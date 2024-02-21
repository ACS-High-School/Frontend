import React, { useState } from 'react';
import '../styles/InferencePage.css';
import Header from '../components/Header';
import api from '../api/api';

function InferencePage() {
  const [taskTitle, setTaskTitle] = useState('');
  const [model, setModel] = useState('');
  const [x1File, setX1File] = useState(null);
  const [x2File, setX2File] = useState(null);
  const [submitted, setSubmitted] = useState(false);

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
      const response = await api.post('/inference/uploadFile', formData);
  
      return response.status === 200; // Check if the response status is OK (200)
    } catch (error) {
      console.error('Error during file upload:', error);
      return false;
    }
  };
  
  const handleSubmit = async () => {
    if (x1File && x2File) {
      const uploadX1Success = await uploadFile(x1File, 'x1');
      const uploadX2Success = await uploadFile(x2File, 'x2');

      if (uploadX1Success && uploadX2Success) {
        console.log('Files uploaded successfully');
        setSubmitted(true);
      } else {
        console.error('Upload failed');
      }
    } else {
      console.error('Both files are required');
    }
    setSubmitted(true);
  };

  const handleDownload = async () => {
    try {
      const response = await api.get('/inference/getFile', {
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
      <Header />
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
      
      <button onClick={handleSubmit} className="block">
        Send
      </button>

      <h2>Output</h2>
      {submitted && x2File && (
        <button onClick={handleDownload} className="block">
          Download Result File
        </button>
      )}
    </div>
  );
}

export default InferencePage;
