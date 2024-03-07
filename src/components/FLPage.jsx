import React, { useState, useEffect } from 'react';
import '../styles/FLPage.css'; // 이 경로에 CSS 파일을 저장하세요.

function FLPage() {
  const [users, setUsers] = useState([
    { id: 1, name: 'User1', fileUploaded: false },
    { id: 2, name: 'User2', fileUploaded: false },
    { id: 3, name: 'User3', fileUploaded: false },
    { id: 4, name: 'User4', fileUploaded: false }
  ]);


  const handleFileUpload = (userId) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, fileUploaded: true } : user
    ));
  };

  const allFilesUploaded = users.every(user => user.fileUploaded);

  return (
    <div className="fl-page">
      <div className="user-list">
        {users.map(user => (
          <div key={user.id} className={`user-component ${user.fileUploaded ? 'uploaded' : ''}`}>
            <span>{user.name}</span>
          </div>
        ))}
      </div>
      <input type="file" onChange={() => handleFileUpload()} />
      {allFilesUploaded && (
        <button className="start-learning">학습 시작</button>
      )}
    </div>
  );
}

export default FLPage;
