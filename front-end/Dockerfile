FROM node:16
WORKDIR /app

COPY ./package.json ./package.json
COPY ./public ./public
COPY ./src ./src
RUN npm install -g npm@9.5.0
RUN npm install --silent
EXPOSE 3000

CMD ["npm", "start"]