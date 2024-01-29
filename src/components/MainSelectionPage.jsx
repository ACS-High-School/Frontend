import React, { useState } from 'react';
import '../styles/MainSelectionPage.css';


const SelectionPage = () => {
    const [hoverFL, setHoverFL] = useState(false);
  
    return (
      <div className="selection-container">
        <div
          className="inference-section"
          onClick={() => window.location.href = '/inference'} // 이 부분을 당신의 라우팅 로직으로 대체하세요
        >
          Inference
        </div>
        <div
          className={`fl-section ${hoverFL ? 'hover' : ''}`}
          onMouseEnter={() => setHoverFL(true)}
          onMouseLeave={() => setHoverFL(false)}
        >
          <div className={`fl-content ${hoverFL ? 'hover' : ''}`}>
            <span className="fl-logo">FL</span>
            {hoverFL && (
              <>
                <button className="fl-button">버튼1</button>
                <button className="fl-button">버튼2</button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default SelectionPage;