// src/components/pages/InterviewRoom.jsx
import React, { useState, useEffect } from 'react';
import AnimatedNavbar from "../layout/AnimatedNavbar";
import InterviewAssistant from "../interview/InterviewAssistant";
import { AnimatedBackground, AnimatedSection, AnimatedButton, GradientText } from '../ui/AnimatedComponents';
import LoadingSpinner from '../ui/LoadingSpinner';

const InterviewRoom = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showTips, setShowTips] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };
  
  const tips = [
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>,
      title: "Keyboard Shortcuts",
      description: "Alt+S to toggle speech recognition, Alt+F to float the assistant, Alt+C to clear transcript."
    },
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
      title: "Practice Makes Perfect",
      description: "Use our assistant for repeated practice with diverse interview questions."
    },
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
      title: "Customize Responses",
      description: "Edit AI-generated responses to match your personal style and experiences."
    },
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
      title: "AI Assistant",
      description: "The assistant will automatically detect questions and generate tailored responses."
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner 
          variant="typing" 
          size="lg" 
          color="primary" 
          message="Preparing your interview environment..." 
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isFullScreen ? 'overflow-hidden' : ''}`}>
      <AnimatedBackground>
        {!isFullScreen && <AnimatedNavbar />}
        
        <div className={`${isFullScreen ? 'fixed inset-0 bg-white z-40 pt-4' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24'}`}>
          {!isFullScreen && (
            <AnimatedSection>
              <div className="mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Interview <GradientText>Room</GradientText>
                    </h2>
                    <p className="mt-2 text-gray-600">
                      Practice with our AI assistant or use it during real interviews.
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 flex space-x-2">
                    <AnimatedButton
                      onClick={() => setShowTips(!showTips)}
                      variant="ghost"
                      className="border border-gray-300"
                    >
                      {showTips ? 'Hide Tips' : 'Show Tips'}
                    </AnimatedButton>
                    <AnimatedButton
                      onClick={toggleFullScreen}
                      variant="primary"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      Enter Full Screen
                    </AnimatedButton>
                  </div>
                </div>
                
                {showTips && (
                  <AnimatedSection delay={200}>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {tips.map((tip, index) => (
                        <div 
                          key={index} 
                          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 bg-primary-100 rounded-full p-2 text-primary-600">
                              {tip.icon}
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-gray-900">{tip.title}</h3>
                              <p className="mt-1 text-xs text-gray-500">{tip.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AnimatedSection>
                )}
              </div>
            </AnimatedSection>
          )}
          
          <AnimatedSection delay={400}>
            <InterviewAssistant />
          </AnimatedSection>
          
          {isFullScreen && (
            <button
              onClick={toggleFullScreen}
              className="fixed top-4 right-4 px-4 py-2 bg-white shadow-md text-gray-700 rounded-lg hover:bg-gray-100 transition-colors z-50 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Exit Full Screen
            </button>
          )}
        </div>
      </AnimatedBackground>
    </div>
  );
};

export default InterviewRoom;