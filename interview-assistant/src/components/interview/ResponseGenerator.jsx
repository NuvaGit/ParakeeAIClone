import React, { useState, useEffect } from 'react';

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
        <h3 className="text-lg font-medium">AI Response</h3>
        <div className="flex space-x-2">
          {currentResponse && !isEditing && (
            <button
              onClick={simulateSpeech}
              disabled={isSpeaking}
              className="px-2 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 disabled:opacity-50"
            >
              {isSpeaking ? 'Speaking...' : 'Speak'}
            </button>
          )}
          {currentResponse && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Edit
            </button>
          )}
          {currentResponse && isEditing && (
            <>
              <button
                onClick={handleSave}
                className="px-2 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
      
      {loading ? (
        <div className="p-4 bg-gray-50 rounded flex items-center justify-center">
          <div className="animate-pulse flex space-x-2">
            <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
            <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
            <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
          </div>
          <p className="ml-2 text-gray-600">Generating response...</p>
        </div>
      ) : isEditing ? (
        <textarea
          value={editableResponse}
          onChange={(e) => setEditableResponse(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={compact ? 3 : 6}
        />
      ) : currentResponse ? (
        <div className="p-4 bg-green-50 border-l-4 border-green-300 rounded">
          {isSpeaking ? (
            <p>
              <span className="font-medium">{highlightedText}</span>
              <span className="text-gray-400">
                {currentResponse.substring(highlightedText.length)}
              </span>
            </p>
          ) : (
            <p>{currentResponse}</p>
          )}
        </div>
      ) : (
        <div className="p-4 bg-gray-50 rounded text-center text-gray-500">
          <p>Waiting for interview questions...</p>
        </div>
      )}
      
      {currentResponse && (
        <div className="mt-2 text-xs text-gray-500">
          <p>This is an AI-generated response. Use the edit button to customize it before speaking.</p>
        </div>
      )}
    </div>
  );
};

export default ResponseGenerator;