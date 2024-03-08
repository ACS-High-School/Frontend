import React, { useState, useEffect } from 'react';
import '../styles/FLPage.css'; // 이 경로에 CSS 파일을 저장하세요.
import api from '../api/api';

function FLPage() {
  const [users, setUsers] = useState([
    { id: 1, name: 'User1', fileUploaded: false },
    { id: 2, name: 'User2', fileUploaded: false },
    { id: 3, name: 'User3', fileUploaded: false },
    { id: 4, name: 'User4', fileUploaded: false }
  ]);

  useEffect(() => {
    // axios를 사용하여 API 호출
    api.get('/fl/users')
        .then(response => {
            const updatedUsers = response.data.map(user => ({
                ...user,
                fileUploaded: false // fileUploaded 상태를 초기화합니다.
            }));
            setUsers(updatedUsers); // 응답 데이터로 사용자 상태를 업데이트합니다.
        })
        .catch(error => console.error("There was an error!", error));
}, []); // 빈 의존성 배열로 컴포넌트가 마운트될 때만 실행합니다.

  // Jupyter Lab을 여는 함수
  const openJupyterLab = () => {
    // 여기에 Jupyter Lab 페이지를 여는 로직을 추가하세요.
    // 예: window.open('Jupyter Lab URL');
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
        {users.map(user => (
          <div key={user.id} className={`user-component ${user.fileUploaded ? 'uploaded' : ''}`}>
            <span>{user.name}</span>
            <span>{`(${user.username})`}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FLPage;
