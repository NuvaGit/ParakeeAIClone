import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from "../layout/Navbar";

const CreateInterview = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
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

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0] || null
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleNextStep = () => {
    setStep(prevStep => prevStep + 1);
  };

  const handlePrevStep = () => {
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
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create New Interview</h2>
          <p className="mt-2 text-gray-600">
            Set up your interview session parameters
          </p>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <div className={`text-sm font-medium ${step >= 1 ? 'text-primary' : 'text-gray-500'}`}>
                  Job Details
                </div>
                <div className={`text-sm font-medium ${step >= 2 ? 'text-primary' : 'text-gray-500'}`}>
                  Resume & Instructions
                </div>
                <div className={`text-sm font-medium ${step >= 3 ? 'text-primary' : 'text-gray-500'}`}>
                  Session Settings
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${(step / 3) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {error && (
              <div className="alert alert-danger mb-4" role="alert">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Step 1: Job Details */}
              {step === 1 && (
                <div className="step-content">
                  <div className="mb-6">
                    <label htmlFor="company" className="form-label">
                      Company Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="e.g., Microsoft, Google, Amazon"
                      required
                    />
                    <small className="form-text text-muted">
                      Enter the name of the company you're interviewing with
                    </small>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="position" className="form-label">
                      Job Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="e.g., Software Engineer with experience in React, Node.js, and AWS"
                      rows={4}
                      required
                    ></textarea>
                    <small className="form-text text-muted">
                      Describe the position you're applying for. The more details, the better the AI responses.
                    </small>
                  </div>
                </div>
              )}
              
              {/* Step 2: Resume & Instructions */}
              {step === 2 && (
                <div className="step-content">
                  <div className="mb-6">
                    <label htmlFor="resumeFile" className="form-label">
                      Upload Resume (Optional)
                    </label>
                    <input
                      type="file"
                      id="resumeFile"
                      name="resumeFile"
                      onChange={handleInputChange}
                      className="form-control"
                      accept=".pdf,.doc,.docx"
                    />
                    <small className="form-text text-muted">
                      Upload your resume to help the AI provide more personalized responses
                    </small>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="instructions" className="form-label">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      id="instructions"
                      name="instructions"
                      value={formData.instructions}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="e.g., Focus on leadership examples, emphasize technical skills, etc."
                      rows={4}
                    ></textarea>
                    <small className="form-text text-muted">
                      Provide any special instructions for the AI when generating responses
                    </small>
                  </div>
                  
                  <div className="form-check mb-6">
                    <input
                      type="checkbox"
                      id="useSimpleLanguage"
                      name="useSimpleLanguage"
                      checked={formData.useSimpleLanguage}
                      onChange={handleInputChange}
                      className="form-check-input"
                    />
                    <label className="form-check-label" htmlFor="useSimpleLanguage">
                      Use Simple Language
                    </label>
                    <div className="mt-1">
                      <small className="form-text text-muted">
                        If English is not your first language, enable this option for simpler vocabulary
                      </small>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 3: Session Settings */}
              {step === 3 && (
                <div className="step-content">
                  <div className="mb-6">
                    <label htmlFor="hotkey" className="form-label">
                      AI Response Hotkey
                    </label>
                    <select
                      id="hotkey"
                      name="hotkey"
                      value={formData.hotkey}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="Space">Space Bar</option>
                      <option value="Control">Ctrl Key</option>
                      <option value="Alt">Alt Key</option>
                    </select>
                    <small className="form-text text-muted">
                      Choose which key to press to get AI assistance during your interview
                    </small>
                  </div>
                  
                  <div className="alert alert-info mb-6">
                    <h4 className="alert-heading">
                      <i className="fas fa-info-circle me-2"></i>
                      Interview Session Overview
                    </h4>
                    <ul className="list-group list-group-flush mt-3">
                      <li className="list-group-item bg-transparent px-0">
                        <i className="fas fa-building text-primary me-2"></i>
                        <strong>Company:</strong> {formData.company}
                      </li>
                      <li className="list-group-item bg-transparent px-0">
                        <i className="fas fa-briefcase text-primary me-2"></i>
                        <strong>Position:</strong> {formData.position}
                      </li>
                      <li className="list-group-item bg-transparent px-0">
                        <i className="fas fa-file-alt text-primary me-2"></i>
                        <strong>Resume:</strong> {formData.resumeFile ? formData.resumeFile.name : 'Not uploaded'}
                      </li>
                      <li className="list-group-item bg-transparent px-0">
                        <i className="fas fa-keyboard text-primary me-2"></i>
                        <strong>Hotkey:</strong> {formData.hotkey}
                      </li>
                    </ul>
                  </div>
                </div>
              )}
              
              <div className="mt-6 d-flex justify-content-between">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="btn btn-outline-secondary"
                    disabled={loading}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Back
                  </button>
                )}
                
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="btn btn-primary ms-auto"
                  >
                    Next
                    <i className="fas fa-arrow-right ms-2"></i>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-primary ms-auto"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-play-circle me-2"></i>
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
    </div>
  );
};

export default CreateInterview;