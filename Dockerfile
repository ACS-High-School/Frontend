# 베이스 이미지 설정
FROM node:14

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사 및 설치
COPY package.json package-lock.json ./
RUN npm install

# 나머지 파일 복사
COPY . .

# 애플리케이션 빌드
RUN npm run build

# 서버 실행
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

