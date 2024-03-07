// authService.js
// import { CognitoUser, CognitoUserPool, CognitoUserAttribute, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { COGNITO_API } from '../config/config';
import { CognitoJwtVerifier } from "aws-jwt-verify";

import { Amplify } from 'aws-amplify';

import { signUp, signIn, confirmSignUp, signOut, resetPassword, confirmResetPassword, updatePassword } from 'aws-amplify/auth';
import { CookieStorage } from 'aws-amplify/utils';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';

const authConfig = {
    Cognito: {
      userPoolId: COGNITO_API.userPoolId,
      userPoolClientId: COGNITO_API.clientId
    }
  };
  
Amplify.configure({
    Auth: authConfig
});

// 쿠키 설정
const cookieStorage = new CookieStorage({
    domain: "localhost",
    path: "/",
    expires: 7,
    sameSite: "none",
    secure: true,
});
  
cognitoUserPoolsTokenProvider.setKeyValueStorage(cookieStorage);


// Verifier that expects valid access tokens:
const verifier = CognitoJwtVerifier.create({
    userPoolId: COGNITO_API.userPoolId,
    tokenUse: "access",
    clientId: COGNITO_API.clientId,
  });


export const authService = {
  // Updated register function using aws-amplify/auth's signUp
  async register(company, username, password, email) {
    try {
      const { userSub } = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
            'custom:company':company,
            // 'custom:name':name
          },
        },
        autoSignIn: false
      });
      console.log(`User registered with ID: ${userSub}`);
      return userSub; // Return userSub as the function result
    } catch (error) {
      console.error('Registration error:', error);
      throw error; // Rethrow the error to be handled by the caller
    }
  },
  // 다른 인증 함수들도 이곳에 포함시킬 수 있습니다.
  // Verify code
  // Updated confirmCode function using aws-amplify/auth's confirmSignUp
  async confirmCode({ username, confirmationCode }) {
    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username,
        confirmationCode
      });
      // Handle the confirmation result here. For example, you can return a success message or perform further actions based on `isSignUpComplete` and `nextStep`.
      console.log(`SignUp confirmation is complete: ${isSignUpComplete}`);
      return { isSignUpComplete, nextStep }; // Return the confirmation result
    } catch (error) {
      console.error('Error confirming sign up:', error);
      throw error; // Rethrow the error to be handled by the caller
    }
  },

  // login
  // 사용자 로그인 함수 정의, 이메일과 비밀번호를 매개변수로 받음
  async login({ username, password }) {
    try {
      const { isSignedIn, nextStep } = await signIn({ username, password });
      console.log(`User signed in: ${isSignedIn}`);
      // Handle the sign-in result here. You can use `isSignedIn` and `nextStep` for further actions.
      return { isSignedIn, nextStep }; // Return the sign-in result
    } catch (error) {
      console.error('Error signing in:', error);
      throw error; // Rethrow the error to be handled by the caller
    }
  },
  
  // SignOut
  // 로그아웃 기능
  async handleSignOut() {
    try {
      await signOut({ global: true });
    } catch (error) {
      console.log('error signing out: ', error);
    }
  },
  
  // 비밀번호 재설정 시작
  async resetPassword(username) {
    try {
      const output = await resetPassword({ username });
      // 여기서 output을 처리할 수 있습니다.
      return output;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  // 비밀번호 재설정 확인
  async confirmResetPassword(username, confirmationCode, newPassword) {
    try {
      await confirmResetPassword({ username, confirmationCode, newPassword });
      // 비밀번호 재설정이 성공적으로 완료됨
    } catch (error) {
      console.error('Confirm reset password error:', error);
      throw error;
    }
  },

  // 비밀번호 업데이트
  async updatePassword(oldPassword, newPassword) {
    try {
      await updatePassword({ oldPassword, newPassword });
      // 비밀번호 업데이트가 성공적으로 완료됨
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  },



  // You can add other authentication functions here as needed
};
