import React from "react";
import { authService } from './authService'; // authService 임포트
import { useForm } from "react-hook-form";

import googleLogo from '../assets/googleLogo.svg'
import { Amplify } from 'aws-amplify';

import { signInWithRedirect, getCurrentUser } from "aws-amplify/auth";

import { useNavigate } from "react-router-dom";

import "../styles/LoginPage.css"; // 스타일링을 위한 CSS 파일을 임포트합니다.

import awsConfig from '../config/aws-exports';

Amplify.configure(awsConfig);

const LoginForm = (props) => {
  const navigate = useNavigate(); 
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const onLogin = async (data) => {
    try {
      console.log(data.email);
      console.log(data.password);
  
      await authService.login({ username: data.email, password: data.password });
      navigate('/select');
  
    } catch (error) {
      if (error instanceof Error && error.name === 'NotAuthorizedException') {
        alert('잘못된 아이디나 비밀번호입니다.'); // 에러에 맞는 메시지 표시
        window.location.reload(); // 페이지 리로드
      } else {
        // 다른 종류의 에러에 대한 처리
        console.error('An error occurred:', error);
      }
    }
  };
  

  const handleSignUp = (data) => {
    navigate('/signup');
  }

  return (
    <div className="login-container">
      {/* 로고 또는 이미지를 표시할 공간 */}
      <div className="logo-container">
        {/* 로고 이미지를 이곳에 추가하거나 이미지 컴포넌트를 사용하세요 */}
        {/* 예: <img src="logo.png" alt="로고" className="logo" /> */}
      </div>
      <form onSubmit={handleSubmit(onLogin)} className="login-form">
        <div className="text_area">
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="text"
            placeholder="text@email.com"
            className="text_input"
            {...register("email", {
              required: "이메일은 필수 입력입니다.",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "유효하지 않은 이메일 형식입니다."
              }
            })}
          />
          {errors.email && <small role="alert">{errors.email.message}</small>}
        </div>
        <div className="text_area">
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            placeholder="*******"
            className="text_input"
            {...register("password", {
              required: "\n비밀번호는 필수 입력입니다.",
              minLength: {
                value: 8,
                message: "\n8자리 이상 비밀번호를 입력하세요.",
              },
            })}
          />
          {errors.password && (
            <small role="alert">{errors.password.message}</small>
          )}
        </div>
        <button type="submit">로그인</button>
        
        {/* 구글 로그인 버튼 */}
        <button type="submit" className="google-signin-btn" onClick={() =>
                signInWithRedirect({
                provider: "Google",
            })
        }>
            <img src={googleLogo}></img>
        </button>

        {/* 회원 가입 버튼 */}
        <button type="button" onClick={handleSignUp}>
          회원 가입
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
