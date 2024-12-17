#!/bin/bash
set -e

/usr/local/bin/docker-entrypoint.sh mysqld &

until mysqladmin ping -h "localhost" --silent; do
  echo 'waiting for mysqld to be connectable...'
  sleep 2
done

for f in /docker-entrypoint-initdb.d/migrations/*.sql; do
  echo "Running $f"
  mysql -u root -p${MYSQL_ROOT_PASSWORD} portfolio < "$f"
done

wait
