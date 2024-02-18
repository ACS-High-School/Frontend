import React from 'react';
import { useNavigate } from "react-router-dom";
import { authService } from './authService'; // 올바른 경로로 수정하세요.

const SignOutButton = () => {
  const navigate = useNavigate(); // useNavigate는 컴포넌트 내에서 호출되어야 합니다.

  // 로그아웃 처리 후 홈 페이지로 리디렉션하는 함수입니다.
  const handleSignOut = async () => {
    try {
      await authService.handleSignOut({ global: true }); // authService 내의 signOut 함수를 호출합니다.
      navigate('/'); // 로그아웃 후 홈 페이지로 리디렉션합니다.
    } catch (error) {
      console.log('로그아웃 중 오류 발생: ', error);
    }
  };

  return (
    <button onClick={handleSignOut}>로그아웃</button> // 이벤트 핸들러에 handleSignOut 함수를 연결합니다.
  );
};

export default SignOutButton;
