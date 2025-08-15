import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, User, Building } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('admin');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (role) => {
    setSelectedRole(role);
    if (role === 'admin') {
      setEmail('admin@hits.com');
      setPassword('admin123');
    } else {
      setEmail('employee@hits.com');
      setPassword('emp123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-dark-bg dark:via-dark-surface dark:to-dark-card flex items-center justify-center p-4 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <Building size={40} className="text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            Welcome to HITS Portal
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Quick Login Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => quickLogin('admin')}
            className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border-2 transition-all duration-300 ${
              selectedRole === 'admin'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface text-gray-700 dark:text-gray-200 hover:border-gray-300 dark:hover:border-dark-primary'
            }`}
          >
            <Shield size={20} />
            <span className="font-medium">Admin Access</span>
          </button>
          
          <button
            onClick={() => quickLogin('employee')}
            className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border-2 transition-all duration-300 ${
              selectedRole === 'employee'
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                : 'border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface text-gray-700 dark:text-gray-200 hover:border-gray-300 dark:hover:border-dark-primary'
            }`}
          >
            <User size={20} />
            <span className="font-medium">Employee Access</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-dark-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-dark-bg dark:via-dark-surface dark:to-dark-card text-gray-500 dark:text-gray-400 transition-colors duration-300">
              Or sign in manually
            </span>
          </div>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors duration-300">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 focus:border-blue-500 dark:focus:border-orange-500 transition-all duration-300 bg-white dark:bg-dark-card text-gray-900 dark:text-white"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors duration-300">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 pr-10 border border-gray-300 dark:border-dark-border rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 focus:border-blue-500 dark:focus:border-orange-500 transition-all duration-300 bg-white dark:bg-dark-card text-gray-900 dark:text-white"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
                  ) : (
                    <Eye size={20} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm transition-colors duration-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-dark-card rounded-lg transition-colors duration-300">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 transition-colors duration-300">Demo Credentials:</h3>
          <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">
            <div><strong>Admin:</strong> admin@hits.com / admin123</div>
            <div><strong>Employee:</strong> employee@hits.com / emp123</div>
          </div>
        </div>
        
        {/* Footer Blank Space */}
        <div className="h-16 sm:h-20 md:h-24"></div>
      </div>
    </div>
  );
};

export default LoginPage;
