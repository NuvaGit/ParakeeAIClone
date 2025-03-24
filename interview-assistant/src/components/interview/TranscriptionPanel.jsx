import React, { useRef, useEffect } from 'react';
import { GradientText } from '../ui/AnimatedComponents';

const TranscriptionPanel = ({ transcript, interimTranscript, isListening, history, compact }) => {
  const historyEndRef = useRef(null);
  
  // Auto-scroll to bottom when new content is added
  useEffect(() => {
    if (historyEndRef.current) {
      historyEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, transcript, interimTranscript]);
  
  return (
    <div className={`mb-4 ${compact ? 'max-h-32' : 'max-h-60'} overflow-y-auto`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
          </svg>
          Transcription
        </h3>
        {isListening && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 animate-pulse">
            <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
            Listening
          </span>
        )}
      </div>
      
      {history.length > 0 && (
        <div className="mb-4 space-y-2">
          {history.map((item) => (
            <div 
              key={item.id} 
              className={`p-3 rounded-lg transition-all transform animate-fade-in ${
                item.type === 'question' 
                  ? 'bg-blue-50 border-l-4 border-blue-300' 
                  : 'bg-green-50 border-l-4 border-green-300'
              }`}
            >
              <div className="text-xs text-gray-500 mb-1 flex justify-between">
                <span className="font-medium">
                  {item.type === 'question' ? 'Interviewer' : 'AI Assistant'}
                </span>
                <span>
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="text-sm">{item.text}</div>
            </div>
          ))}
        </div>
      )}
      
      {(transcript || interimTranscript) && (
        <div className="mb-2">
          <div className="text-sm font-medium text-gray-600 mb-1 flex items-center">
            <svg className="w-4 h-4 mr-1 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7l4-4m0 0l4 4m-4-4v18"></path>
            </svg>
            Live Transcription:
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <span>{transcript}</span>
            {interimTranscript && (
              <span className="text-gray-400">{interimTranscript}</span>
            )}
            {isListening && !interimTranscript && (
              <span className="inline-flex ml-1">
                <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-ping absolute"></span>
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full relative"></span>
              </span>
            )}
          </div>
        </div>
      )}
      
      {!isListening && !transcript && !interimTranscript && history.length === 0 && (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <svg className="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
          </svg>
          <p>Press the microphone button or Alt+S to start listening.</p>
          <p className="text-xs mt-2">Your interview questions will appear here.</p>
        </div>
      )}
      
      <div ref={historyEndRef} />
    </div>
  );
};

export default TranscriptionPanel;