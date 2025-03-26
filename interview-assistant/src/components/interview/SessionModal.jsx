import React, { useState, useRef, useEffect } from 'react';

const SessionModal = ({ onClose, onCreateSession }) => {
  const [step, setStep] = useState(1);
  const [sessionData, setSessionData] = useState({
    company: '',
    position: '',
    resume: null,
    instructions: '',
    useSimpleLanguage: false,
    hotkey: 'Space'
  });
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);
  
  // Track progress percentage
  const progressPercentage = (step / 3) * 100;
  
  // Animation after modal opens
  useEffect(() => {
    const timer = setTimeout(() => {
      if (modalRef.current) {
        modalRef.current.classList.add('modal-entered');
      }
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSessionData({
      ...sessionData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle file uploads
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setSessionData({
        ...sessionData,
        resume: file
      });
    }
  };
  
  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  // File removal
  const removeFile = (e) => {
    e.stopPropagation();
    setFileName('');
    setSessionData({
      ...sessionData,
      resume: null
    });
    fileInputRef.current.value = '';
  };

  const handleNextStep = () => {
    setStep(prevStep => prevStep + 1);
  };

  const handlePrevStep = () => {
    setStep(prevStep => prevStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateSession(sessionData);
    onClose();
  };
  
  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }
  
  // Get step title
  const getStepTitle = () => {
    switch(step) {
      case 1: return "Job Details";
      case 2: return "Resume & Instructions";
      case 3: return "Final Steps";
      default: return "Interview Setup";
    }
  }
  
  // Get step icon
  const getStepIcon = () => {
    switch(step) {
      case 1: return "fas fa-briefcase";
      case 2: return "fas fa-file-alt";
      case 3: return "fas fa-cog";
      default: return "fas fa-question";
    }
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div 
        ref={modalRef}
        className="modal-content"
      >
        <div className="modal-header">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center mr-3">
              <i className={`${getStepIcon()} text-white`}></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">{getStepTitle()}</h3>
          </div>
          <button 
            onClick={onClose} 
            className="close-button transition-transform hover:rotate-90 duration-300"
            aria-label="Close modal"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-6 py-2 bg-gray-50">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span className={step >= 1 ? "text-primary-color font-medium" : ""}>Job Details</span>
            <span className={step >= 2 ? "text-primary-color font-medium" : ""}>Resume & Instructions</span>
            <span className={step >= 3 ? "text-primary-color font-medium" : ""}>Final Steps</span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-color transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }} 
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Step 1: Company and Position */}
            {step === 1 && (
              <div className="space-y-6 transition-all duration-300 transform fade-in">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <i className="fas fa-info-circle text-blue-400"></i>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Enter the company and position details. This information helps the AI provide targeted interview responses.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="company" className="form-label text-gray-700 font-medium block mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-building text-gray-400"></i>
                    </div>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      className="form-control pl-10 h-12 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary-color transition-all duration-200"
                      placeholder="Microsoft, Google, Amazon..."
                      value={sessionData.company}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    The name of the company you're interviewing with
                  </p>
                </div>
                
                <div className="form-group">
                  <label htmlFor="position" className="form-label text-gray-700 font-medium block mb-2">
                    Job Description <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <i className="fas fa-briefcase text-gray-400"></i>
                    </div>
                    <textarea
                      id="position"
                      name="position"
                      className="form-control pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary-color transition-all duration-200"
                      placeholder="Software Engineer with experience in React, Node.js, AWS..."
                      value={sessionData.position}
                      onChange={handleInputChange}
                      rows={5}
                      required
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Describe the position you're applying for with key skills and requirements
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Resume & Instructions */}
            {step === 2 && (
              <div className="space-y-6 transition-all duration-300 transform fade-in">
                <div className="form-group">
                  <label htmlFor="resume" className="form-label text-gray-700 font-medium block mb-2">
                    Upload Resume (Optional)
                  </label>
                  
                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
                      fileName ? 'border-primary-color bg-primary-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={triggerFileInput}
                  >
                    <input
                      type="file"
                      id="resume"
                      name="resume"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                    />
                    
                    {fileName ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary-color bg-opacity-20 flex items-center justify-center">
                          <i className="fas fa-file-pdf text-primary-color"></i>
                        </div>
                        <div className="flex-1 text-left truncate">
                          <p className="font-medium text-primary-dark">{fileName}</p>
                          <p className="text-xs text-gray-500">Click to change file</p>
                        </div>
                        <button 
                          type="button" 
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                          onClick={removeFile}
                          title="Remove file"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="mx-auto w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                          <i className="fas fa-cloud-upload-alt text-gray-500 text-2xl"></i>
                        </div>
                        <p className="text-gray-700 font-medium">Drag and drop or click to upload</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Upload your resume to help the AI provide more personalized responses
                        </p>
                        <p className="text-xs text-gray-400 mt-3">
                          Supports PDF, DOC, DOCX (max. 5MB)
                        </p>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="instructions" className="form-label text-gray-700 font-medium block mb-2">
                    Special Instructions (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <i className="fas fa-edit text-gray-400"></i>
                    </div>
                    <textarea
                      id="instructions"
                      name="instructions"
                      className="form-control pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary-color transition-all duration-200"
                      placeholder="Focus on leadership examples, emphasize technical skills, etc."
                      value={sessionData.instructions}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Provide any special instructions for the AI when generating responses
                  </p>
                </div>
                
                <div className="form-group bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        id="useSimpleLanguage"
                        name="useSimpleLanguage"
                        checked={sessionData.useSimpleLanguage}
                        onChange={handleInputChange}
                        className="form-check-input h-5 w-5 text-primary-color border-gray-300 rounded focus:ring-primary-color transition duration-200"
                      />
                    </div>
                    <div className="ml-3">
                      <label className="form-check-label text-gray-700 font-medium" htmlFor="useSimpleLanguage">
                        Use Simple Language
                      </label>
                      <p className="mt-1 text-sm text-gray-500">
                        If English is not your first language, enable this option for simpler vocabulary
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Session Settings */}
            {step === 3 && (
              <div className="space-y-6 transition-all duration-300 transform fade-in">
                <div className="form-group">
                  <label htmlFor="hotkey" className="form-label text-gray-700 font-medium block mb-2">
                    AI Response Hotkey
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-keyboard text-gray-400"></i>
                    </div>
                    <select
                      id="hotkey"
                      name="hotkey"
                      value={sessionData.hotkey}
                      onChange={handleInputChange}
                      className="form-select pl-10 h-12 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary-color transition-all duration-200"
                    >
                      <option value="Space">Space Bar</option>
                      <option value="Control">Ctrl Key</option>
                      <option value="Alt">Alt Key</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <i className="fas fa-chevron-down text-gray-400"></i>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Choose which key to press to get AI assistance during your interview
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-5 border border-primary-100">
                  <h4 className="text-lg font-medium text-primary-dark flex items-center mb-4">
                    <i className="fas fa-check-circle text-primary-color mr-2"></i>
                    Interview Session Overview
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="w-8 flex-shrink-0 text-primary-color">
                        <i className="fas fa-building"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Company</p>
                        <p className="font-medium text-gray-800">
                          {sessionData.company || 'Not specified'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 flex-shrink-0 text-primary-color">
                        <i className="fas fa-briefcase"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Position</p>
                        <p className="font-medium text-gray-800">
                          {sessionData.position ? 
                            (sessionData.position.length > 100 
                              ? sessionData.position.substring(0, 100) + '...' 
                              : sessionData.position) 
                            : 'Not specified'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 flex-shrink-0 text-primary-color">
                        <i className="fas fa-file-alt"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Resume</p>
                        <p className="font-medium text-gray-800">
                          {fileName || 'Not uploaded'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 flex-shrink-0 text-primary-color">
                        <i className="fas fa-keyboard"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Hotkey</p>
                        <p className="font-medium text-gray-800 flex items-center">
                          <kbd className="px-2 py-1 bg-white rounded border border-gray-300 shadow-sm text-xs mr-2">
                            {sessionData.hotkey}
                          </kbd>
                          will trigger AI assistance
                        </p>
                      </div>
                    </div>
                    
                    {sessionData.useSimpleLanguage && (
                      <div className="flex items-start">
                        <div className="w-8 flex-shrink-0 text-primary-color">
                          <i className="fas fa-language"></i>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Language Setting</p>
                          <p className="font-medium text-gray-800">
                            Simple language enabled
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            {step > 1 && (
              <button
                type="button"
                className="btn-secondary flex items-center justify-center"
                onClick={handlePrevStep}
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back
              </button>
            )}
            
            {step < 3 ? (
              <button
                type="button"
                className="btn-primary flex items-center justify-center ml-auto"
                onClick={handleNextStep}
              >
                Next
                <i className="fas fa-arrow-right ml-2"></i>
              </button>
            ) : (
              <button
                type="submit"
                className="btn-primary flex items-center justify-center ml-auto"
              >
                <i className="fas fa-play-circle mr-2"></i>
                Start Interview
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Custom CSS for animations and style enhancements */}
      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
          backdrop-filter: blur(4px);
          animation: fadeIn 0.3s ease-out;
        }
        
        .modal-content {
          background-color: white;
          border-radius: 1rem;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          transform: scale(0.95);
          opacity: 0;
          transition: all 0.3s ease-out;
        }
        
        .modal-content.modal-entered {
          transform: scale(1);
          opacity: 1;
        }
        
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 1px solid var(--gray-200);
        }
        
        .modal-body {
          padding: 1.5rem;
          max-height: 60vh;
          overflow-y: auto;
        }
        
        .modal-footer {
          display: flex;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-top: 1px solid var(--gray-200);
          background-color: var(--gray-50);
        }
        
        .form-control:focus, .form-select:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(94, 96, 206, 0.1);
        }
        
        .btn-primary {
          background-color: var(--primary-color);
          color: white;
          border-radius: 0.5rem;
          padding: 0.75rem 1.5rem;
          font-weight: 500;
          transition: all 0.2s;
          border: none;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .btn-primary:hover {
          background-color: var(--primary-dark);
          transform: translateY(-1px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        
        .btn-secondary {
          background-color: white;
          color: var(--gray-700);
          border: 1px solid var(--gray-300);
          border-radius: 0.5rem;
          padding: 0.75rem 1.5rem;
          font-weight: 500;
          transition: all 0.2s;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        
        .btn-secondary:hover {
          background-color: var(--gray-50);
          color: var(--gray-900);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SessionModal;