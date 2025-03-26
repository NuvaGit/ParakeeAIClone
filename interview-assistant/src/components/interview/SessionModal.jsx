import React, { useState } from 'react';

const SessionModal = ({ onClose, onCreateSession }) => {
  const [step, setStep] = useState(1);
  const [sessionData, setSessionData] = useState({
    company: '',
    position: '',
    resume: null,
    instructions: '',
    useSimpleLanguage: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSessionData({
      ...sessionData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    setSessionData({
      ...sessionData,
      resume: e.target.files[0]
    });
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateSession(sessionData);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h3>
            {step === 1 && "Job Details"}
            {step === 2 && "Upload Resume"}
            {step === 3 && "Additional Instructions"}
          </h3>
          <button onClick={onClose} className="close-button">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Company and Position */}
          {step === 1 && (
            <div className="modal-body">
              <p className="text-muted mb-4">
                Enter the company and position you're interviewing for to help generate relevant responses.
              </p>
              
              <div className="form-group mb-3">
                <label htmlFor="company" className="form-label">Company</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  className="form-control"
                  placeholder="Microsoft..."
                  value={sessionData.company}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group mb-3">
                <label htmlFor="position" className="form-label">Job Description</label>
                <textarea
                  id="position"
                  name="position"
                  className="form-control"
                  placeholder="Software Engineer versed in Python, SQL, and AWS..."
                  value={sessionData.position}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </div>
            </div>
          )}

          {/* Step 2: Resume Upload */}
          {step === 2 && (
            <div className="modal-body">
              <p className="text-muted mb-4">
                Choose a resume to help the AI provide more personalized answers based on your experience.
              </p>
              
              <div className="form-group mb-3">
                <label htmlFor="resume" className="form-label">Upload Resume (Optional)</label>
                <input
                  id="resume"
                  name="resume"
                  type="file"
                  className="form-control"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
                {!sessionData.resume && (
                  <div className="text-muted mt-2">
                    <small>You don't have any resumes yet.</small>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Additional Instructions */}
          {step === 3 && (
            <div className="modal-body">
              <p className="text-muted mb-4">
                Special instructions for the AI when generating answers. You can ask it to be more specific, more technical, use a more casual tone, etc.
              </p>
              
              <div className="form-group mb-3">
                <label htmlFor="instructions" className="form-label">Extra Context/Instructions (Optional)</label>
                <textarea
                  id="instructions"
                  name="instructions"
                  className="form-control"
                  placeholder="Be more technical, use a more casual tone, etc."
                  value={sessionData.instructions}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
              
              <div className="form-check mb-3">
                <input
                  id="useSimpleLanguage"
                  name="useSimpleLanguage"
                  type="checkbox"
                  className="form-check-input"
                  checked={sessionData.useSimpleLanguage}
                  onChange={handleInputChange}
                />
                <label className="form-check-label" htmlFor="useSimpleLanguage">
                  Simple English
                </label>
                <div className="text-muted">
                  <small>If English is not your first language, you can use this option to make sure the AI doesn't use complex words.</small>
                </div>
              </div>
            </div>
          )}

          <div className="modal-footer">
            {step > 1 && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handlePrevStep}
              >
                Back
              </button>
            )}
            
            {step < 3 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNextStep}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary"
              >
                <i className="fas fa-clock me-2"></i>
                Start Session
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SessionModal;