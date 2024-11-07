FROM node:20.15.0 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20.15.0 as development

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY . .

EXPOSE 3001
CMD ["npm", "run", "start:dev"]

FROM node:20.15.0 as production

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production

EXPOSE 3000
CMD ["node", "dist/main"]
