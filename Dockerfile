FROM nginx
COPY  docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY static/ /usr/share/nginx/html
