import React, { useState } from 'react';
import '../styles/MainSelectionPage.css';

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

    const handleSubmitJoin = async (event) => {
        event.preventDefault(); // 폼 제출에 의한 페이지 리로드 방지
    
        const enteredGroupCode = parseInt(groupCode, 10); // 입력받은 그룹 코드를 int로 변환
    
        try {
            const response = await api.post('/group/join', { groupCode: enteredGroupCode });
            // 성공적으로 데이터를 보냈다면 추가적인 로직 처리
            navigate(`/fl/${enteredGroupCode}`);
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
                            <button className="fl-button" onClick={handleCreateGroup}>그룹 생성</button>
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
