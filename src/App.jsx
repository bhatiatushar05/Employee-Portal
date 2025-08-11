import React, { useState } from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import HomePage from './components/HomePage/HomePage';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import EmployeePortal from './components/EmployeePortal/EmployeePortal';
import AccountsPortal from './components/AccountsPortal/AccountsPortal';
import CCTVMonitoring from './components/CCTVMonitoring/CCTVMonitoring';
import EmployeeAttendance from './components/attendance/EmployeeAttendace';
import VisitorManagement from './components/Vistor /Vistor';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('userData');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('checkin');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
    setActiveSection('dashboard');
    setActiveTab('checkin');
  };

  const renderContent = () => {
    switch(activeSection) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'employee':
        return <EmployeePortal />;
      case 'accounts':
        return <AccountsPortal />;
      case 'cctv':
        return <CCTVMonitoring activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'attendance':
        return <EmployeeAttendance user={user} />;
      case 'visitor':
        return <VisitorManagement user={user} />;
      default:
        return <Dashboard user={user} />;
    }
  };

  if (!isAuthenticated) {
    return (
      <SkeletonTheme 
        baseColor="#f3f4f6" 
        highlightColor="#f9fafb"
        borderRadius="0.75rem"
        duration={1.5}
      >
        <HomePage onLogin={handleLogin} />
      </SkeletonTheme>
    );
  }

  return (
    <SkeletonTheme 
      baseColor="#f3f4f6" 
      highlightColor="#f9fafb"
      borderRadius="0.75rem"
      duration={1.5}
    >
      <div className="h-screen bg-gray-50 font-sans flex">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 p-4 flex items-center justify-between z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Portal</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLogout}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
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

        {/* Main Content */}
        <div
          className={`
            flex-1 pt-16 md:pt-0 overflow-hidden transition-all duration-500 ease-in-out
            ${sidebarCollapsed ? 'md:ml-0' : 'md:ml-0'}
          `}
        >
          {renderContent()}
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default App;