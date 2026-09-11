# ===================================================================
# Pharmacy POS - Start MySQL Database (XAMPP)
# ===================================================================

$mysqlPath = "C:\xampp\mysql\bin\mysqld.exe"
$mysqlAdminPath = "C:\xampp\mysql\bin\mysqladmin.exe"
$myIniPath = "C:\xampp\mysql\bin\my.ini"

if (-not (Test-Path $mysqlPath)) {
    Write-Host "⚠️ MySQL was not found at $mysqlPath. If you are using a different MySQL instance, please ensure it is running."
    exit 0
}

# Check if MySQL is already responding
$pingResult = & $mysqlAdminPath -u root ping 2>$null
if ($LASTEXITCODE -eq 0 -or ($pingResult -match "alive")) {
    Write-Host "🟢 MySQL is already running and ready."
    exit 0
}

# If process is running but not responding, or not running
if (-not (Get-Process mysqld -ErrorAction SilentlyContinue)) {
    Write-Host "🔄 Starting MySQL service..."
    Start-Process -FilePath $mysqlPath -ArgumentList "--defaults-file=$myIniPath", "--standalone" -WorkingDirectory "C:\xampp" -WindowStyle Hidden
}

# Wait until MySQL is alive (up to 15 seconds)
$retries = 15
$ready = $false

while ($retries -gt 0) {
    Start-Sleep -Seconds 1
    $pingResult = & $mysqlAdminPath -u root ping 2>$null
    if ($LASTEXITCODE -eq 0 -or ($pingResult -match "alive")) {
        $ready = $true
        break
    }
    $retries--
}

if ($ready) {
    Write-Host "🟢 MySQL (XAMPP) started successfully and is ready for connections."
} else {
    Write-Host "⚠️ MySQL process started, but connection is still initializing. Continuing..."
}
