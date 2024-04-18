# Frontend

- 연합학습 AI 플랫폼 웹페이지 제작
- 페이지는 다음과 같이 나눈다.
  - Home
  - Main
  - Inference
  - Federated Learining ( *FL* )
  - MyPage


## Features
### Home
- 웹사이트 소개 GIF 재생
- 회원 인증을 진행
  - 로그인과 회원 가입 페이지로 이동
  - 로그인 되어 있는 유저의 경우 바로 **Main** 페이지로 이동
  
### Main
- 사용자의 선택에 따라 **Inference** 혹은 **FL** 페이지로 이동
- **FL** 선택 시 그룹 생성 혹은 참여 진행
  - 그룹 생성
    - FL 에 대한 Task 설명 입력
  - 그룹 참여
    - 참여할 그룹의 그룹 코드를 입력

### Inference
- 추론을 위해 사용자가 입력 폼 작성
  - Model 선택
  - Task Name 입력
  - Input Data 업로드
- 추론이 완료된 후 결과 파일을 버튼을 통해 다운로드

### FL
- 연합 학습을 위한 그룹 별 팝업 페이지
- 참여 인원들의 연합 학습 준비 상태를 제공
- 시작 버튼으로 연합 학습 시작 API 요청
  - 시작 요청의 권한은 그룹을 생성한 *User1* 이 가지게 된다.
- 버튼을 통해 User 별로 할당된 AWS SageMaker 의 Jupyter LAB 주소 이동
- 학습 종료 후 결과 다운로드를 위한 MyPage 로 이동 후 팝업 페이지 삭제
 
## Technologies

- [React](https://react.dev/) 18.2.0
- [Bootstrap](https://getbootstrap.com/) 5.3.3
- [AWS Amplify](https://aws.amazon.com/ko/amplify/) 6.0.16

<br>
<br>

## Prerequisites

### AWS Amplify Set up
[Amplify Docs](https://docs.amplify.aws/react/)

- Configure the Amplify CLI
```bash
amplify configure
```

*(Create 혹은 Import 수행)*

- Amplify CLI Create
```bash
amplify add auth
```

- Amplify CLI Import
```bash
amplify import auth
```
  
위의 작업들을 통해 프로젝트 내부에 `aws-exports.js` 생성 확인 후 진행


## Configuration
*코드의 어느 부분을 채우거나 수정해야하는지 설명하세요.*
- Amplify CLI 를 통해 생성된 `aws-exports.js` 를 config 폴더로 이동 
- `config.js`에 AWS Cognito 의 API 정보 입력
```javascript
export const COGNITO_API = {
    userPoolId: "<Your Cognito userPoolId>",
    clientId: "<Your userPool clientId>",
    domain: "<Your userPool domainURL>",
    googleClientId : "<Your Google Ouath ClientId>",
    createPresignedDomainUrl : "<Your PresignedDomainUrl>"
  };
```

<br>
<br>

## Trouble Shooting 
### 사용자 인가를 위한 토큰 설정
- 문제 원인
  - 인가 처리 방식에 대한 설계 구현
  - 프론트 서버와 백엔드 서버 간의 CORS 에러
  - 쿠키 설정 시 도메인 설정 에러 발생

- 해결 방안
  - 클라이언트의 쿠키를 통한 토큰 저장과 백엔드 서버에서의 유효성 검증 처리
  - Spring Security 의 CORS 설정 추가
  - 서버에 맞는 도메인으로 쿠키 설정

### React 이미지 배포 시 CSS 미적용
- 문제 원인
  - Nginx로 React 배포 시 CSS 파일 경로를 찾지 못함


- 해결 방안
  - nginx mime.types 내용 추가
  - nginx conf 파일에 html 초기 경로를 지정


  
<br>
<br>

## Feature improvements
### ML 모델 결과에 대한 시각 효과 부족
- 개선 이유
  - 시각 자료를 통한 모델 개선 여부와 서비스 진행 확인
  - Rolling Update 배포에 대한 추가 설정 필요
  
- 개선 방안
  - ML 모니터링 툴을 사용하여 모델 버전 별 관리 ex) mlflow, tensorboard
  
### FL 진행 방식과 유저 친화적 기능 추가
- 개선 이유
  - FL 페이지 내에서 그룹원들 간의 소통을 위한 방안이 부족
  - 원활한 서비스 진행을 위한 유저 친화적인 기능 추가 필요 

- 개선 방안
  -  채팅, 사용자 지정 상태 표시 등을 통해 그룹원들 간의 소통을 기존 FL 페이지에서 진행하도록 기능 추가
  -  서비스 진행을 위한 도움말과 같은 진행 방법을 도와주는 요소 추가 필요

<br>
<br>


## Contribution
- 🫠 [김선우](https://github.com/sw801733)
- 🫢 [홍준표](https://github.com/hjp1016)
