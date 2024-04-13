# Frontend


<!--프로젝트 대문 이미지-->
![Project Title](img/project-title.png)

<!--프로젝트 버튼-->

<!--목차-->
# Table of Contents
<!-- - [Frontend](#frontend)
- [Table of Contents](#table-of-contents)
- [\[1\] About the Repository](#1-about-the-repository)
  - [Features](#features)
    - [Home](#home)
  - [Technologies](#technologies)
- [\[2\] Getting Started](#2-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [\[3\] Usage](#3-usage)
- [\[4\] Contribution](#4-contribution)
- [\[5\] Acknowledgement](#5-acknowledgement)
- [\[6\] Contact](#6-contact)
- [\[7\] License](#7-license) -->



# [1] About the Repository

- 연합학습 AI 플랫폼 웹페이지 제작
- 페이지는 다음과 같이 나눈다.
  - Home
  - Main
  - Inference
  - Federated Learining ( *FL* )
  - MyPage


## Features
*강조하고 싶은 **주요 기능**이나 **차별성 있는 특징**을 적으세요.*
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
***언어, 프레임워크, 주요 라이브러리**를 **버전**과 함께 나열하세요.*

- [React](https://react.dev/) 18.2.0
- [Bootstrap](https://getbootstrap.com/) 5.3.3
- [AWS Amplify](https://aws.amazon.com/ko/amplify/) 6.0.16



# [2] Getting Started
*만약 운영체제에 따라 프로그램을 다르게 동작시켜야한다면, 운영체제별로 동작 방법을 설명하세요*

## Prerequisites
*프로젝트를 동작시키기 위해 필요한 소프트웨어와 라이브러리를 나열하고 어떻게 다운받을 수 있는지 설명하세요.*


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

## Installation
*어떻게 이 프로젝트의 소스코드를 다운받을 수 있는지 설명하세요.*
1. Repository 클론
```bash
git clone https://github.com/ACS-High-School/Frontend
```
2. NPM packages 설치
```bash
npm install
```

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



# [3] Usage
***스크린샷, 코드** 등을 통해 **사용 방법**과 **사용 예제**를 보여주세요. 사용 예제별로 h2 헤더로 나누어 설명할 수 있습니다.*

![usage](img/usage.png)
## HomePage
```javascript
// 'Enter' 버튼 클릭 시 로그인 페이지로 이동
  const handleEnter = () => {
    // accessToken 쿠키가 있다면 메인 페이지로 리디렉션
    if (hasAccessTokenCookie()) {
        navigate('/select');
    } else {
        navigate('/login');
    }
  };
```



# [4] Contribution
기여해주신 모든 분들께 대단히 감사드립니다.[`contributing guide`][contribution-url]를 참고해주세요.
이 프로젝트의 기여하신 분들을 소개합니다! 🙆‍♀️
*이모티콘 쓰는 것을 좋아한다면, 버그 수정에 🐞, 아이디어 제공에 💡, 새로운 기능 구현에 ✨를 사용할 수 있습니다.*
- 🐞 [dev-ujin](https://github.com/dev-ujin): 메인페이지 버그 수정



# [5] Acknowledgement
***유사한 프로젝트의 레포지토리** 혹은 **블로그 포스트** 등 프로젝트 구현에 영감을 준 출처에 대해 링크를 나열하세요.*

- [Readme Template - Embedded Artistry](https://embeddedartistry.com/blog/2017/11/30/embedded-artistry-readme-template/)
- [How to write a kickass Readme - James.Scott](https://dev.to/scottydocs/how-to-write-a-kickass-readme-5af9)
- [Best-README-Template - othneildrew](https://github.com/othneildrew/Best-README-Template#prerequisites)
- [Img Shields](https://shields.io/)
- [Github Pages](https://pages.github.com/)



# [6] Contact
- 📧 dev.ujin518@gmail.com
- 📋 [https://dev-ujin.github.io/contact](https://dev-ujin.github.io/contact)


