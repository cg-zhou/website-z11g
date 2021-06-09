docker image pull metaphor1990/z11g

docker rm -f z11g-nginx

docker run --name z11g-nginx -p 80:80 -p 443:443 -d -v /home/cgzhou/nginx:/etc/nginx/conf.d metaphor1990/z11g
