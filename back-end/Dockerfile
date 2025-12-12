FROM node:22-alpine AS builder

WORKDIR /app

COPY . .
RUN npm i
RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY package.json .

RUN npm install --only=production
RUN mkdir /tmp/uploads

COPY --from=builder /app/dist /app/dist

EXPOSE 3000
CMD ["node", "dist/index.js"]
