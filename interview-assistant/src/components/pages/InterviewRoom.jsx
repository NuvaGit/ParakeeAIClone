import React from 'react';
import Navbar from "../layout/Navbar";
import InterviewButton from "../interview/InterviewButton";
import "/src/assets/css/interview-room.css";
import "/src/assets/css/interview-modal.css";

const InterviewRoom = () => {
  return (
    <div className="interview-room-container">
      <Navbar />
      
      <div className="interview-room-content">
        <div className="interview-room-header animate-fade-in">
          <h2 className="interview-room-title">Interview Practice</h2>
          <p className="interview-room-subtitle">
            Create a new interview session to practice or use the assistant during real interviews.
          </p>
          
          <InterviewButton />
          
          <div className="interview-room-instructions">
            <h3>
              <i className="fas fa-info-circle me-2"></i>
              How the Interview Assistant works:
            </h3>
            <div className="instruction-grid">
              <div className="instruction-item">
                <div className="instruction-icon">
                  <i className="fas fa-microphone"></i>
                </div>
                <p>The assistant listens to the interviewer's questions in real-time</p>
              </div>
              
              <div className="instruction-item">
                <div className="instruction-icon">
                  <i className="fas fa-robot"></i>
                </div>
                <p>AI analyzes questions and generates tailored response suggestions</p>
              </div>
              
              <div className="instruction-item">
                <div className="instruction-icon">
                  <i className="fas fa-edit"></i>
                </div>
                <p>You can edit suggestions before responding to the interviewer</p>
              </div>
              
              <div className="instruction-item">
                <div className="instruction-icon">
                  <i className="fas fa-external-link-alt"></i>
                </div>
                <p>The floating mode allows use with video conferencing apps</p>
              </div>
            </div>
          </div>
          
          <div className="session-types-section mt-5">
            <h3 className="mb-4">Available Session Types</h3>
            
            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <div className="session-icon me-3 bg-primary-50 text-primary-700 p-3 rounded-circle">
                        <i className="fas fa-stopwatch fa-lg"></i>
                      </div>
                      <h4 className="card-title mb-0">Trial Session</h4>
                    </div>
                    <ul className="list-unstyled mb-4">
                      <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i> 10-minute free interview session</li>
                      <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i> AI response generation</li>
                      <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i> Real-time transcription</li>
                      <li className="mb-2 text-muted"><i className="fas fa-times-circle text-muted me-2"></i> Limited to basic questions</li>
                    </ul>
                    <p className="text-muted small mb-0">Perfect for testing the assistant with sample questions</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <div className="session-icon me-3 bg-secondary-50 text-secondary-700 p-3 rounded-circle">
                        <i className="fas fa-user-tie fa-lg"></i>
                      </div>
                      <h4 className="card-title mb-0">Full Interview</h4>
                    </div>
                    <ul className="list-unstyled mb-4">
                      <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i> Unlimited interview time</li>
                      <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i> Advanced AI responses</li>
                      <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i> Resume-based personalization</li>
                      <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i> Interview recording & analysis</li>
                    </ul>
                    <p className="text-muted small mb-0">Ideal for complete interview preparation sessions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewRoom;