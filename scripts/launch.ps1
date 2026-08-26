# ===================================================================
# Pharmacy POS - Background Launcher
# ===================================================================
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$projectRoot = "D:\pharmacy-pos"
if (-not (Test-Path "$projectRoot\package.json")) {
    $projectRoot = Split-Path -Parent $PSScriptRoot
}

Set-Location $projectRoot

# Prevent Vite & Node CLI from exiting on stdin EOF in non-interactive background mode
$env:CI = "true"
$env:BROWSER = "none"

$logsDir = Join-Path $projectRoot "logs"
if (-not (Test-Path $logsDir)) {
    New-Item -ItemType Directory -Path $logsDir -Force | Out-Null
}
$logFile = Join-Path $logsDir "app.log"

function Show-Msg {
    param(
        [string]$text,
        [string]$title,
        [System.Windows.Forms.MessageBoxIcon]$icon
    )
    [System.Windows.Forms.MessageBox]::Show($text, $title, [System.Windows.Forms.MessageBoxButtons]::OK, $icon)
}

# 1. Verify Node / NPM prerequisites
$npmCmd = Get-Command "npm.cmd" -ErrorAction SilentlyContinue
if (-not $npmCmd) {
    $npmCmd = Get-Command "npm" -ErrorAction SilentlyContinue
}

if (-not $npmCmd) {
    Show-Msg "Node.js / npm was not found in your system PATH.`n`nPlease ensure Node.js is installed before launching Pharmacy POS." "Pharmacy POS - Node.js Missing" ([System.Windows.Forms.MessageBoxIcon]::Error)
    exit 1
}

# 2. Check if Pharmacy POS is already running
function Test-PortListening {
    param([int]$port)
    try {
        $client = New-Object System.Net.Sockets.TcpClient
        $asyncResult = $client.BeginConnect("127.0.0.1", $port, $null, $null)
        $success = $asyncResult.AsyncWaitHandle.WaitOne(400, $false)
        if ($success -and $client.Connected) {
            $client.EndConnect($asyncResult)
            $client.Close()
            return $true
        }
        $client.Close()
        return $false
    }
    catch {
        return $false
    }
}

if (Test-PortListening 3000) {
    # Already running, open/focus the browser
    Start-Process "http://localhost:3000"
    exit 0
}

# 3. Start npm run dev in background with CI=true
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
try {
    "==================================================" | Out-File -FilePath $logFile -Append -Encoding utf8 -ErrorAction SilentlyContinue
    "[$timestamp] Starting Pharmacy POS via launcher..." | Out-File -FilePath $logFile -Append -Encoding utf8 -ErrorAction SilentlyContinue
    "==================================================" | Out-File -FilePath $logFile -Append -Encoding utf8 -ErrorAction SilentlyContinue
} catch { }

$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = "cmd.exe"
$psi.Arguments = "/c set CI=true&& npm run dev >> `"$logFile`" 2>&1"
$psi.WorkingDirectory = $projectRoot
$psi.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Hidden
$psi.CreateNoWindow = $true
$psi.UseShellExecute = $true

$proc = [System.Diagnostics.Process]::Start($psi)

# 4. Monitor startup until Frontend is ready (up to 45 seconds)
$maxWaitSeconds = 45
$startTime = [DateTime]::UtcNow
$started = $false

while (([DateTime]::UtcNow - $startTime).TotalSeconds -lt $maxWaitSeconds) {
    Start-Sleep -Milliseconds 800

    if (Test-PortListening 3000) {
        $started = $true
        break
    }
}

if ($started) {
    # Brief pause to ensure Vite finished initial bundling
    Start-Sleep -Milliseconds 600
    Start-Process "http://localhost:3000"
    exit 0
}
else {
    # Read last lines of log to inform the user
    $lastLines = ""
    if (Test-Path $logFile) {
        $lines = Get-Content $logFile -Tail 15 -ErrorAction SilentlyContinue
        if ($lines) {
            $lastLines = ($lines -join "`n")
        }
    }

    $errMsg = "Pharmacy POS did not start within $maxWaitSeconds seconds.`n`n"
    if ($lastLines) {
        $errMsg += "Recent log output:`n------------------------------------`n$lastLines`n------------------------------------`n"
    }
    $errMsg += "Log file located at:`n$logFile"

    Show-Msg $errMsg "Pharmacy POS - Startup Notice" ([System.Windows.Forms.MessageBoxIcon]::Warning)
    exit 1
}
