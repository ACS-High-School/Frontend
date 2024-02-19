// authService.js
import { CognitoUser, CognitoUserPool, CognitoUserAttribute, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { COGNITO_API } from '../config/config';

const userPool = new CognitoUserPool({
  UserPoolId: COGNITO_API.userPoolId,
  ClientId: COGNITO_API.clientId,
});

// var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

export const authService = {
  register(username, email, password, name, company, attributes) {
    return new Promise((resolve, reject) => {
    //   const newAttributes = attributes.map(attr => new CognitoUserAttribute(attr));
      
    const newAttributes = [
        new CognitoUserAttribute({
          Name: 'email',
          Value: email,
        }),
        new CognitoUserAttribute({
          Name: 'custom:name',
          Value: name,
        }),
        new CognitoUserAttribute({
          Name: 'custom:company',
          Value: company,
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
        onSuccess: (result) => {
          // 사용자 인증 성공 시 실행될 로직
          // 예: 세션 정보 얻기, 토큰 저장 등
          console.log("로그인 성공", result);
          resolve(result); // 성공 결과 반환
        },
        onFailure: (error) => {
          // 인증 실패 시 실행될 로직
          console.error("로그인 실패", error);
          reject(error); // 에러 반환
        },
      });
    });
  },
 

  // You can add other authentication functions here as needed
};
