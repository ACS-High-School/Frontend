# Build stage
FROM node:14-alpine AS build

WORKDIR /usr/src/app

# package.json과 package-lock.json 파일을 먼저 복사합니다.
COPY package*.json ./

# 필요한 npm 패키지들을 설치합니다.
RUN npm install

# 나머지 소스 파일들을 복사합니다.
COPY . .

# React 앱을 빌드합니다.
RUN npm run build

# Run stage
FROM nginx:stable-alpine

# 기존의 Nginx 설정 파일들을 삭제합니다.
RUN rm -rf /etc/nginx/conf.d

# Custom Nginx configuration 파일을 복사합니다.
COPY nginx.conf /etc/nginx/nginx.conf

# 80 포트를 외부에 노출시킵니다.
EXPOSE 80

# Nginx를 foreground에서 실행합니다.
CMD ["nginx", "-g", "daemon off;"]
