import React, { useState } from 'react';
import '../styles/MainSelectionPage.css';
import { useNavigate } from "react-router-dom";
import api from '../api/api'; // API 호출을 위한 axios 인스턴스 또는 유사한 것
import FLPage from './FLPage'; // FLPage 컴포넌트를 임포트합니다.

const SelectionPage = () => {
    const navigate = useNavigate(); // useNavigate 훅 사용
    const [hoverFL, setHoverFL] = useState(false);
    const [showJoinForm, setShowJoinForm] = useState(false); // 참여 폼 표시 상태
    const [groupCode, setGroupCode] = useState(''); // 그룹 코드 상태 추가
    const [description, setDescription] = useState(''); // 그룹 설명 상태 추가
    const [showDescriptionForm, setShowDescriptionForm] = useState(false); // 설명 입력 폼 표시 여부를 위한 상태


    const handleShowDescriptionForm = () => {
        setShowDescriptionForm(true); // 설명 입력 폼을 보여줌
    };

    const handleCreateGroup = async () => {
        const userConfirmed = window.confirm("그룹을 생성합니다"); // 사용자에게 확인 요청
        if (userConfirmed) {
            const randomCode = Math.floor(Math.random() * (10**6 - 10**5) + 10**5);
            setGroupCode(randomCode);

            try {
                await api.post('/group/create', { groupCode: randomCode, description });
                // 그룹 생성 후 추가 로직 (예: 팝업 창 열기)
                window.open(`/fl/${randomCode}`, 'popup', 'width=600,height=400,left=200,top=200');

            } catch (error) {
                console.error('그룹 생성 중 오류 발생', error);
            }
        }
    };

    const handleJoinGroup = () => {
        setShowJoinForm(true); // 참여 폼 표시
    };

    const handleChangeDescription = (event) => {
        setDescription(event.target.value); // 입력 폼의 값이 변경될 때 설명 상태 업데이트
    };

    const handleSubmitJoin = async (event) => {
        event.preventDefault(); // 폼 제출에 의한 페이지 리로드 방지
    
        const enteredGroupCode = parseInt(groupCode, 10); // 입력받은 그룹 코드를 int로 변환
    
        try {
            const response = await api.post('/group/join', { groupCode: enteredGroupCode });
            // 성공적으로 데이터를 보냈다면 추가적인 로직 처리

            window.open(`/fl/${enteredGroupCode}`, 'popup', 'width=600,height=400,left=200,top=200');
            // navigate(`/fl/${enteredGroupCode}`);
        } catch (error) {
            if (error.response && error.response.status === 409) {
                // 409 에러 처리
                alert('그룹이 이미 가득 찼습니다.'); // 사용자에게 알림 메시지 표시
                window.location.reload(); // 페이지 다시 로드
            } else if (error.response && error.response.status === 404) {
                // 409 에러 처리
                alert('입력한 코드에 맞는 그룹은 존재하지 않습니다!'); // 사용자에게 알림 메시지 표시
                window.location.reload(); // 페이지 다시 로드
            } else {
                console.error('그룹 참여 중 오류 발생', error);
                // 기타 에러 처리 로직
            }
        }
    };

    const handleGroupCodeChange = (event) => {
        setGroupCode(event.target.value);
    };

    return (
        <div className="selection-container">
            <div className="inference-section" onClick={() => window.location.href = '/inference'}>
                Inference
            </div>
            <div className={`fl-section ${hoverFL ? 'hover' : ''}`} onMouseEnter={() => setHoverFL(true)} onMouseLeave={() => setHoverFL(false)}>
                <div className={`fl-content ${hoverFL ? 'hover' : ''}`}>
                    <span className="fl-logo">FL</span>
                    {hoverFL && (
                        <>
                            {!showDescriptionForm ? (
                                <button className="fl-button" onClick={handleShowDescriptionForm}>그룹 생성</button>
                            ) : (
                                <form className="create-form">
                                    <input type="text" placeholder="그룹 설명 입력" value={description} onChange={handleChangeDescription} />
                                    <button type="button" onClick={handleCreateGroup}>그룹 생성 확인</button>
                                </form>
                            )}
                            <button className="fl-button" onClick={handleJoinGroup}>그룹 참여</button>
                            {showJoinForm && (
                                <form className="join-form">
                                    <input type="text" placeholder="그룹 코드 입력" value={groupCode} onChange={handleGroupCodeChange} />
                                    <button type="submit" onClick={handleSubmitJoin}>참여</button>
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
