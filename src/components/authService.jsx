// authService.js
import { CognitoUser, CognitoUserPool, CognitoUserAttribute, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { COGNITO_API } from '../config/config';

const userPool = new CognitoUserPool({
  UserPoolId: COGNITO_API.userPoolId,
  ClientId: COGNITO_API.clientId,
});

// var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

export const authService = {
  register(email, password, attributes) {
    return new Promise((resolve, reject) => {
    //   const newAttributes = attributes.map(attr => new CognitoUserAttribute(attr));
      
    const newAttributes = [
        new CognitoUserAttribute({
          Name: 'email',
          Value: email,
        })
      ];

      userPool.signUp(email, password, newAttributes, [], async (error, result) => {
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
};
