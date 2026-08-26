# Verify Shortcuts
$wsh = New-Object -ComObject WScript.Shell
Get-Item 'C:\Users\Admin\Desktop\Pharmacy POS*.lnk' | ForEach-Object {
    $s = $wsh.CreateShortcut($_.FullName)
    [PSCustomObject]@{
        Name       = $_.Name
        Target     = $s.TargetPath
        Args       = $s.Arguments
        WorkingDir = $s.WorkingDirectory
        Icon       = $s.IconLocation
    }
} | Format-List
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($wsh) | Out-Null
