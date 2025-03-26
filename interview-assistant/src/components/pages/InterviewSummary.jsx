import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from "../layout/Navbar";
import { generateAIResponse } from '../utils/openai';

const InterviewSummary = () => {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  
  // Fetch interview data
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const docRef = doc(db, 'interviews', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // Check if interview belongs to current user
          if (data.userId !== currentUser?.uid) {
            setError("You don't have permission to access this interview.");
            return;
          }
          
          setInterview({
            id: docSnap.id,
            ...data
          });
          
          // If summary already exists, use it
          if (data.summary) {
            setSummary(data.summary);
          } else {
            // Generate summary automatically
            generateSummary(data);
          }
        } else {
          setError("Interview not found.");
        }
      } catch (err) {
        console.error("Error fetching interview:", err);
        setError("Failed to load interview. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchInterview();
    }
  }, [id, currentUser]);

  const generateSummary = async (interviewData) => {
    if (!interviewData.questions || interviewData.questions.length === 0) {
      setError("No questions found to generate summary.");
      return;
    }
    
    setGeneratingSummary(true);
    
    try {
      // Prepare input for the summary generation
      const questions = interviewData.questions.map(q => ({
        question: q.question,
        answer: q.answer
      }));
      
      // Prepare prompt for OpenAI
      const prompt = `
Generate a comprehensive summary of the following job interview for ${interviewData.company} (position: ${interviewData.position || 'Not specified'}).

The interview consisted of the following ${questions.length} questions and answers:

${questions.map((q, i) => `
Question ${i+1}: ${q.question}
Answer: ${q.answer}
`).join('\n')}

Please analyze this interview and provide:
1. A summary of the main topics covered
2. Strengths demonstrated in the responses
3. Areas that could be improved
4. Overall effectiveness of the responses
5. Suggestions for the candidate's next interview

Format the response in clear sections with headings.
`;
      
      // Call OpenAI to generate summary
      const response = await generateAIResponse(prompt, {});
      
      // Save the summary
      const summaryText = response.text;
      setSummary(summaryText);
      
      // Save summary to Firestore
      await updateDoc(doc(db, 'interviews', id), {
        summary: summaryText
      });
      
    } catch (err) {
      console.error("Error generating summary:", err);
      setError("Failed to generate summary. Please try again.");
    } finally {
      setGeneratingSummary(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  const handleRegenerateSummary = () => {
    if (interview) {
      generateSummary(interview);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading interview data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="alert alert-danger" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </div>
          <div className="text-center mt-4">
            <button
              onClick={() => navigate(`/interview-review/${id}`)}
              className="btn btn-primary"
            >
              Back to Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Link to={`/interview-review/${id}`} className="btn btn-sm btn-outline-secondary mb-3">
                <i className="fas fa-arrow-left me-2"></i>
                Back to Interview
              </Link>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">
                {interview?.company} Interview Summary
              </h2>
              <p className="text-gray-600">
                {interview?.position}
              </p>
            </div>
            <div>
              <button
                onClick={handleRegenerateSummary}
                className="btn btn-outline-primary"
                disabled={generatingSummary}
              >
                {generatingSummary ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Generating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sync-alt me-2"></i>
                    Regenerate
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="d-flex flex-wrap gap-3 mt-4">
            <div className="badge bg-light text-dark border">
              <i className="fas fa-calendar-alt me-2 text-primary"></i>
              {interview?.createdAt ? formatDate(interview.createdAt) : 'Unknown date'}
            </div>
            <div className="badge bg-light text-dark border">
              <i className="fas fa-question-circle me-2 text-primary"></i>
              {interview?.questions?.length || 0} questions
            </div>
          </div>
        </div>
        
        <div className="card shadow-lg">
          <div className="card-body p-6">
            <h3 className="text-xl font-semibold mb-4">Interview Analysis</h3>
            
            {generatingSummary ? (
              <div className="text-center py-8">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h4 className="text-lg font-medium text-gray-600">Generating Summary</h4>
                <p className="text-gray-500">
                  Please wait while we analyze your interview responses...
                </p>
              </div>
            ) : !summary ? (
              <div className="text-center py-8">
                <i className="fas fa-file-alt fa-3x text-gray-300 mb-3"></i>
                <h4 className="text-lg font-medium text-gray-600">No summary available</h4>
                <p className="text-gray-500 mb-4">
                  There isn't a summary for this interview yet.
                </p>
                <button
                  onClick={handleRegenerateSummary}
                  className="btn btn-primary"
                  disabled={!interview?.questions?.length}
                >
                  Generate Summary
                </button>
              </div>
            ) : (
              <div className="summary-content">
                <div className="whitespace-pre-line">
                  {summary}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center mt-6">
          <Link
            to="/interviews"
            className="btn btn-primary"
          >
            Back to All Interviews
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InterviewSummary;