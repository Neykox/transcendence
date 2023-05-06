FROM node:latest

WORKDIR /app/usr/src/frontend

COPY package*.json ./

RUN yarn global add typescript

RUN yarn install

# Copiez le reste des fichiers du projet dans le répertoire de travail
COPY . .

VOLUME [ "/usr/src/app/frontend/src" ]
VOLUME [ "/usr/src/app/frontend/shared"]


RUN yarn run build

CMD ["yarn", "start"]