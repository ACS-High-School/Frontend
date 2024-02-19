import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import MyPage from "./components/MyPage";
import MainSelectionPage from "./components/MainSelectionPage";
import InferencePage from "./components/InferencePage";
import FLPage from "./components/FLPage";
import { verifyToken } from "./api/api"; // verifyToken 함수 임포트

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = verifyToken(); // 라우트 접근 시에만 verifyToken 호출
  return isLoggedIn ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/mypage"
          element={
            <ProtectedRoute>
              <MyPage />
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
          path="/fl"
          element={
            <ProtectedRoute>
              <FLPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
