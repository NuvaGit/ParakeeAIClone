// src/hooks/useSpeechRecognition.js
import { useContext } from 'react';
import { TranscriptionContext } from '../contexts/TranscriptionContext';

const useSpeechRecognition = () => {
  const {
    isListening,
    transcript,
    interimTranscript,
    transcriptionHistory,
    error,
    startListening,
    stopListening,
    clearTranscript,
    clearHistory
  } = useContext(TranscriptionContext);
  
  return {
    isListening,
    transcript,
    interimTranscript,
    transcriptionHistory,
    error,
    startListening,
    stopListening,
    clearTranscript,
    clearHistory
  };
};

export default useSpeechRecognition;