import React, { useState, useEffect } from 'react';
import '../styles/FLPage.css'; // 이 경로에 CSS 파일을 저장하세요.

function useCountdown(targetDate) {
    const getCountdownTime = () => targetDate - new Date().getTime();
    const [countdownTime, setCountdownTime] = useState(getCountdownTime);
  
    useEffect(() => {
      if (countdownTime <= 0) {
        // 타이머가 0에 도달했을 때의 로직을 여기에 추가하세요.
        return;
      }
  
      // 정확한 1초 간격으로 카운트다운을 업데이트합니다.
      const timerId = setTimeout(() => {
        setCountdownTime(getCountdownTime());
      }, 1000);
  
      // 컴포넌트가 언마운트될 때 타이머를 정리합니다.
      return () => clearTimeout(timerId);
    }, [countdownTime, targetDate]);
  
    return countdownTime;
  }

function FLPage() {
  const [users, setUsers] = useState([
    { id: 1, name: 'User1', fileUploaded: false },
    { id: 2, name: 'User2', fileUploaded: false },
    { id: 3, name: 'User3', fileUploaded: false },
    { id: 4, name: 'User4', fileUploaded: false }
  ]);


  // 남은 시간을 분:초 형태로 변환합니다.
  const formatTime = () => {
    const minutes = Math.floor(countdownTime / 60000);
    const seconds = Math.floor((countdownTime % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // 남은 시간 (예: 1시간 후)
  const countdownTime = useCountdown(new Date().getTime() + 3600 * 1000);

  const handleFileUpload = (userId) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, fileUploaded: true } : user
    ));
  };

  const allFilesUploaded = users.every(user => user.fileUploaded);

  return (
    <div className="fl-page">
      <div className="countdown-timer">
        남은 시간: {new Date(countdownTime).toISOString().substr(11, 8)}
      </div>
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
