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
<예시>
### 웹 서비스 배포 과정에서의 5XX 에러
- 문제 원인
  - Replica 설정과 HPA 설정의 충돌 발생
  - Rolling Update 배포에 대한 추가 설정 필요
  
- 해결 방안
  - ReadinessGate 설정으로 ALB 에서 Pod 의 상태에 따른 트래픽 조정
  - Readiness / Liveness Probe 를 통한 클러스터에서의 Pod 상태 확인
  - PreStop 설정을 통한 Draining 상태에 대한 Pod 접근 제어


  
<br>
<br>

## Feature improvements
<예시>
### 웹 서비스 배포 과정에서의 5XX 에러
- 문제 원인
  - Replica 설정과 HPA 설정의 충돌 발생
  - Rolling Update 배포에 대한 추가 설정 필요
  
- 해결 방안
  - ReadinessGate 설정으로 ALB 에서 Pod 의 상태에 따른 트래픽 조정
  - Readiness / Liveness Probe 를 통한 클러스터에서의 Pod 상태 확인
  - PreStop 설정을 통한 Draining 상태에 대한 Pod 접근 제어

<br>
<br>


## Contribution
- 🫠 [김선우](https://github.com/sw801733)
- 🫢 [홍준표](https://github.com/hjp1016)
