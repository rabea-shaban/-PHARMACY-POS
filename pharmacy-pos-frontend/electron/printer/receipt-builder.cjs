/**
 * Receipt Builder for Direct Thermal Printing (80mm & 58mm)
 * Generates standalone, pixel-perfect HTML for silent thermal printing.
 */

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatMoney(amount) {
  const num = Number(amount) || 0;
  return num.toFixed(2) + ' ج.م';
}

function getReceiptStyles(paperSize = '80mm') {
  const is58mm = paperSize === '58mm';
  const widthPx = is58mm ? '54mm' : '76mm';
  const fontSize = is58mm ? '10px' : '11px';
  const headerFontSize = is58mm ? '13px' : '15px';

  return `
    @page {
      margin: 0;
      size: ${paperSize} auto;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      width: ${widthPx};
      margin: 0 auto;
      padding: 4px 6px 12px 6px;
      font-family: 'Cairo', 'Segoe UI', Arial, sans-serif;
      font-size: ${fontSize};
      color: #000;
      background: #fff;
      direction: rtl;
      line-height: 1.35;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .text-center { text-align: center; }
    .text-left { text-align: left; direction: ltr; }
    .text-right { text-align: right; }
    .bold { font-weight: 700; }
    .black { font-weight: 900; }
    .dashed-divider {
      border-bottom: 1px dashed #000;
      margin: 5px 0;
    }
    .solid-divider {
      border-bottom: 1px solid #000;
      margin: 5px 0;
    }
    .double-divider {
      border-bottom: 2px solid #000;
      margin: 5px 0;
    }
    .header-title {
      font-size: ${headerFontSize};
      font-weight: 900;
      margin-bottom: 2px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 4px 0;
    }
    .items-table th {
      border-bottom: 1px solid #000;
      padding: 2px 1px;
      font-size: ${fontSize};
      font-weight: 800;
    }
    .items-table td {
      padding: 3px 1px;
      font-size: ${fontSize};
      vertical-align: top;
    }
    .footer {
      text-align: center;
      font-size: ${is58mm ? '9px' : '10px'};
      margin-top: 8px;
    }
  `;
}

/**
 * Builds HTML for a Sales Invoice Receipt
 */
