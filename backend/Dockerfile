FROM dunglas/frankenphp:latest-builder AS builder

RUN install-php-extensions \
	pcntl \
	pdo_mysql \
	mbstring \
	exif \
	bcmath \
	gd \
	zip \
	opcache

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY composer.json composer.lock ./

RUN composer install \
	--no-interaction \
	--no-plugins \
	--no-scripts \
	--no-dev \
	--prefer-dist

COPY . .

RUN composer dump-autoload --optimize --classmap-authoritative --no-dev


FROM dunglas/frankenphp:latest AS runtime

WORKDIR /app

ENV APP_ENV=production \
    APP_DEBUG=false \
    OCTANE_SERVER=frankenphp \
    GODEBUG=cgocheck=0

COPY --from=builder /usr/local/lib/php/extensions/ /usr/local/lib/php/extensions/
COPY --from=builder /usr/local/etc/php/conf.d/ /usr/local/etc/php/conf.d/

COPY --from=builder /app /app

RUN echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/docker-php-ext-opcache.ini \
	&& echo "opcache.enable_cli=1" >> /usr/local/etc/php/conf.d/docker-php-ext-opcache.ini \
	&& echo "opcache.jit=tracing" >> /usr/local/etc/php/conf.d/docker-php-ext-opcache.ini \
	&& echo "opcache.jit_buffer_size=100M" >> /usr/local/etc/php/conf.d/docker-php-ext-opcache.ini \
	&& echo "opcache.memory_consumption=128" >> /usr/local/etc/php/conf.d/docker-php-ext-opcache.ini \
	&& echo "opcache.interned_strings_buffer=16" >> /usr/local/etc/php/conf.d/docker-php-ext-opcache.ini \
	&& echo "opcache.max_accelerated_files=20000" >> /usr/local/etc/php/conf.d/docker-php-ext-opcache.ini

RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache \
	&& chmod -R 775 /app/storage /app/bootstrap/cache \
	&& setcap -r /usr/local/bin/frankenphp

RUN php artisan config:cache \
	&& php artisan route:cache \
	&& php artisan event:cache \
	&& php artisan view:cache

EXPOSE 8000

ENTRYPOINT ["sh", "-c", "php artisan migrate --force && php artisan octane:start --server=frankenphp --host=0.0.0.0 --port=8000 --max-requests=500"]