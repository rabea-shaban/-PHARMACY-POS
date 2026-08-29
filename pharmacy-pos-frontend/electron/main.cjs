const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { spawn } = require('child_process');
const { autoUpdater } = require('electron-updater');

// Determine environment
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
const devServerUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:3000';
const BACKEND_PORT = 5000;
const HEALTH_CHECK_URL = `http://127.0.0.1:${BACKEND_PORT}/api/v1/health`;
const BACKEND_STARTUP_TIMEOUT_MS = 30000;
const MAX_RESTART_ATTEMPTS = 3;

let mainWindow = null;
let backendProcess = null;
let ownsBackendProcess = false;
let backendRestartAttempts = 0;
let isShuttingDown = false;
let logStream = null;

// ----------------------------------------------------
// Logging Setup
// ----------------------------------------------------
function getLogFilePath() {
  const logDir = path.join(app.getPath('userData'), 'logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  return path.join(logDir, 'backend.log');
}

function writeLog(level, message, error = null) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] [${level.toUpperCase()}] ${message}${error ? ` - ${error.stack || error}` : ''}\n`;
  try {
    if (!logStream) {
      logStream = fs.createWriteStream(getLogFilePath(), { flags: 'a' });
    }
    logStream.write(logLine);
  } catch (e) {
    console.error('Failed to write to log file:', e);
  }
  if (isDev) {
    console.log(`[BackendService] [${level}] ${message}`);
  }
}

// ----------------------------------------------------
// Health Check Helper (HTTP Probe to 127.0.0.1)
// ----------------------------------------------------
function checkBackendHealth(timeoutMs = 2000) {
  return new Promise((resolve) => {
    const req = http.get(HEALTH_CHECK_URL, { timeout: timeoutMs }, (res) => {
      // Status 200 (healthy) or 503 (server up but verifying DB) means the express server is alive and responding
      if (res.statusCode === 200 || res.statusCode === 503 || res.statusCode === 404) {
        resolve({ alive: true, statusCode: res.statusCode });
      } else {
        resolve({ alive: true, statusCode: res.statusCode });
      }
    });

    req.on('error', () => {
      resolve({ alive: false, statusCode: null });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ alive: false, statusCode: 'TIMEOUT' });
    });
  });
}

// Polling until backend becomes ready
async function waitForBackendReady(timeoutMs = BACKEND_STARTUP_TIMEOUT_MS, intervalMs = 500) {
  const startTime = Date.now();
  writeLog('info', `Waiting for backend health check at ${HEALTH_CHECK_URL}...`);

  while (Date.now() - startTime < timeoutMs) {
    const health = await checkBackendHealth(1500);
    if (health.alive) {
      writeLog('info', `Backend health check succeeded (status: ${health.statusCode}) after ${Date.now() - startTime}ms.`);
      return true;
    }
    await new Promise((res) => setTimeout(res, intervalMs));
  }

  writeLog('error', `Backend startup timed out after ${timeoutMs}ms.`);
  return false;
}

// ----------------------------------------------------
// Local Backend Service Management
// ----------------------------------------------------
function getBackendPathInfo() {
  if (app.isPackaged) {
    // In Production: bundled in resources/backend
    const resourcesPath = process.resourcesPath;
    return {
      scriptPath: path.join(resourcesPath, 'backend', 'dist', 'server.js'),
      cwd: path.join(resourcesPath, 'backend'),
    };
  } else {
    // In Development: located at project root ../pharmacy-pos-backend
    const devBackendDir = path.resolve(__dirname, '../../pharmacy-pos-backend');
    return {
      scriptPath: path.join(devBackendDir, 'dist', 'server.js'),
      cwd: devBackendDir,
    };
  }
}

async function startBackendService() {
  if (isShuttingDown) return { running: false, error: 'Application shutting down' };

  // 1. Check if backend is already running (e.g. started externally or in dev)
  const existingHealth = await checkBackendHealth(1500);
  if (existingHealth.alive) {
    ownsBackendProcess = false;
    writeLog('info', `Backend is already running on port ${BACKEND_PORT}. Skipping spawn.`);
    return { running: true, owned: false, statusCode: existingHealth.statusCode };
  }

  // 2. Resolve backend script path
  const { scriptPath, cwd } = getBackendPathInfo();
  writeLog('info', `Locating backend at: ${scriptPath}`);

  if (!fs.existsSync(scriptPath)) {
    const errorMsg = `Backend build file not found at: ${scriptPath}. Please run backend build.`;
    writeLog('error', errorMsg);
    return { running: false, error: errorMsg };
  }

  // 3. Spawn Backend as a Node child process using Electron's Node runtime (ELECTRON_RUN_AS_NODE=1)
  try {
    writeLog('info', `Starting Backend process (Node CWD: ${cwd})...`);

    const env = {
      ...process.env,
      ELECTRON_RUN_AS_NODE: '1',
      NODE_ENV: app.isPackaged ? 'production' : 'development',
      PORT: String(BACKEND_PORT),
    };

    backendProcess = spawn(process.execPath, [scriptPath], {
      cwd,
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    });

    ownsBackendProcess = true;
    const pid = backendProcess.pid;
    writeLog('info', `Backend process spawned successfully with PID: ${pid}`);

    // Stream backend logs safely to log file
    backendProcess.stdout.on('data', (data) => {
      writeLog('info', `[Backend stdout] ${data.toString().trim()}`);
    });

    backendProcess.stderr.on('data', (data) => {
      writeLog('warn', `[Backend stderr] ${data.toString().trim()}`);
    });

    backendProcess.on('error', (err) => {
      writeLog('error', 'Backend process failed to start or errored:', err);
    });

    backendProcess.on('exit', (code, signal) => {
      writeLog('warn', `Backend process (PID: ${pid}) exited with code ${code}, signal ${signal}`);
      backendProcess = null;

      // Handle controlled restart if not shutting down intentionally
      if (!isShuttingDown && ownsBackendProcess) {
        if (backendRestartAttempts < MAX_RESTART_ATTEMPTS) {
          backendRestartAttempts++;
          const backoffDelay = backendRestartAttempts * 2000;
          writeLog('warn', `Attempting controlled backend restart #${backendRestartAttempts} in ${backoffDelay}ms...`);
          setTimeout(() => {
            startBackendService();
          }, backoffDelay);
        } else {
          writeLog('error', `Max restart attempts (${MAX_RESTART_ATTEMPTS}) reached. Backend service failed.`);
          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('backend:status', {
              status: 'CRASHED',
              message: 'تعذر تشغيل خدمة الخادم الخلفي للنظام بعد عدة محاولات.',
              logPath: getLogFilePath(),
            });
          }
        }
      }
    });

    // 4. Wait for backend to pass health check
    const isReady = await waitForBackendReady(BACKEND_STARTUP_TIMEOUT_MS);
    if (!isReady) {
      writeLog('error', 'Backend failed health check verification within timeout.');
      return { running: false, error: 'Backend health check timeout' };
    }

    backendRestartAttempts = 0; // Reset restart counter on success
    return { running: true, owned: true, pid };
  } catch (err) {
    writeLog('error', 'Exception occurred while spawning backend:', err);
    return { running: false, error: err.message };
  }
}

