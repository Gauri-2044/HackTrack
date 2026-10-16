# Aim is to make a compressed image 

#1. Building a basic image
FROM node:24-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

#2. Make app compress to serve only necessary things on nginx server
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]
