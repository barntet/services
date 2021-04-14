FROM node:14.15.3

WORKDIR /usr/app/00-static
COPY . .
RUN npm i

EXPOSE 9000
CMD npm run start