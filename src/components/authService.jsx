// authService.js
// import { CognitoUser, CognitoUserPool, CognitoUserAttribute, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { COGNITO_API } from '../config/config';
import { CognitoJwtVerifier } from "aws-jwt-verify";

import { Amplify } from 'aws-amplify';

import { signUp, signIn, confirmSignUp, signOut, resetPassword, confirmResetPassword, updatePassword } from 'aws-amplify/auth';
import { CookieStorage } from 'aws-amplify/utils';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';

export const domain = process.env.REACT_APP_HOME_URL;

const authConfig = {
    Cognito: {
      userPoolId: COGNITO_API.userPoolId,
      userPoolClientId: COGNITO_API.clientId
    }
  };
  
Amplify.configure({
    Auth: authConfig
});

//쿠키 설정
const cookieStorage = new CookieStorage({
    domain: `${domain}`,
    path: "/",
    sameSite: "none",
    secure: true,
});
  
cognitoUserPoolsTokenProvider.setKeyValueStorage(cookieStorage);
//cognitoUserPoolsTokenProvider.setKeyValueStorage(new CookieStorage);

// 'accessToken' 과 'refreshToken' 을 세션 쿠키로 설정
async function updateTokenToSessionInCookie() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      const [cookieName, cookieValue] = cookie.split('=');
  
      // 쿠키 이름에 'accessToken'이 포함되어 있다면, 해당 쿠키를 새 액세스 토큰 값으로 업데이트합니다.
      if (cookieName.includes('accessToken')) {
        const updatedCookie = `${cookieName}=${cookieValue}; domain=${domain}; path=/; `; // max-age는 쿠키의 유효 시간을 설정합니다.
        document.cookie = updatedCookie; // 쿠키 업데이트
      }
      else if (cookieName.includes('refreshToken')) {
        const updatedCookie = `${cookieName}=${cookieValue}; domain=${domain}; path=/; `; // max-age는 쿠키의 유효 시간을 설정합니다.
        document.cookie = updatedCookie; // 쿠키 업데이트
      }
    }
  }



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

      await updateTokenToSessionInCookie();
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
      // 모든 쿠키를 조회
    const cookies = document.cookie.split(';');

    // 쿠키 이름에 'accessToken'을 포함하는 쿠키를 찾아 삭제
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      if (name.trim().includes('accessToken')) {
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        // 필요한 경우 여기에 domain, secure, sameSite 등 다른 쿠키 속성을 추가
      }
    }
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
