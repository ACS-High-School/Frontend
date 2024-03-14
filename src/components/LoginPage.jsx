import React from "react";
import { authService } from './authService'; // authService 임포트
import { useForm } from "react-hook-form";

import googleLogo from '../assets/googleLogo.svg'
import { Amplify } from 'aws-amplify';

import { signInWithRedirect, getCurrentUser } from "aws-amplify/auth";

import { useNavigate } from "react-router-dom";

// import "../styles/LoginPage.css"; // 스타일링을 위한 CSS 파일을 임포트합니다.s

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
    <Container className="login-container d-flex justify-content-center align-items-center mt-3" style={{ minHeight: '100vh' }}>
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <div className="logo-container text-center mb-5">
          <Image src="logo.png" alt="로고" fluid />
        </div>
        <Form onSubmit={handleSubmit(onLogin)} className="login-form">
          <Form.Group className="mb-4" controlId="email">
            <Form.Label>이메일</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="text@email.com" 
              {...register("email", { /* 검증 규칙 */ })}
            />
            {errors.email && <Alert variant="danger">{errors.email.message}</Alert>}
          </Form.Group>
  
          <Form.Group className="mb-4" controlId="password">
            <Form.Label>비밀번호</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="*******" 
              {...register("password", { /* 검증 규칙 */ })}
            />
            {errors.password && <Alert variant="danger">{errors.password.message}</Alert>}
          </Form.Group>
  
          <Button variant="primary" type="submit" className="w-100 mb-3">로그인</Button>
    
          <Button variant="light" className="w-100 google-signin-btn mb-3" onClick={() => signInWithRedirect({
                provider: "Google",
            })}>
            <Image src={googleLogo} alt="Google 로그인" />
          </Button>
    
          <Button variant="btn btn-outline-primary" className="w-100" onClick={handleSignUp}>
            회원 가입
          </Button>
        </Form>
      </div>
    </Container>
  );
};  

export default LoginForm;
