# Stage 1 - Building
# Use Node 22 LTS per Angular 20 support matrix
FROM node:22.19.0 AS builder
WORKDIR /app
COPY ./package*.json ./
# Prefer reproducible installs in CI/containers
RUN npm ci || npm install
COPY ./ .
# Angular 20 defaults to production build; --prod is deprecated
RUN npm run build

# Stage 2 - Deploying
FROM nginx:1.19.6-alpine
COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist/bookcase-angular/browser/ /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
