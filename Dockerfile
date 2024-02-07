# 호환성을 위해 특정 버전의 node를 사용합니다.
FROM node:14 AS build-stage

# Docker 이미지 내에서 작업 디렉토리 설정.
WORKDIR /app

# package.json과 package-lock.json(또는 yarn.lock) 파일을 복사합니다.
COPY package*.json ./

# 모든 의존성을 설치합니다.
RUN npm install

# 전체 프로젝트를 Docker 이미지에 복사합니다.
COPY . .

# 애플리케이션을 빌드합니다.
RUN npm run build

# 프로덕션 서버를 설정하기 위해 새로운 단계를 시작합니다.
FROM nginx:alpine AS production-stage

# build-stage에서 빌드 디렉토리를 nginx 서버 디렉토리로 복사합니다.
COPY --from=build-stage /app/build /usr/share/nginx/html

# nginx.conf 파일을 복사합니다.
COPY nginx.conf /etc/nginx/nginx.conf

# 컨테이너가 실행되면 외부로 80 포트를 노출합니다.
EXPOSE 80

# 글로벌 지시문과 함께 데몬이 아닌 상태로 nginx를 시작합니다.
CMD ["nginx", "-g", "daemon off;"]
