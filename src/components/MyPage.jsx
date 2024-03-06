import React, { useState, useEffect } from 'react';
import styles from '../styles/MyPage.css'; // 스타일 시트 임포트
import api from '../api/api'; // API 호출을 위한 axios 인스턴스 또는 유사한 것

function MyPage() {
  const [activeTab, setActiveTab] = useState('edit');
  const [inferenceData, setInferenceData] = useState([]);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    // Result History 탭이 활성화될 때 데이터를 불러옵니다.
    if (activeTab === 'history') {
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

  
  const getTabClassName = (tabName) => {
    return `tab-button ${activeTab === tabName ? 'active' : ''}`;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
  };

  const UserProfile = ({ isLoading, setUserData }) => {
    const [form, setForm] = useState({
      name: '',
      nickname: '',
      company: '',
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
  
  
    return (
      <div className={styles.profileContainer}>
        <table>
          <tbody>
            <tr>
              <th>이메일</th>
              <td>{userData?.email}</td>
              <td></td>
            </tr>
            <tr>
              <th>닉네임</th>
              <td><input type="text" name="nickname" defaultValue={userData?.nickname} onChange={handleChange}/></td>
              <td>
                <button onClick={(e) => handleSubmit('nickname', e)}>수정</button>
              </td>
            </tr>
            <tr>
              <th>소속 회사</th>
              <td><input type="text" name="company" defaultValue={userData?.company} onChange={handleChange} /></td>
              <td>
                <button onClick={(e) => handleSubmit('company', e)}>수정</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  
  
  // 인퍼런스 데이터를 표로 렌더링하는 컴포넌트
  const InferenceTable = () => {
    return (
      <table className='table'>
        <thead>
          <tr> 
            <th>Title</th>
            <th>Model</th>
            <th>Date</th>
            <th>Result</th>
            {/* 기타 필요한 테이블 헤더 */}
          </tr>
        </thead>
        <tbody>
          {inferenceData.map((inference) => (
            <tr key={inference._id}>
              <td>{inference.title}</td>
              <td>{inference.model}</td>
              <td>{formatDate(inference.date)}</td>
              <td>{inference.result}</td>
              {/* 기타 필요한 테이블 데이터 셀 */}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 탭 컨텐츠를 결정하는 컴포넌트
  const TabContent = () => {
    switch (activeTab) {
      case 'edit':
        return <UserProfile />; 
      case 'history':
        return <InferenceTable />; // 인퍼런스 테이블을 렌더링합니다.
      case 'monitoring':
        return <div>Model Monitoring 컨텐츠</div>;
      default:
        return null;
    }
  };

  return (
    <div>
      <nav className="profile-tabs">
        <button onClick={() => setActiveTab('edit')} className={getTabClassName('edit')}>
          프로필 수정
        </button>
        <button onClick={() => setActiveTab('history')} className={getTabClassName('history')}>
          Result History
        </button>
        <button onClick={() => setActiveTab('monitoring')} className={getTabClassName('monitoring')}>
          Model Monitoring
        </button>
      </nav>
      <div className="tab-content">
        <TabContent />
      </div>
    </div>
  );
}

export default MyPage;
