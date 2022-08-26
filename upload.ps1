$Domain = "cg-zhou.top"
$Ip = [System.Net.Dns]::GetHostAddresses($Domain).IPAddressToString

function PrintLable ($Text) {
    Write-Host $Text -ForegroundColor Blue    
}

function PrintText ($Text) {
    Write-Host $Text -ForegroundColor White    
}

PrintLable
PrintLable "The IP of $Domain is:"
PrintText "$Ip"

PrintLable
PrintLable "Please input the file path:"
$File = Read-Host 

if (-not (Test-Path $File)) {
    PrintLable "Can't find the file:"
    PrintText "$File"
    return;
}

$ZipFileName = "$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss').zip"
$ZipPath = "$env:TEMP\$ZipFileName"

PrintLable 
PrintLable "Compress $File to temporary ZIP file $ZipPath"
Compress-Archive -Path $File -DestinationPath $ZipPath

PrintLable 
PrintLable "Copy $ZipPath to remote server ${Ip}"
Invoke-Expression "scp $ZipPath cgzhou@${Ip}:/home/cgzhou/publish/nginx"

PrintLable 
PrintLable "Deploy $ZipFileName into nginx container"
Invoke-Expression "ssh cgzhou@$Ip 'docker cp /home/cgzhou/publish/nginx/$ZipFileName z11g-nginx:/usr/share/nginx/html'"

PrintLable 
PrintLable "Delete temporary file in the remote server ${Ip}"
Invoke-Expression "ssh cgzhou@$Ip 'rm /home/cgzhou/publish/nginx/*.zip'"

PrintLable
PrintLable "Delete local temporary file: $ZipPath"
Remove-Item $ZipPath

$PublishUrl = "https://$Domain/$ZipFileName"
PrintLable
PrintLable "The result link is:"
PrintText $PublishUrl
