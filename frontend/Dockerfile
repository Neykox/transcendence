FROM node:20.2.0

WORKDIR /usr/src/app/frontend

COPY package.json ./

RUN yarn global add typescript

RUN yarn install

# Copiez le reste des fichiers du projet dans le répertoire de travail
COPY . .

VOLUME [ "/usr/src/app/frontend/src" ]
VOLUME [ "/usr/src/app/frontend/shared"]
VOLUME [ "/usr/src/app/frontend/public"]

CMD ["yarn", "start:dev", "--watch"]