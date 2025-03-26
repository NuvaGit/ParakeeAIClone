import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SessionModal from './SessionModal';

const InterviewButton = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleCreateSession = (sessionData) => {
    // Save session data to context or state
    // Then navigate to the interview room with this data
    navigate('/interview-session', { state: sessionData });
  };

  return (
    <div className="interview-button-container">
      <button 
        className="btn btn-primary btn-lg"
        onClick={() => setShowModal(true)}
      >
        <i className="fas fa-play-circle me-2"></i>
        Go to interview sessions
      </button>
      
      {showModal && (
        <SessionModal 
          onClose={() => setShowModal(false)}
          onCreateSession={handleCreateSession}
        />
      )}
    </div>
  );
};

export default InterviewButton;