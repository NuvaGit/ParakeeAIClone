import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from "../contexts/AuthContext";
import { AnimatedSection, GradientText, AnimatedButton } from '../ui/AnimatedComponents';

const Login = () => {
  const { login, loginWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="max-w-md mx-auto mt-10 overflow-hidden">
      <AnimatedSection>
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white">
            <h2 className="text-2xl font-bold text-center">Welcome Back</h2>
            <p className="text-center text-white/80 mt-1">Log in to your account</p>
          </div>
          
          <div className="p-8">
            {error && (
              <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded animate-fade-in">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {error}
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="email">
                  Email
                </label>
                <input
                  className="form-input"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-gray-700 font-medium" htmlFor="password">
                    Password
                  </label>
                  <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
                    Forgot password?
                  </a>
                </div>
                <input
                  className="form-input"
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <AnimatedButton
                className="w-full"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Log In'}
              </AnimatedButton>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  className="w-full bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-sm transition-all flex items-center justify-center"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.64 12.2C20.64 11.5 20.58 10.98 20.45 10.44H12V13.46H16.88C16.66 14.52 16.02 15.36 15.04 15.94V17.94H17.96C19.66 16.4 20.64 14.52 20.64 12.2Z" fill="#4285F4"/>
                    <path d="M12 21C14.43 21 16.47 20.12 17.96 17.94L15.04 15.94C14.24 16.48 13.22 16.8 12 16.8C9.67 16.8 7.74 15.26 7.08 13.2H4.08V15.26C5.56 18.58 8.58 21 12 21Z" fill="#34A853"/>
                    <path d="M7.08 13.2C6.88 12.6 6.78 11.96 6.78 11.28C6.78 10.6 6.9 9.96 7.08 9.36V7.3H4.08C3.44 8.48 3.08 9.82 3.08 11.28C3.08 12.74 3.44 14.08 4.08 15.26L7.08 13.2Z" fill="#FBBC05"/>
                    <path d="M12 5.76C13.3 5.76 14.48 6.2 15.43 7.1L17.99 4.54C16.47 3.12 14.43 2.24 12 2.24C8.58 2.24 5.56 4.66 4.08 7.98L7.08 10.04C7.74 7.98 9.67 5.76 12 5.76Z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>
      
      {/* Decorative elements */}
      <div className="fixed -top-20 -right-20 w-80 h-80 bg-primary-400/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
      <div className="fixed -bottom-20 -left-20 w-80 h-80 bg-accent-400/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow animation-delay-2000"></div>
    </div>
  );
};

export default Login;