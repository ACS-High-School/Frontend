import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import SignUpPage from "./components/SignUpPage";
import MyPage from "./components/MyPage";
import MainSelectionPage from "./components/MainSelectionPage";
import InferencePage from "./components/InferencePage";
import FLPage from "./components/FLPage";
import { verifyToken } from "./api/api"; // verifyToken 함수 임포트
import Layout from "./layout/Layout";
import { Container } from "react-bootstrap";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = verifyToken(); // 라우트 접근 시에만 verifyToken 호출
  return isLoggedIn ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <Layout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route
              path="/mypage"
              element={
                <ProtectedRoute>
                  <Container style={{ minHeight: "75vh" }}> 
                    <MyPage />
                </Container>
                </ProtectedRoute>
              }
            />
            <Route
              path="/select"
              element={
                <ProtectedRoute>
                  <MainSelectionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inference"
              element={
                <ProtectedRoute>
                  <InferencePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fl/:groupCode"
              element={
                <ProtectedRoute>
                  <Container style={{ minHeight: "75vh" }}> 
                    <FLPage />
                  </Container>
                </ProtectedRoute>
              }
            />
          </Routes>
      </Layout>
    </Router>
  );
}

export default App;
