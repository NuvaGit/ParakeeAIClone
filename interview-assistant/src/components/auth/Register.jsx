import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from "../contexts/AuthContext";
import { Button, Input, Card, Alert } from '../ui/UIComponents';

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

  useEffect(() => {
    setShowAnimation(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
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
  
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: 'None', color: 'bg-zinc-200' };
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    const strengthMap = [
      { label: 'Weak', color: 'bg-red-500' },
      { label: 'Fair', color: 'bg-yellow-500' },
      { label: 'Good', color: 'bg-blue-500' },
      { label: 'Strong', color: 'bg-green-500' }
    ];
    
    return { 
      strength: strength, 
      label: strengthMap[strength - 1]?.label || 'None',
      color: strengthMap[strength - 1]?.color || 'bg-zinc-200'
    };
  };
  
  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className={`text-center ${showAnimation ? 'animate-slide-up' : 'opacity-0'}`}>
          <h2 className="text-3xl font-extrabold text-zinc-900">
            Create your account
          </h2>
          <p className="mt-2 text-zinc-600">Start your interview preparation journey</p>
        </div>
      </div>

      <div className={`mt-8 sm:mx-auto sm:w-full sm:max-w-md ${showAnimation ? 'animate-slide-up animation-delay-100' : 'opacity-0'}`}>
        <Card className="px-4 py-8 sm:px-10 shadow-lg">
          {error && (
            <Alert
              variant="error"
              className="mb-6"
              dismissible
              onDismiss={() => setError('')}
            >
              {error}
            </Alert>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              id="displayName"
              type="text"
              label="Full Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="John Doe"
              autoComplete="name"
              required
            />

            <Input
              id="email"
              type="email"
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />

            <div>
              <Input
                id="password"
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                required
                minLength="8"
              />
              
              {/* Password strength indicator */}
              {password && (
                <div className="mt-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex space-x-1">
                      {[...Array(4)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-1 w-5 rounded-full ${i < passwordStrength.strength ? passwordStrength.color : 'bg-zinc-200'}`}
                        ></div>
                      ))}
                    </div>
                    <div className="text-xs text-zinc-500">{passwordStrength.label}</div>
                  </div>
                  <p className="text-xs text-zinc-500">
                    Use 8+ characters with a mix of letters, numbers & symbols
                  </p>
                </div>
              )}
            </div>

            <Input
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />

            <div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={loading}
                className="group relative"
              >
                <span className="absolute inset-0 w-0 bg-primary-400 transition-all duration-300 ease-out group-hover:w-full"></span>
                <span className="relative">Create Account</span>
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-zinc-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                onClick={handleGoogleLogin}
                variant="outline"
                fullWidth
                disabled={loading}
                className="flex items-center justify-center bg-white"
                icon={
                  <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
                  </svg>
                }
              >
                Sign up with Google
              </Button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-zinc-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
      
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-secondary-100 rounded-full opacity-20 blur-3xl transform -translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-accent-100 rounded-full opacity-20 blur-3xl transform translate-x-1/3 translate-y-1/3"></div>
      </div>
    </div>
  );
};

export default Register;