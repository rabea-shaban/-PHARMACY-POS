# PowerShell Database Backup Script for Pharmacy POS (MySQL / MariaDB XAMPP)
$ErrorActionPreference = "Stop"

$BackupDir = Join-Path $PSScriptRoot "..\backups"
if (!(Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

$Timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$BackupFile = Join-Path $BackupDir "pharmacy_pos_backup_$Timestamp.sql"

$MySqlDumpPath = "C:\xampp\mysql\bin\mysqldump.exe"
if (!(Test-Path $MySqlDumpPath)) {
    # Check PATH
    $MySqlDumpPath = "mysqldump"
}

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "💾 Starting Pharmacy POS Database Backup..." -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "📁 Target Destination: $BackupFile" -ForegroundColor Yellow

try {
    & $MySqlDumpPath -u root --databases pharmacy_pos --routines --triggers --single-transaction --result-file="$BackupFile"
    
    if (Test-Path $BackupFile) {
        $FileSize = (Get-Item $BackupFile).Length / 1MB
        $FormattedSize = [math]::Round($FileSize, 2)
        Write-Host "✅ Database Backup Created Successfully!" -ForegroundColor Green
        Write-Host "📊 File Size: $FormattedSize MB" -ForegroundColor Green
        Write-Host "📍 Location: $BackupFile" -ForegroundColor Green
    } else {
        Write-Host "❌ Backup file was not created." -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error creating database backup: $_" -ForegroundColor Red
}
Write-Host "================================================================" -ForegroundColor Cyan
