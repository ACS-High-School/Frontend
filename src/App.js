import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import MyPage from './components/MyPage';
import MainSelectionPage from './components/MainSelectionPage';
import InferencePage from './components/InferencePage';
import FLPage from './components/FLPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/select" element={<MainSelectionPage />} />
        <Route path="/inference" element={<InferencePage />} />
        <Route path="/fl" element={<FLPage />} />
      </Routes>
    </Router>
  );
}

export default App;
