import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from "./components/contexts/AuthContext";
import { TranscriptionProvider } from "./components/contexts/TranscriptionContext";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Home from "./components/pages/Home";
import Profile from "./components/pages/Profile";
import InterviewRoom from "./components/pages/InterviewRoom";
import InterviewSessions from "./components/pages/InterviewSessions";
import CreateInterview from "./components/pages/CreateInterview";
import InterviewSession from "./components/pages/InterviewSession";
import InterviewReview from "./components/pages/InterviewReview";
import InterviewSummary from "./components/pages/InterviewSummary";
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <TranscriptionProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/profile/setup" 
              element={
                <ProtectedRoute>
                  <Profile setup={true} />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/interview" 
              element={
                <ProtectedRoute>
                  <InterviewRoom />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/interviews" 
              element={
                <ProtectedRoute>
                  <InterviewSessions />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/create-interview" 
              element={
                <ProtectedRoute>
                  <CreateInterview />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/interview-session/:id" 
              element={
                <ProtectedRoute>
                  <InterviewSession />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/interview-review/:id" 
              element={
                <ProtectedRoute>
                  <InterviewReview />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/interview-summary/:id" 
              element={
                <ProtectedRoute>
                  <InterviewSummary />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </TranscriptionProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;