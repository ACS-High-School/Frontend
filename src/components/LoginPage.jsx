import React from "react";
import { useForm } from "react-hook-form";
// import "./login.css";

const LoginForm = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const handleSignUp = (data) => {
    // 여기에 회원 가입 로직을 추가합니다.
    console.log("회원 가입 데이터:", data);
  };


  return (
    <form onSubmit={handleSubmit(props.onSubmit)} className="login">
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
          {/* 회원 가입 버튼 */}
          <button type="button" onClick={handleSignUp}>
        회원 가입
      </button>
    </form>

  );
};

export default LoginForm;
