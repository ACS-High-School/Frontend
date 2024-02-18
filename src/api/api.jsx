import axios from 'axios';
import {COGNITO_API} from '../config/config';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

// 쿠키에서 refreshToken 값을 가져오는 함수
function getRefreshTokenFromCookies() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      const cookieParts = cookie.split('=');
      const cookieName = cookieParts[0];
      const cookieValue = cookieParts[1];
      if (cookieName.includes('refreshToken')) {
        return cookieValue;
      }
    }
    return null; // 'refreshToken'이 포함된 쿠키를 찾지 못한 경우
  }

// 필요한 API 요청 함수들을 여기에 정의
export const uploadFile = async (formData) => {
  try {
    const response = await api.post('/inference/uploadFile', formData);
    return response.data; // 응답 데이터 반환
  } catch (error) {
    throw error; // 오류 처리를 위해 에러를 던집니다.
  }
};

// refreshToken을 사용하여 accessToken을 갱신하는 함수
export const refreshAccessToken = async () => {
    const refreshTokenValue = getRefreshTokenFromCookies();
    const requestData = {
      "grant_type": "refresh_token",
      "client_id": COGNITO_API.clientId,
      "redirect_uri": "localhost:3000",
      "refresh_token": refreshTokenValue,
    };
  
    try {
      const response = await axios.post(`${COGNITO_API.domain}`, new URLSearchParams(requestData).toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
      // 새로 받은 accessToken 반환
      console.log("새로 받은 accessToken: " + response.data.access_token);
      return response.data.access_token;
    } catch (error) {
      // 에러 처리
      if (error.response) {
        // 서버에서 응답이 왔으나 2xx 범위가 아닌 경우
        console.error(error.response.data);
      } else if (error.request) {
        // 요청이 이루어졌으나 응답을 받지 못한 경우
        console.error(error.request);
      } else {
        // 요청을 설정하는 중에 문제가 발생한 경우
        console.error('Error', error.message);
      }
      throw error; // 오류 처리를 위해 에러를 던집니다.
    }
  };

// 기타 API 함수들...

export default api;
