import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from "../contexts/AuthContext";
import "/src/assets/css/auth.css";

const Login = () => {
  const { login, loginWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  // Animation effect on mount
  useEffect(() => {
    setShowAnimation(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/interview');
    } catch (error) {
      setError('Failed to log in: ' + error.message);
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      await loginWithGoogle();
      navigate('/interview');
    } catch (error) {
      setError('Failed to log in with Google: ' + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card-wrapper">
        <div className={`auth-header ${showAnimation ? 'animate-slide-up' : ''}`}>
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Sign in to your Interview Assistant account</p>
        </div>

        <div className={`card auth-card ${showAnimation ? 'animate-slide-up animation-delay-100' : ''}`}>
          <div className="card-body">
            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <div className="d-flex align-items-center">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  <div>{error}</div>
                </div>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setError('')}
                  aria-label="Close"
                ></button>
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email address</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-envelope"></i>
                  </span>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center">
                  <label htmlFor="password" className="form-label">Password</label>
                  <Link to="/forgot-password" className="auth-link">
                    Forgot password?
                  </Link>
                </div>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-lock"></i>
                  </span>
                  <input
                    id="password"
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 mt-4"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="btn btn-outline-secondary btn-lg w-100 d-flex align-items-center justify-content-center"
              disabled={loading}
            >
              <img 
                src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg" 
                alt="Google logo" 
                style={{ width: '18px', height: '18px', marginRight: '8px' }} 
              />
              Sign in with Google
            </button>

            <div className="auth-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="auth-link">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decorations */}
      <div className="auth-bg-decoration auth-bg-decoration-1"></div>
      <div className="auth-bg-decoration auth-bg-decoration-2"></div>
    </div>
  );
};

export default Login;