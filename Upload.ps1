$domain = "cg-zhou.top"
$ip = [System.Net.Dns]::GetHostAddresses($domain).IPAddressToString

function Print ($text, $color) {
    if ($null -eq $color) {
        Write-Host $text
    }
    else {
        Write-Host $text -ForegroundColor $color
    }
}

Print
Print "The IP of $domain is:" Green
Print "$ip"

Print
Print "Please input the file path or file URL:" Green
$uri = Read-Host 

$isLocalFile = $true
$fileName = ""
if ($uri.StartsWith("http")) {
    $isLocalFile = $false
    $fileName = $uri.Substring($uri.LastIndexOf("/") + 1)
} else {
    if (-not (Test-Path $uri)) {
        Print "Can't find the file:"
        Print "$uri"
        return;
    }
    
    $fileName = $(Get-Item $uri).Name

    Print 
    Print "Copy $uri to remote server ${Ip}" Green
    Invoke-Expression "scp $uri cgzhou@${Ip}:/tmp"
}

Print
Print "The file name is:" Green
Print "$fileName"

Print 
Print "Execute remote commands:" Green

$cmd = ""
if (-not $isLocalFile){
    $cmd += "wget $uri -O /tmp/$fileName; "
}
$cmd += "docker exec z11g-nginx mkdir -p /usr/share/nginx/html/download; "
$cmd += "docker cp /tmp/$fileName z11g-nginx:/usr/share/nginx/html/download/$fileName; "
$cmd += "echo 'All files:'; "
$cmd += "docker exec z11g-nginx ls -lah /usr/share/nginx/html/download; "
$cmd += "rm /tmp/$fileName; "
Invoke-Expression "ssh cgzhou@$ip '$cmd'"

$result = "https://$domain/download/$fileName"
Print
Print "The result link is:" Green
Print $result Yellow
Print
