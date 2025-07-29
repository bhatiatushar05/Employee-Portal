import React, { useState } from 'react';
import HomePage from './components/HomePage/HomePage';
import Sidebar from './components/Sidebar/Sidebar';
import EmployeePortal from './components/EmployeePortal/EmployeePortal';
import AccountsPortal from './components/AccountsPortal/AccountsPortal';
import CCTVMonitoring from './components/CCTVMonitoring/CCTVMonitoring';
import ChatBot from './components/ChatBot/ChatBot'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState('employee');
  const [activeTab, setActiveTab] = useState('checkin');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle successful login
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveSection('employee');
    setActiveTab('checkin');
    setSidebarOpen(false);
  };

  const renderContent = () => {
    switch(activeSection) {
      case 'employee':
        return <EmployeePortal />;
      case 'accounts':
        return <AccountsPortal />;
      case 'cctv':
        return <CCTVMonitoring activeTab={activeTab} setActiveTab={setActiveTab} />;
      default:
        return <EmployeePortal />;
    }
  };

  // Show home page if not authenticated
  if (!isAuthenticated) {
    return <HomePage onLogin={handleLogin} />;
  }

  // Show main portal if authenticated
  return (
    <div className="h-screen flex bg-gray-50 font-sans relative">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 p-4 flex items-center justify-between z-30">
        <h1 className="text-lg font-semibold text-gray-900">Portal</h1>
        <div className="flex items-center space-x-2">
          {/* Logout button for mobile */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Logout"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
          {/* Menu button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />
      <ChatBot/>

      {/* Main Content */}
      <div className="flex-1 flex flex-col pt-16 md:pt-0 min-h-0">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;