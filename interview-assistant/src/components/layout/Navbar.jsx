import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Button, Avatar, Badge, Dropdown } from '../ui/UIComponents';

const Navbar = () => {
  const { currentUser, userProfile, logout } = useContext(AuthContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

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

  const profileMenuItems = [
    {
      label: 'Your Profile',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      onClick: () => navigate('/profile')
    },
    {
      label: 'Interview Room',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
      onClick: () => navigate('/interview')
    },
    { divider: true },
    {
      label: 'Sign out',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ),
      onClick: handleLogout,
      danger: true
    }
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-sm shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo and desktop navigation */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-gradient text-2xl font-bold">InterviewAssist</span>
            </Link>
            
            {/* Desktop navigation links */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                to="/"
                className={`transition-colors duration-200 ${
                  isActive('/') 
                    ? 'text-primary-600 font-medium' 
                    : 'text-zinc-700 hover:text-primary-500'
                }`}
              >
                Home
              </Link>
              
              {currentUser && (
                <>
                  <Link
                    to="/interview"
                    className={`transition-colors duration-200 ${
                      isActive('/interview') 
                        ? 'text-primary-600 font-medium' 
                        : 'text-zinc-700 hover:text-primary-500'
                    }`}
                  >
                    Interview Room
                  </Link>
                  
                  <Link
                    to="/profile"
                    className={`transition-colors duration-200 ${
                      isActive('/profile') 
                        ? 'text-primary-600 font-medium' 
                        : 'text-zinc-700 hover:text-primary-500'
                    }`}
                  >
                    Profile
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Desktop right side - login/signup or profile */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {currentUser ? (
              <Dropdown
                isOpen={dropdownOpen}
                setIsOpen={setDropdownOpen}
                items={profileMenuItems}
                trigger={
                  <button 
                    className="flex items-center space-x-2 focus:outline-none group"
                    aria-expanded={dropdownOpen}
                  >
                    <div className="relative">
                      <Avatar
                        src={currentUser.photoURL}
                        fallback={currentUser.displayName?.charAt(0) || 'U'}
                        alt={currentUser.displayName || 'User'}
                        className="border-2 border-transparent group-hover:border-primary-300 transition-all duration-200"
                      />
                      {userProfile?.profileComplete === false && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                      )}
                    </div>
                    <span className="text-zinc-700 font-medium group-hover:text-primary-600 transition-colors">
                      {currentUser.displayName?.split(' ')[0] || 'User'}
                    </span>
                    <svg 
                      className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${dropdownOpen ? 'transform rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                }
              />
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-zinc-700 hover:text-primary-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">{isMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
              
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div 
        className={`
          md:hidden transition-all duration-300 ease-in-out overflow-hidden transform
          ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}
        `}
      >
        <div className="bg-white shadow-lg rounded-b-xl mx-4 mt-2 overflow-hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`
                block px-3 py-2 rounded-lg text-base font-medium transition-colors
                ${isActive('/') ? 'bg-primary-50 text-primary-700' : 'text-zinc-700 hover:bg-zinc-50'}
              `}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            
            {currentUser && (
              <>
                <Link
                  to="/interview"
                  className={`
                    block px-3 py-2 rounded-lg text-base font-medium transition-colors
                    ${isActive('/interview') ? 'bg-primary-50 text-primary-700' : 'text-zinc-700 hover:bg-zinc-50'}
                  `}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Interview Room
                </Link>
                
                <Link
                  to="/profile"
                  className={`
                    block px-3 py-2 rounded-lg text-base font-medium transition-colors
                    ${isActive('/profile') ? 'bg-primary-50 text-primary-700' : 'text-zinc-700 hover:bg-zinc-50'}
                  `}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
              </>
            )}
          </div>
          
          <div className="pt-4 pb-3 border-t border-zinc-200">
            {currentUser ? (
              <>
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <Avatar
                      src={currentUser.photoURL}
                      fallback={currentUser.displayName?.charAt(0) || 'U'}
                      alt={currentUser.displayName || 'User'}
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-zinc-800">{currentUser.displayName || 'User'}</div>
                    <div className="text-sm font-medium text-zinc-500">{currentUser.email}</div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center w-full px-3 py-2 text-base font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className="px-2 space-y-1">
                <Link
                  to="/login"
                  className="block w-full px-3 py-2 rounded-lg text-center text-base font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="block w-full px-3 py-2 rounded-lg text-center text-base font-medium bg-primary-500 text-white hover:bg-primary-600 transition-colors"
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