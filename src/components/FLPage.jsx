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

  const { groupCode } = useParams(); // useParams를 사용하여 URL에서 groupCode를 가져옵니다.

  useEffect(() => {
    api.post('/group/users', { groupCode })
      .then(response => {
        // 서버 응답에서 각 User 객체의 username 추출
        const updatedUsers = users.map((user, index) => {
          // user1, user2, user3, user4에 해당하는 서버 응답 데이터에서 username 추출
          const serverUser = response.data[`user${index + 1}`]; // index는 0부터 시작하므로 +1
          return serverUser
            ? { ...user, username: serverUser.username } // 서버 응답에 해당 사용자 정보가 있으면 username 추가 또는 업데이트
            : { ...user, username: '' }; // 서버 응답에 사용자 정보가 없으면 username을 빈 문자열로 설정
        });
  
        setUsers(updatedUsers); // 업데이트된 사용자 목록으로 상태 업데이트
      })
      .catch(error => console.error("There was an error!", error));
  }, [groupCode]); // 의존성 배열에는 groupCode만 포함
  
  
  
  
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
            <span>
              {user.username ? user.username : "아직 입장 안함"} {/* username이 있으면 표시하고, 없으면 "정보 없음" 표시 */}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
  
}

export default FLPage;