async function stopBackendService() {
  isShuttingDown = true;
  if (ownsBackendProcess && backendProcess && !backendProcess.killed) {
    const pid = backendProcess.pid;
    writeLog('info', `Gracefully shutting down backend process (PID: ${pid})...`);

    return new Promise((resolve) => {
      const forceKillTimeout = setTimeout(() => {
        if (backendProcess && !backendProcess.killed) {
          writeLog('warn', `Force killing backend process tree (PID: ${pid})...`);
          try {
            if (process.platform === 'win32') {
              spawn('taskkill', ['/pid', String(pid), '/T', '/F']);
            } else {
              backendProcess.kill('SIGKILL');
            }
          } catch (e) {
            writeLog('error', 'Error while force killing backend:', e);
          }
        }
        ownsBackendProcess = false;
        backendProcess = null;
        resolve();
      }, 4000);

      backendProcess.once('exit', () => {
        clearTimeout(forceKillTimeout);
        writeLog('info', 'Backend process exited cleanly.');
        ownsBackendProcess = false;
        backendProcess = null;
        resolve();
      });

      try {
        backendProcess.kill('SIGTERM');
      } catch (e) {
        backendProcess.kill();
      }
    });
  }
}

// ----------------------------------------------------
// Main Window Creation
// ----------------------------------------------------
function createWindow() {
  const iconPath = path.join(__dirname, '../assets/icon.ico');

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 700,
    title: 'نظام صيدلية الأمل لإدارة الصيدليات ونقاط البيع | Pharmacy POS',
    backgroundColor: '#f8fafc',
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webSecurity: true,
      spellcheck: false,
    },
  });

  mainWindow.setMenuBarVisibility(false);

  if (isDev) {
    mainWindow.loadURL(devServerUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.maximize();
    }
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('http://localhost:3000') && !url.startsWith('file://')) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ----------------------------------------------------
// Online Auto-Updater Configuration
// ----------------------------------------------------
function setupAutoUpdater() {
  if (isDev) {
    writeLog('info', 'Auto-updater is disabled in development mode.');
    return;
  }

  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('checking-for-update', () => {
    writeLog('info', 'Checking for online updates...');
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('updater:status', { status: 'CHECKING' });
    }
  });

  autoUpdater.on('update-available', (info) => {
    writeLog('info', `Update available: v${info.version}`);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('updater:status', {
        status: 'AVAILABLE',
        version: info.version,
        releaseDate: info.releaseDate,
        releaseNotes: typeof info.releaseNotes === 'string' ? info.releaseNotes : '',
      });
    }
  });

  autoUpdater.on('update-not-available', (info) => {
    writeLog('info', `System is up to date: v${info.version}`);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('updater:status', {
        status: 'UP_TO_DATE',
        version: info.version,
      });
    }
  });

  autoUpdater.on('error', (err) => {
    writeLog('warn', `Auto-updater encountered an error: ${err.message}`);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('updater:status', {
        status: 'ERROR',
        message: err.message || 'فشل التحقق من التحديثات',
      });
    }
  });

  autoUpdater.on('download-progress', (progressObj) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('updater:download-progress', {
        percent: Math.round(progressObj.percent || 0),
        transferred: progressObj.transferred || 0,
        total: progressObj.total || 0,
        bytesPerSecond: progressObj.bytesPerSecond || 0,
      });
    }
  });

  autoUpdater.on('update-downloaded', (info) => {
    writeLog('info', `Update downloaded successfully: v${info.version}`);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('updater:status', {
        status: 'DOWNLOADED',
        version: info.version,
      });
    }
  });
}

