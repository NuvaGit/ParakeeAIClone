import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from "../layout/Navbar";

const CreateInterview = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [step, setStep] = useState(1);
  const [fileName, setFileName] = useState('');
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    resumeFile: null,
    instructions: '',
    useSimpleLanguage: false,
    hotkey: 'Space'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFileHovered, setIsFileHovered] = useState(false);

  // Progress percentage
  const progressPercentage = Math.round((step / 3) * 100);

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        setFileName(file.name);
        setFormData({
          ...formData,
          resumeFile: file
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  const removeFile = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setFileName('');
    setFormData({
      ...formData,
      resumeFile: null
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleNextStep = () => {
    window.scrollTo(0, 0);
    setStep(prevStep => prevStep + 1);
  };

  const handlePrevStep = () => {
    window.scrollTo(0, 0);
    setStep(prevStep => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      let resumeUrl = null;
      
      // Upload resume if available
      if (formData.resumeFile) {
        const resumeRef = ref(storage, `resumes/${currentUser.uid}/${Date.now()}_${formData.resumeFile.name}`);
        await uploadBytes(resumeRef, formData.resumeFile);
        resumeUrl = await getDownloadURL(resumeRef);
      }
      
      // Create interview document in Firestore
      const interviewData = {
        userId: currentUser.uid,
        company: formData.company,
        position: formData.position,
        resumeUrl,
        instructions: formData.instructions,
        useSimpleLanguage: formData.useSimpleLanguage,
        hotkey: formData.hotkey,
        createdAt: serverTimestamp(),
        questions: [], // Initialize empty questions array
        status: 'created'
      };
      
      const docRef = await addDoc(collection(db, 'interviews'), interviewData);
      
      // Navigate to interview session page
      navigate(`/interview-session/${docRef.id}`);
      
    } catch (err) {
      console.error("Error creating interview session:", err);
      setError("Failed to create interview session. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header Section */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-block p-2 bg-primary-50 rounded-full mb-3">
            <div className="bg-gradient-to-br from-primary-color to-secondary-color text-white w-16 h-16 rounded-full flex items-center justify-center">
              <i className="fas fa-microphone-alt text-2xl"></i>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Create Your Interview</h2>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Set up your interview parameters to get personalized AI assistance during your practice or real interview.
          </p>
        </div>
        
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden animate-slideInUp">
          <div className="relative h-2 bg-gray-100">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-color to-secondary-color transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          <div className="p-6 sm:p-8">
            {/* Steps indicator */}
            <div className="flex justify-between mb-8">
              <div 
                className={`step-indicator flex flex-col items-center ${step >= 1 ? 'active' : ''}`}
                onClick={() => step > 1 && setStep(1)}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${step >= 1 ? 'bg-primary-color text-white' : 'bg-gray-200 text-gray-500'}`}>
                  <i className="fas fa-building"></i>
                </div>
                <span className={`text-sm font-medium ${step >= 1 ? 'text-primary-color' : 'text-gray-500'}`}>Job Details</span>
              </div>
              
              <div className={`line flex-1 self-start mt-5 mx-4 h-0.5 ${step >= 2 ? 'bg-primary-color' : 'bg-gray-200'}`}></div>
              
              <div 
                className={`step-indicator flex flex-col items-center ${step >= 2 ? 'active' : ''}`}
                onClick={() => step > 2 && setStep(2)}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${step >= 2 ? 'bg-primary-color text-white' : 'bg-gray-200 text-gray-500'}`}>
                  <i className="fas fa-file-alt"></i>
                </div>
                <span className={`text-sm font-medium ${step >= 2 ? 'text-primary-color' : 'text-gray-500'}`}>Resume & Instructions</span>
              </div>
              
              <div className={`line flex-1 self-start mt-5 mx-4 h-0.5 ${step >= 3 ? 'bg-primary-color' : 'bg-gray-200'}`}></div>
              
              <div 
                className={`step-indicator flex flex-col items-center ${step >= 3 ? 'active' : ''}`}
                onClick={() => step > 3 && setStep(3)}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${step >= 3 ? 'bg-primary-color text-white' : 'bg-gray-200 text-gray-500'}`}>
                  <i className="fas fa-cog"></i>
                </div>
                <span className={`text-sm font-medium ${step >= 3 ? 'text-primary-color' : 'text-gray-500'}`}>Final Setup</span>
              </div>
            </div>
            
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-fadeIn">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <i className="fas fa-exclamation-circle text-red-500"></i>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">An error occurred</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Job Details */}
              {step === 1 && (
                <div className="step-content animate-fadeIn">
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-md mb-6">
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
                  
                  <div className="mb-6">
                    <label htmlFor="company" className="form-label text-gray-700 font-medium block mb-2">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-building text-gray-400"></i>
                      </div>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="form-control pl-10 h-12 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary-color transition-all duration-200"
                        placeholder="e.g., Microsoft, Google, Amazon"
                        required
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Enter the name of the company you're interviewing with
                    </p>
                  </div>
                  
                  <div className="mb-6">
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
                        value={formData.position}
                        onChange={handleInputChange}
                        className="form-control pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary-color transition-all duration-200"
                        placeholder="e.g., Software Engineer with experience in React, Node.js, and AWS"
                        rows={5}
                        required
                      ></textarea>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Describe the position you're applying for. The more details, the better the AI responses.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Step 2: Resume & Instructions */}
              {step === 2 && (
                <div className="step-content animate-fadeIn">
                  <div className="mb-6">
                    <label htmlFor="resumeFile" className="form-label text-gray-700 font-medium block mb-2">
                      Upload Resume (Optional)
                    </label>
                    <div 
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
                        isFileHovered ? 'border-primary-color bg-primary-50' : 
                        fileName ? 'border-primary-color bg-primary-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={triggerFileUpload}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsFileHovered(true);
                      }}
                      onDragLeave={() => setIsFileHovered(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsFileHovered(false);
                        if (e.dataTransfer.files.length) {
                          const file = e.dataTransfer.files[0];
                          setFileName(file.name);
                          setFormData({
                            ...formData,
                            resumeFile: file
                          });
                        }
                      }}
                    >
                      <input
                        type="file"
                        id="resumeFile"
                        name="resumeFile"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleInputChange}
                      />
                      
                      {fileName ? (
                        <div className="flex items-center justify-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-primary-color bg-opacity-20 flex items-center justify-center">
                            <i className="fas fa-file-pdf text-primary-color text-lg"></i>
                          </div>
                          <div className="flex-1 text-left truncate">
                            <p className="font-medium text-primary-dark">{fileName}</p>
                            <p className="text-xs text-gray-500">Click to change file • Drag & drop a new file to replace</p>
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
                          <div className="mx-auto w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-3">
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
                    <p className="mt-1 text-sm text-gray-500">
                      Your resume helps the AI understand your background and tailor responses
                    </p>
                  </div>
                  
                  <div className="mb-6">
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
                        value={formData.instructions}
                        onChange={handleInputChange}
                        className="form-control pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary-color transition-all duration-200"
                        placeholder="e.g., Focus on leadership examples, emphasize technical skills, etc."
                        rows={4}
                      ></textarea>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Provide any special instructions for the AI when generating responses
                    </p>
                  </div>
                  
                  <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          id="useSimpleLanguage"
                          name="useSimpleLanguage"
                          checked={formData.useSimpleLanguage}
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
                <div className="step-content animate-fadeIn">
                  <div className="mb-6">
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
                        value={formData.hotkey}
                        onChange={handleInputChange}
                        className="form-select pl-10 h-12 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary-color transition-all duration-200 appearance-none"
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
                  
                  <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-5 border border-primary-100 mb-6">
                    <h4 className="text-lg font-medium text-primary-dark flex items-center mb-4">
                      <i className="fas fa-check-circle text-primary-color mr-2"></i>
                      Interview Session Overview
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="w-8 flex-shrink-0 text-primary-color">
                          <i className="fas fa-building"></i>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Company</p>
                          <p className="font-medium text-gray-800">
                            {formData.company || 'Not specified'}
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
                            {formData.position ? 
                              (formData.position.length > 100 
                                ? formData.position.substring(0, 100) + '...' 
                                : formData.position) 
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
                              {formData.hotkey}
                            </kbd>
                            will trigger AI assistance
                          </p>
                        </div>
                      </div>
                      
                      {formData.useSimpleLanguage && (
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
                  
                  <div className="bg-yellow-50 rounded-lg p-5 border border-yellow-100">
                    <h4 className="text-lg font-medium text-yellow-800 flex items-center mb-3">
                      <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
                      How to Use During Interview
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-200 flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-yellow-800 text-xs font-bold">1</span>
                        </div>
                        <p className="text-yellow-800">Join your interview call or practice session</p>
                      </li>
                      <li className="flex">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-200 flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-yellow-800 text-xs font-bold">2</span>
                        </div>
                        <p className="text-yellow-800">Listen as the interviewer asks questions</p>
                      </li>
                      <li className="flex">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-200 flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-yellow-800 text-xs font-bold">3</span>
                        </div>
                        <p className="text-yellow-800">Press your chosen hotkey to get AI-generated response suggestions</p>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
              
              <div className="mt-8 pt-5 border-t border-gray-200 flex justify-between">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="btn-secondary flex items-center justify-center"
                  >
                    <i className="fas fa-arrow-left mr-2"></i>
                    Back
                  </button>
                )}
                
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="btn-primary flex items-center justify-center ml-auto"
                  >
                    Continue
                    <i className="fas fa-arrow-right ml-2"></i>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn-primary flex items-center justify-center ml-auto"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-play-circle mr-2"></i>
                        Start Interview
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Custom CSS for animations and styling */}
      <style jsx>{`
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
        
        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
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
        
        .form-control:focus, .form-select:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(94, 96, 206, 0.1);
          outline: none;
        }
        
        .step-indicator.active {
          cursor: pointer;
        }
        
        .step-indicator:not(.active) {
          cursor: default;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CreateInterview;