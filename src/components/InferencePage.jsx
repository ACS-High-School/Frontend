import React, { useState } from 'react';
import '../styles/InferencePage.css';
import api from '../api/api';
import Spinner from "../assets/spinner.gif"

function InferencePage() {
  const [taskTitle, setTaskTitle] = useState('');
  const [model, setModel] = useState('');
  const [x1File, setX1File] = useState(null);
  const [x2File, setX2File] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); // 스피너 상태를 관리하는 새로운 state

  const handleTaskTitleChange = (event) => {
    setTaskTitle(event.target.value);
  };

  const handleModelChange = (event) => {
    setModel(event.target.value);
  };

  const handleX1FileChange = (event) => {
    setX1File(event.target.files[0]);
  };

  const handleX2FileChange = (event) => {
    setX2File(event.target.files[0]);
  };

  const uploadFile = async (file, subFolderPath) => {
    const formData = new FormData();
    formData.append('taskTitle', taskTitle);
    formData.append('multipartFiles', file);
    formData.append('subFolderPath', subFolderPath);
    
    try {
      const response = await api.post('/s3/uploadFile', formData);
  
      return response.status === 200; // Check if the response status is OK (200)
    } catch (error) {
      console.error('Error during file upload:', error);
      return false;
    }
  };
  
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('model', model); // 'model' 파라미터 추가
    formData.append('taskTitle', taskTitle);

    if (x1File && x2File) {
      const uploadX1Success = await uploadFile(x1File, 'x1');
      const uploadX2Success = await uploadFile(x2File, 'x2');

      if (uploadX1Success && uploadX2Success) {
        try {
          // 데이터베이스에 정보 저장 로직
          const response = await api.post('/inference/upload', formData);
          if (response.status === 200) {
            // 처리 성공
            console.log('Data saved successfully');
          }
        } catch (error) {
          console.error('Error during data saving:', error);
          setLoading(false); // 에러 발생 시 로딩 중지
        }
      } else {
        console.error('File upload to S3 failed');
      }
      setLoading(true); // 버튼 클릭 시 로딩 시작
      setSubmitted(true);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get('/s3/getFile', {
        responseType: 'blob', // Important for files
      });
  
      // Blob을 이용해 Object URL을 생성합니다.
      const url = window.URL.createObjectURL(new Blob([response.data]));
  
      // 가상의 <a> 태그를 만들어 파일 다운로드를 수행합니다.
      const a = document.createElement('a');
      a.href = url;
      a.download = 'result.csv'; // Set the desired file name
      document.body.appendChild(a);
      a.click();
  
      // 사용 후 Object URL을 정리합니다.
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
  
    } catch (error) {
      console.error('Download error:', error);
    }
  };
  

  return (
    <div className="container">
      <h2>Input</h2>
      <label className="block">
        Model
        <select value={model} onChange={handleModelChange} className="block">
          <option value="">Select Model</option>
          <option value="1">model 1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </label>
      
      <label className="block">
        Task Title
        <input 
          type="text" 
          value={taskTitle} 
          onChange={handleTaskTitleChange} 
          placeholder="Task Name" 
          className="block"
        />
      </label>
      
      <label className="block">
        X1
        <input 
          type="file" 
          onChange={handleX1FileChange} 
          className="block"
        />
        {x1File && <p>Selected: {x1File.name}</p>}
      </label>
      
      <label className="block">
        X2
        <input 
          type="file" 
          onChange={handleX2FileChange} 
          className="block"
        />
        {x2File && <p>Selected: {x2File.name}</p>}
      </label>
      
      <button
        onClick={handleSubmit}
        className={`block button ${!model || !taskTitle || !x1File || !x2File ? 'button-disabled' : ''}`}
        disabled={!model || !taskTitle || !x1File || !x2File}
      >
        Send
      </button>

      <h2>Output</h2>
      {loading && <img src={Spinner} alt="Loading..." />}
      {!loading && submitted && (
        <button onClick={handleDownload} className="block">
          Download Result File
        </button>
      )}
    </div>
  );
}


export default InferencePage;