// ----------------------------------------------------
// IPC Communication Handlers
// ----------------------------------------------------

// 1. App Info
ipcMain.handle('app:getInfo', () => {
  return {
    name: app.getName(),
    version: app.getVersion(),
    isPackaged: app.isPackaged,
    platform: process.platform,
    arch: process.arch,
    logPath: getLogFilePath(),
  };
});

// 2. Window Controls
ipcMain.handle('window:minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.handle('window:maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle('window:close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle('window:isMaximized', () => {
  return mainWindow ? mainWindow.isMaximized() : false;
});

// 3. Backend Service Control & Status
ipcMain.handle('backend:getStatus', async () => {
  const health = await checkBackendHealth(2000);
  return {
    healthy: health.alive,
    statusCode: health.statusCode,
    ownsProcess: ownsBackendProcess,
    pid: backendProcess ? backendProcess.pid : null,
    logPath: getLogFilePath(),
  };
});

ipcMain.handle('backend:restart', async () => {
  writeLog('info', 'Manual backend restart requested via IPC.');
  await stopBackendService();
  isShuttingDown = false;
  return await startBackendService();
});

// 4. Auto-Updater IPC
ipcMain.handle('updater:checkForUpdates', async () => {
  if (isDev) {
    return { status: 'DEV_SKIPPED', message: 'التحديثات معطلة في بيئة التطوير' };
  }
  try {
    return await autoUpdater.checkForUpdates();
  } catch (err) {
    writeLog('error', 'Error in checkForUpdates IPC:', err);
    return { status: 'ERROR', message: err.message };
  }
});

