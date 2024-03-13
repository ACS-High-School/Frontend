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
      const inferenceResponse = await api.post('/inference/upload', formData);
      setInferenceId(inferenceResponse.data._id);
  
      const newTaskTitle = inferenceResponse.data.input;
      const uploadSuccess = await uploadFile(dataFile, 'input', newTaskTitle);
  
      if (uploadSuccess) {
        console.log('File uploaded successfully');
        setAlert({ show: true, message: '파일이 성공적으로 업로드 되었습니다.', variant: 'success' });
        setUploadSuccess(true);
        setInferenceStatus('processing');
      }
    } catch (error) {
      setLoading(false); // 로딩 중지
      setSubmitted(true); // 폼 제출 상태 설정
  
      if (error.response && error.response.status === 500) {
        // 서버에서 500 에러를 반환하는 경우
        setAlert({ show: true, message: 'Task Title이 중복됩니다.', variant: 'danger' });
      } else {
        // 기타 다른 에러를 처리하는 경우
        setAlert({ show: true, message: '처리 중 오류가 발생했습니다.', variant: 'danger' });
        console.error('Error during the process:', error);
      }
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

  const handleDownload = async () => {
    // filename과 subFolderPath 값을 가져옵니다.
    const filename = downloadUrl; // 이전에 저장된 다운로드 URL을 filename으로 사용
    console.log(filename);
    const subFolderPath = 'output'; // 고정된 서브 폴더 경로
    
    try {
      // 서버의 다운로드 엔드포인트에 요청을 보냅니다. URL의 일부로 subFolderPath와 filename을 포함합니다.
      const response = await api.get(`/s3/csv_download/${subFolderPath}/${filename}`, {
        responseType: 'blob' // 파일 데이터를 바이너리 형태로 받기 위한 설정
      });
  
      // 브라우저에서 파일을 다운로드하기 위한 URL 생성
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // 생성된 URL을 이용하여 링크 요소를 생성하고 프로그램적으로 클릭 이벤트를 발생시켜 다운로드
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename); // 다운로드 될 파일 이름 설정
      document.body.appendChild(link);
      link.click();
      
      // 사용 후 링크 요소 정리
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url); // 생성된 URL 해제
      
    } catch (error) {
      // 에러 처리
      console.error('Error during file download:', error);
      setAlert({ show: true, message: '파일 다운로드 중 오류가 발생했습니다.', variant: 'danger' });
    }
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
