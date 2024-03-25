import React, { useEffect } from 'react';
import '../styles/HomePage.css'; // CSS 파일 경로 확인
import homeImage from '../assets/home.gif'; // GIF 이미지 경로 확인
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 임포트

// accessToken으로 끝나는 쿠키가 있는지 확인하는 함수
const hasAccessTokenCookie = () => {
  const cookies = document.cookie.split("; ");
  return cookies.some((cookie) => {
    const parts = cookie.split("=");
    const name = parts[0];
    return name.split(".").pop() === "accessToken";
  });
};

const HomePage = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용
  
  // 'Enter' 버튼 클릭 시 로그인 페이지로 이동
  const handleEnter = () => {
    // 컴포넌트가 마운트될 때 쿠키 확인
    if (hasAccessTokenCookie()) {
        // accessToken 쿠키가 있다면 메인 페이지로 리디렉션
        navigate('/select');
    } else {
        navigate('/login');

    }
  };

  return (
    <div className="home-container">
      <div className="home-image-container">
      </div>
      <div className="home-auth-container">
        <Button onClick={handleEnter} className="auth-button" variant="primary">Enter</Button>
        <div className="b3o-footer-text">B3O</div> {/* 여기에 B3O 텍스트 추가 */}
      </div>
    </div>
  );
};

export default HomePage;