ipcMain.handle('updater:downloadUpdate', async () => {
  if (isDev) {
    return { status: 'DEV_SKIPPED' };
  }
  try {
    return await autoUpdater.downloadUpdate();
  } catch (err) {
    writeLog('error', 'Error in downloadUpdate IPC:', err);
    return { status: 'ERROR', message: err.message };
  }
});

ipcMain.handle('updater:quitAndInstall', () => {
  if (!isDev) {
    setImmediate(async () => {
      await stopBackendService();
      autoUpdater.quitAndInstall();
    });
  }
});

// 5. Printer & Notifications
ipcMain.handle('printer:getPrinters', async () => {
  if (!mainWindow) return [];
  return await mainWindow.webContents.getPrintersAsync();
});

ipcMain.handle('printer:printReceipt', async (_event, options = {}) => {
  if (!mainWindow) return { success: false, error: 'Window not found' };
  try {
    const defaultOptions = {
      silent: true,
      printBackground: true,
      color: false,
      margins: { marginType: 'none' },
      pageSize: { width: 80000, height: 297000 },
      ...options,
    };
    return new Promise((resolve) => {
      mainWindow.webContents.print(defaultOptions, (success, failureReason) => {
        resolve({ success, failureReason });
      });
    });
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('notification:show', (_event, { title, body } = {}) => {
  const { Notification } = require('electron');
  if (Notification.isSupported()) {
    const iconPath = path.join(__dirname, '../assets/icon.ico');
    new Notification({
      title: title || 'Pharmacy POS',
      body: body || '',
      icon: fs.existsSync(iconPath) ? iconPath : undefined,
    }).show();
    return true;
  }
  return false;
});

// ----------------------------------------------------
// App Lifecycle & Single Instance Lock
// ----------------------------------------------------
const gotSingleInstanceLock = app.requestSingleInstanceLock();

if (!gotSingleInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(async () => {
    writeLog('info', '==================================================');
    writeLog('info', `Pharmacy POS Desktop Shell Starting (v${app.getVersion()})`);
    writeLog('info', `Runtime: Electron ${process.versions.electron}, Node ${process.versions.node}`);
    writeLog('info', '==================================================');

    // 1. Start or verify Backend Service
    const backendResult = await startBackendService();
    if (!backendResult.running) {
      writeLog('warn', `Warning: Backend service is not running (${backendResult.error || 'unreachable'}). UI will load with status warning.`);
    }

    // 2. Setup Auto-Updater & Window
    setupAutoUpdater();
    createWindow();

    // 3. Trigger silent update check in production after window is ready
    if (!isDev) {
      setTimeout(() => {
        try {
          autoUpdater.checkForUpdates().catch((err) => {
            writeLog('warn', `Silent background update check failed: ${err.message}`);
          });
        } catch (e) {
          // Ignore background update errors
        }
      }, 5000);
    }

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
}

app.on('before-quit', async (e) => {
  if (ownsBackendProcess && backendProcess && !backendProcess.killed) {
    e.preventDefault();
    await stopBackendService();
    app.quit();
  }
});

app.on('window-all-closed', async () => {
  await stopBackendService();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
