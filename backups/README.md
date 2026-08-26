# 💾 دليل النسخ الاحتياطي واستعادة قاعدة البيانات (Database Backup & Restore Guide)

يوثق هذا الدليل كيفية إنشاء واسترجاع النسخ الاحتياطية لقاعدة بيانات نظام **Pharmacy POS (MySQL / MariaDB)** بكل سهولة.

---

## 1️⃣ كيفية أخذ نسخة احتياطية جديدة (Backup)

يمكنك إنشاء نسخة احتياطية جديدة ومحدثة في أي وقت بأي من الطرق التالية:

### أ. عبر الـ NPM (الأسهل والموصى به):
من المجلد الرئيسي للمشروع (`d:\pharmacy-pos`):
```bash
npm run db:backup
```

### ب. عبر PowerShell:
```powershell
.\scripts\backup-db.ps1
```

### ج. عبر موجه الأوامر المباشر (Direct MySQL Dump):
```bash
"C:\xampp\mysql\bin\mysqldump.exe" -u root --databases pharmacy_pos --routines --triggers --single-transaction --result-file="D:\pharmacy-pos\backups\pharmacy_pos_backup.sql"
```

> **ملاحظة:** يتم حفظ ملفات النسخ الاحتياطي تلقائياً داخل هذا المجلد (`D:\pharmacy-pos\backups\`) بصيغة `.sql` متبوعة بالتاريخ والوقت.

---

## 2️⃣ كيفية استرجاع قاعدة البيانات (Restore / Recovery)

في حال الحاجة إلى استعادة قاعدة البيانات من ملف احتياطي سابق:

### الخطوة الأولى: التأكد من تشغيل خادم MySQL
تأكد أن خدمة MySQL قيد التشغيل (عبر XAMPP Control Panel أو عبر الأمر `npm run db:start`).

### الخطوة الثانية: تنفيذ أمر الاسترجاع

#### عبر PowerShell / Command Prompt:
استبدل `اسم_ملف_النسخة.sql` باسم الملف الفعلي الذي تريد استرجاعه:

```powershell
# الطريقة المباشرة باستخدام مسار XAMPP:
Get-Content "D:\pharmacy-pos\backups\اسم_ملف_النسخة.sql" | & "C:\xampp\mysql\bin\mysql.exe" -u root pharmacy_pos
```

أو عبر CMD العادي:
```cmd
"C:\xampp\mysql\bin\mysql.exe" -u root pharmacy_pos < "D:\pharmacy-pos\backups\اسم_ملف_النسخة.sql"
```

### الخطوة الثالثة: التحقق من نجاح الاسترجاع
بعد اكتمال الاسترجاع، قم بإعادة تشغيل السيرفر للتأكد من قراءة البيانات المسترجعة:
```bash
npm run dev
```

---

## 3️⃣ نصائح الأمان والحفظ الدوري (Best Practices)
- يُنصح بأخذ نسخة احتياطية دورية (يومياً أو أسبوعياً) قبل إجراء أي تحديثات كبرى على النظام.
- احتفظ بنسخة من ملفات الـ `.sql` المهمة على قرص خارجي أو سحابة آمنة (Google Drive / OneDrive).
- ملفات الـ `.sql` داخل هذا المجلد مستثناة تلقائياً من الـ Git (`.gitignore`) لضمان سرية وأمان بيانات الصيدلية.
