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
  login(email, password) {
    return new Promise((resolve, reject) => {
      const userData = {
        Username: email,
        Pool: userPool,
      };
  
      const cognitoUser = new CognitoUser(userData);
      const authDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });
  
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: async (result) => {
          console.log("로그인 성공", result);
          const jwt = result.getAccessToken().getJwtToken();
  
          // 서버로 JWT 토큰 전송하는 부분
          fetch('http://localhost:8080/select', {
            method: 'POST', // 요청 메서드 (GET, POST, PUT 등)
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${123}` // 헤더에 바로 토큰 포함
            },
            body: JSON.stringify({ /* 서버로 보낼 데이터 */ })
            ,
            credentials: 'include',
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('서버 에러 발생');
            }
            return response.json(); // 서버로부터 받은 응답 처리
          })
          .then(data => {
            console.log('서버로부터의 응답:', data);
            resolve(result); // 성공 결과와 함께 프라미스를 완료
          })
          .catch(error => {
            console.error('서버 요청 실패:', error);
            reject(error); // 서버 요청 중 발생한 오류를 프라미스의 거부 이유로 전달
          });
        },
        onFailure: (error) => {
          console.error("로그인 실패", error);
          reject(error); // 에러 반환
        },
      });
    });
  },
 

  // You can add other authentication functions here as needed
};
