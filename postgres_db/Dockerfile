## Utilisation d'une image de base pour PostgreSQL
FROM postgres:latest

## Copie d'un script pour initialiser la base de données
##COPY init.sql ./
COPY init.sh /docker-entrypoint-initdb.d/script.sh

ENV POSTGRES_USER=${POSTGRES_USER}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
ENV POSTGRES_DB=${POSTGRES_DB}

##RUN set -eux \
##    echo "CREATE USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD';" > /docker-entrypoint-initdb.d/init-user.sql \
##    echo "CREATE DATABASE '$POSTGRES_DB';" >> /docker-entrypoint-initdb.d/init-user.sql \
##    && cat /docker-entrypoint-initdb.d/init-user.sql /init.sql > /docker-entrypoint-initdb.d/init-all.sql \
##    && chmod 755 /docker-entrypoint-initdb.d/*.sql

# Exposition du port par défaut pour PostgreSQL
EXPOSE 5432

