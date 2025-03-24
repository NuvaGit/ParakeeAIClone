import React, { createContext, useState, useEffect, useRef } from 'react';

export const TranscriptionContext = createContext();

export const TranscriptionProvider = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [transcriptionHistory, setTranscriptionHistory] = useState([]);
  const [error, setError] = useState('');
  
  const recognitionRef = useRef(null);
  
  useEffect(() => {
    // Check if browser supports Speech Recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }
    
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';
    
    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };
    
    recognitionRef.current.onend = () => {
      // Auto restart if still in listening mode
      if (isListening) {
        recognitionRef.current.start();
      }
    };
    
    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };
    
    recognitionRef.current.onresult = (event) => {
      let interim = '';
      let final = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript + ' ';
        } else {
          interim += transcript;
        }
      }
      
      setInterimTranscript(interim);
      
      if (final) {
        setTranscript(prev => {
          const newTranscript = prev + final;
          
          // Add to history if we detect a question (ends with '?')
          const sentences = final.split(/(?<=[.?!])\s+/);
          for (const sentence of sentences) {
            if (sentence.trim().endsWith('?')) {
              const timestamp = new Date().toISOString();
              setTranscriptionHistory(prev => [
                ...prev, 
                { 
                  id: `${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
                  text: sentence.trim(),
                  type: 'question',
                  timestamp
                }
              ]);
            }
          }
          
          return newTranscript;
        });
      }
    };
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);
  
  const startListening = () => {
    setTranscript('');
    setInterimTranscript('');
    setError('');
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Error starting recognition', err);
      }
    }
  };
  
  const stopListening = () => {
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };
  
  const addAIResponse = (questionId, responseText) => {
    const timestamp = new Date().toISOString();
    setTranscriptionHistory(prev => [
      ...prev,
      {
        id: `response-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
        questionId,
        text: responseText,
        type: 'response',
        timestamp
      }
    ]);
  };
  
  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
  };
  
  const clearHistory = () => {
    setTranscriptionHistory([]);
  };
  
  const value = {
    isListening,
    transcript,
    interimTranscript,
    transcriptionHistory,
    error,
    startListening,
    stopListening,
    clearTranscript,
    clearHistory,
    addAIResponse
  };
  
  return (
    <TranscriptionContext.Provider value={value}>
      {children}
    </TranscriptionContext.Provider>
  );