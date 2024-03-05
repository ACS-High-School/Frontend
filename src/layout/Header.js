import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../components/authService";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 위치 확인을 위해 useLocation 사용

  const handleSignOut = async () => {
    try {
      await authService.handleSignOut({ global: true });
      navigate("/"); // 로그아웃 후 홈 페이지로 리디렉션합니다.
    } catch (error) {
      console.log("로그아웃 중 오류 발생: ", error);
    }
  };

  const isMyPage = location.pathname === "/mypage";
  const isHome = location.pathname === "/";
  const isLogin = location.pathname === "/login"; // 로그인 페이지인지 확인하는 조건
  const isSignUp = location.pathname === "/signup"; // 회원가입 페이지인지 확인하는 조건

  return (
    <header>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">B3O</Navbar.Brand>
          {!isLogin && (
            // 로그인 페이지가 아닌 경우에만 Navbar.Toggle 및 Navbar.Collapse 표시
            <>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                  {!isHome && !isSignUp && (
                    <Nav.Link href="/select">Main</Nav.Link>
                  )}
                  {isMyPage ? (
                    <Button variant="outline-danger" onClick={handleSignOut}>
                      Logout
                    </Button>
                  ) : (
                    (isHome || isSignUp) && (
                      // 홈 또는 회원가입 페이지인 경우 로그인 버튼 표시
                      <Button
                        variant="outline-primary"
                        onClick={() => navigate("/login")}
                      >
                        Login
                      </Button>
                    )
                  )}
                  {!isHome && !isSignUp && !isMyPage && (
                    // 홈, 회원가입, 마이페이지가 아닌 경우 프로필 링크 표시
                    <Nav.Link href="/mypage">Profile</Nav.Link>
                  )}
                </Nav>
              </Navbar.Collapse>
            </>
          )}
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
