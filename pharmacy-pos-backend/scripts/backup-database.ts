import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function backupDatabase() {
  const backupsDir = path.resolve(__dirname, '../../backups');
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir, { recursive: true });
  }

  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
  const filename = `pharmacy_pos_backup_${timestamp}.sql`;
  const targetPath = path.join(backupsDir, filename);

  console.log('================================================================');
  console.log('💾 Pharmacy POS - Automated Database Backup (MySQL / MariaDB)');
  console.log('================================================================\n');
  console.log(`📁 Destination File: ${targetPath}`);

  // Resolve mysqldump path
  let mysqldumpCmd = 'mysqldump';
  const xamppDump = 'C:\\xampp\\mysql\\bin\\mysqldump.exe';
  if (fs.existsSync(xamppDump)) {
    mysqldumpCmd = `"${xamppDump}"`;
  }

  try {
    const cmd = `${mysqldumpCmd} -u root --databases pharmacy_pos --routines --triggers --single-transaction --result-file="${targetPath}"`;
    execSync(cmd, { stdio: 'inherit' });

    if (fs.existsSync(targetPath)) {
      const stats = fs.statSync(targetPath);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`\n✅ Database backup created successfully!`);
      console.log(`📊 File Size: ${sizeMB} MB`);
      console.log(`📍 Path: ${targetPath}`);
      console.log('================================================================\n');
    }
  } catch (err: any) {
    console.error(`\n❌ Failed to take database backup:`, err.message);
    process.exit(1);
  }
}

backupDatabase();
