FROM node:alpine as builder
WORKDIR '/app'
COPY ./package.json ./
COPY ./package-lock.json ./

RUN rm -rf node_modules

RUN apk add --no-cache make gcc g++ python && \
  npm install --silent && \
  apk del make gcc g++ python
COPY . .

RUN npm run build

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist  /usr/share/nginx/html
