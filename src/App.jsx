import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginPage from './components/Auth/LoginPage';
import Sidebar from './components/Sidebar/Sidebar';
import TopRightHeader from './components/TopRightHeader/TopRightHeader';
import Dashboard from './components/Dashboard/Dashboard';
import EmployeePortal from './components/EmployeePortal/EmployeePortal';

import CCTVMonitoring from './components/CCTVMonitoring/CCTVMonitoring';
import EmployeeAttendance from './components/Attendace /EmployeeAttendace';
import VisitorManagement from './components/Vistor /Vistor';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { Chat } from './components/Chat';

const AppContent = () => {
  const { user, logout, loading } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('checkin');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    setActiveSection('dashboard');
    setActiveTab('checkin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-dark-bg dark:via-dark-surface dark:to-dark-card flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const renderContent = () => {
    switch(activeSection) {
      case 'dashboard':
        return <Dashboard user={user} setActiveSection={setActiveSection} />;
      case 'employee':
        return <EmployeePortal user={user} />;
      case 'chat':
        return <Chat user={user} />;
      case 'cctv':
        return <CCTVMonitoring activeTab={activeTab} setActiveTab={setActiveTab} user={user} />;
      case 'attendance':
        return <EmployeeAttendance user={user} />;
      case 'visitor':
        return <VisitorManagement user={user} />;
      default:
        return <Dashboard user={user} setActiveSection={setActiveSection} />;
    }
  };

  return (
    <SkeletonTheme 
      baseColor={document.documentElement.classList.contains('dark') ? "#374151" : "#f3f4f6"}
      highlightColor={document.documentElement.classList.contains('dark') ? "#4b5563" : "#f9fafb"}
      borderRadius="0.75rem"
      duration={1.5}
    >
      <div className="h-screen bg-gray-50 dark:bg-dark-bg font-sans flex transition-colors duration-300">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-white dark:bg-dark-surface shadow-sm border-b border-gray-200 dark:border-dark-border p-4 flex items-center justify-between z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-card"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Portal</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLogout}
              className="p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-card min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Logout"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          onLogout={handleLogout}
          user={user}
        />

        {/* TopRightHeader */}
        <TopRightHeader user={user} />

        {/* Main Content */}
        <div
          className={`
            flex-1 min-h-screen transition-all duration-500 ease-in-out
            ${activeSection === 'chat' ? 'pt-16 md:pt-20 overflow-auto' : 'pt-16 md:pt-0 overflow-auto'}
          `}
        >
          {renderContent()}
          {activeSection === 'chat' && (
            <div className="h-40 sm:h-40 md:h-40"></div>
          )}
        </div>
      </div>
    </SkeletonTheme>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*" element={<AppContent />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;