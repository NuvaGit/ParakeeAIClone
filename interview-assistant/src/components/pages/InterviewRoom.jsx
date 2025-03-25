import React, { useState } from 'react';
import Navbar from "../layout/Navbar";
import InterviewAssistant from "../interview/InterviewAssistant";
import "/src/assets/css/interview-room.css";

const InterviewRoom = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className={`interview-room-container ${isFullScreen ? 'interview-room-fullscreen' : ''}`}>
      {!isFullScreen && <Navbar />}
      
      <div className="interview-room-content">
        {!isFullScreen && (
          <div className="interview-room-header animate-fade-in">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="interview-room-title">Interview Room</h2>
                <p className="interview-room-subtitle">
                  Practice with our AI assistant or use it during real interviews.
                </p>
              </div>
              <button
                onClick={toggleFullScreen}
                className="btn btn-primary"
              >
                <i className="fas fa-expand-alt me-2"></i>
                Enter Full Screen
              </button>
            </div>
            
            <div className="interview-room-instructions">
              <h3>
                <i className="fas fa-info-circle me-2"></i>
                How to use the Interview Assistant:
              </h3>
              <div className="instruction-grid">
                <div className="instruction-item">
                  <div className="instruction-icon">
                    <i className="fas fa-microphone"></i>
                  </div>
                  <p>Click the microphone button or press <kbd>Alt</kbd>+<kbd>S</kbd> to start listening</p>
                </div>
                
                <div className="instruction-item">
                  <div className="instruction-icon">
                    <i className="fas fa-robot"></i>
                  </div>
                  <p>The assistant will automatically detect questions and generate responses</p>
                </div>
                
                <div className="instruction-item">
                  <div className="instruction-icon">
                    <i className="fas fa-edit"></i>
                  </div>
                  <p>You can edit the suggested responses before using them</p>
                </div>
                
                <div className="instruction-item">
                  <div className="instruction-icon">
                    <i className="fas fa-external-link-alt"></i>
                  </div>
                  <p>Click "Float" to make the assistant stay on top while using other applications</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="interview-assistant-wrapper">
          <InterviewAssistant />
        </div>
        
        {isFullScreen && (
          <button
            onClick={toggleFullScreen}
            className="exit-fullscreen-btn"
          >
            <i className="fas fa-compress-alt me-2"></i>
            Exit Full Screen
          </button>
        )}
      </div>
    </div>
  );
};

export default InterviewRoom;