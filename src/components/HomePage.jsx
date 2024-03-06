import React from 'react';
import '../styles/HomePage.css'; // HomePage에 맞는 스타일시트 경로
import homeImage from '../assets/home.png'; // home.png 이미지를 assets 폴더에서 불러옵니다.

const HomePage = () => {
    return (
        <div className="home-container">
            <div className="home-section">
                <img src={homeImage} alt="Home" className="home-image"/>
            </div>
        </div>
    );
};

export default HomePage;
