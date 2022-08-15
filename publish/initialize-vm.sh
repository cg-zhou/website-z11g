# install unzip
sudo apt-get update
sudo apt install unzip

# install docker/docker-compose
curl -fsSL https://get.docker.com | bash -s docker

# start docker v2ray
docker image pull v2fly/v2fly-core
docker rm v2ray -f
docker run --restart=always --name v2ray -p 10086:10086 -d -v $PWD/v2ray/config.json:/etc/v2ray/config.json v2fly/v2fly-core

# start docker z11g
docker image pull metaphor1990/z11g
docker rm -f z11g-nginx
docker run --restart=always --name z11g-nginx -p 80:80 -p 443:443 -d -v $PWD/nginx:/etc/nginx/conf.d metaphor1990/z11g
