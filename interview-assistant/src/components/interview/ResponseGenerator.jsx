// src/components/interview/ResponseGenerator.jsx
import React, { useState, useEffect } from 'react';
import { AnimatedButton } from '../ui/AnimatedComponents';
import LoadingSpinner from '../ui/LoadingSpinner';

const ResponseGenerator = ({ currentResponse, setCurrentResponse, loading, compact }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableResponse, setEditableResponse] = useState('');
  
  useEffect(() => {
    setEditableResponse(currentResponse);
  }, [currentResponse]);
  
  const handleSave = () => {
    setCurrentResponse(editableResponse);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditableResponse(currentResponse);
    setIsEditing(false);
  };
  
  // Simulate speech by highlighting words as they would be spoken
  const [highlightedText, setHighlightedText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const simulateSpeech = () => {
    if (!currentResponse || isSpeaking) return;
    
    setIsSpeaking(true);
    setHighlightedText('');
    
    const words = currentResponse.split(' ');
    let wordIndex = 0;
    
    const speakInterval = setInterval(() => {
      if (wordIndex < words.length) {
        setHighlightedText(words.slice(0, wordIndex + 1).join(' '));
        wordIndex++;
      } else {
        clearInterval(speakInterval);
        setIsSpeaking(false);
      }
    }, 200); // adjust speed as needed
    
    return () => clearInterval(speakInterval);
  };
  
  return (
    <div className={`mt-4 ${compact ? 'max-h-48' : ''} overflow-y-auto`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          AI Response
        </h3>
        <div className="flex space-x-2">
          {currentResponse && !isEditing && (
            <AnimatedButton
              onClick={simulateSpeech}
              disabled={isSpeaking}
              variant="ghost"
              size="sm"
              className="bg-purple-50 text-purple-700 hover:bg-purple-100"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m5.657-9.9a9 9 0 010 12.728M4.93 19.07L7.364 16.636m5.657-9.9 2.828-2.828" />
              </svg>
              {isSpeaking ? 'Speaking...' : 'Speak'}
            </AnimatedButton>
          )}
          {currentResponse && !isEditing && (
            <AnimatedButton
              onClick={() => setIsEditing(true)}
              variant="ghost"
              size="sm"
              className="bg-blue-50 text-blue-700 hover:bg-blue-100"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit
            </AnimatedButton>
          )}
          {currentResponse && isEditing && (
            <>
              <AnimatedButton
                onClick={handleSave}
                variant="ghost"
                size="sm"
                className="bg-green-50 text-green-700 hover:bg-green-100"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Save
              </AnimatedButton>
              <AnimatedButton
                onClick={handleCancel}
                variant="ghost"
                size="sm"
                className="bg-red-50 text-red-700 hover:bg-red-100"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </AnimatedButton>
            </>
          )}
        </div>
      </div>
      
      {loading ? (
        <div className="p-6 bg-gray-50 rounded-lg flex flex-col items-center justify-center border border-gray-200">
          <LoadingSpinner 
            variant="typing" 
            size="md" 
            color="primary" 
            message="Generating AI response..." 
          />
        </div>
      ) : isEditing ? (
        <div className="relative">
          <textarea
            value={editableResponse}
            onChange={(e) => setEditableResponse(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all"
            rows={compact ? 3 : 6}
            placeholder="Edit your response here..."
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
            {editableResponse.length} characters
          </div>
        </div>
      ) : currentResponse ? (
        <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-lg relative overflow-hidden group">
          {isSpeaking ? (
            <p className="relative z-10">
              <span className="font-medium">{highlightedText}</span>
              <span className="text-gray-500">
                {currentResponse.substring(highlightedText.length)}
              </span>
            </p>
          ) : (
            <p className="relative z-10">{currentResponse}</p>
          )}
          
          {/* Subtle gradient background animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-100/40 to-green-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      ) : (
        <div className="p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center">
          <svg className="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p className="text-gray-600">Waiting for interview questions...</p>
          <p className="text-xs mt-2 text-gray-500">AI-generated responses will appear here.</p>
        </div>
      )}
      
      {currentResponse && (
        <div className="mt-2 text-xs text-gray-500 italic">
          <p>This is an AI-generated response. Use the edit button to customize it before speaking.</p>
        </div>
      )}
    </div>
  );
};

export default ResponseGenerator;