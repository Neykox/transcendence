## Utilisation d'une image de base pour PostgreSQL
FROM postgres:latest

## Copie d'un script SQL pour initialiser la base de données
COPY init.sql ./

ENV POSTGRES_USER=${POSTGRES_USER}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}

##RUN set -eux \
##    echo "CREATE USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD';" > /docker-entrypoint-initdb.d/init-user.sql \
##    && cat /docker-entrypoint-initdb.d/init-user.sql /init.sql > /docker-entrypoint-initdb.d/init-all.sql \
##    #&& rm /init.sql \
##    && chmod 755 /docker-entrypoint-initdb.d/*.sql

# Exposition du port par défaut pour PostgreSQL
EXPOSE 5432

