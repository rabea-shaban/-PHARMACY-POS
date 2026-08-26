# 🏥 Al-Amal Pharmacy POS & Management System
### نظام إدارة الصيدليات ونقاط البيع المتكامل (Production-Ready Full Stack)

نظام متكامل واحترافي لإدارة الصيدليات ومنافذ البيع، مصمم وفق أعلى معايير هندسة البرمجيات والأداء العالي، مبني بـ **React 19 + TypeScript + Node.js Express + Prisma ORM + MySQL (XAMPP)** مع دعم كامل لقاعدة بيانات الأدوية المصرية (أكثر من 25,000 دواء)، وإدارة الصلاحيات (FEFO)، والباركود، والتأمين الطبي، وبرامج الولاء، والفواتير الحرارية وإشعارات الواتساب.

---

## 🚀 دليل التثبيت والتشغيل على أي جهاز جديد (Step-by-Step Setup Guide)

اتبع الخطوات البسيطة التالية لتشغيل النظام بالكامل من الصفر على أي جهاز:

### 1️⃣ المتطلبات الأساسية (Prerequisites)
تأكد من تثبيت البرامج التالية على جهازك:
1. **[Node.js](https://nodejs.org/)** (الإصدار 18 أو 20 أو أحدث).
2. **[Git](https://git-scm.com/)** لإدارة الكود والمزامنة.
3. **[XAMPP](https://www.apachefriends.org/)** (لتشغيل خادم قاعدة البيانات MySQL).

---

### 2️⃣ استنساخ المشروع (Clone Repository)
افتح **PowerShell** أو **Command Prompt** ونفذ أمر الاستنساخ:
```bash
git clone https://github.com/rabea-shaban/-PHARMACY-POS.git pharmacy-pos
cd pharmacy-pos
```

---

### 3️⃣ تثبيت الحزم والمكتبات (Install Dependencies)
قم بتثبيت مكتبات المشروع بالكامل عبر الأوامر التالية:
```bash
# تثبيت حزم الجذر
npm install

# تثبيت حزم الـ Backend
npm --prefix pharmacy-pos-backend install

# تثبيت حزم الـ Frontend
npm --prefix pharmacy-pos-frontend install
```

---

### 4️⃣ إعداد وتجهيز قاعدة البيانات (Database Setup & Restore)

1. افتح **XAMPP Control Panel** وقم بتشغيل خادم **MySQL** بالضغط على **Start**.
2. أنشئ قاعدة البيانات واسترجع النسخة الاحتياطية المرفقة مع المشروع (تحتوي على 25,085 دواء وإعدادات النظام):

#### في PowerShell:
```powershell
# 1. إنشاء قاعدة البيانات
& "C:\xampp\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS pharmacy_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. توليد عميل Prisma
npm --prefix pharmacy-pos-backend run prisma:generate

# 3. استرجاع النسخة الاحتياطية الكاملة
Get-Content ".\backups\pharmacy_pos_backup_2026-08-26_13-18-25.sql" | & "C:\xampp\mysql\bin\mysql.exe" -u root pharmacy_pos
```

#### أو في Command Prompt (CMD):
```cmd
"C:\xampp\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS pharmacy_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
npm --prefix pharmacy-pos-backend run prisma:generate
"C:\xampp\mysql\bin\mysql.exe" -u root pharmacy_pos < "backups\pharmacy_pos_backup_2026-08-26_13-18-25.sql"
```

---

### 5️⃣ تشغيل النظام (Launch Application)

لتشغيل السيرفرين (Backend + Frontend) معاً بأمر واحد:
```bash
npm run dev
```

- **رابط واجهة الصيدلية (Frontend):** [http://localhost:5173](http://localhost:5173)
- **رابط الـ API السيرفر (Backend):** [http://localhost:5000](http://localhost:5000)
- **رابط التحقق من صحة النظام:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 بيانات تسجيل الدخول الافتراضية (Default Credentials)

يمكنك الدخول مباشرة بأي من الحسابات الجاهزة التالية:

| الدور (Role) | البريد الإلكتروني | كلمة المرور |
|---|---|---|
| **مدير المنظومة (Platform Manager)** | `admin@pharmacy.local` | `AdminPass123!` |
| **صيدلي أول / مدير فرع (Branch Manager)** | `pharmacist@pharmacy.local` | `PharmaPass123!` |
| **كاشير / مسؤول مبيعات (Cashier)** | `cashier@pharmacy.local` | `CashierPass123!` |
| **محاسب ومسؤول مالي (Accountant)** | `accountant@pharmacy.local` | `AccountPass123!` |

---

## 📋 الأوامر الشائعة المفيدة (Useful NPM Scripts)

| الأمر | الوظيفة |
|---|---|
| `npm run dev` | تشغيل الـ Backend والـ Frontend بالتوازي في بيئة التطوير |
| `npm run build` | بناء وتجهيز الـ Production Chunks لكلا المشروعين |
| `npm run db:backup` | أخذ نسخة احتياطية فورية وتلقائية لقاعدة البيانات داخل مجلد `backups/` |
| `npm run db:start` | تشغيل خادم MySQL الخاص بـ XAMPP في الخلفية تلقائياً |
| `npm run shortcuts:create` | إنشاء أيقونات واختصارات تشغيل وإيقاف سريعة على سطح المكتب (Desktop Shortcuts) |

---

## 🖥️ اختصارات سطح المكتب والتشغيل بضغطة زر (One-Click Launch)
لإنشاء أيقونات تشغيل الصيدلية مباشرة من سطح المكتب دون فتح الـ Terminal:
```powershell
npm run shortcuts:create
```
سيتم إنشاء أيقونتين على سطح مكتبك:
- **💊 Pharmacy POS - Start:** لتشغيل قواعد البيانات والسيرفرات وفتح المتصفح تلقائياً.
- **🛑 Pharmacy POS - Stop:** لإيقاف السيرفرات وقاعدة البيانات بشكل نظيف وآمن.

---

## 🛠️ البنية التقنية (Tech Stack)

### Frontend:
- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 6 + Production Chunking
- **State Management:** Redux Toolkit + TanStack React Query v5
- **Routing:** React Router v7
- **Styling & UI:** Tailwind CSS v4 + Lucide React Icons
- **Internationalization:** i18next (كامل اللغتين العربية والإنجليزية مع RTL/LTR)
- **Forms & Validation:** React Hook Form + Zod

### Backend:
- **Runtime:** Node.js (ES Modules) + TypeScript
- **Server:** Express 5
- **Database & ORM:** MySQL / MariaDB (XAMPP) + Prisma ORM
- **Security:** HttpOnly Cookies, JWT, Helmet, CORS, Rate Limiting, bcrypt
- **Logging & Auditing:** Comprehensive Audit Log & Activity Tracking

---

## 🌟 أبرز مميزات ووظائف النظام (Key Features)
1. **نقطة البيع والكاشير (POS):** دعم الباركود، الصرف الآلي حسب الصلاحية (FEFO)، والخصومات وطرق الدفع المتعددة (Split Payments).
2. **إدارة المخزون والتنبيهات:** مراقبة الأرصدة، تنبيهات النواقص، وتنبيهات الأدوية القريبة من الانتهاء.
3. **الدليل المرجعي للأدوية المصرية (Master Drug Catalog):** أكثر من 25,000 صنف دوائي بأسعارها الجبرية الرسمية وموادها الفعالة.
4. **المشتريات والموردين:** دورة مشتريات كاملة واستلام بوالص وتوليد تشغيلات حقيقية.
5. **المرتجعات وإشعارات الدائن (Sales Returns & Refunds):** استرجاع الأصناف وإعادة ضبط المخزون والحسابات المالية آلياً.
6. **التأمين الطبي والشركات (Insurance & Claims):** إدارة شركات التأمين وتغطية بوالص المرضى ونسب التحمل والمطالبات.
7. **برامج الولاء والعملاء:** حساب النقاط واستبدالها بالخصم ومستويات العملاء (Tiers).
8. **التقارير ولوحات التحكم المالية:** تقارير الأرباح والمبيعات، أداء الأصناف، ومسيرات العمولات والمصروفات.
9. **الورديات والخزينة (Shifts & Cash Drawers):** فتح وإغلاق وردية الكاشير وتتبع العجز والزيادة.
10. **الطباعة المتعددة:** طباعة فواتير حرارية (80mm Thermal) وفواتير قياسية (A4 Invoices).

---

## 📄 الترخيص (License)
هذا المشروع مخصص للاستخدام الإنتاجي والإداري للصيدليات.
جميع الحقوق محفوظة © 2026.
