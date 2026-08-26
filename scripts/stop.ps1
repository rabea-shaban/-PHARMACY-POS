# ===================================================================
# Pharmacy POS - Safe Process Stopper
# ===================================================================
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$projectRoot = "D:\pharmacy-pos"
if (-not (Test-Path "$projectRoot\package.json")) {
    $projectRoot = Split-Path -Parent $PSScriptRoot
}

Set-Location $projectRoot

function Show-Msg {
    param(
        [string]$text,
        [string]$title,
        [System.Windows.Forms.MessageBoxIcon]$icon
    )
    [System.Windows.Forms.MessageBox]::Show($text, $title, [System.Windows.Forms.MessageBoxButtons]::OK, $icon)
}

function Get-PidsFromPort {
    param([int]$port)
    $pids = @()
    try {
        $conns = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
        if ($conns) {
            $pids += ($conns | Select-Object -ExpandProperty OwningProcess -Unique)
        }
    }
    catch { }

    # Fallback to netstat
    if ($pids.Count -eq 0) {
        $lines = netstat -ano | Select-String ":$port\s+.*LISTENING\s+(\d+)"
        foreach ($line in $lines) {
            if ($line.Matches[0].Groups[1].Value) {
                $pids += [int]$line.Matches[0].Groups[1].Value
            }
        }
    }

    return ($pids | Select-Object -Unique)
}

$stoppedItems = @()
$killedPids = @()

# 1. Stop Frontend (Port 3000) and Backend (Port 5000)
$ports = @(3000, 5000)
foreach ($port in $ports) {
    $portPids = Get-PidsFromPort $port
    foreach ($p in $portPids) {
        if ($p -and ($killedPids -notcontains $p) -and ($p -ne $PID)) {
            try {
                $proc = Get-Process -Id $p -ErrorAction SilentlyContinue
                if ($proc) {
                    Stop-Process -Id $p -Force -ErrorAction SilentlyContinue
                    $killedPids += $p
                    $stoppedItems += "Stopped process on port $port (PID: $p - $($proc.ProcessName))"
                }
            }
            catch { }
        }
    }
}

# 2. Stop any remaining background node / tsx / cmd processes launched for pharmacy-pos
try {
    $posProcesses = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object {
        $_.CommandLine -and ($_.CommandLine -like "*pharmacy-pos*" -or $_.CommandLine -like "*pharmacy-pos-backend*" -or $_.CommandLine -like "*pharmacy-pos-frontend*") -and ($_.ProcessId -ne $PID) -and ($killedPids -notcontains $_.ProcessId)
    }
    foreach ($item in $posProcesses) {
        try {
            Stop-Process -Id $item.ProcessId -Force -ErrorAction SilentlyContinue
            $killedPids += $item.ProcessId
            $stoppedItems += "Stopped background task (PID: $($item.ProcessId) - $($item.Name))"
        } catch { }
    }
} catch { }

# 3. Stop MySQL safely via mysqladmin shutdown
$mysqlStopped = $false
try {
    $mysqlAdminPath = "C:\xampp\mysql\bin\mysqladmin.exe"
    if (Test-Path $mysqlAdminPath) {
        $psi = New-Object System.Diagnostics.ProcessStartInfo
        $psi.FileName = $mysqlAdminPath
        $psi.Arguments = "-u root shutdown"
        $psi.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Hidden
        $psi.CreateNoWindow = $true
        $psi.UseShellExecute = $false
        $p = [System.Diagnostics.Process]::Start($psi)
        if ($p) {
            $p.WaitForExit(3000) | Out-Null
            $mysqlStopped = $true
            $stoppedItems += "MySQL (XAMPP) shutdown command sent"
        }
    }
}
catch { }

# Log the stop action
$logsDir = Join-Path $projectRoot "logs"
if (-not (Test-Path $logsDir)) {
    New-Item -ItemType Directory -Path $logsDir -Force | Out-Null
}
$logFile = Join-Path $logsDir "app.log"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
try {
    "==================================================" | Out-File -FilePath $logFile -Append -Encoding utf8 -ErrorAction SilentlyContinue
    "[$timestamp] Pharmacy POS stopped." | Out-File -FilePath $logFile -Append -Encoding utf8 -ErrorAction SilentlyContinue
    "==================================================" | Out-File -FilePath $logFile -Append -Encoding utf8 -ErrorAction SilentlyContinue
} catch { }

if ($stoppedItems.Count -gt 0) {
    $summary = ($stoppedItems -join "`n• ")
    Show-Msg "Pharmacy POS services have been stopped successfully.`n`n• $summary" "Pharmacy POS - Stopped" ([System.Windows.Forms.MessageBoxIcon]::Information)
}
else {
    Show-Msg "No running Pharmacy POS processes were found." "Pharmacy POS - Already Stopped" ([System.Windows.Forms.MessageBoxIcon]::Information)
}
