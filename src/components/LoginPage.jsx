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
      <div className="w-100" style={{ 
            maxWidth: '600px', // 폼의 최대 너비를 늘림
            padding: '80px', // 내부 패딩을 늘려 폼 주변의 공간 확장
            borderRadius: '15px',
            // boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            border: '2px solid #707070' // 테두리 색상을 약간 회색빛이 도는 색으로 변경
        }}>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <Button variant="primary" type="submit" style={{ flex: 1, marginRight: '10px' }}>로그인</Button>

            <Button variant="light" style={{ flex: 1, padding: 0, border: 'none', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '10px' }}>
                <Image src={googleLogo} alt="Google 로그인" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </Button>
          </div>

            <Button variant="btn btn-outline-primary" className="w-100" style={{ color: '#FFFFFF', backgroundColor: '#2c3e50', marginTop: '15px' }}>
            회원 가입
            </Button>

        </Form>
      </div>
    </Container>
  );
};  

export default LoginForm;
