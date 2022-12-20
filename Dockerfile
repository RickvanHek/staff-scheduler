FROM node:16-alpine
WORKDIR /api

COPY package.json yarn.lock ./
RUN yarn install
COPY . .
CMD yarn start:dev

# COPY ./package.json /package.json 
# RUN yarn install --no-lockfile
# CMD yarn install && yarn start:dev