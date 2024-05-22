FROM node:alpine
WORKDIR /usr/src/app
COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./tsconfig.json ./
RUN npm install
COPY ./src ./src
COPY ./.env ./
CMD ["npm", "run" , "dev"]