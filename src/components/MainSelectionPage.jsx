import React, { useState } from 'react';
import '../styles/MainSelectionPage.css';
import SignOutButton from './SignOutButton';
import { useNavigate } from 'react-router-dom';

import api from '../api/api';

const SelectionPage = () => {
    const navigate = useNavigate(); // useNavigate 훅 사용
    const [hoverFL, setHoverFL] = useState(false);
    const [showJoinForm, setShowJoinForm] = useState(false); // 참여 폼 표시 상태
    const [groupCode, setGroupCode] = useState(''); // 그룹 코드 상태 추가

    const handleCreateGroup = async () => {
        const randomCode = Math.floor(Math.random() * (10**6 - 10**5) + 10**5);
        setGroupCode(randomCode); // 랜덤 그룹 코드 설정

        try {
            await api.post('/group/create', { groupCode: randomCode });            
            // 성공적으로 데이터를 보냈다면 추가적인 로직 처리
        } catch (error) {
            console.error('그룹 생성 중 오류 발생', error);
            // 에러 처리 로직
        }
        navigate(`/fl/${randomCode}`);

    };

    const handleJoinGroup = () => {
        setShowJoinForm(true); // 참여 폼 표시
    };

    return (
        <div className="selection-container">
            <SignOutButton />
            <div className="inference-section" onClick={() => window.location.href = '/inference'}>
                Inference
            </div>
            <div className={`fl-section ${hoverFL ? 'hover' : ''}`} onMouseEnter={() => setHoverFL(true)} onMouseLeave={() => setHoverFL(false)}>
                <div className={`fl-content ${hoverFL ? 'hover' : ''}`}>
                    <span className="fl-logo">FL</span>
                    {hoverFL && (
                        <>
                            <button className="fl-button" onClick={handleCreateGroup}>그룹 생성</button>
                            <button className="fl-button" onClick={handleJoinGroup}>그룹 참여</button>
                            {showJoinForm && (
                                <form className="join-form">
                                    <input type="text" placeholder="그룹 코드 입력" />
                                    <button type="submit">참여</button>
                                </form>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SelectionPage;
