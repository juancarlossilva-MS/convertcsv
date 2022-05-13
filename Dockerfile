FROM node:14.15.4-alpine3.12

RUN apk add --no-cache bash

USER root

WORKDIR /home/node/app

