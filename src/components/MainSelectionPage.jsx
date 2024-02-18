import React, { useState } from 'react';
import '../styles/MainSelectionPage.css';
import SignOutButton from './SignOutButton';

const SelectionPage = () => {
    const [hoverFL, setHoverFL] = useState(false);
    const [showGroupCode, setShowGroupCode] = useState(false); // 그룹 코드 표시 상태
    const [showJoinForm, setShowJoinForm] = useState(false); // 참여 폼 표시 상태
    const [groupCode, setGroupCode] = useState(''); // 그룹 코드 상태 추가

    const handleCreateGroup = () => {
        setShowGroupCode(true); // 그룹 코드 표시
        setShowJoinForm(false); // 참여 폼 숨김
        const randomCode = Math.random().toString(36).substring(2, 8);
        setGroupCode(randomCode); // 랜덤 그룹 코드 설정
    };

    const handleJoinGroup = () => {
        setShowJoinForm(true); // 참여 폼 표시
        setShowGroupCode(false); // 그룹 코드 숨김
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
                            {showGroupCode && <div className="group-code">그룹 코드: {groupCode}</div>}
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
