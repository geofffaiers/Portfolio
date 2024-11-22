# Use the official MySQL image as the base image
FROM mysql:latest

# Set environment variables
ENV MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
ENV MYSQL_DATABASE=${MYSQL_DATABASE}
ENV MYSQL_USER=${MYSQL_USER}
ENV MYSQL_PASSWORD=${MYSQL_PASSWORD}

# Copy the initialization scripts to the Docker entrypoint directory
COPY ./ /docker-entrypoint-initdb.d

# Expose the MySQL port
EXPOSE ${MYSQL_PORT}

# Healthcheck to ensure the MySQL server is up and running
HEALTHCHECK --interval=5s --retries=50 CMD mysqladmin ping -h localhost -p${MYSQL_ROOT_PASSWORD} || exit 1