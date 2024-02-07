FROM node:16
WORKDIR /app

COPY ./package.json ./package.json
COPY ./index.js ./index.js
COPY ./routes ./routes 
COPY ./.env ./.env
COPY ./serviceaccount.json ./serviceaccount.json
RUN mkdir ./google_Audios
RUN npm install --silent
EXPOSE 3001

CMD ["npm", "start"]