# Stage 1 - Building
FROM node:20.13.1 AS builder
WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY ./ .
RUN npm run build --prod

# Stage 2 - Deploying
FROM nginx:1.19.6-alpine
COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist/bookcase-angular/browser/ /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
