import React, { useState } from 'react';

import { Button, Form, InputGroup, Container, Row, Col } from 'react-bootstrap';

import '../styles/MainSelectionPage.css';
import { useNavigate } from "react-router-dom";
import api from '../api/api'; // API 호출을 위한 axios 인스턴스 또는 유사한 것

const SelectionPage = () => {
    const navigate = useNavigate(); // useNavigate 훅 사용
    const [hoverFL, setHoverFL] = useState(false);
    const [showJoinForm, setShowJoinForm] = useState(false); // 참여 폼 표시 상태
    const [groupCode, setGroupCode] = useState(''); // 그룹 코드 상태 추가
    const [description, setDescription] = useState(''); // 그룹 설명 상태 추가
    const [showDescriptionForm, setShowDescriptionForm] = useState(false); // 설명 입력 폼 표시 여부를 위한 상태


    const handleShowDescriptionForm = () => {
        setShowDescriptionForm(true); // 설명 입력 폼을 보여줌
        setShowJoinForm(false); // 참여 폼은 숨김
    };

    const handleCreateGroup = async () => {
        const userConfirmed = window.confirm("그룹을 생성합니다"); // 사용자에게 확인 요청
        if (userConfirmed) {
            const randomCode = Math.floor(Math.random() * (10**6 - 10**5) + 10**5);
            setGroupCode(randomCode);

            try {
                await api.post('/group/create', { 
                    groupCode: randomCode, 
                    description: description 
                });
                // 그룹 생성 후 추가 로직 (예: 팝업 창 열기)
                window.open(`/fl/${randomCode}`, 'popup', 'width=600,height=400,left=200,top=200');

            } catch (error) {
                console.error('그룹 생성 중 오류 발생', error);
            }
        }
    };

    const handleJoinGroup = () => {
        setShowJoinForm(true); // 참여 폼 표시
        setShowDescriptionForm(false); // 설명 입력 폼은 숨김
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

            window.open(`/fl/${enteredGroupCode}`, 'popup', 'width=600,height=500,left=200,top=200');
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
        <Container className="selection-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center', padding: 0,  marginLeft: 0, marginRight: 0, height: '100vh', width: '100vw' }}>
            <Row className="inference-section" style={{ flex: 1, alignItems: 'center', justifyContent: 'center', fontSize: '50px', cursor: 'pointer', width: '100%', margin: 0 }} onClick={() => navigate('/inference')}>
                Inference
            </Row>
    
            <Row className={`fl-section ${hoverFL ? 'hover' : ''}`} style={{ flex: 1, justifyContent: 'center', width: '100%', margin: 0 }} onMouseEnter={() => setHoverFL(true)} onMouseLeave={() => setHoverFL(false)}>
                <Col className="fl-content" style={{ textAlign: 'center', paddingTop: '20px', paddingLeft: 0, paddingRight: 0 }}>
                    <div className="fl-logo">FL</div>
                    <Button style={{ fontSize: '18px', padding: '10px 20px', marginRight: '10px', cursor: 'pointer' }} onClick={handleShowDescriptionForm}>그룹 생성</Button>
                    <Button variant="secondary" style={{ fontSize: '18px', padding: '10px 20px', cursor: 'pointer' }} onClick={handleJoinGroup}>그룹 참여</Button>
                    
                    {showDescriptionForm && (
                        <Form className="create-form" style={{ marginTop: '20px', width: '100%', display: 'flex', justifyContent: 'center' }} onSubmit={handleCreateGroup}>
                            <Form.Group controlId="formGroupDescription" style={{ width: '300px' }}>
                                <Form.Control type="text" placeholder="Task 설명 입력" value={description} onChange={handleChangeDescription} />
                            </Form.Group>
                            <Button variant="success" type="submit" style={{ marginLeft: '20px' }}>생성 확인</Button>
                        </Form>
                    )}
    
                    {showJoinForm && (
                        <Form className="join-form" onSubmit={handleSubmitJoin} style={{ marginTop: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <Form.Group controlId="formGroupCode" style={{ width: '300px' }}>
                                <Form.Control type="text" placeholder="그룹 코드 입력" value={groupCode} onChange={handleGroupCodeChange} />
                            </Form.Group>
                            <Button variant="success" type="submit" style={{ marginLeft: '20px' }}>참여</Button>
                        </Form>
                    )}
                </Col>
            </Row>
        </Container>
    );
};    



export default SelectionPage;
