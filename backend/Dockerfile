FROM node:20.2.0

WORKDIR /usr/src/app

COPY package.json  ./
COPY tsconfig.json ./
COPY nest-cli.json ./
COPY .prettierrc ./
COPY .eslintrc.js ./


RUN yarn install

#RUN yarn global add ts-node

RUN mkdir dist
RUN chown node:node dist

VOLUME [ "/usr/src/app/src" ]
VOLUME [ "/usr/src/app/shared" ]

CMD ["yarn","start:dev"]



