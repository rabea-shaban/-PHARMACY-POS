export interface MedicationScheduleItem {
  productName: string;
  scientificName?: string | null;
  type?: 'ACUTE' | 'CHRONIC';
  dosage: string;
  dosageUnit?: string | null;
  frequency: string;
  dosageTimes?: string[] | string | null;
  duration?: string | null;
  isContinuous?: boolean;
  doctorNotes?: string | null;
}

export interface MedicationSchedulePayload {
  customerName?: string;
  customerPhone?: string;
  pharmacyName?: string;
  invoiceNumber?: string;
  date?: string;
  items: MedicationScheduleItem[];
  lang?: 'ar' | 'en';
}

export function formatMedicationScheduleText(payload: MedicationSchedulePayload): string {
  const isAr = payload.lang !== 'en';
  const pharmacy = payload.pharmacyName || (isAr ? 'صيدلية فيريكسا' : 'Virexa Pharmacy');
  const dateStr = payload.date || new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US');

  let text = '';

  if (isAr) {
    text += `🌿 *${pharmacy}* 🌿\n`;
    text += `📋 *جدول مواعيد وتناول الأدوية*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    if (payload.customerName) text += `👤 *المريض:* ${payload.customerName}\n`;
    if (payload.invoiceNumber) text += `🧾 *رقم الفاتورة:* ${payload.invoiceNumber}\n`;
    text += `📅 *التاريخ:* ${dateStr}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

    payload.items.forEach((item, index) => {
      const typeBadge = item.type === 'CHRONIC' ? '🔴 [دواء مزمن]' : '🔵 [دواء عرضي]';
      text += `*${index + 1}. ${item.productName}* ${typeBadge}\n`;
      if (item.scientificName) text += `   • *الاسم العلمي:* ${item.scientificName}\n`;
      text += `   • *الجرعة:* ${item.dosage}${item.dosageUnit ? ' ' + item.dosageUnit : ''}\n`;
      text += `   • *التكرار:* ${item.frequency}\n`;

      if (item.dosageTimes) {
        const times = Array.isArray(item.dosageTimes)
          ? item.dosageTimes.join(' - ')
          : item.dosageTimes;
        text += `   • *المواعيد:* ⏰ ${times}\n`;
      }

      if (item.isContinuous) {
        text += `   • *المدة:* مستمر (علاج مزمن)\n`;
      } else if (item.duration) {
        text += `   • *المدة:* ${item.duration}\n`;
      }

      if (item.doctorNotes) {
        text += `   • *ملاحظات الصيدلي/الطبيب:* 📝 ${item.doctorNotes}\n`;
      }

      text += `\n`;
    });

    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `💡 *تعليمات عامة:*\n`;
    text += `• يرجى الالتزام بالمواعيد المحددة وتناول الدواء مع كمية كافية من الماء.\n`;
    text += `• لا تتوقف عن تناول المضادات الحيوية أو الأدوية المزمنة دون استشارة الطبيب.\n`;
    text += `• نتمنى لكم دوام الصحة والعافية والشفاء العاجل 🌿✨`;
  } else {
    text += `🌿 *${pharmacy}* 🌿\n`;
    text += `📋 *Medication Schedule & Instructions*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    if (payload.customerName) text += `👤 *Patient:* ${payload.customerName}\n`;
    if (payload.invoiceNumber) text += `🧾 *Invoice:* ${payload.invoiceNumber}\n`;
    text += `📅 *Date:* ${dateStr}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

    payload.items.forEach((item, index) => {
      const typeBadge = item.type === 'CHRONIC' ? '🔴 [Chronic]' : '🔵 [Acute]';
      text += `*${index + 1}. ${item.productName}* ${typeBadge}\n`;
      if (item.scientificName) text += `   • *Active Ingredient:* ${item.scientificName}\n`;
      text += `   • *Dosage:* ${item.dosage}${item.dosageUnit ? ' ' + item.dosageUnit : ''}\n`;
      text += `   • *Frequency:* ${item.frequency}\n`;

      if (item.dosageTimes) {
        const times = Array.isArray(item.dosageTimes)
          ? item.dosageTimes.join(' - ')
          : item.dosageTimes;
        text += `   • *Times:* ⏰ ${times}\n`;
      }

      if (item.isContinuous) {
        text += `   • *Duration:* Continuous (Chronic treatment)\n`;
      } else if (item.duration) {
        text += `   • *Duration:* ${item.duration}\n`;
      }

      if (item.doctorNotes) {
        text += `   • *Doctor/Pharmacist Notes:* 📝 ${item.doctorNotes}\n`;
      }

      text += `\n`;
    });

    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `💡 *General Instructions:*\n`;
    text += `• Please adhere to scheduled times and take medication with plenty of water.\n`;
    text += `• Wishing you a speedy recovery and great health! 🌿✨`;
  }

  return text;
}

export function cleanPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('00')) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    // Egyptian mobile number like 01012345678 -> 201012345678
    cleaned = '20' + cleaned.substring(1);
  }
  return cleaned;
}

export function generateWhatsAppMedicationLink(phone: string, scheduleText: string): string {
  const cleanedPhone = cleanPhoneNumber(phone);
  const encodedText = encodeURIComponent(scheduleText);
  return `https://wa.me/${cleanedPhone}?text=${encodedText}`;
}
