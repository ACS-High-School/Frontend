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


// 'accessToken'이 포함된 쿠키의 이름을 찾고, 해당 쿠키 값을 업데이트하는 함수
function updateAccessTokenInCookie(newAccessToken) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      const [cookieName, cookieValue] = cookie.split('=');
  
      // 쿠키 이름에 'accessToken'이 포함되어 있다면, 해당 쿠키를 새 액세스 토큰 값으로 업데이트합니다.
      if (cookieName.includes('accessToken')) {
        const updatedCookie = `${cookieName}=${newAccessToken}; path=/; max-age=3600`; // max-age는 쿠키의 유효 시간을 설정합니다.
        document.cookie = updatedCookie; // 쿠키 업데이트
        break; // 쿠키를 찾았으니 루프를 종료합니다.
      }
    }
  }

// 응답 인터셉터 추가
api.interceptors.response.use(
    response => {
      // 응답이 성공적으로 반환된 경우, 응답을 그대로 반환합니다.
      return response;
    },
    async error => {
      // 원본 요청을 저장합니다.
      const originalRequest = error.config;
  
      // 401 에러가 발생했고, 이전에 재시도하지 않았다면
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // 재시도 했음을 표시합니다.
  
        try {
          console.log("Access Token 재갱신")
          // 토큰을 갱신합니다.
          const newAccessToken = await refreshAccessToken();
  
          // 새 액세스 토큰으로 쿠키를 업데이트합니다.
          updateAccessTokenInCookie(newAccessToken);
  
          // 원본 요청을 새 액세스 토큰으로 재시도합니다.
          return api(originalRequest);
        } catch (refreshError) {
          // 토큰 갱신에 실패했다면 에러를 반환합니다.
          return Promise.reject(refreshError);
        }
      }
  
      // 다른 모든 에러는 그대로 반환합니다.
      return Promise.reject(error);
    }
  );
  


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
