// src/components/interview/TranscriptionPanel.jsx
import React, { useRef, useEffect } from 'react';

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
      <h3 className="text-lg font-medium mb-2">Transcription</h3>
      
      {history.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-600 mb-1">Conversation History:</h4>
          <div className="space-y-2">
            {history.map((item) => (
              <div 
                key={item.id} 
                className={`p-2 rounded ${
                  item.type === 'question' 
                    ? 'bg-blue-50 border-l-4 border-blue-300' 
                    : 'bg-green-50 border-l-4 border-green-300'
                }`}
              >
                <div className="text-xs text-gray-500 mb-1">
                  {item.type === 'question' ? 'Interviewer' : 'AI Assistant'} • {
                    new Date(item.timestamp).toLocaleTimeString()
                  }
                </div>
                <div className="text-sm">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {(transcript || interimTranscript) && (
        <div className="mb-2">
          <h4 className="text-sm font-medium text-gray-600 mb-1">Live Transcription:</h4>
          <div className="p-2 bg-gray-50 rounded">
            <span>{transcript}</span>
            {interimTranscript && (
              <span className="text-gray-400">{interimTranscript}</span>
            )}
            {isListening && !interimTranscript && (
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-1 animate-pulse"></span>
            )}
          </div>
        </div>
      )}
      
      {!isListening && !transcript && !interimTranscript && history.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Press the microphone button or Alt+S to start listening.</p>
        </div>
      )}
      
      <div ref={historyEndRef} />
    </div>
  );
};

export default TranscriptionPanel;