import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from "../contexts/AuthContext";
import "/src/assets/css/auth.css";


const Register = () => {
  const { register, loginWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    strength: 0,
    label: 'None',
    color: 'var(--gray-200)'
  });

  // Animation effect on mount
  useEffect(() => {
    setShowAnimation(true);
  }, []);

  // Calculate password strength when password changes
  useEffect(() => {
    setPasswordStrength(getPasswordStrength(password));
  }, [password]);

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: 'None', color: 'var(--gray-200)' };
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    const strengthMap = [
      { label: 'Weak', color: 'var(--danger-color)' },
      { label: 'Fair', color: 'var(--warning-color)' },
      { label: 'Good', color: 'var(--secondary-color)' },
      { label: 'Strong', color: 'var(--success-color)' }
    ];
    
    return { 
      strength: strength, 
      label: strength > 0 ? strengthMap[strength - 1].label : 'None',
      color: strength > 0 ? strengthMap[strength - 1].color : 'var(--gray-200)'
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (passwordStrength.strength < 2) {
      return setError('Please use a stronger password');
    }
    
    setError('');
    setLoading(true);

    try {
      await register(email, password, displayName);
      navigate('/profile/setup');
    } catch (error) {
      setError('Failed to create an account: ' + error.message);
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      await loginWithGoogle();
      navigate('/profile/setup');
    } catch (error) {
      setError('Failed to register with Google: ' + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card-wrapper">
        <div className={`auth-header ${showAnimation ? 'animate-slide-up' : ''}`}>
          <h2 className="auth-title">Create an account</h2>
          <p className="auth-subtitle">Begin your interview preparation journey</p>
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
                <label htmlFor="displayName" className="form-label">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-user"></i>
                  </span>
                  <input
                    id="displayName"
                    type="text"
                    className="form-control"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="John Doe"
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

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
                <label htmlFor="password" className="form-label">Password</label>
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
                    autoComplete="new-password"
                    required
                    minLength="8"
                  />
                </div>
                
                {/* Password strength indicator */}
                {password && (
                  <div className="password-strength mt-2">
                    <div className="d-flex justify-content-between mb-1">
                      <div className="strength-bars">
                        {[...Array(4)].map((_, i) => (
                          <div 
                            key={i} 
                            className="strength-bar"
                            style={{ 
                              backgroundColor: i < passwordStrength.strength ? passwordStrength.color : 'var(--gray-200)',
                              height: '4px',
                              width: '32px',
                              borderRadius: '2px',
                              marginRight: '4px',
                              display: 'inline-block'
                            }}
                          ></div>
                        ))}
                      </div>
                      <div className="strength-label" style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>
                        {passwordStrength.label}
                      </div>
                    </div>
                    <p className="password-tips" style={{ fontSize: '0.75rem', color: 'var(--gray-600)', margin: 0 }}>
                      Use 8+ characters with a mix of letters, numbers & symbols
                    </p>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-lock"></i>
                  </span>
                  <input
                    id="confirmPassword"
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
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
                    Creating account...
                  </>
                ) : (
                  'Create Account'
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
              Sign up with Google
            </button>

            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="auth-link">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decorations */}
      <div className="auth-bg-decoration auth-bg-decoration-3"></div>
      <div className="auth-bg-decoration auth-bg-decoration-4"></div>
    </div>
  );
};

export default Register;