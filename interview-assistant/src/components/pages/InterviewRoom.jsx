import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import Navbar from "../layout/Navbar";
import InterviewAssistant from "../interview/InterviewAssistant";
import { Button, Card, Badge, Tooltip, Alert } from '../ui/UIComponents';

const InterviewRoom = () => {
  const { userProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showTips, setShowTips] = useState(true);
  const [activeTab, setActiveTab] = useState('common');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const isProfileIncomplete = userProfile && !userProfile.profileComplete;

  const commonQuestions = [
    {
      category: "Background",
      questions: [
        "Can you tell me about yourself?",
        "What are your greatest strengths?",
        "What do you consider to be your weaknesses?",
        "Why are you leaving your current job?",
        "Why do you want to work here?"
      ]
    },
    {
      category: "Experience",
      questions: [
        "Describe a challenging project you worked on.",
        "Tell me about a time you had to deal with a difficult team member.",
        "What's your greatest professional achievement?",
        "How do you handle stress and pressure?",
        "Give me an example of when you showed leadership qualities."
      ]
    },
    {
      category: "Technical",
      questions: [
        "How do you stay updated with the latest technologies?",
        "Describe your workflow when starting a new project.",
        "How do you ensure your code is maintainable and scalable?",
        "Tell me about a time you had to learn a new technology quickly.",
        "How do you approach debugging a complex issue?"
      ]
    }
  ];

  const behavioralQuestions = [
    {
      category: "Problem Solving",
      questions: [
        "Tell me about a time when you faced an unexpected problem and how you solved it.",
        "Describe a situation where you had to analyze data to make a recommendation.",
        "Give an example of a time when you had to think outside the box.",
        "How do you make decisions when you don't have all the information?",
        "Tell me about a time when you improved a process."
      ]
    },
    {
      category: "Teamwork",
      questions: [
        "Describe a time when you had to work with someone difficult.",
        "How do you handle disagreements on your team?",
        "Tell me about a successful team project and your contribution.",
        "Give an example of when you had to motivate others.",
        "How do you build relationships with colleagues?"
      ]
    },
    {
      category: "Communication",
      questions: [
        "Describe a situation where you had to explain something complex to someone.",
        "Tell me about a time when you had to persuade someone to see things your way.",
        "How do you ensure clear communication in a remote environment?",
        "Give an example of how you've handled receiving negative feedback.",
        "Describe a time when you had to deliver difficult news."
      ]
    }
  ];

  const jobSpecificQuestions = [
    {
      category: "Software Engineering",
      questions: [
        "Explain how you would design a scalable web application.",
        "How do you approach testing your code?",
        "Describe your experience with continuous integration and deployment.",
        "What design patterns are you familiar with and when do you use them?",
        "How do you keep your code DRY and maintainable?"
      ]
    },
    {
      category: "Data Science",
      questions: [
        "How do you approach a new dataset?",
        "Explain how you would handle imbalanced data.",
        "What feature engineering techniques do you use?",
        "How do you validate your models?",
        "Describe a time when your analysis led to a business impact."
      ]
    },
    {
      category: "Product Management",
      questions: [
        "How do you prioritize features for a product?",
        "Describe how you gather and incorporate user feedback.",
        "How do you measure the success of a product?",
        "Tell me about a product you managed from concept to launch.",
        "How do you communicate with different stakeholders?"
      ]
    }
  ];

  const tips = [
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>,
      title: "Keyboard Shortcuts",
      description: "Alt+S to toggle speech recognition, Alt+F to float the assistant, Alt+C to clear transcript."
    },
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
      title: "STAR Method",
      description: "Use the Situation, Task, Action, Result format when answering behavioral questions."
    },
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
      title: "Customize Responses",
      description: "Edit AI-generated responses to match your personal style and experiences."
    },
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
      title: "Practice Naturally",
      description: "Speak questions as if you were in a real interview for the most accurate practice."
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-primary-200 border-t-primary-500 animate-spin"></div>
              <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-transparent border-t-primary-300 animate-spin" style={{ animationDelay: '0.2s', animationDirection: 'reverse' }}></div>
            </div>
          </div>
          <h2 className="text-xl font-medium text-zinc-700 mb-1">Preparing your interview space</h2>
          <p className="text-zinc-500">Setting up your personalized AI assistant...</p>
        </div>
      </div>
    );
  }

  const renderQuestionList = (questions) => {
    return questions.map((category, index) => (
      <div key={index} className="mb-6">
        <h3 className="text-lg font-medium text-zinc-800 mb-3">{category.category}</h3>
        <ul className="space-y-2">
          {category.questions.map((question, qIndex) => (
            <li key={qIndex}>
              <button
                className="w-full text-left p-3 rounded-lg bg-white border border-zinc-200 hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                onClick={() => {
                  // Here you would trigger the question to be spoken or added to the transcript
                  console.log(`Selected question: ${question}`);
                }}
              >
                <div className="flex items-center">
                  <span className="flex-1">{question}</span>
                  <span className="text-zinc-400 group-hover:text-primary-500 transform group-hover:translate-x-1 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    ));
  };

  return (
    <div className={`min-h-screen bg-zinc-50 ${isFullScreen ? 'overflow-hidden' : ''}`}>
      {!isFullScreen && <Navbar />}
      
      <div className={`${isFullScreen ? 'fixed inset-0 bg-zinc-50 z-40 pt-4' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24'}`}>
        {!isFullScreen && (
          <>
            <div className="mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h1 className="text-3xl font-bold text-zinc-900">
                    Interview <span className="text-gradient">Room</span>
                  </h1>
                  <p className="mt-2 text-zinc-600">
                    Practice with our AI assistant or use it during real interviews.
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-2">
                  <Button
                    onClick={() => setShowTips(!showTips)}
                    variant="ghost"
                    className="border border-zinc-300"
                  >
                    {showTips ? 'Hide Tips' : 'Show Tips'}
                  </Button>
                  <Button
                    onClick={toggleFullScreen}
                    variant="primary"
                    icon={
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    }
                  >
                    Enter Full Screen
                  </Button>
                </div>
              </div>
              
              {/* Profile completion prompt */}
              {isProfileIncomplete && (
                <Alert
                  variant="info"
                  className="mt-6"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  title="Complete your profile for better results"
                  dismissible
                >
                  <p className="text-sm">
                    Your profile is incomplete. For more accurate and personalized AI responses,
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 text-primary-600 underline"
                      onClick={() => navigate('/profile')}
                    >
                      complete your profile
                    </Button>
                  </p>
                </Alert>
              )}
              
              {/* Tips section */}
              {showTips && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
                  {tips.map((tip, index) => (
                    <Card 
                      key={index} 
                      className="p-4 hover:shadow-md transition-shadow"
                      hover
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 bg-primary-100 rounded-full p-2 text-primary-600">
                          {tip.icon}
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-zinc-900">{tip.title}</h3>
                          <p className="mt-1 text-xs text-zinc-500">{tip.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            
            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Interview assistant column */}
              <div className="lg:col-span-2">
                <InterviewAssistant />
              </div>
              
              {/* Questions library column */}
              <div className="hidden lg:block">
                <Card className="p-4 sticky top-24">
                  <h2 className="text-xl font-bold text-zinc-900 mb-4">Questions Library</h2>
                  
                  {/* Question category tabs */}
                  <div className="flex border-b border-zinc-200 mb-6 overflow-x-auto pb-1">
                    <button
                      className={`px-3 py-2 font-medium text-sm mr-4 transition-colors ${activeTab === 'common' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-zinc-600 hover:text-zinc-900'}`}
                      onClick={() => setActiveTab('common')}
                    >
                      Common
                    </button>
                    <button
                      className={`px-3 py-2 font-medium text-sm mr-4 transition-colors ${activeTab === 'behavioral' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-zinc-600 hover:text-zinc-900'}`}
                      onClick={() => setActiveTab('behavioral')}
                    >
                      Behavioral
                    </button>
                    <button
                      className={`px-3 py-2 font-medium text-sm transition-colors ${activeTab === 'job-specific' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-zinc-600 hover:text-zinc-900'}`}
                      onClick={() => setActiveTab('job-specific')}
                    >
                      Job-Specific
                    </button>
                  </div>
                  
                  {/* Questions list based on active tab */}
                  <div className="overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                    {activeTab === 'common' && renderQuestionList(commonQuestions)}
                    {activeTab === 'behavioral' && renderQuestionList(behavioralQuestions)}
                    {activeTab === 'job-specific' && renderQuestionList(jobSpecificQuestions)}
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}
        
        {/* Full screen mode only shows the assistant */}
        {isFullScreen && (
          <>
            <div className="max-w-3xl mx-auto">
              <InterviewAssistant />
            </div>
            <button
              onClick={toggleFullScreen}
              className="fixed top-4 right-4 px-4 py-2 bg-white shadow-md text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors z-50 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Exit Full Screen
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default InterviewRoom;