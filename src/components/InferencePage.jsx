import React, { useState, useEffect, useRef } from 'react';
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
  const [inferenceStatus, setInferenceStatus] = useState(''); // inference 상태 저장
  const [fileError, setFileError] = useState(false); // 파일 확장자 에러 상태
  const [downloadUrl, setDownloadUrl] = useState(''); // 다운로드 URL 상태 추가
  const [inferenceId, setInferenceId] = useState(null); // 인퍼런스 ID 상태 추가
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  const statusIntervalRef = useRef();

  const handleTaskTitleChange = (event) => {
    setTaskTitle(event.target.value);
  };

  const handleModelChange = (event) => {
    setModel(event.target.value);
  };

  const handleDataFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.csv')) {
      setDataFile(file);
      setFileError(false); // 올바른 파일 확장자
    } else {
      setDataFile(null);
      setFileError(true); // 잘못된 파일 확장자
    }
  };


  const handleSubmit = async () => {
    setLoading(true); // 로딩 시작
    const formData = new FormData();
    formData.append('model', model);
    formData.append('taskTitle', taskTitle); // 여기서 초기 taskTitle을 전송

    try {
      // /inference/upload 요청 보내기
      const inferenceResponse = await api.post('/inference/upload', formData);

      if (inferenceResponse.status === 200 && dataFile) {
        setInferenceId(inferenceResponse.data._id);

        const newTaskTitle = inferenceResponse.data.input;
        // S3에 파일 업로드하기
        const uploadSuccess = await uploadFile(dataFile, 'input', newTaskTitle);

        if (uploadSuccess) {
          console.log('File uploaded successfully');
          setAlert({ show: true, message: '파일이 성공적으로 업로드 되었습니다.', variant: 'success' });
          setUploadSuccess(true); // 업로드 성공 상태 설정
          setInferenceStatus('processing');
        } else {
          console.error('File upload to S3 failed');
          setAlert({ show: true, message: '처리 중 오류가 발생했습니다.', variant: 'danger' });
        }
      }
    } catch (error) {
      console.error('Error during the process:', error);
    } finally {
      setLoading(false); // 로딩 중지
      setSubmitted(true); // 폼 제출 상태 설정
    }
  };

  const checkInferenceStatus = async () => {
    if (inferenceId) { // inferenceId가 있는 경우에만 상태 체크
      try {
        const response = await api.get(`/inference/result/${inferenceId}`);
        if (response.data.stats === 'complete') {
          setInferenceStatus('complete');
          setDownloadUrl(response.data.result);
          clearInterval(statusIntervalRef.current);
        }
      } catch (error) {
        console.error('인퍼런스 상태 확인 중 오류가 발생했습니다:', error);
      }
    }
  };

  useEffect(() => {
    if (uploadSuccess) {
      statusIntervalRef.current = setInterval(checkInferenceStatus, 3000);
    }
    return () => clearInterval(statusIntervalRef.current);
  }, [uploadSuccess, inferenceId]); // useEffect의 의존성 배열에 inferenceId 추가

  const handleDownload = () => {
    window.location.href = downloadUrl; // 설정된 URL에서 파일 다운로드
  };


  // uploadFile 함수 수정
  const uploadFile = async (file, subFolderPath, taskTitle) => {
    const formData = new FormData();
    formData.append('taskTitle', taskTitle); // 수정된 taskTitle 사용
    formData.append('multipartFiles', file);
    formData.append('subFolderPath', subFolderPath);

    try {
      const response = await api.post('/s3/upload', formData);
      return response.status === 200;
    } catch (error) {
      console.error('Error during file upload:', error);
      return false;
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
              <option value="modelv1">modelv1</option>
              <option value="modelv2">modelv2</option>
              <option value="modelv3">modelv3</option>
              <option value="modelv4">modelv4</option>
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
            {fileError && <Alert variant="danger" className="mt-2">파일은 .csv 확장자여야 합니다.</Alert>}
          </Col>
        </Form.Group>

        {alert.show && (
        <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
          {alert.message}
        </Alert>
        )}

        <Button variant="primary" onClick={handleSubmit} disabled={!model || !taskTitle || !dataFile || fileError} className="mb-4">
          Send
        </Button>
      </Form>

      {inferenceStatus === 'processing' && <div className="text-center"><BootstrapSpinner animation="border" /></div>}
      {inferenceStatus === 'complete' && (
        <>
          <Alert variant="success" className="mt-3">
            파일 처리가 완료되었습니다. 결과를 다운로드하세요.
          </Alert>
          <Button variant="success" onClick={handleDownload} className="mt-2">
            Download Result File
          </Button>
        </>
      )}
    </Container>
  );
}

export default InferencePage;
