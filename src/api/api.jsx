import axios from 'axios';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

// 필요한 API 요청 함수들을 여기에 정의
export const uploadFile = async (formData) => {
  try {
    const response = await api.post('/inference/uploadFile', formData);
    return response.data; // 응답 데이터 반환
  } catch (error) {
    throw error; // 오류 처리를 위해 에러를 던집니다.
  }
};

// 기타 API 함수들...

export default api;
