import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from "../contexts/AuthContext";
import { Button, Input, Card, Alert } from '../ui/UIComponents';

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
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className={`text-center ${showAnimation ? 'animate-slide-up' : 'opacity-0'}`}>
          <h2 className="text-3xl font-extrabold text-zinc-900">
            Interview<span className="text-gradient">Assistant</span>
          </h2>
          <p className="mt-2 text-zinc-600">Sign in to your account to continue</p>
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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                containerClassName="mt-1"
              />
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={loading}
                className="relative overflow-hidden group"
              >
                <span className="relative z-10">Sign in</span>
                <span className="absolute top-0 right-full w-full h-full bg-primary-400 transform group-hover:translate-x-full transition-transform duration-500"></span>
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
                Sign in with Google
              </Button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-zinc-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                Create an account
              </Link>
            </p>
          </div>
        </Card>
      </div>
      
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary-100 rounded-full opacity-20 blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent-100 rounded-full opacity-20 blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
      </div>
    </div>
  );
};

export default Login;