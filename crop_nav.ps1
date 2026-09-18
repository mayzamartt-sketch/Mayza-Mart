Add-Type -AssemblyName System.Drawing

$srcPath = "c:\Users\shame\entrance\mockup_reference.jpg"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

$rect = New-Object System.Drawing.Rectangle(0, 60, 420, 200)
$cropped = $bmp.Clone($rect, $bmp.PixelFormat)
$outPath = "c:\Users\shame\entrance\little_joys_crop.png"
$cropped.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

$cropped.Dispose()
$bmp.Dispose()
Write-Output "Saved clean crop to $outPath"
