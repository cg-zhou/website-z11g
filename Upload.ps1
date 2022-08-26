$Domain = "cg-zhou.top"
$Ip = [System.Net.Dns]::GetHostAddresses($Domain).IPAddressToString

function PrintLable ($Text) {
    Write-Host $Text -ForegroundColor Green
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

$FileName = $(Get-Item $File).Name

PrintLable 
PrintLable "Copy $File to remote server ${Ip}"
Invoke-Expression "scp $File cgzhou@${Ip}:/home/cgzhou/publish/nginx"

PrintLable 
PrintLable "Deploy $FileName into nginx container"
Invoke-Expression "ssh cgzhou@$Ip 'docker cp /home/cgzhou/publish/nginx/$FileName z11g-nginx:/usr/share/nginx/html;
rm /home/cgzhou/publish/nginx/$FileName'"

$PublishUrl = "https://$Domain/$FileName"
PrintLable
PrintLable "The result link is:"
PrintText $PublishUrl
