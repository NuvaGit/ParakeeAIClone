import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TranscriptionProvider } from './contexts/TranscriptionContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import InterviewRoom from './pages/InterviewRoom';
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