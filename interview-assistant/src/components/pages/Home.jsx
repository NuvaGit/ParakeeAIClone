import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from "../layout/Navbar";
import "/src/assets/css/home.css";

const Home = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="ia-container">
      <Navbar />
      
      <section className="ia-hero-section">
        <div className="ia-hero-content animate-fade-in">
          <h1 className="ia-hero-title">Interview Assistant</h1>
          <p className="ia-hero-subtitle">
            Your AI-powered interview coach that helps you prepare and excel in job interviews.
          </p>
          <div className="mt-4">
            {currentUser ? (
              <Link to="/interview" className="btn btn-primary btn-lg">
                Start Interview Practice
              </Link>
            ) : (
              <div className="d-flex gap-2 justify-content-center">
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-outline-primary btn-lg">
                  Log In
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="ia-features-section">
        <div className="container">
          <h2 className="text-center mb-4">Powered by AI Technology</h2>
          <p className="text-center mb-5 text-muted mx-auto" style={{ maxWidth: '800px' }}>
            Our intelligent interview assistant uses cutting-edge AI to help you prepare for 
            interviews by providing personalized responses based on your experience and the specific job you're targeting.
          </p>
          
          <div className="ia-features-grid">
            <div className="ia-feature-card animate-slide-up">
              <div className="ia-feature-icon">
                <i className="fas fa-microphone"></i>
              </div>
              <h3 className="ia-feature-title">Real-time Transcription</h3>
              <p>
                Our app listens to your interview and provides real-time transcription, 
                so you can focus on the conversation while we capture every question.
              </p>
            </div>

            <div className="ia-feature-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="ia-feature-icon">
                <i className="fas fa-brain"></i>
              </div>
              <h3 className="ia-feature-title">AI-Powered Responses</h3>
              <p>
                Get intelligent response suggestions tailored to your resume and experience
                for even the toughest interview questions, helping you highlight your strengths.
              </p>
            </div>

            <div className="ia-feature-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="ia-feature-icon">
                <i className="fas fa-desktop"></i>
              </div>
              <h3 className="ia-feature-title">Works Everywhere</h3>
              <p>
                Use our assistant in your browser or as a desktop app that integrates with
                Zoom and Teams for real interviews, with a floating UI that works alongside any application.
              </p>
            </div>
            
            <div className="ia-feature-card animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="ia-feature-icon">
                <i className="fas fa-user-tie"></i>
              </div>
              <h3 className="ia-feature-title">Personalized Coaching</h3>
              <p>
                The more you use it, the better it gets. Our AI learns from your profile and past
                interviews to provide increasingly tailored advice specific to your career goals.
              </p>
            </div>
            
            <div className="ia-feature-card animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <div className="ia-feature-icon">
                <i className="fas fa-edit"></i>
              </div>
              <h3 className="ia-feature-title">Customizable Responses</h3>
              <p>
                Edit and refine AI-suggested responses to match your personal speaking style, 
                ensuring your answers sound natural and authentic to you.
              </p>
            </div>
            
            <div className="ia-feature-card animate-slide-up" style={{ animationDelay: '1s' }}>
              <div className="ia-feature-icon">
                <i className="fas fa-history"></i>
              </div>
              <h3 className="ia-feature-title">Interview History</h3>
              <p>
                Review your past practice sessions and track your improvement over time, 
                helping you identify strengths and areas for further development.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-5" style={{ background: 'linear-gradient(135deg, var(--gray-100), var(--gray-200))' }}>
        <div className="container text-center">
          <h2 className="mb-4">Ready to ace your next interview?</h2>
          <p className="mb-4 mx-auto" style={{ maxWidth: '700px' }}>
            Join thousands of job seekers who have improved their interview performance with our AI assistant.
          </p>
          {currentUser ? (
            <Link to="/interview" className="btn btn-primary btn-lg animate-pulse">
              Start Practicing Now
            </Link>
          ) : (
            <Link to="/register" className="btn btn-primary btn-lg animate-pulse">
              Create Your Free Account
            </Link>
          )}
        </div>
      </section>
      
      <footer className="bg-dark text-white py-4">
        <div className="container text-center">
          <p className="mb-0">© {new Date().getFullYear()} Interview Assistant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
