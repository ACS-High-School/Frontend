import React from "react";
import { authService } from './authService'; // authService 임포트
import { useForm } from "react-hook-form";

import googleLogo from '../assets/googleLogo.svg'
import { Amplify } from 'aws-amplify';

import { signInWithRedirect, getCurrentUser } from "aws-amplify/auth";

import { useNavigate } from "react-router-dom";

import "../styles/LoginPage.css"; // 스타일링을 위한 CSS 파일을 임포트합니다.

import awsConfig from '../config/aws-exports';

import api from '../api/api';

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
        
        api.post('/test');

        navigate('/select');
  
      } catch (error) {
        console.error(error);
      //   reset();
        // 에러 처리 로직을 여기에 추가하세요.
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
            placeholder="test@email.com"
            className="text_input"
            {...register("email", {
              required: "\n이메일은 필수 입력입니다.",
              pattern: {
                value:
                  /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
                message: "\n이메일 형식에 맞지 않습니다.",
              },
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
                value: 7,
                message: "\n7자리 이상 비밀번호를 입력하세요.",
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
