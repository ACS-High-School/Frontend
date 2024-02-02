import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { authService } from './authService'; // authService 임포트
import "../styles/SignUpPage.css"; // 스타일링을 위한 CSS 파일을 임포트합니다.


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
      const attributes = [
        { Name: 'username', Value: data.email },
        // 필요한 다른 속성들을 여기에 추가하세요.
      ];
      await authService.register(data.username, data.email, data.password);
      // 회원가입 성공 후의 로직을 여기에 추가하세요.
      setShowEmailVerification(true);
      console.log("회원 생성 성공!")

    } catch (error) {
      console.error(error);
    //   reset();
      // 에러 처리 로직을 여기에 추가하세요.
    }
  };

  const verifyCode = async (data) => {
    try {
        console.log(data.emailVerificationCode)
        await authService.confirmCode(data.username, data.emailVerificationCode);
        // 회원가입 성공 후의 로직을 여기에 추가하세요.
        console.log("회원 인증 성공!")
        navigate('/');
    } catch (error) {
      console.error(error);
    //   reset();
      // 에러 처리 로직을 여기에 추가하세요.
    }
  };

  return (
    <div className="sign-form-container">
      <form onSubmit={handleSubmit(onSubmit)} className="sign-form">
        <div>
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="text"
            placeholder="test@email.com"
            {...register("email", {
              required: "이메일은 필수 입력입니다.",
              pattern: {
                value:
                  /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
                message: "이메일 형식에 맞지 않습니다.",
              },
            })}
          />
          {errors.email && (
            <small role="alert">{errors.email.message}</small>
          )}
        </div>
        <div>
          <label htmlFor="username">닉네임</label>
          <input
            id="username"
            type="text"
            placeholder="닉네임을 입력하세요"
            {...register("username", {
              required: "닉네임은 필수 입력입니다.",
              minLength: {
                value: 3,
                message: "닉네임은 최소 3자 이상이어야 합니다.",
              },
            })}
          />
          {errors.username && (
            <small role="alert">{errors.username.message}</small>
          )}
        </div>
        <div className="form-control__items">
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            placeholder="*******"
            {...register("password", {
              required: "비밀번호는 필수 입력입니다.",
              minLength: {
                value: 7,
                message: "7자리 이상 비밀번호를 입력하세요.",
              },
              validate: {
                containsUpperCase: value =>
                  /[A-Z]/.test(value) || "최소 1개 이상의 대문자가 포함되어야 합니다.",
                containsSpecialChar: value =>
                  /[!@#$%^&*(),.?":{}|<>]/.test(value) || "최소 1개 이상의 특수문자가 포함되어야 합니다."
              }
            })}
          />
          {errors.password && (
            <small role="alert">{errors.password.message}</small>
          )}
        </div>
        <div>
          <label htmlFor="passwordConfirm">비밀번호 확인</label>
          <input
            id="passwordConfirm"
            type="password"
            placeholder="*******"
            {...register("passwordConfirm", {
              required: "비밀번호 확인은 필수 입력입니다.",
              minLength: {
                value: 7,
                message: "7자리 이상 비밀번호를 사용하세요.",
              },
              validate: {
                check: (val) => {
                  if (getValues("password") !== val) {
                    return "비밀번호가 일치하지 않습니다.";
                  }
                },
              },
            })}
          />
          {errors.passwordConfirm && (
            <small role="alert">{errors.passwordConfirm.message}</small>
          )}
        <button type="submit">회원가입 완료</button>

        </div>
        {/* 이메일 인증 코드 입력 필드와 버튼을 조건부 렌더링 */}
        {showEmailVerification && (
          <div className="email-verification">
            <div>
              <label htmlFor="emailVerificationCode">이메일 인증 코드</label>
              <input
                id="emailVerificationCode"
                type="text"
                placeholder="인증 코드를 입력하세요"
                {...register("emailVerificationCode", {
                  required: "이메일 인증 코드는 필수 입력입니다.",
                })}
              />
              {errors.emailVerificationCode && (
                <small role="alert">{errors.emailVerificationCode.message}</small>
              )}
            </div>
            <button type="button" onClick={handleSubmit(verifyCode)}>인증 코드 전송</button>
          </div>
        )}

      </form>
    </div>
  );
};

export default SignForm;
