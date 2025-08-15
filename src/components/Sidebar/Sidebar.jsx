import React, { useState, useCallback, useMemo } from 'react';
import { Home, Camera, CheckCircle, FolderOpen, Settings, X, LogOut, Building2, LayoutDashboard, User, ChevronLeft, ChevronRight, Clock, Users, Menu, Bell, Search, Moon, Sun } from 'lucide-react';
import HLogo from '../../assets/H logo.png'; // Make sure the file is in src/assets/
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Sidebar = ({ 
  activeSection, 
  setActiveSection, 
  sidebarOpen, 
  setSidebarOpen, 
  sidebarCollapsed, 
  setSidebarCollapsed, 
  onLogout, 
  user 
}) => {
  const { isAdmin, isEmployee } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Role-based navigation items
  const navigationItems = useMemo(() => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'main', permission: 'dashboard' },
      { id: 'employee', label: isAdmin() ? 'Request Management' : 'Employee Portal', icon: Home, category: 'main', permission: 'employee-portal' },
      { id: 'attendance', label: 'Attendance', icon: Clock, category: 'main', permission: 'attendance' },
    ];

    // Admin-only items
    if (isAdmin()) {
      baseItems.push(
        { id: 'visitor', label: 'Visitor Management', icon: Users, category: 'main', permission: 'visitor-management' },
        { id: 'cctv', label: 'CCTV Monitoring', icon: Camera, category: 'main', permission: 'cctv-monitoring' },
        { id: 'files', label: 'File Manager', icon: FolderOpen, category: 'tools', permission: 'file-manager' },
        { id: 'checkin', label: 'Check-In', icon: CheckCircle, category: 'tools', permission: 'checkin' }
      );
    }

    return baseItems;
  }, [isAdmin]);

  // Memoized filtered items
  const { mainNavItems, toolItems } = useMemo(() => ({
    mainNavItems: navigationItems.filter(item => item.category === 'main'),
    toolItems: navigationItems.filter(item => item.category === 'tools')
  }), [navigationItems]);

  // Optimized section change handler with useCallback
  const handleSectionChange = useCallback((section) => {
    setActiveSection(section);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768 && setSidebarOpen) {
      setSidebarOpen(false);
    }
  }, [setActiveSection, setSidebarOpen]);

  // Memoized NavButton component
  const NavButton = React.memo(({ item, isActive, onClick }) => {
    const Icon = item.icon;
    
    return (
      <button 
        onClick={onClick}
        className={`
          group relative w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg
          text-xs sm:text-sm font-medium transition-all duration-200 text-left
          ${sidebarCollapsed ? 'justify-center px-2' : ''}
          ${isActive 
            ? 'bg-white/10 text-white shadow-sm border border-white/10' 
            : 'text-gray-300 hover:text-white hover:bg-white/5'
          }
        `}
        title={sidebarCollapsed ? item.label : ''}
      >
        <div className={`
          flex-shrink-0 p-1 sm:p-1.5 rounded-md transition-all duration-200
          ${isActive ? 'bg-white/15' : 'group-hover:bg-white/10'}
        `}>
          <Icon size={14} className="sm:w-4 sm:h-4" />
        </div>
        
        {!sidebarCollapsed && (
          <span className="truncate">{item.label}</span>
        )}
        
        {isActive && (
          <div className={`
            absolute w-1 h-5 sm:h-6 bg-orange-400 rounded-r-full transition-all duration-200
            ${sidebarCollapsed ? '-right-4' : '-right-3'}
          `} />
        )}
      </button>
    );
  });

  return (
    <div className="flex h-screen">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 
        ${sidebarCollapsed ? 'md:w-16' : 'md:w-64'}
        fixed md:relative z-50 md:z-auto w-72 sm:w-64 h-full
        bg-gradient-to-br from-slate-800 via-blue-800 to-indigo-900
        text-white flex flex-col
        transition-all duration-300 ease-in-out
        border-r border-slate-700/30
        shadow-xl md:shadow-none
      `}>
        
        {/* Header */}
        <div className={`
          flex items-center justify-between p-3 sm:p-4 border-b border-slate-700/30
          ${sidebarCollapsed ? 'px-2' : ''}
        `}>
          {/* Sidebar Header with Logo */}
          <div className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-b border-slate-700/30 ${sidebarCollapsed ? 'px-2 justify-center' : ''}`}>
            <img
              src={HLogo}
              alt="Company Logo"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
            />
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-base sm:text-lg font-bold text-white">HITS</h1>
                <p className="text-xs text-gray-400">Employee System</p>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>

        {/* User Section */}
        {user && (
          <div className={`p-3 sm:p-4 border-b border-slate-700/30 ${sidebarCollapsed ? 'px-2' : ''}`}>
            {!sidebarCollapsed ? (
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={12} className="sm:w-[14px] sm:h-[14px]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-white truncate">
                    {user.fullName ? user.fullName.split(' ')[0] : 'User'}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user.email || 'employee@hits.com'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0" title={user.fullName || 'User'}>
                  <User size={12} className="sm:w-[14px] sm:h-[14px]" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className={`flex-1 p-3 sm:p-4 space-y-4 sm:space-y-6 overflow-y-auto ${sidebarCollapsed ? 'px-2' : ''}`}>
          {/* Main Navigation */}
          <div className="space-y-2">
            {!sidebarCollapsed && (
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider px-2 sm:px-3">
                Main
              </h3>
            )}
            <div className="space-y-1">
              {mainNavItems.map((item) => (
                <NavButton
                  key={item.id}
                  item={item}
                  isActive={activeSection === item.id}
                  onClick={() => handleSectionChange(item.id)}
                />
              ))}
            </div>
          </div>

          {/* Tools */}
          <div className="space-y-2">
            {!sidebarCollapsed && (
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider px-2 sm:px-3">
                Tools
              </h3>
            )}
            {sidebarCollapsed && (
              <div className="border-t border-blue-700/40" />
            )}
            <div className="space-y-1">
              {toolItems.map((item) => (
                <NavButton
                  key={item.id}
                  item={item}
                  isActive={activeSection === item.id}
                  onClick={() => handleSectionChange(item.id)}
                />
              ))}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className={`p-4 border-t border-blue-700/40 space-y-1 ${sidebarCollapsed ? 'px-2' : ''}`}>
          {/* Profile Button */}
          <button 
            onClick={() => setShowProfile(true)}
            className={`
              group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
              text-sm font-medium transition-all duration-200 text-left
              text-blue-100 hover:text-white hover:bg-white/10
              ${sidebarCollapsed ? 'justify-center px-2' : ''}
            `}
            title={sidebarCollapsed ? 'Profile' : ''}
          >
            <div className="flex-shrink-0 p-1.5 rounded-md transition-all duration-200 group-hover:bg-white/10">
              <User size={16} />
            </div>
            {!sidebarCollapsed && <span>Profile</span>}
          </button>

          {/* Settings Button */}
          <button 
            onClick={() => setShowSettings(true)}
            className={`
              group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
              text-sm font-medium transition-all duration-200 text-left
              text-blue-100 hover:text-white hover:bg-white/10
              ${sidebarCollapsed ? 'justify-center px-2' : ''}
            `}
            title={sidebarCollapsed ? 'Settings' : ''}
          >
            <div className="flex-shrink-0 p-1.5 rounded-md transition-all duration-200 group-hover:bg-white/10">
              <Settings size={16} />
            </div>
            {!sidebarCollapsed && <span>Settings</span>}
          </button>
          
          {/* Logout Button */}
          {onLogout && (
            <button 
              onClick={onLogout}
              className={`
                group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-sm font-medium transition-all duration-200 text-left
                text-orange-200 hover:text-white hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-blue-500/20
                ${sidebarCollapsed ? 'justify-center px-2' : ''}
              `}
              title={sidebarCollapsed ? 'Logout' : ''}
            >
              <div className="flex-shrink-0 p-1.5 rounded-md transition-all duration-200 group-hover:bg-white/10">
                <LogOut size={16} />
              </div>
              {!sidebarCollapsed && <span>Logout</span>}
            </button>
          )}
        </div>
      </aside>

      {/* Toggle Button */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className={`
          hidden md:flex fixed top-4 z-50 w-8 h-8 
          bg-white shadow-lg border border-gray-200 rounded-lg
          items-center justify-center text-gray-600 hover:text-gray-900
          transition-all duration-300 hover:shadow-xl
          ${sidebarCollapsed ? 'left-20' : 'left-64'}
        `}
        title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 w-10 h-10 bg-white shadow-lg border border-gray-200 rounded-lg flex items-center justify-center text-gray-600"
      >
        <Menu size={18} />
      </button>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile</h2>
                <button 
                  onClick={() => setShowProfile(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-green-500 flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
                  <span className="text-3xl font-bold text-white">{user?.fullName?.[0] || 'U'}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{user?.email || 'user@hits.com'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 capitalize">{user?.role || 'user'}</p>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <button
                  onClick={() => {
                    setShowProfile(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full py-3 px-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* General Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">General</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                    <div className="flex items-center gap-3">
                      {isDarkMode ? (
                        <Moon className="w-5 h-5 text-orange-500" />
                      ) : (
                        <Sun className="w-5 h-5 text-yellow-500" />
                      )}
                      <span className="font-medium text-gray-900 dark:text-white">Dark mode</span>
                    </div>
                    <button
                      onClick={toggleDarkMode}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                        isDarkMode ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                        isDarkMode ? 'transform translate-x-6' : ''
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-blue-500" />
                      <span className="font-medium text-gray-900 dark:text-white">Notifications</span>
                    </div>
                    <div className="w-12 h-6 bg-blue-500 rounded-full relative">
                      <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* User Preferences */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                    <span className="font-medium text-gray-900 dark:text-white">Language</span>
                    <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                    <span className="font-medium text-gray-900 dark:text-white">Time Zone</span>
                    <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option>UTC (GMT+0)</option>
                      <option>EST (GMT-5)</option>
                      <option>PST (GMT-8)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer Blank Space */}
      <div className="h-16 sm:h-20 md:h-24"></div>
    </div>
  );
};

export default Sidebar;