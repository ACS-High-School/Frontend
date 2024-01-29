import React from "react";
import { useForm } from "react-hook-form";

const SignForm = (props) => {
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const onSubmit = (data) => {
    // 여기에 회원가입 양식을 처리하는 로직을 추가하세요
    console.log("양식 데이터 제출됨:", data);
    // 부모 컴포넌트의 onSubmit 함수를 호출하려면 필요한 경우 아래와 같이 사용하세요
    if (props.onSubmit) {
      props.onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
        {errors.email && <small role="alert">{errors.email.message}</small>}
      </div>
      <div>
        <label htmlFor="nickname">닉네임</label>
        <input
          id="nickname"
          type="text"
          placeholder="닉네임을 입력하세요"
          {...register("nickname", {
            required: "닉네임은 필수 입력입니다.",
            minLength: {
              value: 3,
              message: "닉네임은 최소 3자 이상이어야 합니다.",
            },
          })}
        />
        {errors.nickname && (
          <small role="alert">{errors.nickname.message}</small>
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
      </div>
      <button type="submit">회원가입 완료</button>
    </form>
  );
};

export default SignForm;
