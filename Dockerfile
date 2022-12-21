FROM node:16-alpine
WORKDIR /api

COPY package.json yarn.lock ./
RUN yarn install && yarn
COPY . .
RUN yarn build
CMD yarn start