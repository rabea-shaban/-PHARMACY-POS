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

export interface PrinterInfo {
  name: string;
  displayName: string;
  description: string;
  status: number;
  isDefault: boolean;
}

export interface PrinterPrintOptions {
  printerName?: string;
  paperSize?: '80mm' | '58mm';
  silent?: boolean;
  copies?: number;
}

export interface ReceiptBranding {
  pharmacyName?: string;
  pharmacySlogan?: string;
  pharmacyPhone?: string;
  pharmacyAddress?: string;
  receiptFooterText?: string;
  receiptReturnPolicy?: string;
  receiptShowTax?: boolean | string;
  receiptShowLogo?: boolean | string;
}

export interface PrintReceiptResult {
  success: boolean;
  error?: string;
  printerName?: string;
  paperSize?: string;
}

export interface PrinterStatusResult {
  found: boolean;
  printer?: PrinterInfo;
  error?: string;
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
    list: () => Promise<PrinterInfo[]>;
    getDefault: () => Promise<PrinterInfo | null>;
    printSale: (payload: { sale: any; branding?: ReceiptBranding; options?: PrinterPrintOptions }) => Promise<PrintReceiptResult>;
    printReturn: (payload: { saleReturn: any; branding?: ReceiptBranding; options?: PrinterPrintOptions }) => Promise<PrintReceiptResult>;
    printTest: (payload: { printerName?: string; paperSize?: '80mm' | '58mm'; branding?: ReceiptBranding }) => Promise<PrintReceiptResult>;
    getStatus: (payload?: { printerName?: string }) => Promise<PrinterStatusResult>;
    printReceipt: (payload: any) => Promise<PrintReceiptResult>;
    getPrinters: () => Promise<PrinterInfo[]>;
  };

  showNotification: (payload: { title: string; body: string }) => Promise<boolean>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
