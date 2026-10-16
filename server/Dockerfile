#BASE IMAGE
FROM node:18-alpine

#directory in container
WORKDIR /app

#INSTALL REQUIREMENTS   - Build Command
COPY package*.json ./
COPY prisma ./prisma


RUN npm install

#for Prisma ORM
RUN npx prisma generate 

#MAKE A BUILD COPY
COPY . .

#EXPOSE THE PORT
EXPOSE 5000

#RUN  - Run Command
# CMD [ "node", "server.js" ]
CMD [ "sh", "-c","npx prisma migrate deploy && node server.js" ]
