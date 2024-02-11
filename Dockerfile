FROM node:20.11.0-alpine

WORKDIR /app

COPY . .
RUN npm i

CMD ["npm", "start"]