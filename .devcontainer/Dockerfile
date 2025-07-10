FROM node:20-alpine

WORKDIR /workspace

COPY package.json package-lock.json ./

RUN npm install

COPY . .
