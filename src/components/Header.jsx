import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css'; // 헤더 스타일 임포트

function Header() {
  return (
    <div className="header">
      <Link to="/select" className="logo">B3O</Link>
      <Link to="/mypage" className="my-profile">MyProfile</Link>
    </div>
  );
}

export default Header;
