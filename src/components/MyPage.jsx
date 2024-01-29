import React, { useState } from 'react';
import '../styles/MyPage.css'; // 스타일 시트 임포트

function MyPage() {
  const [activeTab, setActiveTab] = useState('edit');

  const getTabClassName = (tabName) => {
    return `tab-button ${activeTab === tabName ? 'active' : ''}`;
  };

  const TabContent = () => {
    switch (activeTab) {
      case 'edit':
        return <div>프로필 수정 컨텐츠</div>;
      case 'history':
        return <div>Result History 컨텐츠</div>;
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
        {/* 탭 컨텐츠 렌더링 */}
        <TabContent />
      </div>
    </div>
  );
}

export default MyPage;
