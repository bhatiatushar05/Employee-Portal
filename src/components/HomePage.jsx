import React, { useState, useEffect } from 'react';
import { User, Lock, Eye, EyeOff, Building2, Users, CreditCard, Monitor, CheckCircle, ArrowRight, Sparkles, Mail } from 'lucide-react';

const HomePage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    // Trigger card animations after component mounts
    const timer = setTimeout(() => setAnimateCards(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Call the onLogin prop to authenticate user
    if (onLogin) {
      onLogin();
    }
    
    setIsLoading(false);
  };

  const features = [
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Expense Management",
      description: "Submit and track your expense requests and reimbursements seamlessly",
      delay: "0ms"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Account Portal",
      description: "Access your account information and manage your profile settings",
      delay: "100ms"
    },
    {
      icon: <Monitor className="w-8 h-8" />,
      title: "CCTV Monitoring",
      description: "View and monitor security footage with advanced access controls",
      delay: "200ms"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "File Management",
      description: "Organize and access your documents with our integrated file system",
      delay: "300ms"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-20 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 py-16">
          <div className="max-w-md mx-auto">
            {/* Logo & Title */}
            <div className="mb-12 opacity-0 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
              <div className="flex items-center mb-6">
                <div className="relative">
                  <Building2 className="w-12 h-12 text-emerald-400" />
                  <Sparkles className="w-6 h-6 text-green-400 absolute -top-2 -right-2 animate-spin" />
                </div>
                <div className="ml-4">
                  <h1 className="text-4xl font-bold text-white">Portal</h1>
                  <p className="text-emerald-300 text-sm">Employee Management System</p>
                </div>
              </div>
              <p className="text-slate-300 text-lg leading-relaxed">
                Welcome to your comprehensive employee portal. Manage expenses, access accounts, and streamline your workflow all in one place.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 transform transition-all duration-700 hover:scale-105 hover:bg-white/15 cursor-pointer ${
                    animateCards ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
                  }`}
                  style={{ transitionDelay: feature.delay }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-emerald-400 flex-shrink-0 mt-1">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-slate-300 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-16">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8 opacity-0 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
              <div className="flex items-center justify-center mb-4">
                <Building2 className="w-10 h-10 text-emerald-400 mr-3" />
                <h1 className="text-3xl font-bold text-white">Portal</h1>
              </div>
              <p className="text-slate-300">Employee Management System</p>
            </div>

            {/* Sign In Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl opacity-0 animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-slate-300">Sign in to access your portal</p>
              </div>

              <form onSubmit={handleSignIn} className="space-y-6">
                {/* Email Input */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-200 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-slate-200 block">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center text-slate-300">
                    <input type="checkbox" className="w-4 h-4 text-emerald-400 bg-transparent border border-white/20 rounded focus:ring-emerald-400 focus:ring-2" />
                    <span className="ml-2">Remember me</span>
                  </label>
                  <a href="#" className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200">
                    Forgot password?
                  </a>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Signing In...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      Sign In
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  )}
                </button>

                {/* Demo Credentials */}
                <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                  <p className="text-yellow-200 text-sm text-center mb-2 font-medium">Demo Credentials</p>
                  <div className="text-xs text-yellow-100 space-y-1">
                    <p><strong>Email:</strong> demo@portal.com</p>
                    <p><strong>Password:</strong> demo123</p>
                  </div>
                </div>
              </form>
            </div>

            {/* Bottom Links */}
            <div className="text-center mt-6 opacity-0 animate-fade-in" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
              <p className="text-slate-400 text-sm">
                Don't have an account? 
                <a href="#" className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200 ml-1">
                  Contact IT Support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HomePage;