function buildSaleReceiptHtml(sale, branding = {}, paperSize = '80mm') {
  const pharmacyName = escapeHtml(branding.pharmacyName || 'صيدلية الأمل الحديثة');
  const pharmacySlogan = escapeHtml(branding.pharmacySlogan || '');
  const pharmacyPhone = escapeHtml(branding.pharmacyPhone || '');
  const pharmacyAddress = escapeHtml(branding.pharmacyAddress || '');
  const footerText = escapeHtml(branding.receiptFooterText || 'نتمنى لكم دوام الصحة والعافية!');
  const returnPolicy = escapeHtml(branding.receiptReturnPolicy || 'المرتجع خلال 14 يوماً مع إحضار أصل الفاتورة');

  const itemsHtml = (sale.items || [])
    .map((item) => {
      const name = escapeHtml(item.productName || 'صنف');
      const qty = item.quantity || 1;
      const price = formatMoney(item.unitPrice);
      const total = formatMoney(item.total);
      return `
        <tr>
          <td style="text-align: right; width: 50%; word-break: break-word;">
            <div class="bold">${name}</div>
            <div style="font-size: 85%; color: #333;">${price} × ${qty}</div>
          </td>
          <td style="text-align: center; width: 15%;">${qty}</td>
          <td style="text-align: left; width: 35%;" class="bold text-left">${total}</td>
        </tr>
      `;
    })
    .join('');

  const paymentsHtml = (sale.payments || [])
    .map((p) => {
      const method = escapeHtml(p.paymentMethod || 'نقدي');
      const amount = formatMoney(p.amount);
      return `
        <div class="row">
          <span>طريقة الدفع (${method}):</span>
          <span class="bold text-left">${amount}</span>
        </div>
      `;
    })
    .join('');

  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>Receipt ${escapeHtml(sale.invoiceNumber)}</title>
  <style>${getReceiptStyles(paperSize)}</style>
</head>
<body>
  <!-- Header -->
  <div class="text-center">
    <div class="header-title">${pharmacyName}</div>
    ${pharmacySlogan ? `<div style="font-size: 90%; font-weight: bold;">${pharmacySlogan}</div>` : ''}
    ${pharmacyPhone || pharmacyAddress ? `
      <div style="font-size: 85%;">
        ${pharmacyPhone ? `هاتف: ${pharmacyPhone}` : ''}
        ${pharmacyPhone && pharmacyAddress ? ' • ' : ''}
        ${pharmacyAddress ? `${pharmacyAddress}` : ''}
      </div>
    ` : ''}
  </div>

  <div class="dashed-divider"></div>

  <!-- Invoice Meta -->
  <div style="font-size: 90%;">
    <div class="row">
      <span>رقم الفاتورة:</span>
      <span class="bold text-left">${escapeHtml(sale.invoiceNumber || '—')}</span>
    </div>
    <div class="row">
      <span>التاريخ والوقت:</span>
      <span class="text-left">${escapeHtml(sale.createdAt ? new Date(sale.createdAt).toLocaleString('ar-EG') : new Date().toLocaleString('ar-EG'))}</span>
    </div>
    <div class="row">
      <span>الكاشير:</span>
      <span class="bold">${escapeHtml(sale.cashierName || 'الكاشير')}</span>
    </div>
    ${sale.customerName ? `
      <div class="row">
        <span>العميل:</span>
        <span class="bold">${escapeHtml(sale.customerName)}</span>
      </div>
    ` : ''}
  </div>

  <div class="dashed-divider"></div>

  <!-- Items Table -->
  <table class="items-table">
    <thead>
      <tr>
        <th style="text-align: right;">الصنف</th>
        <th style="text-align: center;">الكمية</th>
        <th style="text-align: left;">الإجمالي</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHtml}
    </tbody>
  </table>

  <div class="dashed-divider"></div>

  <!-- Totals -->
  <div style="font-size: 95%;">
    <div class="row">
      <span>المجموع الفرعي:</span>
      <span class="text-left">${formatMoney(sale.subtotal)}</span>
    </div>
    ${sale.discount > 0 ? `
      <div class="row" style="font-weight: bold;">
        <span>الخصم:</span>
        <span class="text-left">-${formatMoney(sale.discount)}</span>
      </div>
    ` : ''}
    ${sale.insuranceAmount > 0 ? `
      <div class="row">
        <span>تغطية التأمين:</span>
        <span class="text-left">-${formatMoney(sale.insuranceAmount)}</span>
      </div>
    ` : ''}
    ${sale.tax > 0 ? `
      <div class="row">
        <span>الضريبة:</span>
        <span class="text-left">+${formatMoney(sale.tax)}</span>
      </div>
    ` : ''}
    <div class="double-divider"></div>
    <div class="row bold" style="font-size: 115%;">
      <span>الإجمالي النهائي:</span>
      <span class="text-left">${formatMoney(sale.total)}</span>
    </div>
  </div>

  ${paymentsHtml ? `
    <div class="dashed-divider"></div>
    <div style="font-size: 90%;">
      ${paymentsHtml}
    </div>
  ` : ''}

  <!-- Footer -->
  <div class="dashed-divider"></div>
  <div class="footer">
    <div class="bold">${footerText}</div>
    <div style="font-size: 85%; margin-top: 3px;">${returnPolicy}</div>
  </div>
