import React, { useState, useEffect, useRef } from 'react';
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import useAIResponses from "../hooks/useAIResponses";   
import TranscriptionPanel from './TranscriptionPanel';
import ResponseGenerator from './ResponseGenerator';

const InterviewAssistant = () => {
  const {
    isListening,
    transcript,
    interimTranscript,
    transcriptionHistory,
    error: transcriptionError,
    startListening,
    stopListening,
    clearTranscript
  } = useSpeechRecognition();
  
  const {
    generateResponse,
    currentResponse,
    loading: responseLoading,
    error: responseError,
    setCurrentResponse
  } = useAIResponses();
  
  const [isFloating, setIsFloating] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const assistantRef = useRef(null);
  
  // Auto-generate response when a new question is detected
  useEffect(() => {
    const latestQuestion = transcriptionHistory.find(item => 
      item.type === 'question' && 
      !transcriptionHistory.some(response => response.questionId === item.id)
    );
    
    if (latestQuestion && !responseLoading) {
      generateResponse(latestQuestion.text, latestQuestion.id);
    }
  }, [transcriptionHistory, generateResponse, responseLoading]);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt+S to toggle speech recognition
      if (e.altKey && e.key === 's') {
        if (isListening) {
          stopListening();
        } else {
          startListening();
        }
      }
      
      // Alt+F to toggle floating mode
      if (e.altKey && e.key === 'f') {
        setIsFloating(prev => !prev);
      }
      
      // Alt+C to clear transcript
      if (e.altKey && e.key === 'c') {
        clearTranscript();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isListening, startListening, stopListening, clearTranscript]);
  
  // Dragging functionality for floating mode
  const handleMouseDown = (e) => {
    if (isFloating && assistantRef.current) {
      setIsDragging(true);
      const rect = assistantRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };
  
  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);
  
  const floatingStyles = isFloating ? {
    position: 'fixed',
    left: `${position.x}px`,
    top: `${position.y}px`,
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  } : {};
  
  return (
    <div 
      ref={assistantRef}
      className={`bg-white rounded-lg ${isFloating ? 'w-96' : 'w-full max-w-5xl mx-auto'}`}
      style={floatingStyles}
      onMouseDown={handleMouseDown}
    >
      <div className="p-4 bg-blue-500 text-white rounded-t-lg flex justify-between items-center cursor-move">
        <h2 className="text-lg font-semibold">Interview Assistant</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setIsFloating(!isFloating)}
            className="p-1 rounded hover:bg-blue-600"
            title={isFloating ? "Dock" : "Float"}
          >
            {isFloating ? "📌" : "🔘"}
          </button>
          <button
            onClick={isListening ? stopListening : startListening}
            className={`p-1 rounded ${isListening ? 'bg-red-500 hover:bg-red-600' : 'hover:bg-blue-600'}`}
            title={isListening ? "Stop Listening" : "Start Listening"}
          >
            {isListening ? "🛑" : "🎤"}
          </button>
        </div>
      </div>
      
      <div className={`p-4 ${isFloating ? 'max-h-96 overflow-y-auto' : ''}`}>
        {(transcriptionError || responseError) && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {transcriptionError || responseError}
          </div>
        )}
        
        <TranscriptionPanel 
          transcript={transcript}
          interimTranscript={interimTranscript}
          isListening={isListening}
          history={transcriptionHistory}
          compact={isFloating}
        />
        
        <ResponseGenerator 
          currentResponse={currentResponse}
          setCurrentResponse={setCurrentResponse}
          loading={responseLoading}
          compact={isFloating}
        />
        
        <div className="mt-4 text-xs text-gray-500">
          <p>Keyboard shortcuts: Alt+S (Toggle Speech), Alt+F (Toggle Float), Alt+C (Clear)</p>
        </div>
      </div>
    </div>
  );
};

export default InterviewAssistant;