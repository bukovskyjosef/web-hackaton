FROM composer:2 AS vendor

WORKDIR /app/calendar

COPY calendar/composer.json calendar/composer.lock ./

RUN composer install \
    --no-dev \
    --prefer-dist \
    --no-interaction \
    --optimize-autoloader


FROM php:8.3-apache

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       libonig-dev \
       libcurl4-openssl-dev \
    && docker-php-ext-install mbstring curl \
    && rm -rf /var/lib/apt/lists/*

COPY . /var/www/html/

COPY --from=vendor /app/calendar/vendor /var/www/html/calendar/vendor

RUN mkdir -p /var/www/html/calendar/private \
    && chown -R www-data:www-data /var/www/html/calendar/private

EXPOSE 80