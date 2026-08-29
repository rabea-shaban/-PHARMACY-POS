const { contextBridge, ipcRenderer } = require('electron');

// Safe IPC Listener Registry for React components
const validIncomingChannels = [
  'updater:status',
  'updater:download-progress',
  'backend:status',
];

contextBridge.exposeInMainWorld('electronAPI', {
  // App information
  getAppInfo: () => ipcRenderer.invoke('app:getInfo'),

  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window:maximize'),
  closeWindow: () => ipcRenderer.invoke('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:isMaximized'),

  // Local Backend Service Management
  backend: {
    getStatus: () => ipcRenderer.invoke('backend:getStatus'),
    restart: () => ipcRenderer.invoke('backend:restart'),
    onStatus: (callback) => {
      const subscription = (_event, data) => callback(data);
      ipcRenderer.on('backend:status', subscription);
      return () => ipcRenderer.removeListener('backend:status', subscription);
    },
  },

  // Online Auto-Updater
  updater: {
    checkForUpdates: () => ipcRenderer.invoke('updater:checkForUpdates'),
    downloadUpdate: () => ipcRenderer.invoke('updater:downloadUpdate'),
    quitAndInstall: () => ipcRenderer.invoke('updater:quitAndInstall'),
    onStatus: (callback) => {
      const subscription = (_event, data) => callback(data);
      ipcRenderer.on('updater:status', subscription);
      return () => ipcRenderer.removeListener('updater:status', subscription);
    },
    onDownloadProgress: (callback) => {
      const subscription = (_event, data) => callback(data);
      ipcRenderer.on('updater:download-progress', subscription);
      return () => ipcRenderer.removeListener('updater:download-progress', subscription);
    },
  },

  // Hardware & POS Printer Integration
  printer: {
    list: () => ipcRenderer.invoke('printer:list'),
    getDefault: () => ipcRenderer.invoke('printer:getDefault'),
    printSale: (payload) => ipcRenderer.invoke('printer:printSale', payload),
    printReturn: (payload) => ipcRenderer.invoke('printer:printReturn', payload),
    printTest: (payload) => ipcRenderer.invoke('printer:printTest', payload),
    getStatus: (payload) => ipcRenderer.invoke('printer:getStatus', payload),
    printReceipt: (payload) => ipcRenderer.invoke('printer:printReceipt', payload),
    getPrinters: () => ipcRenderer.invoke('printer:list'),
  },

  // Notifications
  showNotification: (payload) => ipcRenderer.invoke('notification:show', payload),
});
