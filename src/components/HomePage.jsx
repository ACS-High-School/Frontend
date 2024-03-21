import React from 'react';
import '../styles/HomePage.css'; // CSS 파일 경로를 확인해주세요.
import homeImage from '../assets/home.gif'; // GIF 이미지 경로를 지정해주세요.
import Button from 'react-bootstrap/Button';

const HomePage = () => {
    return (
        <div className="home-container">
            <div className="home-image-container">
                {/* <img src={homeImage} alt="Home" className="home-image"/> */}
            </div>
            <div className="home-auth-container">
                <Button className="auth-button" variant="primary">Enter</Button>
            </div>
        </div>
    );
};

export default HomePage;
