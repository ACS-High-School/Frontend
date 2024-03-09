import React, { useState, useEffect } from 'react';
import '../styles/FLPage.css'; // 이 경로에 CSS 파일을 저장하세요.
import api from '../api/api';
import { useParams } from 'react-router-dom';

function FLPage() {
  const [users, setUsers] = useState([
    { id: 1, name: 'User1', fileUploaded: false },
    { id: 2, name: 'User2', fileUploaded: false },
    { id: 3, name: 'User3', fileUploaded: false },
    { id: 4, name: 'User4', fileUploaded: false }
  ]);

  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  const { groupCode } = useParams(); // useParams를 사용하여 URL에서 groupCode를 가져옵니다.

  const [currentUser, setCurrentUser] = useState(null);

  const [jupyterLabUrl, setjupyterLabUrl] = useState(null);

  useEffect(() => {
    setIsLoading(true); // API 요청 시작 시 로딩 상태를 true로 설정
    api.post('/group/users', { groupCode })
      .then(response => {
        const updatedUsers = users.map((user, index) => {
          const serverUser = response.data[`user${index + 1}`];
          setCurrentUser(response.data.currentUser);
          setjupyterLabUrl(response.data.jupyterLabUrl);
          return serverUser
            ? { ...user, username: serverUser.username }
            : { ...user, username: '아직 입장 안함' }; // 정보가 없으면 "아직 입장 안함"으로 설정
        });

        setUsers(updatedUsers);
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
  

  return (
    <div className="fl-page">
      <div className="btn_header">
        <button onClick={openJupyterLab} className="jupyter-lab-btn">Jupyter LAB</button>
        <button onClick={reloadPage} className="reload-btn">Reload</button>
      </div>  
      <div className="user-list">
        {isLoading ? (
          <div>Loading...</div> // 로딩 중이면 로딩 인디케이터 표시
        ) : (
          users.map(user => (
            <div key={user.id} className={`user-component ${user.fileUploaded ? 'uploaded' : ''}`}>
              <span>{user.name}</span>
              <span>{user.username}</span> {/* "아직 입장 안함" 메시지는 API 응답 처리 시 추가됨 */}
              {/* currentUser와 user의 username이 같은 경우 "현재 유저" 표시 추가 */}
              {currentUser && currentUser.username === user.username && (
                <span className="current-user-tag"> (현재 유저)</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FLPage;
