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
  
  const generateResponse = useCallback(async (question, questionId) => {
    setLoading(true);
    setError(null);
    
    try {
      // Prepare user context from profile
      const userContext = prepareUserContext(userProfile);
      
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