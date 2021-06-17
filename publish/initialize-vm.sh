sudo apt update

sudo apt install docker.io

sudo groupadd docker

sudo gpasswd -a $USER docker

newgrp docker

./start-z11g.sh

./start-v2ray.sh
