FROM nginx

COPY nginx-default.conf /etc/nginx/conf.d/default.conf
COPY ng /usr/share/nginx/html

ENTRYPOINT ["nginx", "-g", "daemon off;"]
