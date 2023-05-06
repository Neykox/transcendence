FROM node:latest

WORKDIR /usr/src/app

COPY package.json  ./
COPY tsconfig.json ./
COPY nest-cli.json ./

RUN yarn install

RUN mkdir dist
RUN chown node:node dist

VOLUME [ "/usr/src/app/src" ]
VOLUME [ "/usr/src/app/shared" ]

CMD ["yarn", "start"]



