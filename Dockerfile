FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
RUN npm ci

COPY . .

RUN rm -rf dist/
RUN npm run build --verbose

RUN npm prune --production

FROM node:20-alpine

WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY package.json ./
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/tsconfig.json ./

EXPOSE 3000

CMD ["npm", "run", "start:prod"]