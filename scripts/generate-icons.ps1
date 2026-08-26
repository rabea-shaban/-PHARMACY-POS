Add-Type -AssemblyName System.Drawing

$assetsDir = Join-Path $PSScriptRoot "..\assets"
if (-not (Test-Path $assetsDir)) {
    New-Item -ItemType Directory -Path $assetsDir -Force | Out-Null
}

function Build-IcoFile {
    param(
        [string]$outputPath,
        [string]$mode
    )

    $sizes = @(16, 32, 48, 64, 128, 256)
    $bitmaps = [System.Collections.Generic.List[System.Drawing.Bitmap]]::new()
    $pngStreams = [System.Collections.Generic.List[System.IO.MemoryStream]]::new()

    try {
        foreach ($sz in $sizes) {
            $bmp = New-Object System.Drawing.Bitmap($sz, $sz, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
            $g = [System.Drawing.Graphics]::FromImage($bmp)
            $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
            $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
            $g.Clear([System.Drawing.Color]::Transparent)

            $pad = [Math]::Max(1.0, [float]($sz * 0.04))
            $rectW = [float]($sz - 2 * $pad)
            $rectH = [float]($sz - 2 * $pad)
            $rect = New-Object System.Drawing.RectangleF($pad, $pad, $rectW, $rectH)
            $radius = [float]($sz * 0.22)

            # Draw rounded background
            $path = New-Object System.Drawing.Drawing2D.GraphicsPath
            $d = $radius * 2
            $path.AddArc($rect.X, $rect.Y, $d, $d, 180, 90)
            $path.AddArc($rect.Right - $d, $rect.Y, $d, $d, 270, 90)
            $path.AddArc($rect.Right - $d, $rect.Bottom - $d, $d, $d, 0, 90)
            $path.AddArc($rect.X, $rect.Bottom - $d, $d, $d, 90, 90)
            $path.CloseFigure()

            if ($mode -eq "start") {
                # Modern Emerald Green Gradient
                $c1 = [System.Drawing.Color]::FromArgb(255, 16, 185, 129)
                $c2 = [System.Drawing.Color]::FromArgb(255, 5, 150, 105)
                $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $c1, $c2, [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal)
                $g.FillPath($brush, $path)
                $brush.Dispose()

                # Inner subtle border glow
                $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(60, 255, 255, 255), [Math]::Max(1.0, [float]($sz * 0.03)))
                $g.DrawPath($pen, $path)
                $pen.Dispose()

                # White Medical Cross
                $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
                $cx = [float]($sz / 2.0)
                $cy = [float]($sz / 2.0)
                $cLen = [float]($sz * 0.54)
                $cThick = [float]($sz * 0.18)

                $hRect = New-Object System.Drawing.RectangleF(($cx - $cLen / 2.0), ($cy - $cThick / 2.0), $cLen, $cThick)
                $vRect = New-Object System.Drawing.RectangleF(($cx - $cThick / 2.0), ($cy - $cLen / 2.0), $cThick, $cLen)

                $g.FillRectangle($whiteBrush, $hRect)
                $g.FillRectangle($whiteBrush, $vRect)
                $whiteBrush.Dispose()
            }
            else {
                # Modern Crimson Red Gradient for Stop
                $c1 = [System.Drawing.Color]::FromArgb(255, 239, 68, 68)
                $c2 = [System.Drawing.Color]::FromArgb(255, 185, 28, 28)
                $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $c1, $c2, [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal)
                $g.FillPath($brush, $path)
                $brush.Dispose()

                # Inner subtle border glow
                $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(60, 255, 255, 255), [Math]::Max(1.0, [float]($sz * 0.03)))
                $g.DrawPath($pen, $path)
                $pen.Dispose()

                # White Stop Square / Power Emblem
                $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
                $sqSize = [float]($sz * 0.40)
                $sRect = New-Object System.Drawing.RectangleF(([float]($sz / 2.0) - $sqSize / 2.0), ([float]($sz / 2.0) - $sqSize / 2.0), $sqSize, $sqSize)
                
                # Rounded stop square
                $sqPath = New-Object System.Drawing.Drawing2D.GraphicsPath
                $sqR = [float]($sqSize * 0.2)
                $sqD = $sqR * 2
                $sqPath.AddArc($sRect.X, $sRect.Y, $sqD, $sqD, 180, 90)
                $sqPath.AddArc($sRect.Right - $sqD, $sRect.Y, $sqD, $sqD, 270, 90)
                $sqPath.AddArc($sRect.Right - $sqD, $sRect.Bottom - $sqD, $sqD, $sqD, 0, 90)
                $sqPath.AddArc($sRect.X, $sRect.Bottom - $sqD, $sqD, $sqD, 90, 90)
                $sqPath.CloseFigure()

                $g.FillPath($whiteBrush, $sqPath)
                $sqPath.Dispose()
                $whiteBrush.Dispose()
            }

            $path.Dispose()
            $g.Dispose()

            $pStream = New-Object System.IO.MemoryStream
            $bmp.Save($pStream, [System.Drawing.Imaging.ImageFormat]::Png)
            $bitmaps.Add($bmp)
            $pngStreams.Add($pStream)
        }

        # Compose ICO binary
        $outStream = [System.IO.File]::Create($outputPath)
        $bw = New-Object System.IO.BinaryWriter($outStream)

        # Header: Reserved (0), Type (1 for ICO), Image Count
        $bw.Write([UInt16]0)
        $bw.Write([UInt16]1)
        $bw.Write([UInt16]$bitmaps.Count)

        # Directory entries
        $offset = 6 + (16 * $bitmaps.Count)
        for ($i = 0; $i -lt $bitmaps.Count; $i++) {
            $b = $bitmaps[$i]
            $ps = $pngStreams[$i]
            $wByte = if ($b.Width -ge 256) { [byte]0 } else { [byte]$b.Width }
            $hByte = if ($b.Height -ge 256) { [byte]0 } else { [byte]$b.Height }

            $bw.Write($wByte)
            $bw.Write($hByte)
            $bw.Write([byte]0)   # Color palette count
            $bw.Write([byte]0)   # Reserved
            $bw.Write([UInt16]1) # Color planes
            $bw.Write([UInt16]32)# Bits per pixel
            $bw.Write([UInt32]$ps.Length) # Image data size
            $bw.Write([UInt32]$offset)    # Image data offset
            $offset += $ps.Length
        }

        # Write PNG payloads
        for ($i = 0; $i -lt $bitmaps.Count; $i++) {
            $bytes = $pngStreams[$i].ToArray()
            $bw.Write($bytes)
        }

        $bw.Flush()
        $bw.Close()
        $outStream.Close()
    }
    finally {
        foreach ($ps in $pngStreams) { $ps.Dispose() }
        foreach ($b in $bitmaps) { $b.Dispose() }
    }
}

$startIco = Join-Path $assetsDir "pharmacy-pos.ico"
$stopIco = Join-Path $assetsDir "pharmacy-pos-stop.ico"

Build-IcoFile -outputPath $startIco -mode "start"
Build-IcoFile -outputPath $stopIco -mode "stop"

Write-Host "Icons generated successfully:"
Write-Host "  -> $startIco"
Write-Host "  -> $stopIco"
