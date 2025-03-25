import React, { useState } from 'react';
import Navbar from "../layout/Navbar";
import InterviewAssistant from "../interview/InterviewAssistant";

const InterviewRoom = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isFullScreen ? 'overflow-hidden' : ''}`}>
      {!isFullScreen && <Navbar />}
      
      <div className={`${isFullScreen ? 'fixed inset-0 bg-white z-50' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'}`}>
        {!isFullScreen && (
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Interview Room</h2>
                <p className="mt-2 text-gray-600">
                  Practice with our AI assistant or use it during real interviews.
                </p>
              </div>
              <button
                onClick={toggleFullScreen}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                Enter Full Screen
              </button>
            </div>
            
            <div className="mt-6 bg-blue-50 rounded-lg p-4 border-l-4 border-blue-300">
              <h3 className="text-lg font-medium text-blue-800 mb-2">How to use the Interview Assistant:</h3>
              <ul className="list-disc pl-5 space-y-1 text-blue-700">
                <li>Click the microphone button or press Alt+S to start listening</li>
                <li>The assistant will automatically detect questions and generate responses</li>
                <li>You can edit the suggested responses before using them</li>
                <li>Click "Float" to make the assistant stay on top while using other applications</li>
                <li>For Zoom/Teams integration, download our desktop app</li>
              </ul>
            </div>
          </div>
        )}
        
        <InterviewAssistant />
        
        {isFullScreen && (
          <button
            onClick={toggleFullScreen}
            className="fixed top-4 right-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Exit Full Screen
          </button>
        )}
      </div>
    </div>
  );
};

export default InterviewRoom;