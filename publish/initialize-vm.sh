sudo apt update

sudo apt install docker.io

sudo groupadd docker

sudo gpasswd -a $USER docker

newgrp docker

chmod u+x ./start-z11g.sh

./start-z11g.sh

chmod u+x ./start-v2ray.sh

./start-v2ray.sh
