const { BrowserWindow } = require('electron');
const { listPrinters, getDefaultPrinter } = require('./printer-discovery.cjs');
const {
  buildSaleReceiptHtml,
  buildReturnReceiptHtml,
  buildTestReceiptHtml,
} = require('./receipt-builder.cjs');

/**
 * Executes silent printing using a dedicated offscreen BrowserWindow.
 */
function printHtmlContent(htmlContent, options = {}) {
  return new Promise((resolve) => {
    const {
      printerName = '',
      paperSize = '80mm',
      silent = true,
      copies = 1,
    } = options;

    let printWindow = new BrowserWindow({
      show: false,
      width: paperSize === '58mm' ? 260 : 380,
      height: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true,
      },
    });

    const cleanup = () => {
      if (printWindow) {
        printWindow.destroy();
        printWindow = null;
      }
    };

    // Safety timeout in case print hangs
    const timeoutHandle = setTimeout(() => {
      cleanup();
      resolve({ success: false, error: 'Printing timeout exceeded (15s)' });
    }, 15000);

    printWindow.webContents.once('did-finish-load', () => {
      // 58mm = width 58000 microns, 80mm = width 80000 microns
      const widthMicrons = paperSize === '58mm' ? 58000 : 80000;

      const printOptions = {
        silent: silent !== false,
        printBackground: true,
        color: false,
        margins: {
          marginType: 'none',
        },
        copies: Math.max(1, Number(copies) || 1),
        pageSize: {
          width: widthMicrons,
          height: 297000, // standard thermal continuous roll
        },
      };

      if (printerName) {
        printOptions.deviceName = printerName;
      }

      printWindow.webContents.print(printOptions, (success, failureReason) => {
        clearTimeout(timeoutHandle);
        cleanup();

        if (!success) {
          resolve({
            success: false,
            error: failureReason || 'Unknown printer failure',
          });
        } else {
          resolve({
            success: true,
            printerName: printerName || 'Default Printer',
            paperSize,
          });
        }
      });
    });

    printWindow.webContents.once('did-fail-load', (_event, errorCode, errorDescription) => {
      clearTimeout(timeoutHandle);
      cleanup();
      resolve({
        success: false,
        error: `Failed to load receipt template: ${errorDescription} (${errorCode})`,
      });
    });

    printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);
  });
}

class PrinterService {
  constructor(getMainWindowWebContents) {
    this.getWebContents = getMainWindowWebContents;
  }

  async getPrinters() {
    const webContents = this.getWebContents();
    return await listPrinters(webContents);
  }

  async getDefaultPrinter() {
    const webContents = this.getWebContents();
    return await getDefaultPrinter(webContents);
  }

  async printSale(sale, branding = {}, options = {}) {
    if (!sale) {
      return { success: false, error: 'Sale data is required for printing' };
    }
    const paperSize = options.paperSize || '80mm';
    const html = buildSaleReceiptHtml(sale, branding, paperSize);
    return await printHtmlContent(html, options);
  }

  async printReturn(saleReturn, branding = {}, options = {}) {
    if (!saleReturn) {
      return { success: false, error: 'Return data is required for printing' };
    }
    const paperSize = options.paperSize || '80mm';
    const html = buildReturnReceiptHtml(saleReturn, branding, paperSize);
    return await printHtmlContent(html, options);
  }

  async printTest(printerName, paperSize = '80mm', branding = {}) {
    const html = buildTestReceiptHtml(printerName, paperSize, branding);
    return await printHtmlContent(html, { printerName, paperSize, silent: true, copies: 1 });
  }

  async getStatus(printerName) {
    const printers = await this.getPrinters();
    if (!printerName) {
      const defaultP = printers.find((p) => p.isDefault) || printers[0];
      return defaultP ? { found: true, printer: defaultP } : { found: false, error: 'No printers installed on this system' };
    }
    const found = printers.find((p) => p.name.toLowerCase() === printerName.toLowerCase());
    return found ? { found: true, printer: found } : { found: false, error: `Printer '${printerName}' not found` };
  }
}

module.exports = {
  PrinterService,
  printHtmlContent,
};
