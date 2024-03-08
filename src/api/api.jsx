import axios from 'axios';
import {COGNITO_API} from '../config/config';
import {authService} from '../components/authService';



// Axios 인스턴스 생성
const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

// 토큰 유효성 검사 요청
export const verifyToken = async () => {
    try {
      const response = await api.get('/verify');
      console.log('토큰 유효성 검사 성공:', response.data);
      // 추가 로직 처리 (예: 사용자 상태 업데이트)
    } catch (error) {
      console.error('토큰 유효성 검사 실패:', error.response);
      // 오류 처리 로직 (예: 로그아웃 처리)
    }
  };

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
async function updateAccessTokenInCookie(newAccessToken) {
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
      else {
        const updatedCookie = `accessToken=${newAccessToken}; path=/; max-age=3600`; // max-age는 쿠키의 유효 시간을 설정합니다.
        document.cookie = updatedCookie; // 쿠키 업데이트
      }
    }
  }


api.interceptors.response.use(
    response => {
      // 성공적인 응답 처리
      return response;
    },
    async error => {
      const originalRequest = error.config;
  
      // /verify 경로에 대한 GET 요청이고 401 에러가 발생했으며, 이전에 재시도하지 않았다면
      if (originalRequest.url.includes('/verify') && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // 재시도 표시
        console.log(originalRequest._retry);
  
        try {
          const newAccessToken = await refreshAccessToken();
          // 새 액세스 토큰으로 쿠키 업데이트
          await updateAccessTokenInCookie(newAccessToken);
        //   originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(originalRequest); // 원본 요청 재시도
        } catch (refreshError) {
          // 토큰 갱신 시도 후 실패했을 경우, 로그인 페이지로 리디렉션
          alert("다시 로그인 해주세요!!");
          window.location.href = '/'; // 로그인 페이지 경로 확인 필요
        }
      }
      return Promise.reject(error);
    }
  );
  

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
      console.log("새로 받은 accessToken: " + response.data.access_token);
      return response.data.access_token;
    } catch (error) {
      console.error('토큰 갱신 에러:', error);
      throw error; // 에러 처리를 위해 에러를 던집니다.
    }
  };

// 기타 API 함수들...

export default api;
