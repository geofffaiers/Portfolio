# /nginx/Dockerfile
FROM nginx:latest

COPY nginx.prod.conf /etc/nginx/nginx.conf

RUN mkdir -p /etc/letsencrypt /var/lib/letsencrypt

VOLUME ["/etc/letsencrypt", "/var/lib/letsencrypt"]

EXPOSE 80 443