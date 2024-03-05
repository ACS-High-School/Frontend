import React from 'react';
import { useNavigate, useLocation } from "react-router-dom"; // useLocation 추가
import { authService } from '../components/authService';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 위치 확인을 위해 useLocation 사용

  // 로그아웃 처리 후 홈 페이지로 리디렉션하는 함수입니다.
  const handleSignOut = async () => {
    try {
      await authService.handleSignOut({ global: true });
      navigate('/'); // 로그아웃 후 홈 페이지로 리디렉션합니다.
    } catch (error) {
      console.log('로그아웃 중 오류 발생: ', error);
    }
  };

  // 현재 위치가 '/mypage'인지 확인하는 조건
  const isMyPage = location.pathname === '/mypage';

  return (
    <header>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">B3O</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/select">Main</Nav.Link>
              {isMyPage ? (
                // 현재 페이지가 mypage일 경우 로그아웃 버튼을 표시
                <Button variant="outline-danger" onClick={handleSignOut}>Logout</Button>
              ) : (
                // 그 외의 경우 Profile 링크를 표시
                <Nav.Link href="/mypage">Profile</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
