import React, { useState } from 'react';
import '../styles/InferencePage.css';
import api from '../api/api';
import { Alert, Button, Form, Container, Row, Col, Spinner as BootstrapSpinner } from 'react-bootstrap';

function InferencePage() {
  const [taskTitle, setTaskTitle] = useState('');
  const [model, setModel] = useState('');
  const [dataFile, setDataFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleTaskTitleChange = (event) => {
    setTaskTitle(event.target.value);
  };

  const handleModelChange = (event) => {
    setModel(event.target.value);
  };

  const handleDataFileChange = (event) => {
    setDataFile(event.target.files[0]);
  };

  const uploadFile = async (file, subFolderPath) => {
    const formData = new FormData();
    formData.append('taskTitle', taskTitle);
    formData.append('multipartFiles', file);
    formData.append('subFolderPath', subFolderPath);

    try {
      const response = await api.post('/s3/uploadFile', formData);
      return response.status === 200;
    } catch (error) {
      console.error('Error during file upload:', error);
      return false;
    }
  };

  const handleSubmit = async () => {
    setLoading(true); // 로딩 시작
    const formData = new FormData();
    formData.append('model', model);
    formData.append('taskTitle', taskTitle);

    if (dataFile) {
      const uploadSuccess = await uploadFile(dataFile, 'input');

      if (uploadSuccess) {
        try {
          const response = await api.post('/inference/upload', formData);
          if (response.status === 200) {
            console.log('Data saved successfully');
            setUploadSuccess(true); // 업로드 성공 상태 설정
          }
        } catch (error) {
          console.error('Error during data saving:', error);
        }
      } else {
        console.error('File upload to S3 failed');
      }
    }
    setLoading(false); // 로딩 중지
    setSubmitted(true);
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
    <Container className="mt-5">
      <h2 className="mb-4">Input</h2>
      <Form>
        <Form.Group as={Row} className="mb-3" controlId="formModel">
          <Form.Label column sm="2">Model</Form.Label>
          <Col sm="10">
            <Form.Control as="select" value={model} onChange={handleModelChange} className="mb-2">
              <option value="">Select Model</option>
              <option value="1">Model 1</option>
              <option value="2">Model 2</option>
              <option value="3">Model 3</option>
              <option value="4">Model 4</option>
            </Form.Control>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formTaskTitle">
          <Form.Label column sm="2">Task Title</Form.Label>
          <Col sm="10">
            <Form.Control type="text" value={taskTitle} onChange={handleTaskTitleChange} placeholder="Task Name" className="mb-2"/>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formDataFile">
          <Form.Label column sm="2">Input Data</Form.Label>
          <Col sm="10">
            <Form.Control type="file" onChange={handleDataFileChange} className="mb-2"/>
          </Col>
        </Form.Group>

        <Button variant="primary" onClick={handleSubmit} disabled={!model || !taskTitle || !dataFile} className="mb-4" >
          Send
        </Button>
      </Form>

      <h2>Output</h2>
      {loading && <div className="text-center"><BootstrapSpinner animation="border" /></div>}
      {!loading && uploadSuccess && (
        <Alert variant="success" className="mt-3">
          파일 업로드가 완료되었습니다.
        </Alert>
      )}
      {!loading && submitted && (
        <Button variant="success" onClick={handleDownload} className="mt-2">
          Download Result File
        </Button>
      )}
    </Container>
  );
}

export default InferencePage;
