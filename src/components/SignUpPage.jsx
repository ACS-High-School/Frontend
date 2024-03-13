import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { authService } from './authService'; // authService 임포트

// import "../styles/SignUpPage.css"; // 스타일링을 위한 CSS 파일을 임포트합니다.

import { Form, Button, InputGroup, Alert, Container } from 'react-bootstrap';


const SignForm = (props) => {
    const navigate = useNavigate();
    const {

    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const [showEmailVerification, setShowEmailVerification] = useState(false); // 이메일 인증 단계를 제어하는 상태 변수


  const onSubmit = async (data) => {
    try {
      console.log(data.username);
      console.log(data.email);
      console.log(data.password);
      await authService.register(data.company, data.username, data.password, data.email);
      // 회원가입 성공 후의 로직을 여기에 추가하세요.
      setShowEmailVerification(true);
      console.log("회원 생성 성공!")
  
    } catch (error) {
      console.error(error);
      // 에러 메시지에 따라 다른 액션을 취할 수 있습니다.
      if (error.message.includes("이미 존재하는 이메일입니다.")) {
        alert("이미 존재하는 이메일입니다."); // 사용자에게 이미 존재하는 이메일임을 알립니다.
      } else if (error.message.includes("이미 존재하는 사용자 이름입니다.")) {
        alert("이미 존재하는 닉네임입니다."); // 사용자에게 이미 존재하는 이메일임을 알립니다.
      }
      // reset(); // 폼을 리셋하려면 주석을 해제하세요.
      // 에러 처리 로직을 여기에 추가하세요.
    }
  };
  

  const verifyCode = async (data) => {
    try {
      console.log(data.emailVerificationCode);
      // Pass an object with username and confirmationCode properties
      await authService.confirmCode({ 
        username: data.username, 
        confirmationCode: data.emailVerificationCode 
      });
      console.log("회원 인증 성공!"); // "Membership authentication success!"
      navigate('/');
    } catch (error) {
      console.error(error);
      // Add error handling logic here
    }
  };
  

  return (
    <Container className="sign-form-container mt-3">
      <Form onSubmit={handleSubmit(onSubmit)} className="sign-form">
        <Form.Group controlId="email" className="mb-3">
          <Form.Label>이메일</Form.Label>
          <Form.Control
            type="email"
            placeholder="test@email.com"
            {...register("email", {
              required: "이메일은 필수 입력입니다.",
              pattern: {
                value: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
                message: "이메일 형식에 맞지 않습니다.",
              },
            })}
          />
          {errors.email && <Alert variant="danger" style={{ fontSize: '0.8rem', marginTop: '10px' }}>{errors.email.message}</Alert>}
        </Form.Group>
  
        <Form.Group controlId="username" className="mb-3">
          <Form.Label>닉네임</Form.Label>
          <Form.Control
            type="text"
            placeholder="닉네임을 입력하세요"
            {...register("username", {
              required: "닉네임은 필수 입력입니다.",
              minLength: {
                value: 3,
                message: "닉네임는 최소 3자 이상이어야 합니다.",
              },
            })}
          />
          {errors.username && <Alert variant="danger" style={{ fontSize: '0.8rem', marginTop: '10px' }}>{errors.username.message}</Alert>}
        </Form.Group>
  
        <Form.Group controlId="company" className="mb-3">
          <Form.Label>소속</Form.Label>
          <Form.Control
            type="text"
            placeholder="소속을 입력하세요"
            {...register("company", {
              required: "소속은 필수 입력입니다.",
            })}
          />
          {errors.company && <Alert variant="danger" style={{ fontSize: '0.8rem', marginTop: '10px' }}>{errors.company.message}</Alert>}
        </Form.Group>
  
        <Form.Group controlId="password" className="mb-3">
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
              validate: {
                containsUpperCase: value =>
                  /[A-Z]/.test(value) || "최소 1개 이상의 대문자가 포함되어야 합니다.",
                containsSpecialChar: value =>
                  /[!@#$%^&*(),.?":{}|<>]/.test(value) || "최소 1개 이상의 특수문자가 포함되어야 합니다.",
              },
            })}
          />
          {errors.password && <Alert variant="danger" style={{ fontSize: '0.8rem', marginTop: '10px' }}>{errors.password.message}</Alert>}
        </Form.Group>
  
        <Form.Group controlId="passwordConfirm" className="mb-3">
          <Form.Label>비밀번호 확인</Form.Label>
          <Form.Control
            type="password"
            placeholder="*******"
            {...register("passwordConfirm", {
              required: "비밀번호 확인은 필수 입력입니다.",
              validate: {
                check: (val) => {
                  if (getValues("password") !== val) {
                    return "비밀번호가 일치하지 않습니다.";
                  }
                },
              },
            })}
          />
          {errors.passwordConfirm && <Alert variant="danger" style={{ fontSize: '0.8rem', marginTop: '10px' }}>{errors.passwordConfirm.message}</Alert>}
        </Form.Group>
  
        <Button variant="primary" type="submit" className="mb-3">
          이메일 인증 코드 발송
        </Button>
  
        {showEmailVerification && (
          <div className="email-verification">
            <Form.Group controlId="emailVerificationCode" className="mb-3">
              <Form.Label>이메일 인증 코드</Form.Label>
              <Form.Control
                type="text"
                placeholder="인증 코드를 입력하세요"
                {...register("emailVerificationCode", {
                  required: "이메일 인증 코드는 필수 입력입니다.",
                })}
              />
              {errors.emailVerificationCode && <Alert variant="danger" style={{ fontSize: '0.8rem', marginTop: '10px' }}>{errors.emailVerificationCode.message}</Alert>}
            </Form.Group>
  
            <Button variant="success" onClick={handleSubmit(verifyCode)}>
              회원 가입 완료
            </Button>
          </div>
        )}
      </Form>
    </Container>
  );
  
};

export default SignForm;
