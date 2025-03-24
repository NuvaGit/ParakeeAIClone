import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from "./components/contexts/AuthContext";
import { TranscriptionProvider } from "./components/contexts/TranscriptionContext";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Home from "./components/pages/Home";
import Profile from "./components/pages/Profile";
import InterviewRoom from "./components/pages/InterviewRoom";
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
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </TranscriptionProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;