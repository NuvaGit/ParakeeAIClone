import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Listen for scroll events to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          {/* Logo and desktop navigation */}
          <div className="d-flex align-items-center">
            <Link to="/" className="navbar-brand">
              <span className="text-gradient">InterviewAssist</span>
            </Link>
            
            {/* Desktop navigation links */}
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link
                  to="/"
                  className={`nav-link ${isActive('/') ? 'active' : ''}`}
                >
                  Home
                </Link>
              </li>
              
              {currentUser && (
                <>
                  <li className="nav-item">
                    <Link
                      to="/interview"
                      className={`nav-link ${isActive('/interview') ? 'active' : ''}`}
                    >
                      Interview Room
                    </Link>
                  </li>
                  
                  <li className="nav-item">
                    <Link
                      to="/profile"
                      className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                    >
                      Profile
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          
          {/* Desktop right side - login/signup or profile */}
          <div className="d-flex align-items-center">
            {currentUser ? (
              <div className="relative">
                <button 
                  className="d-flex align-items-center gap-2 btn btn-sm"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  <img
                    className="h-10 w-10 rounded-full"
                    src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || 'User')}&background=5e60ce&color=fff`}
                    alt="Profile"
                    style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                  />
                  <span>{currentUser.displayName?.split(' ')[0] || 'User'}</span>
                  <i className={`fas fa-chevron-down ${profileDropdownOpen ? 'fa-rotate-180' : ''}`}></i>
                </button>
                
                {profileDropdownOpen && (
                  <div className="card" style={{ position: 'absolute', right: 0, top: '100%', minWidth: '200px', marginTop: '0.5rem', zIndex: 1000 }}>
                    <div className="card-body p-3">
                      <div className="mb-2 pb-2" style={{ borderBottom: '1px solid var(--gray-200)' }}>
                        <p className="mb-0 fw-bold">{currentUser.displayName || 'User'}</p>
                        <p className="mb-0 small text-muted">{currentUser.email}</p>
                      </div>
                      
                      <Link
                        to="/profile"
                        className="d-flex align-items-center p-2 text-decoration-none"
                        onClick={() => setProfileDropdownOpen(false)}
                        style={{ color: 'var(--gray-700)', borderRadius: 'var(--border-radius)' }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-100)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <i className="fas fa-user me-2"></i>
                        Your Profile
                      </Link>
                      
                      <Link
                        to="/interview"
                        className="d-flex align-items-center p-2 text-decoration-none"
                        onClick={() => setProfileDropdownOpen(false)}
                        style={{ color: 'var(--gray-700)', borderRadius: 'var(--border-radius)' }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-100)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <i className="fas fa-microphone me-2"></i>
                        Interview Room
                      </Link>
                      
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          handleLogout();
                        }}
                        className="d-flex align-items-center p-2 w-100 text-start border-0 bg-transparent"
                        style={{ color: 'var(--danger-color)', borderRadius: 'var(--border-radius)' }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-100)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-primary">
                  Log in
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign up
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <button
            className="btn d-md-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
        
        {/* Mobile menu */}
        <div 
          className={`d-md-none transition-all duration-300`} 
          style={{
            maxHeight: isMenuOpen ? '500px' : '0',
            opacity: isMenuOpen ? 1 : 0,
            overflow: 'hidden',
            marginTop: isMenuOpen ? '1rem' : '0'
          }}
        >
          <div className="card card-body">
            <div className="mb-3">
              <Link
                to="/"
                className={`d-block p-2 ${isActive('/') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover-bg-gray-50'}`}
                style={{ borderRadius: 'var(--border-radius)' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              {currentUser && (
                <>
                  <Link
                    to="/interview"
                    className={`d-block p-2 ${isActive('/interview') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover-bg-gray-50'}`}
                    style={{ borderRadius: 'var(--border-radius)' }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Interview Room
                  </Link>
                  
                  <Link
                    to="/profile"
                    className={`d-block p-2 ${isActive('/profile') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover-bg-gray-50'}`}
                    style={{ borderRadius: 'var(--border-radius)' }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </>
              )}
            </div>
            
            {currentUser ? (
              <div>
                <div className="d-flex align-items-center mb-3 p-2">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || 'User')}&background=5e60ce&color=fff`}
                    alt="Profile"
                    style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                  />
                  <div className="ms-3">
                    <div className="fw-bold">{currentUser.displayName || 'User'}</div>
                    <div className="small text-muted">{currentUser.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="btn btn-outline-danger w-100"
                >
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Sign out
                </button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                <Link
                  to="/login"
                  className="btn btn-outline-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;