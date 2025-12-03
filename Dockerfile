
# stage 1 - build the final image and copy the react build files
FROM nginx:1.21-alpine
COPY ./build/. /usr/share/nginx/html/
RUN rm /etc/nginx/conf.d/default.conf
COPY scripts/nginx/reimburse.conf /etc/nginx/conf.d
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]

#stage 2 - installing certbot and try to add ssl configuration 

# FROM certbot:certbot
# RUN ls /etc/letsencrypt
# RUN ls /var/www/certbot
