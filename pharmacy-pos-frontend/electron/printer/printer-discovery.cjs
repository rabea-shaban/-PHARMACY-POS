/**
 * Printer Discovery Module for Windows POS Environment
 * Interacts with Electron webContents to discover real physical and virtual printers.
 */

async function listPrinters(targetWebContents) {
  if (!targetWebContents) {
    return [];
  }
  try {
    const printers = await targetWebContents.getPrintersAsync();
    return (printers || []).map((p) => ({
      name: p.name,
      displayName: p.displayName || p.name,
      description: p.description || '',
      status: p.status,
      isDefault: Boolean(p.isDefault),
    }));
  } catch (error) {
    console.error('[PrinterDiscovery] Failed to get printers:', error);
    return [];
  }
}

async function getDefaultPrinter(targetWebContents) {
  const printers = await listPrinters(targetWebContents);
  return printers.find((p) => p.isDefault) || (printers.length > 0 ? printers[0] : null);
}

module.exports = {
  listPrinters,
  getDefaultPrinter,
};
