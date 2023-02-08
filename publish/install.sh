# install tools
sudo apt-get update
sudo apt install unzip
sudo apt install wget

# install docker/docker-compose
curl -fsSL https://get.docker.com | bash -s docker

# run docker with non-root user
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker

mkdir ~/workspace
cd ~/workspace
mkdir v2ray
mkdir nginx

cd ~/workspace/v2ray
wget https://raw.githubusercontent.com/cg-zhou/website-z11g/master/publish/v2ray/config.json

cd ~/workspace/nginx
wget https://raw.githubusercontent.com/cg-zhou/website-z11g/master/publish/nginx/default.conf
wget https://raw.githubusercontent.com/cg-zhou/website-z11g/master/publish/nginx/cg-zhou.top.key
wget https://raw.githubusercontent.com/cg-zhou/website-z11g/master/publish/nginx/cg-zhou.top.pem

# start docker v2ray
docker image pull v2fly/v2fly-core
docker rm v2ray -f
docker run --restart=always --name v2ray -p 10086:10086 -d -v ~/workspace/v2ray/config.json:/etc/v2ray/config.json v2fly/v2fly-core run -c /etc/v2ray/config.json

# start docker z11g
docker image pull metaphor1990/z11g
docker rm -f z11g-nginx
docker run --restart=always --name z11g-nginx -p 80:80 -p 443:443 -d -v ~/workspace/nginx:/etc/nginx/conf.d metaphor1990/z11g
