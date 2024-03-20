import React, { useState, useEffect } from 'react';
// import '../styles/FLPage.css'; // 이 경로에 CSS 파일을 저장하세요.
import api from '../api/api';
import { useParams } from 'react-router-dom';
import { Button, Container, ListGroup, Spinner, Alert} from 'react-bootstrap';
import { BsArrowRepeat } from 'react-icons/bs'; // React Icons 사용

function FLPage() {
  const [users, setUsers] = useState([
    { id: 0, name: 'User1' },
    { id: 1, name: 'User2' },
    { id: 2, name: 'User3' },
    { id: 3, name: 'User4' }
  ]);

  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  const { groupCode } = useParams(); // useParams를 사용하여 URL에서 groupCode를 가져옵니다.

  const [currentUser, setCurrentUser] = useState(null);

  const [jupyterLabUrl, setjupyterLabUrl] = useState(null);

  const [userTasks, setUserTasks] = useState({});

  const [description, setDescription] = useState('');

  const [isLearningStarted, setIsLearningStarted] = useState(false);


  useEffect(() => {
    setIsLoading(true); // API 요청 시작 시 로딩 상태를 true로 설정
    api.post('/group/users', { groupCode })
      .then(response => {
        console.log(response);
        const updatedUsers = users.map((user) => {
          const serverUser = response.data[`user${user.id + 1}`];
          
          return serverUser
            ? { ...user, username: serverUser.username }
            : { ...user, username: '아직 입장 안함' }; // 정보가 없으면 "아직 입장 안함"으로 설정
        });

        setCurrentUser(response.data.currentUser);
        setjupyterLabUrl(response.data.jupyterLabUrl);
        setDescription(response.data.description);

        if (response.data.status === 'start') {
          setIsLearningStarted(true);
        }

        if (response.data.status === 'done') {
            // 'done' 상태일 때 alert을 띄우고, 확인을 누르면 mypage 페이지로 리다이렉트
            alert('학습이 완료되었습니다. 마이페이지로 이동합니다.');
            window.open('/mypage');
          }

        setUsers(updatedUsers);
        setUserTasks(response.data.userTasks);
        setIsLoading(false); // API 요청 완료 후 로딩 상태를 false로 설정
      })
      .catch(error => {
        console.error("There was an error!", error);
        setIsLoading(false); // 에러 발생 시 로딩 상태를 false로 설정
      });
  }, [groupCode]);

  
  
  
  // Jupyter Lab을 여는 함수
  const openJupyterLab = () => {
    // 여기에 Jupyter Lab 페이지를 여는 로직을 추가하세요.
    window.open(jupyterLabUrl);
  };
  
  // 페이지를 새로고침하는 함수
  const reloadPage = () => {
    window.location.reload();
  };

  // 연합 학습을 시작하는 함수
  const startFederatedLearning = () => {
    // 연합 학습 시작 로직을 여기에 추가하세요.
    console.log('연합 학습 시작');
    setIsLearningStarted(true); // 연합 학습 시작 상태를 true로 설정

    api.post('/group/start', { groupCode })
    .then(response => {
        console.log(response);
    });
  };
  

  return (
    <Container className="fl-page mt-3">
      <div className="d-flex justify-content-between mb-3">
        <Button 
          onClick={openJupyterLab} 
          variant="dark"
          style={{
            width: '120px', 
            height: '50px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: 0
          }}
          >
            Jupyter LAB
        </Button>
        {/* 중앙에 그룹 코드를 보여줍니다. */}
        {groupCode && (
            <div style={{
                flex: 1,
                // textAlign: 'right', // 텍스트를 오른쪽으로 정렬합니다.
                paddingLeft: '50px', // 오른쪽에 여백을 줍니다.
                fontSize: '0.8rem',
                fontWeight: 'bold',
              }}>
            그룹 코드: {groupCode}
            {description && <p style={{fontSize: '1rem'}}>{description}</p>}
            </div>
            
        )}
        <Button 
          onClick={reloadPage} 
          variant="outline-secondary" 
          style={{
            width: '60px', 
            height: '50px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            marginLeft: '100px',
            padding: 0
          }}>
          <BsArrowRepeat size={30} style={{ color: 'darkgrey' }}/> {/* 크기와 색상을 명시적으로 설정 */}
        </Button>
      </div>
  
      <ListGroup>
        {users.map(user => (
          <ListGroup.Item
            key={user.id}
            className={userTasks[user.id]?.taskStatus === 'ready' ? 'list-group-item-success' : ''}
            action
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span>{user.name}</span>
                <span className="mx-2">|</span>
                <span>{user.username}</span>
              </div>
  
              {currentUser && currentUser.username === user.username && (
                <span className="badge rounded-pill bg-info">현재 유저</span>
              )}
  
              {userTasks[user.id]?.taskStatus === 'ready' && (
                <span className="badge bg-success">Ready</span>
              )}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* currentUser가 User1일 때만 "연합 학습 시작" 버튼 표시 */}
    {currentUser && currentUser.username === users[0].username && (
      <div className="mt-3 d-flex justify-content-center">
        <Button
          variant="primary"
          onClick={startFederatedLearning}
          style={{
            width: '140px',
            height: '50px',
          }}
          disabled={isLearningStarted}
        >
          연합 학습 시작
        </Button>
      </div>
    )}

    {isLearningStarted && (
            <div className="mt-3">
            <Alert variant="alert alert-dismissible alert-warning" className="text-center">
                연합 학습이 실행 중입니다!
            </Alert>
            </div>
        )}

      
      {isLoading && (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
    </Container>
  );
}  

export default FLPage;
