import React, { useState, useEffect } from 'react';
import styles from '../styles/MyPage.css'; // 스타일 시트 임포트

import { Button, Table, Form, Nav, Tab, Pagination } from 'react-bootstrap';
import api from '../api/api'; // API 호출을 위한 axios 인스턴스 또는 유사한 것
import { authService } from './authService';

function MyPage() {
  const [activeTab, setActiveTab] = useState('edit');
  const [inferenceData, setInferenceData] = useState([]);
  const [flData, setFlData] = useState([]); // FL 데이터를 위한 상태 추가
  const [userData, setUserData] = useState({});
  const [currentPageInference, setCurrentPageInference] = useState(1);
  const [currentPageFL, setCurrentPageFL] = useState(1);
  const dataPerPage = 5;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab'); // 'tab' 쿼리 파라미터의 값을 가져옵니다.
    // 유효한 탭 값이 있는 경우, 해당 탭을 활성화합니다.
    if (tab && ['edit', 'inference-history', 'fl-history'].includes(tab)) {
        setActiveTab(tab);
    }
    // Result History 탭이 활성화될 때 데이터를 불러옵니다.
    if (activeTab === 'inference-history') {
      const fetchData = async () => {
        try {
          const response = await api.get('/inference/results');
          setInferenceData(response.data); // 데이터를 상태에 저장합니다.
        } catch (error) {
          console.error('Error fetching inference data:', error);
        }
      };
      fetchData();
    }
    // FL History 탭이 활성화될 때 데이터를 불러옵니다.
    if (activeTab === 'fl-history') {
        const fetchFlData = async () => {
          try {
            const response = await api.get('/fl/results'); // 예시 엔드포인트
            setFlData(response.data); // 데이터를 상태에 저장합니다.
          } catch (error) {
            console.error('Error fetching FL data:', error);
          }
        };
  
        fetchFlData();
      }
  }, [activeTab]); // activeTab이 변경될 때마다 실행됩니다.

  useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await api.get('/user');
          setUserData(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
  
      fetchUserData();
    }, []);

    // 페이징을 위한 페이지 번호 컴포넌트 생성 함수
    const PaginationNumbers = ({ total, current, onPageChange }) => {
      let items = [];
      for (let number = 1; number <= Math.ceil(total / dataPerPage); number++) {
        items.push(
          <div className="pagination-wrapper">
            <Pagination.Item key={number} active={number === current} onClick={() => onPageChange(number)}>
              {number}
            </Pagination.Item>,
          </div>
        );
      }
      return (
        <div className="pagination-wrapper"> {/* 여기에 클래스를 적용합니다 */}
          <Pagination>{items}</Pagination>
        </div>
      );
    };
  

  
  const getTabClassName = (tabName) => {
    return `tab-button ${activeTab === tabName ? 'active' : ''}`;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
  };

  const UserProfile = ({ isLoading, setUserData }) => {
    const [form, setForm] = useState({
      username: '',
      company: '',
      newPassword: '',
      confirmPassword: '',
    });

    const handleUpdate = async (field, newValue) => {
      try {
        // 적절한 엔드포인트에 PUT 요청을 보냅니다.
        const endpoint = `/user/${field}`; // 예: /user/name, /user/company, /user/nickname
        const response = await api.put(endpoint, newValue);
  
        // 응답이 성공적이면, 사용자 상태를 업데이트합니다.
        if (response.status === 200) {
          alert(`${field} 정보가 성공적으로 업데이트되었습니다.`);
        }
      } catch (error) {
        console.error(`${field} 정보 업데이트에 실패했습니다.`, error);
      }
    };
  
    const handleSubmit = (field, e) => {
      e.preventDefault();
      const newValue = form[field]; // form 상태에서 새 값을 가져옵니다.
      handleUpdate(field, newValue);
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    const handlePasswordChange = async (e) => {
      e.preventDefault();
  
      try {
        // authService를 사용하여 비밀번호 변경 로직을 추가하세요.
        await authService.updatePassword(form.oldPassword, form.newPassword);
        alert('비밀번호가 성공적으로 변경되었습니다!');
        window.location.reload(); // 페이지 리로드
        console.log('비밀번호가 성공적으로 변경되었습니다.');

        // 비밀번호 변경 성공 후 필요한 작업 수행
      } catch (error) {
        console.error('비밀번호 변경 오류:', error);

            // LimitExceededException 에러일 경우에만 alert 띄우기
        if (error.name === 'LimitExceededException' || error.message.includes('LimitExceededException')) {
          alert('비밀번호 변경 시도 횟수가 초과되었습니다. \n잠시 후 다시 시도해주세요.');
        }

        if (error.name === 'NotAuthorizedException' || error.message.includes('NotAuthorizedException')) {
          alert('이전 비밀번호를 잘못 입력하셨습니다!');
        }
        
        if (error.name === 'InvalidPasswordException' || error.message.includes('InvalidPasswordException')) {
          alert('새로운 비밀번호를 잘못 입력하셨습니다! \n대문자, 특수문자 1개 이상, 8 자리 이상 입력이 필요합니다!');
        }
        // 비밀번호 변경 실패 시 필요한 작업 수행
      }
    };
  
  
    return (
      <div className={styles.profileContainer} style={{ marginTop: '20px' }}>
        <Form>
          <Form.Group className="mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Form.Label style={{ width: '20%' }}>이메일</Form.Label>
            <Form.Control
              type="text"
              readOnly
              defaultValue={userData?.email}
              style={{ flex: 1, marginRight: '10px' }}
            />
          </Form.Group>

          <Form.Group className="mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Form.Label style={{ width: '20%' }}>닉네임</Form.Label>
            <Form.Control
              type="text"
              readOnly
              defaultValue={userData?.username}
              style={{ flex: 1, marginRight: '10px' }}
            />
          </Form.Group>

          <Form.Group className="mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Form.Label style={{ width: '20%' }}>소속 회사</Form.Label>
            <Form.Control
              type="text"
              name="company"
              defaultValue={userData?.company}
              onChange={handleChange}
              style={{ flex: 1, marginRight: '10px' }}
            />
            <Button variant="primary" onClick={(e) => handleSubmit('company', e)} style={{ width: '20%' }}>수정</Button>
          </Form.Group>
        </Form>

        <Form onSubmit={handlePasswordChange}>
          <Form.Group className="mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Form.Label style={{ width: '20%' }}>이전 비밀번호</Form.Label>
            <Form.Control
              type="password"
              name="oldPassword"
              value={form.oldPassword}
              onChange={handleChange}
              required
              style={{ flex: 1, marginRight: '10px' }}
            />
          </Form.Group>
          <Form.Group className="mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Form.Label style={{ width: '20%' }}>새 비밀번호</Form.Label>
            <Form.Control
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              required
              style={{ flex: 1, marginRight: '10px' }}
            />
            <Button type="submit" variant="primary" style={{ width: '20%' }}>비밀번호 변경</Button>
          </Form.Group>
        </Form>
      </div>
    );
  };
  
  // 인퍼런스 데이터를 표로 렌더링하는 컴포넌트
  const InferenceTable = () => {

    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };
    // 현재 페이지에 표시할 데이터 계산
    const currentData = inferenceData.slice((currentPageInference - 1) * dataPerPage, currentPageInference * dataPerPage);

    return (
      <>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Model</th>
              <th>Date</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((inference, index) => (
              <tr key={index}>
                <td>{inference.title}</td>
                <td>{inference.model}</td>
                <td>{formatDate(inference.date)}</td>
                <td>
                  <Button 
                    variant="primary" 
                    disabled={inference.stats !== 'complete'} // 'complete'가 아니면 버튼을 비활성화합니다.
                    onClick={() => handleDownload(inference.result, 'inference', 'output')}
                  >
                    Download
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <PaginationNumbers total={inferenceData.length} current={currentPageInference} onPageChange={setCurrentPageInference} />
      </>
    );
  };

  // FL 데이터를 표로 렌더링하는 컴포넌트
  const FlTable = () => {

    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // 현재 페이지에 표시할 데이터 계산
    const currentData = flData.slice((currentPageFL - 1) * dataPerPage, currentPageFL * dataPerPage);

    return (
      <>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>TaskName</th>
              <th>Description</th>
              <th>Date</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((flItem, index) => (
              <tr key={index}>
                <td>{flItem.taskName}</td>
                <td>{flItem.description}</td>
                <td>{formatDate(flItem.date)}</td>
                <td>
                <Button
                  variant="primary"
                  disabled={flItem.status !== 'complete'} // 'complete'가 아니면 버튼을 비활성화합니다.
                  // FlTable 컴포넌트 내에서 handleDownload 호출
                  onClick={() => handleDownload(flItem.result, 'fedlearn', 'output')}
                >
                  Download
                </Button>
              </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <PaginationNumbers total={flData.length} current={currentPageFL} onPageChange={setCurrentPageFL} />
      </>
    );
  };


  const handleDownload = async (result, intermediateFolderPath, subFolderPath ) => {
  if (result) {
    const filename = result; // 파일 이름 설정

    try {
      // 다운로드를 위해 서버에 요청
      const response = await api.get(`/s3/csv_download/${intermediateFolderPath}/${subFolderPath}/${filename}`, {
        responseType: 'blob' // 파일 데이터를 바이너리 형태로 받음
      });

      // 브라우저에서 파일 다운로드를 위한 URL 생성
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename.split('/').pop()); // 파일 이름 설정
      document.body.appendChild(link);
      link.click();

      // 정리
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error during file download:', error);
    }
  }
};
  
  // 탭 컨텐츠를 결정하는 컴포넌트
  const TabContent = () => {
    switch (activeTab) {
      case 'edit':
        return <UserProfile />; 
      case 'inference-history':
        return <InferenceTable />; // 인퍼런스 테이블을 렌더링합니다.
      case 'fl-history':
        return <FlTable />; // FL 테이블을 렌더링합니다.
      default:
        return null;
    }
  };

  return (
    <div>
    <Nav variant="underline" defaultActiveKey="/edit" style={{ marginTop: '10px' }}>
      <Nav.Item>
        <Nav.Link eventKey="edit" onClick={() => setActiveTab('edit')}>
          프로필 수정
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="history" onClick={() => setActiveTab('inference-history')}>
          Inference History
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="monitoring" onClick={() => setActiveTab('fl-history')}>
          FL History
        </Nav.Link>
      </Nav.Item>
    </Nav>
    <Tab.Content className="tab-content">
      <TabContent />
    </Tab.Content>
  </div>
  );
}

export default MyPage;
