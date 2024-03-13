import React from "react";
import { authService } from './authService'; // authService 임포트
import { useForm } from "react-hook-form";

import googleLogo from '../assets/googleLogo.svg'
import { Amplify } from 'aws-amplify';

import { signInWithRedirect, getCurrentUser } from "aws-amplify/auth";

import { useNavigate } from "react-router-dom";

import "../styles/LoginPage.css"; // 스타일링을 위한 CSS 파일을 임포트합니다.

import awsConfig from '../config/aws-exports';

import { Container, Form, Button, Alert, Image } from 'react-bootstrap';

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
    <Container className="login-container mt-3">
      <div className="logo-container mb-3">
        {/* 이미지 컴포넌트 사용 예시 */}
        <Image src="logo.png" alt="로고" fluid />
      </div>
      <Form onSubmit={handleSubmit(onLogin)} className="login-form">
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>이메일</Form.Label>
          <Form.Control 
            type="email" 
            placeholder="text@email.com" 
            {...register("email", {
              required: "이메일은 필수 입력입니다.",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "유효하지 않은 이메일 형식입니다."
              }
            })
            }
          />
          {errors.email && (
        <Alert variant="danger" role="alert" style={{ fontSize: '0.8rem', marginTop: '10px' }}>
            {errors.email.message}
        </Alert>
        )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>비밀번호</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="*******" 
            {...register("password", {
              required: "비밀번호는 필수 입력입니다.",
              minLength: {
                value: 8,
                message: "8자리 이상 비밀번호를 입력하세요.",
              },
            })}
          />
          {errors.password && <Alert variant="danger" role="alert" style={{ fontSize: '0.8rem', marginTop: '10px' }}>{errors.password.message}</Alert>}
        </Form.Group>
        <Button variant="primary" type="submit" className="mb-2">로그인</Button>
  
        {/* 구글 로그인 버튼 */}
        <Button variant="light" className="google-signin-btn mb-2" onClick={() =>
                signInWithRedirect({
                provider: "Google",
            })}
        >
            <Image src={googleLogo} alt="Google 로그인" />
        </Button>
  
        {/* 회원 가입 버튼 */}
        <Button variant="secondary" onClick={handleSignUp}>
          회원 가입
        </Button>
      </Form>
    </Container>
  );
};

export default LoginForm;
