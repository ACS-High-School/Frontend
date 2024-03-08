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
  const [downloadFileName, setDownloadFileName] = useState('');
  const [inferenceStatus, setInferenceStatus] = useState(''); // inference 상태 저장
  const [fileError, setFileError] = useState(false); // 파일 확장자 에러 상태

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

        // inferenceResponse에서 output 값을 받아서 저장
        const outputFileName = inferenceResponse.data.output;

        // 상태 업데이트
        setDownloadFileName(outputFileName);

        // inferenceResponse에서 input 값을 받아서 그것을 taskTitle로 사용
        const newTaskTitle = inferenceResponse.data.input;

        // S3에 파일 업로드하기
        const uploadSuccess = await uploadFile(dataFile, 'input', newTaskTitle);

        if (uploadSuccess) {
          console.log('File uploaded successfully');
          setUploadSuccess(true); // 업로드 성공 상태 설정
          setInferenceStatus('processing');
        } else {
          console.error('File upload to S3 failed');
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
    try {
      const response = await api.get('/result', {
        params: { taskTitle }, 
      });
      if (response.data.stats === 'complete') {
        setInferenceStatus('complete');
        clearInterval(statusIntervalRef.current); // useRef를 통해 접근
      }
    } catch (error) {
      console.error('Error checking inference status:', error);
    }
  };

  useEffect(() => {
    if (uploadSuccess) {
      statusIntervalRef.current = setInterval(() => {
        checkInferenceStatus();
      }, 3000); // 3초마다 상태 체크
    }
    return () => clearInterval(statusIntervalRef.current); // 컴포넌트 언마운트 시 인터벌 정리
  }, [uploadSuccess]);

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

  const handleDownload = async () => {
    try {
      const subFolderPath = "output"; // 다운로드할 파일이 위치한 서버 측 폴더 경로

      // 파일 다운로드 요청
      const response = await api.get('/s3/download', {
        params: {
          fileName: downloadFileName, // 서버로부터 받은 파일 이름 사용
          subFolderPath: subFolderPath // 정의된 subFolderPath 사용
        },
        responseType: 'blob', // 중요: 파일 다운로드를 위해 blob 타입으로 설정
      });
  
      // Blob을 이용해 Object URL을 생성합니다.
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // 가상의 <a> 태그를 만들어 파일 다운로드를 수행합니다.
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadFileName; // 서버로부터 받은 파일 이름을 사용
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