</body>
</html>
  `;
}

/**
 * Builds HTML for a Return Credit Note Receipt
 */
function buildReturnReceiptHtml(saleReturn, branding = {}, paperSize = '80mm') {
  const pharmacyName = escapeHtml(branding.pharmacyName || 'صيدلية الأمل الحديثة');
  const footerText = escapeHtml(branding.receiptFooterText || 'شكراً لتعاملكم معنا');

  const itemsHtml = (saleReturn.items || [])
    .map((item) => {
      const name = escapeHtml(item.productName || 'صنف');
      const qty = item.quantity || 1;
      const refund = formatMoney(item.refundAmount);
      return `
        <tr>
          <td style="text-align: right; width: 50%;">
            <div class="bold">${name}</div>
            ${item.batchNumber ? `<div style="font-size: 80%;">تشغيلة: ${escapeHtml(item.batchNumber)}</div>` : ''}
          </td>
          <td style="text-align: center; width: 15%;">${qty}</td>
          <td style="text-align: left; width: 35%;" class="bold text-left">${refund}</td>
        </tr>
      `;
    })
    .join('');

  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>Return Receipt ${escapeHtml(saleReturn.returnNumber)}</title>
  <style>${getReceiptStyles(paperSize)}</style>
</head>
<body>
  <div class="text-center">
    <div class="header-title">${pharmacyName}</div>
    <div style="font-size: 110%; font-weight: 900; margin: 3px 0; border: 1px solid #000; padding: 2px;">
      إشعار إرجاع بضاعة (مرتجع)
    </div>
  </div>

  <div class="dashed-divider"></div>

  <div style="font-size: 90%;">
    <div class="row">
      <span>رقم الإشعار:</span>
      <span class="bold text-left">${escapeHtml(saleReturn.returnNumber || '—')}</span>
    </div>
    <div class="row">
      <span>الفاتورة الأصلية:</span>
      <span class="bold text-left">${escapeHtml(saleReturn.invoiceNumber || '—')}</span>
    </div>
    <div class="row">
      <span>التاريخ:</span>
      <span class="text-left">${escapeHtml(new Date().toLocaleString('ar-EG'))}</span>
    </div>
    <div class="row">
      <span>المسؤول:</span>
      <span class="bold">${escapeHtml(saleReturn.processedByName || 'الكاشير')}</span>
    </div>
    ${saleReturn.customerName ? `
      <div class="row">
        <span>العميل:</span>
        <span class="bold">${escapeHtml(saleReturn.customerName)}</span>
      </div>
    ` : ''}
    ${saleReturn.reason ? `
      <div class="row">
        <span>سبب الإرجاع:</span>
        <span>${escapeHtml(saleReturn.reason)}</span>
      </div>
    ` : ''}
  </div>

  <div class="dashed-divider"></div>

  <table class="items-table">
    <thead>
      <tr>
        <th style="text-align: right;">الصنف المسترجع</th>
        <th style="text-align: center;">الكمية</th>
        <th style="text-align: left;">المسترد</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHtml}
    </tbody>
  </table>

  <div class="double-divider"></div>

  <div class="row bold" style="font-size: 115%;">
    <span>إجمالي المبلغ المسترد:</span>
    <span class="text-left">${formatMoney(saleReturn.total)}</span>
  </div>

  <div class="dashed-divider"></div>
  <div class="footer">
    <div class="bold">${footerText}</div>
  </div>
</body>
</html>
  `;
}

/**
 * Builds HTML for a Hardware Test Print Receipt
 */
function buildTestReceiptHtml(printerName, paperSize = '80mm', branding = {}) {
  const pharmacyName = escapeHtml(branding.pharmacyName || 'صيدلية الأمل الحديثة');
  const now = new Date().toLocaleString('ar-EG');

  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>Test Print</title>
  <style>${getReceiptStyles(paperSize)}</style>
</head>
<body>
  <div class="text-center">
    <div class="header-title">${pharmacyName}</div>
    <div style="font-weight: 900; margin: 4px 0; border: 1px solid #000; padding: 2px;">
      اختبار الطابعة الحرارية (Test Receipt)
    </div>
  </div>

  <div class="dashed-divider"></div>

  <div style="font-size: 90%;">
    <div class="row">
      <span>اسم الطابعة:</span>
      <span class="bold text-left">${escapeHtml(printerName || 'الطابعة الافتراضية')}</span>
    </div>
    <div class="row">
      <span>عرض الورق:</span>
      <span class="bold text-left">${escapeHtml(paperSize)}</span>
    </div>
    <div class="row">
      <span>تاريخ الاختبار:</span>
      <span class="text-left">${escapeHtml(now)}</span>
    </div>
    <div class="row">
      <span>حالة الاتصال:</span>
      <span class="bold">متصلة بنجاح ✓</span>
    </div>
  </div>

  <div class="dashed-divider"></div>

  <div style="font-size: 85%; line-height: 1.5;">
    <div class="bold">اختبار النصوص العربية والإنجليزية:</div>
    <div>أ ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن هـ و ي</div>
    <div class="text-left">ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789</div>
    <div>الأسعار والعملة: 150.75 ج.م (EGP)</div>
  </div>

  <div class="dashed-divider"></div>

  <div class="text-center bold" style="font-size: 90%;">
    تمت الطباعة بنجاح من نظام Pharmacy POS
  </div>
  <div class="dashed-divider"></div>
</body>
</html>
  `;
}

module.exports = {
  buildSaleReceiptHtml,
  buildReturnReceiptHtml,
  buildTestReceiptHtml,
};
