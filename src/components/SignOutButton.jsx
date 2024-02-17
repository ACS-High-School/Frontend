import React from 'react';
import { handleSignOut } from './authService'; // 올바른 경로로 수정하세요.

const SignOutButton = () => (
  <button onClick={handleSignOut}>로그아웃</button>
);

export default SignOutButton;
