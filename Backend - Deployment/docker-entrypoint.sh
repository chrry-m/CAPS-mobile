#!/bin/sh
if [ ! -f .env ]; then
  echo "Setting up configuration files..."
  cp .env.example .env
  php artisan key:generate
  php artisan jwt:secret --force
fi
php artisan config:cache
php artisan optimize:clear
php artisan storage:link || true
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache
exec "$@"
