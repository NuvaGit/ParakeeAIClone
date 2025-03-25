import React, { useState, useEffect, useRef } from 'react';
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import useAIResponses from "../hooks/useAIResponses";
import { Button, Card, Badge, Alert, Tooltip } from '../ui/UIComponents';

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableResponse, setEditableResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [highlightedText, setHighlightedText] = useState('');
  const [showCopyToast, setShowCopyToast] = useState(false);
  
  const assistantRef = useRef(null);
  const textareaRef = useRef(null);
  
  useEffect(() => {
    setEditableResponse(currentResponse);
  }, [currentResponse]);
  
  useEffect(() => {
    const latestQuestion = transcriptionHistory.find(item => 
      item.type === 'question' && 
      !transcriptionHistory.some(response => response.questionId === item.id)
    );
    
    if (latestQuestion && !responseLoading) {
      generateResponse(latestQuestion.text, latestQuestion.id);
    }
  }, [transcriptionHistory, generateResponse, responseLoading]);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === 's') {
        if (isListening) {
          stopListening();
        } else {
          startListening();
        }
      }
      
      if (e.altKey && e.key === 'f') {
        setIsFloating(prev => !prev);
      }
      
      if (e.altKey && e.key === 'c') {
        clearTranscript();
      }
      
      if (e.key === 'Escape' && isEditing) {
        cancelEditing();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isListening, startListening, stopListening, clearTranscript, isEditing]);
  
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);
  
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
  
  // Simulate speech by highlighting words
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
    }, 200);
    
    return () => clearInterval(speakInterval);
  };
  
  const handleSaveEdit = () => {
    setCurrentResponse(editableResponse);
    setIsEditing(false);
  };
  
  const cancelEditing = () => {
    setEditableResponse(currentResponse);
    setIsEditing(false);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentResponse);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 2000);
  };
  
  const floatingStyles = isFloating ? {
    position: 'fixed',
    left: `${position.x}px`,
    top: `${position.y}px`,
    zIndex: 1000,
    width: '400px'
  } : {};
  
  const renderHistoryItem = (item) => {
    const isQuestion = item.type === 'question';
    
    return (
      <div 
        key={item.id} 
        className={`
          p-4 rounded-xl transition-all transform animate-fade-in border
          ${isQuestion 
            ? 'bg-blue-50 border-blue-200' 
            : 'bg-green-50 border-green-200'
          }
        `}
      >
        <div className="flex justify-between items-start mb-2">
          <Badge
            variant={isQuestion ? 'primary' : 'success'}
            size="sm"
            className="font-medium"
          >
            {isQuestion ? 'Interviewer' : 'AI Response'}
          </Badge>
          <span className="text-xs text-zinc-500">
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <p className="text-sm">{item.text}</p>
      </div>
    );
  };
  
  return (
    <Card
      ref={assistantRef}
      variant={isFloating ? 'elevated' : 'default'}
      className={`overflow-hidden ${isDragging ? 'cursor-grabbing' : ''}`}
      style={floatingStyles}
    >
      {/* Header */}
      <div 
        className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 flex justify-between items-center cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center text-white">
          <span className="text-xl font-semibold">Interview Assistant</span>
          {isListening && (
            <span className="flex ml-3 items-center">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="ml-2 text-sm font-medium">Listening</span>
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <Tooltip content={isCollapsed ? "Expand" : "Collapse"} position="bottom">
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-full text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={
                  isCollapsed ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"
                } />
              </svg>
            </button>
          </Tooltip>
          
          <Tooltip content={isFloating ? "Dock" : "Float"} position="bottom">
            <button 
              onClick={() => setIsFloating(!isFloating)}
              className="p-1.5 rounded-full text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              {isFloating ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              )}
            </button>
          </Tooltip>
          
          <Tooltip content={isListening ? "Stop Listening" : "Start Listening"} position="bottom">
            <button
              onClick={isListening ? stopListening : startListening}
              className={`
                p-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/50
                ${isListening ? 'bg-red-500 text-white' : 'text-white hover:bg-white/20'}
              `}
            >
              {isListening ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>
          </Tooltip>
        </div>
      </div>
      
      {/* Body - only shown when not collapsed */}
      {!isCollapsed && (
        <div className="p-5 space-y-6">
          {/* Error messages */}
          {(transcriptionError || responseError) && (
            <Alert
              variant="error"
              dismissible
              onDismiss={() => {
                if (transcriptionError) clearTranscript();
              }}
            >
              {transcriptionError || responseError}
            </Alert>
          )}
          
          {/* Transcript history */}
          {transcriptionHistory.length > 0 && (
            <div className={`space-y-3 overflow-y-auto ${isFloating ? 'max-h-40' : 'max-h-60'}`}>
              {transcriptionHistory.map(renderHistoryItem)}
            </div>
          )}
          
          {/* Live transcription */}
          {(transcript || interimTranscript) && (
            <div className="border border-zinc-200 bg-zinc-50 rounded-xl p-4">
              <div className="text-sm font-medium text-zinc-600 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-1 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                </svg>
                Live Transcription:
              </div>
              <div className="font-medium">
                <span>{transcript}</span>
                {interimTranscript && (
                  <span className="text-zinc-400">{interimTranscript}</span>
                )}
                {isListening && !interimTranscript && (
                  <span className="inline-flex ml-1">
                    <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse"></span>
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Empty state */}
          {!isListening && !transcript && !interimTranscript && transcriptionHistory.length === 0 && (
            <div className="text-center py-12 bg-zinc-50 rounded-xl border border-dashed border-zinc-300">
              <svg className="w-12 h-12 mx-auto text-zinc-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
              </svg>
              <h3 className="text-zinc-700 font-medium mb-1">Start Your Interview</h3>
              <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-4">
                Press the microphone button or use Alt+S to begin recording. Your interview questions will appear here.
              </p>
              <Button
                variant="primary"
                onClick={startListening}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                  </svg>
                }
              >
                Start Listening
              </Button>
            </div>
          )}
          
          {/* AI Response section */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium flex items-center text-zinc-800">
                <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI Response
              </h3>
              
              {currentResponse && !isEditing && (
                <div className="flex space-x-2">
                  <Tooltip content="Copy to clipboard" position="top">
                    <button
                      onClick={copyToClipboard}
                      className="p-1.5 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  </Tooltip>
                  
                  <Tooltip content="Speak response" position="top">
                    <button
                      onClick={simulateSpeech}
                      disabled={isSpeaking}
                      className={`p-1.5 ${isSpeaking ? 'text-primary-500' : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100'} rounded-full transition-colors`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m5.657-9.9a9 9 0 010 12.728M4.93 19.07L7.364 16.636m5.657-9.9 2.828-2.828" />
                      </svg>
                    </button>
                  </Tooltip>
                  
                  <Tooltip content="Edit response" position="top">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </Tooltip>
                </div>
              )}
              
              {currentResponse && isEditing && (
                <div className="flex space-x-2">
                  <Tooltip content="Save changes" position="top">
                    <button
                      onClick={handleSaveEdit}
                      className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </Tooltip>
                  
                  <Tooltip content="Cancel editing" position="top">
                    <button
                      onClick={cancelEditing}
                      className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </Tooltip>
                </div>
              )}
            </div>
            
            {/* Loading state */}
            {responseLoading && (
              <div className="p-6 bg-zinc-50 rounded-xl border border-zinc-200 flex flex-col items-center justify-center">
                <div className="flex space-x-2 justify-center items-center">
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <p className="mt-3 text-sm text-zinc-500">Generating AI response...</p>
              </div>
            )}
            
            {/* Editing state */}
            {isEditing && !responseLoading && (
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={editableResponse}
                  onChange={(e) => setEditableResponse(e.target.value)}
                  className="w-full p-4 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all"
                  rows={isFloating ? 3 : 6}
                  placeholder="Edit your response here..."
                ></textarea>
                <div className="absolute bottom-2 right-2 text-xs text-zinc-400">
                  {editableResponse.length} characters
                </div>
              </div>
            )}
            
            {/* Display response */}
            {currentResponse && !isEditing && !responseLoading && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl relative overflow-hidden group">
                {isSpeaking ? (
                  <p className="relative z-10">
                    <span className="font-medium">{highlightedText}</span>
                    <span className="text-zinc-500">
                      {currentResponse.substring(highlightedText.length)}
                    </span>
                  </p>
                ) : (
                  <p className="relative z-10">{currentResponse}</p>
                )}
                
                {/* Subtle gradient background animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-100/40 to-green-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            )}
            
            {/* Empty state */}
            {!currentResponse && !responseLoading && (
              <div className="p-6 bg-zinc-50 rounded-xl border border-dashed border-zinc-300 text-center">
                <svg className="w-10 h-10 mx-auto text-zinc-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <p className="text-zinc-600">Waiting for interview questions...</p>
                <p className="text-xs mt-2 text-zinc-500">AI-generated responses will appear here.</p>
              </div>
            )}
            
            {/* Copy toast notification */}
            {showCopyToast && (
              <div className="fixed bottom-4 right-4 px-4 py-2 bg-zinc-800 text-white text-sm rounded-lg shadow-lg animate-fade-in">
                Response copied to clipboard
              </div>
            )}
            
            {currentResponse && (
              <div className="mt-2 text-xs text-zinc-500 italic">
                <p>This is an AI-generated response. Use the edit button to customize it before speaking.</p>
              </div>
            )}
          </div>
          
          {/* Footer with shortcuts */}
          <div className="mt-6 pt-4 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500">
            <div className="flex space-x-4">
              <div className="flex items-center">
                <kbd className="px-1.5 py-0.5 bg-zinc-100 border border-zinc-300 rounded text-zinc-700 font-mono text-xs mr-1">Alt+S</kbd>
                <span>Toggle Speech</span>
              </div>
              <div className="flex items-center">
                <kbd className="px-1.5 py-0.5 bg-zinc-100 border border-zinc-300 rounded text-zinc-700 font-mono text-xs mr-1">Alt+F</kbd>
                <span>Toggle Float</span>
              </div>
              <div className="flex items-center">
                <kbd className="px-1.5 py-0.5 bg-zinc-100 border border-zinc-300 rounded text-zinc-700 font-mono text-xs mr-1">Alt+C</kbd>
                <span>Clear</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="py-1 px-2 text-xs text-red-500 hover:bg-red-50"
              onClick={clearTranscript}
            >
              Reset
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default InterviewAssistant;