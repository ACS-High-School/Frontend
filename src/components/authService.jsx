// authService.js
import { CognitoUser, CognitoUserPool, CognitoUserAttribute, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { COGNITO_API } from '../config/config';
import { CognitoJwtVerifier } from "aws-jwt-verify";

const userPool = new CognitoUserPool({
  UserPoolId: COGNITO_API.userPoolId,
  ClientId: COGNITO_API.clientId,
});

// Verifier that expects valid access tokens:
const verifier = CognitoJwtVerifier.create({
    userPoolId: COGNITO_API.userPoolId,
    tokenUse: "access",
    clientId: COGNITO_API.clientId,
  });

// var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

export const authService = {
  register(username, email, password, attributes) {
    return new Promise((resolve, reject) => {
    //   const newAttributes = attributes.map(attr => new CognitoUserAttribute(attr));
      
    const newAttributes = [
        new CognitoUserAttribute({
          Name: 'email',
          Value: email,
        })
      ];

      userPool.signUp(username,password, newAttributes, [], async (error, result) => {
        if (error) {
          reject(error);
          console.error(error);
          return;
        }

        resolve(result.userSub);
      });
    });
  },

  // 다른 인증 함수들도 이곳에 포함시킬 수 있습니다.
  // Verify code
    confirmCode(username, code) {
        return new Promise((resolve, reject) => {
        const userData = {
            Username: username,
            Pool: userPool,
        };

        const cognitoUser = new CognitoUser(userData);

        cognitoUser.confirmRegistration(code, true, (error) => {
            if (error) {
            reject(error);
            console.error(error);
            return;
            }
            resolve(); // Resolve without value, simply indicating success
        });
        });
  },

  // login
  // 사용자 로그인 함수 정의, 이메일과 비밀번호를 매개변수로 받음
login(email, password) {
    return new Promise((resolve, reject) => { // Promise를 반환하여 비동기 처리 가능
      const userData = {
        Username: email, // 사용자 이메일
        Pool: userPool, // Cognito 사용자 풀, 초기화 필요
      };
  
      // Cognito 사용자 객체 생성
      const cognitoUser = new CognitoUser(userData);
      // 인증 상세 정보 객체 생성, 이메일과 비밀번호 포함
      const authDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });
  
      // Cognito를 사용하여 사용자 인증 시도
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: async (result) => { // 인증 성공 시 실행될 콜백 함수
          console.log("로그인 성공", result); // 콘솔에 로그인 성공 메시지 출력
          const jwt = result.getAccessToken().getJwtToken(); // 인증 성공 후 받은 JWT 토큰
  
          // 인증 성공 후, JWT 토큰을 포함하여 백엔드 서버에 요청을 보냄
          fetch('http://localhost:8080/select', {
            method: 'POST', // HTTP POST 요청 사용
            headers: {
              'Content-Type': 'application/json', // 요청 본문의 내용이 JSON임을 명시
              'Authorization': `Bearer ${jwt}` // 헤더에 JWT 토큰 포함, 현재 잘못된 값 '123'로 설정되어 있음
            },
            body: JSON.stringify({ /* 서버로 보낼 데이터, 현재는 비어 있음 */ }),
            credentials: 'include', // 쿠키 등의 인증 정보를 요청과 함께 전송
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('서버 에러 발생'); // 서버 응답이 정상이 아닐 경우 오류 처리
            }
            return response.json(); // 서버 응답을 JSON 형태로 파싱
          })
          .then(data => {
            console.log('서버로부터의 응답:', data); // 서버 응답 로그 출력
            resolve(result); // Promise를 성공적으로 완료하고 결과 반환
          })
          .catch(error => {
            console.error('서버 요청 실패:', error); // 요청 실패 시 오류 로그 출력
            reject(error); // Promise를 거부하고 오류 반환
          });
        },
        onFailure: (error) => { // 인증 실패 시 실행될 콜백 함수
          console.error("로그인 실패", error); // 콘솔에 로그인 실패 메시지 출력
          reject(error); // Promise를 거부하고 오류 반환
        },
      });
    });
  }
  
 

  // You can add other authentication functions here as needed
};
