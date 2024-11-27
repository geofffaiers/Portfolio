# /nginx/Dockerfile
FROM nginx:latest

COPY nginx.prod.conf /etc/nginx/nginx.conf

VOLUME ["/etc/letsencrypt", "/var/lib/letsencrypt"]
