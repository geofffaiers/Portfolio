#!/bin/bash
set -e

/usr/local/bin/docker-entrypoint.sh mysqld &

until mysqladmin ping -h "localhost" --silent; do
  echo 'waiting for mysqld to be connectable...'
  sleep 2
done

export MYSQL_PWD=${MYSQL_ROOT_PASSWORD}

for f in /docker-entrypoint-initdb.d/migrations/*.sql; do
  echo "Running $f"
  mysql -u root portfolio < "$f"
done

wait