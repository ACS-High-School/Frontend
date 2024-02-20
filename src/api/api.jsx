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
      else {
        const updatedCookie = `accessToken=${newAccessToken}; path=/; max-age=3600`; // max-age는 쿠키의 유효 시간을 설정합니다.
        document.cookie = updatedCookie; // 쿠키 업데이트
      }
    }
  }

//   api.interceptors.request.use(request => {
//     // 모든 요청에 대해 _retry 플래그를 false로 초기화
//     request._retry = false;
//     return request;
//   });
  
  // 응답 인터셉터 추가
  api.interceptors.response.use(
    response => {
      // 응답이 성공적으로 반환된 경우, 응답을 그대로 반환합니다.
      return response;
    },
    async error => {
      // 원본 요청을 저장합니다.
      const originalRequest = error.config;
  
      // /verify 경로에 대한 GET 요청이고, 401 에러가 발생했으며, 이전에 재시도하지 않았다면
      if (originalRequest.url.includes('/verify') && originalRequest.method === 'get') {
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true; // 재시도 했음을 표시합니다.
  
          try {
            // 토큰을 갱신합니다.
            const newAccessToken = await refreshAccessToken();
    
            // 새 액세스 토큰으로 쿠키를 업데이트합니다.
            updateAccessTokenInCookie(newAccessToken);
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            // 원본 요청을 새 액세스 토큰으로 재시도합니다.
            return api(originalRequest);
          } catch (refreshError) {
            // 재시도 후에도 에러가 발생했다면 사용자에게 알림을 줍니다.
            console.error("토큰 갱신 중 알 수 없는 에러 발생:", refreshError);
            alert("다시 로그인 해주세요");
            window.location.href = '/';
            authService.handleSignOut();
            return Promise.reject(refreshError);
          }
        }
      } else {

        // /verify 경로나 GET 요청이 아닌 경우, 또는 이미 재시도한 경우 에러를 그대로 반환합니다.
        return Promise.reject(error);
      }
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
