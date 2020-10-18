FROM node:12.18.2-stretch-slim AS npm

RUN mkdir /app

COPY package.json yarn.lock /app/

WORKDIR /app

RUN yarn

COPY . /app
