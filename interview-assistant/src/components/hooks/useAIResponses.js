import { useState, useContext, useCallback } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { TranscriptionContext } from '../contexts/TranscriptionContext';
import { generateAIResponse, prepareUserContext, createInterviewPrompt } from '../utils/openai';

const useAIResponses = () => {
  const { userProfile } = useContext(AuthContext);
  const { addAIResponse } = useContext(TranscriptionContext);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentResponse, setCurrentResponse] = useState('');
  
  const generateResponse = useCallback(async (question, questionId, sessionContext = null) => {
    setLoading(true);
    setError(null);
    
    try {
      // Prepare user context from profile
      let userContext = prepareUserContext(userProfile);
      
      // If session context is provided, use it to enhance the context
      if (sessionContext) {
        userContext = {
          ...userContext,
          company: sessionContext.company || userContext.company,
          jobTitle: sessionContext.position || userContext.jobTitle,
          instructions: sessionContext.instructions || '',
          useSimpleLanguage: sessionContext.useSimpleLanguage || false
        };
      }
      
      // Call Firebase function to get AI response
      const response = await generateAIResponse(
        question,
        userContext
      );
      
      // Update state with response
      setCurrentResponse(response.text);
      
      // Add to transcription history
      addAIResponse(questionId, response.text);
      
      return response.text;
    } catch (error) {
      console.error('Error generating response:', error);
      setError(error.message || 'Failed to generate AI response');
      return null;
    } finally {
      setLoading(false);
    }
  }, [userProfile, addAIResponse]);
  
  return {
    generateResponse,
    currentResponse,
    loading,
    error,
    setCurrentResponse
  };
};

export default useAIResponses;