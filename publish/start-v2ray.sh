docker image pull v2fly/v2fly-core

docker rm v2ray -f

docker run --name v2ray -p 10086:10086 -d -v $PWD/v2ray/config.json:/etc/v2ray/config.json v2fly/v2fly-core
