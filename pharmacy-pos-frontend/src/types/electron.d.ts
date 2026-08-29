export interface ElectronAppInfo {
  name: string;
  version: string;
  isPackaged: boolean;
  platform: string;
  arch: string;
  logPath?: string;
}

export interface BackendStatus {
  healthy: boolean;
  statusCode?: number | string | null;
  ownsProcess: boolean;
  pid?: number | null;
  logPath?: string;
}

export type UpdateStatus = 'IDLE' | 'CHECKING' | 'AVAILABLE' | 'UP_TO_DATE' | 'DOWNLOADING' | 'DOWNLOADED' | 'ERROR' | 'DEV_SKIPPED';

export interface UpdateInfoPayload {
  status: UpdateStatus;
  version?: string;
  releaseDate?: string;
  releaseNotes?: string;
  message?: string;
}

export interface UpdateProgressPayload {
  percent: number;
  transferred: number;
  total: number;
  bytesPerSecond: number;
}

export interface ElectronPrinterInfo {
  name: string;
  displayName: string;
  description: string;
  status: number;
  isDefault: boolean;
}

export interface ElectronPrintOptions {
  silent?: boolean;
  printBackground?: boolean;
  deviceName?: string;
  color?: boolean;
  copies?: number;
  pageSize?: { width: number; height: number };
}

export interface ElectronAPI {
  getAppInfo: () => Promise<ElectronAppInfo>;
  minimizeWindow: () => Promise<void>;
  maximizeWindow: () => Promise<void>;
  closeWindow: () => Promise<void>;
  isMaximized: () => Promise<boolean>;

  backend: {
    getStatus: () => Promise<BackendStatus>;
    restart: () => Promise<{ running: boolean; error?: string }>;
    onStatus: (callback: (data: { status: string; message: string; logPath?: string }) => void) => () => void;
  };

  updater: {
    checkForUpdates: () => Promise<any>;
    downloadUpdate: () => Promise<any>;
    quitAndInstall: () => void;
    onStatus: (callback: (payload: UpdateInfoPayload) => void) => () => void;
    onDownloadProgress: (callback: (payload: UpdateProgressPayload) => void) => () => void;
  };

  printer: {
    getPrinters: () => Promise<ElectronPrinterInfo[]>;
    printReceipt: (options?: ElectronPrintOptions) => Promise<{ success: boolean; failureReason?: string }>;
  };

  showNotification: (payload: { title: string; body: string }) => Promise<boolean>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
