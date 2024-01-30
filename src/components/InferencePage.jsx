import React, { useState } from 'react';
import '../styles/InferencePage.css'; // 상대 경로를 사용하여 CSS 파일 임포트
import Header from '../components/Header'; // Header 컴포넌트 임포트

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

  const handleSubmit = () => {
    console.log('Submitted', { taskTitle, model, x1File, x2File });
    setSubmitted(true);
  };

  const handleDownload = () => {
    if (x2File) {
      const url = URL.createObjectURL(x2File);
      const a = document.createElement('a');
      a.href = url;
      a.download = x2File.name;
      a.click();
      URL.revokeObjectURL(url);
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
          <option value="1">1</option>
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
        제출 확인
      </button>

      <h2>Output</h2>
      {submitted && x2File && (
        <button onClick={handleDownload} className="block">
          Download X2 File
        </button>
      )}
    </div>
  );
}

export default InferencePage;
