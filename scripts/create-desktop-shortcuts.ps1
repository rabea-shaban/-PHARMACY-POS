# ===================================================================
# Pharmacy POS - Desktop Shortcut Creator
# Creates 'Pharmacy POS' and 'Pharmacy POS - Stop' on Windows Desktop
# ===================================================================
$projectRoot = "D:\pharmacy-pos"
if (-not (Test-Path "$projectRoot\package.json")) {
    $projectRoot = Split-Path -Parent $PSScriptRoot
}

$desktopPath = [Environment]::GetFolderPath([Environment+SpecialFolder]::Desktop)
$assetsDir = Join-Path $projectRoot "assets"
$scriptsDir = Join-Path $projectRoot "scripts"

# Ensure icons exist
$startIco = Join-Path $assetsDir "pharmacy-pos.ico"
$stopIco = Join-Path $assetsDir "pharmacy-pos-stop.ico"

if ((-not (Test-Path $startIco)) -or (-not (Test-Path $stopIco))) {
    & (Join-Path $scriptsDir "generate-icons.ps1")
}

$wshShell = New-Object -ComObject WScript.Shell

# 1. Main Launcher Shortcut: "Pharmacy POS"
$startLnkPath = Join-Path $desktopPath "Pharmacy POS.lnk"
$startLnk = $wshShell.CreateShortcut($startLnkPath)
$startLnk.TargetPath = "wscript.exe"
$startLnk.Arguments = "`"$scriptsDir\start-pharmacy-pos.vbs`""
$startLnk.WorkingDirectory = $projectRoot
$startLnk.IconLocation = "$startIco,0"
$startLnk.Description = "Launch Pharmacy POS System"
$startLnk.WindowStyle = 1
$startLnk.Save()

# 2. Stopper Shortcut: "Pharmacy POS - Stop"
$stopLnkPath = Join-Path $desktopPath "Pharmacy POS - Stop.lnk"
$stopLnk = $wshShell.CreateShortcut($stopLnkPath)
$stopLnk.TargetPath = "wscript.exe"
$stopLnk.Arguments = "`"$scriptsDir\stop-pharmacy-pos.vbs`""
$stopLnk.WorkingDirectory = $projectRoot
$stopLnk.IconLocation = "$stopIco,0"
$stopLnk.Description = "Safely stop Pharmacy POS System"
$stopLnk.WindowStyle = 1
$stopLnk.Save()

[System.Runtime.Interopservices.Marshal]::ReleaseComObject($wshShell) | Out-Null

Write-Host "=================================================="
Write-Host "✅ Desktop Shortcuts created successfully!"
Write-Host "  1. $startLnkPath"
Write-Host "  2. $stopLnkPath"
Write-Host "=================================================="
