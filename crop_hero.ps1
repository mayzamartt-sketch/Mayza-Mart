Add-Type -AssemblyName System.Drawing

$srcPath = "c:\Users\shame\entrance\mockup_reference.jpg"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

# y = 64 perfectly clears the top navbar and wheel
# height = 188 perfectly captures the hero banner without any bottom bleed
$rect = New-Object System.Drawing.Rectangle(0, 64, $bmp.Width, 188)
$cropped = $bmp.Clone($rect, $bmp.PixelFormat)
$outPath = "c:\Users\shame\entrance\hero_banner_exact.png"
$cropped.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

$cropped.Dispose()
$bmp.Dispose()
Write-Output "Saved clean banner to $outPath"
