## Utilisation d'une image de base pour PostgreSQL
FROM postgres:latest

## Copie d'un script pour initialiser la base de données
COPY init.sh /docker-entrypoint-initdb.d/script.sh

ENV POSTGRES_USER=${POSTGRES_USER}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
ENV POSTGRES_DB=${POSTGRES_DB}

EXPOSE 5432

