FROM nginx

COPY ng /usr/share/nginx/html

ENTRYPOINT ["nginx", "-g", "daemon off;"]
