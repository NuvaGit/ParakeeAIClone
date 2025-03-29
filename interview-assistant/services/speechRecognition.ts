// services/speechRecognition.ts
import { useCallback, useEffect, useRef, useState } from 'react';

// Define interfaces for better type safety
export interface SpeechRecognitionResult {
  text: string;
  isFinal: boolean;
  speaker: 'user' | 'interviewer';
}

export interface SpeechRecognitionConfig {
  autoResponse?: boolean;
  onTranscriptUpdate?: (text: string, speaker: 'user' | 'interviewer') => void;
  onFinalTranscript?: (text: string, speaker: 'user' | 'interviewer') => void;
}

export function useSpeechRecognition(config: SpeechRecognitionConfig = {}) {
  const { autoResponse = true, onTranscriptUpdate, onFinalTranscript } = config;
  
  // State for managing recording status
  const [isRecording, setIsRecording] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  
  // Refs for speech recognition instances
  const userRecognitionRef = useRef<any>(null);
  const interviewerRecognitionRef = useRef<any>(null);
  const isUserListeningRef = useRef(false);
  const isInterviewerListeningRef = useRef(false);
  
  // Setup speech recognition
  const setupSpeechRecognition = useCallback(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return null;
    
    // Get speech recognition constructor (with browser compatibility)
    const SpeechRecognitionAPI = window.SpeechRecognition || 
                               window.webkitSpeechRecognition || 
                               null;
    
    if (!SpeechRecognitionAPI) {
      setErrorMessage('Speech recognition is not supported in this browser.');
      return null;
    }
    
    try {
      // Configure user's speech recognition
      const userRecognition = new SpeechRecognitionAPI();
      userRecognition.continuous = true;
      userRecognition.interimResults = true;
      userRecognition.lang = 'en-US';
      
      userRecognition.onresult = (event: any) => {
        let currentInterimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
            if (onFinalTranscript) {
              onFinalTranscript(finalTranscript.trim(), 'user');
            }
          } else {
            currentInterimTranscript += event.results[i][0].transcript;
          }
        }
        
        // Update interim transcript
        if (currentInterimTranscript) {
          setInterimTranscript(currentInterimTranscript);
          if (onTranscriptUpdate) {
            onTranscriptUpdate(currentInterimTranscript, 'user');
          }
        }
      };
      
      userRecognition.onerror = (event: any) => {
        console.error('User speech recognition error:', event.error);
        setErrorMessage(`Error with speech recognition: ${event.error}`);
      };
      
      userRecognition.onend = () => {
        if (isUserListeningRef.current) {
          userRecognition.start();
        }
      };
      
      // Configure interviewer's speech recognition
      const interviewerRecognition = new SpeechRecognitionAPI();
      interviewerRecognition.continuous = true;
      interviewerRecognition.interimResults = true;
      interviewerRecognition.lang = 'en-US';
      
      interviewerRecognition.onresult = (event: any) => {
        let currentInterimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
            if (onFinalTranscript) {
              onFinalTranscript(finalTranscript.trim(), 'interviewer');
            }
          } else {
            currentInterimTranscript += event.results[i][0].transcript;
          }
        }
        
        // Update interim transcript
        if (currentInterimTranscript) {
          setInterimTranscript(currentInterimTranscript);
          if (onTranscriptUpdate) {
            onTranscriptUpdate(currentInterimTranscript, 'interviewer');
          }
        }
      };
      
      interviewerRecognition.onerror = (event: any) => {
        console.error('Interviewer speech recognition error:', event.error);
        setErrorMessage(`Error with interviewer recognition: ${event.error}`);
      };
      
      interviewerRecognition.onend = () => {
        if (isInterviewerListeningRef.current) {
          interviewerRecognition.start();
        }
      };
      
      return {
        userRecognition,
        interviewerRecognition
      };
    } catch (error) {
      console.error('Error setting up speech recognition:', error);
      setErrorMessage('Failed to initialize speech recognition');
      return null;
    }
  }, [onTranscriptUpdate, onFinalTranscript]);
  
  // Initialize speech recognition
  useEffect(() => {
    const recognitionInstances = setupSpeechRecognition();
    
    if (recognitionInstances) {
      userRecognitionRef.current = recognitionInstances.userRecognition;
      interviewerRecognitionRef.current = recognitionInstances.interviewerRecognition;
    }
    
    // Cleanup function
    return () => {
      stopRecording();
    };
  }, [setupSpeechRecognition]);
  
  // Start recording function
  const startRecording = useCallback(() => {
    if (!userRecognitionRef.current || !interviewerRecognitionRef.current) {
      setErrorMessage('Speech recognition not initialized');
      return false;
    }
    
    try {
      // Start user recognition
      if (!isUserListeningRef.current) {
        userRecognitionRef.current.start();
        isUserListeningRef.current = true;
      }
      
      // Start interviewer recognition
      if (!isInterviewerListeningRef.current) {
        interviewerRecognitionRef.current.start();
        isInterviewerListeningRef.current = true;
      }
      
      setIsRecording(true);
      setErrorMessage(null);
      return true;
    } catch (error) {
      console.error('Error starting recording:', error);
      setErrorMessage('Failed to start recording');
      return false;
    }
  }, []);
  
  // Stop recording function
  const stopRecording = useCallback(() => {
    try {
      // Stop user recognition
      if (userRecognitionRef.current && isUserListeningRef.current) {
        userRecognitionRef.current.stop();
        isUserListeningRef.current = false;
      }
      
      // Stop interviewer recognition
      if (interviewerRecognitionRef.current && isInterviewerListeningRef.current) {
        interviewerRecognitionRef.current.stop();
        isInterviewerListeningRef.current = false;
      }
      
      setIsRecording(false);
      return true;
    } catch (error) {
      console.error('Error stopping recording:', error);
      return false;
    }
  }, []);
  
  return {
    isRecording,
    errorMessage,
    interimTranscript,
    startRecording,
    stopRecording,
    isSupported: !!window.SpeechRecognition || !!window.webkitSpeechRecognition
  };
}