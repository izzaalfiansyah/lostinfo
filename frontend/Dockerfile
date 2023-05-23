FROM php:8.1-apache

WORKDIR /var/www/html

COPY ./dist /var/www/html

EXPOSE 5000

CMD ["php", "-S", "0.0.0.0:5000"]