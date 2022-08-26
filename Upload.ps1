$Domain = "cg-zhou.top"
$Ip = [System.Net.Dns]::GetHostAddresses($Domain).IPAddressToString

function Print ($Text, $Color) {
    if ($null -eq $Color) {
        Write-Host $Text
    }
    else {
        Write-Host $Text -ForegroundColor $Color
    }
}

Print
Print "The IP of $Domain is:" Green
Print "$Ip"

Print
Print "Please input the file path:" Green
$File = Read-Host 

if (-not (Test-Path $File)) {
    Print "Can't find the file:"
    Print "$File"
    return;
}

$FileName = $(Get-Item $File).Name

Print 
Print "Copy $File to remote server ${Ip}" Green
Invoke-Expression "scp $File cgzhou@${Ip}:/tmp"

Print 
Print "Deploy $FileName into nginx container" Green

$Command = "docker exec z11g-nginx mkdir -p /usr/share/nginx/html/download; "
$Command += "docker cp /tmp/$FileName z11g-nginx:/usr/share/nginx/html/download/$FileName; "
$Command += "echo 'All files:'; "
$Command += "docker exec z11g-nginx ls -lah /usr/share/nginx/html/download; "
$Command += "rm /tmp/$FileName; "
Invoke-Expression "ssh cgzhou@$Ip '$Command'"

$PublishUrl = "https://$Domain/download/$FileName"
Print
Print "The result link is:" Green
Print $PublishUrl Yellow
Print
