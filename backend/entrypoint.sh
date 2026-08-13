#!/bin/sh
php artisan migrate --force

(while true; do
	php artisan schedule:run
	sleep 60
done) &

php artisan octane:start --server=frankenphp --host=0.0.0.0 --port=8000
