import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../components/authService";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
  const isLogin = location.pathname === "/login";
  const isSignUp = location.pathname === "/signup";

  // accessToken으로 끝나는 쿠키가 있는지 확인하는 함수
  const hasAccessTokenCookie = () => {
    const cookies = document.cookie.split("; ");
    return cookies.some((cookie) => {
      const parts = cookie.split("=");
      const name = parts[0];
      return name.split(".").pop() === "accessToken";
    });
  };

  // accessToken 쿠키의 존재 여부
  const hasAccessToken = hasAccessTokenCookie();

  return (
<header>
  <Navbar bg="dark" variant="dark" expand="lg">
    <Container fluid> {/* fluid 속성으로 전체 너비 사용 */}
      <Navbar.Brand href="/">B3O</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto"> {/* ms-auto로 오른쪽 정렬 */}
          <Nav.Link href="/select">Main</Nav.Link>
          {isMyPage ? (
            <Button variant="outline-danger" onClick={handleSignOut}>
              Logout
            </Button>
          ) : (
            (isHome || isSignUp) &&
            !hasAccessToken && (
              <Button variant="outline-primary" onClick={() => navigate("/login")}>
                Login
              </Button>
            )
          )}
          <Nav.Link href="/mypage">Profile</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
</header>
  );
};

export default Header;
