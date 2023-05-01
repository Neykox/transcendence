FROM node:latest As development

WORKDIR /usr/src/app

COPY package.json  ./

COPY tsconfig.json ./

RUN yarn install

RUN mkdir dist
RUN chown node:node dist

CMD ["yarn", "start"]


