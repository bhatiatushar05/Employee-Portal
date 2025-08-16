import React, { useState, useCallback, useMemo } from 'react';
import { Home, Camera, CheckCircle, FolderOpen, Settings, X, LogOut, Building2, LayoutDashboard, User, ChevronLeft, ChevronRight, Clock, Users, Menu, Bell, Search, Moon, Sun, MessageCircle } from 'lucide-react';
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
      { id: 'chat', label: 'Chat', icon: MessageCircle, category: 'main', permission: 'chat' },
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
          group relative w-full flex items-center gap-2 sm:gap-3 px-2 sm:gap-3 py-2 sm:py-2.5 rounded-lg
          text-xs sm:text-sm font-medium transition-all duration-200 text-left
          ${sidebarCollapsed ? 'justify-center px-2' : ''}
          ${isDarkMode 
            ? isActive 
              ? 'bg-blue-500/20 text-blue-300 shadow-sm border border-blue-500/30' 
              : 'text-blue-200 hover:text-blue-100 hover:bg-blue-500/10'
            : isActive 
              ? 'bg-blue-500/20 text-blue-600 shadow-sm border border-blue-500/30' 
              : 'text-black hover:text-blue-600 hover:bg-blue-500/10'
          }
        `}
        title={sidebarCollapsed ? item.label : ''}
      >
        <div className={`
          flex-shrink-0 p-1 sm:p-1.5 rounded-md transition-all duration-200
          ${isDarkMode 
            ? isActive ? 'bg-blue-500/20' : 'group-hover:bg-blue-500/10'
            : isActive ? 'bg-white/15' : 'group-hover:bg-white/10'
          }
        `}>
          <Icon size={14} className="sm:w-4 sm:h-4" />
        </div>
        
        {!sidebarCollapsed && (
          <span className="truncate">{item.label}</span>
        )}
        
        {isActive && (
          <div className={`
            absolute w-1 h-5 sm:h-6 rounded-r-full transition-all duration-200
            bg-blue-500
            ${sidebarCollapsed ? '-right-4' : '-right-3'}
          `} />
        )}
      </button>
    );
  });

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className={`
          hidden md:flex fixed top-4 z-50 w-8 h-8 
          shadow-lg border rounded-xl
          items-center justify-center transition-all duration-300 hover:shadow-xl
          ${sidebarCollapsed ? 'left-24' : 'left-72'}
          ${isDarkMode 
            ? 'bg-gradient-to-r from-blue-900 to-black border-orange-500/30 text-orange-400 hover:text-orange-300 shadow-orange-500/20' 
            : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900'
          }
        `}
        title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className={`md:hidden fixed top-4 left-4 z-40 w-10 h-10 shadow-lg border rounded-xl flex items-center justify-center ${
          isDarkMode 
            ? 'bg-gradient-to-r from-blue-900 to-black border-orange-500/30 text-orange-400 shadow-orange-500/20' 
            : 'bg-white border-gray-200 text-gray-600'
        }`}
      >
        <Menu size={18} />
      </button>

      <div className="flex h-screen relative">
        {/* Full page gradient background (light mode) to match content */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-orange-50 via-blue-50 to-orange-100 dark:from-dark-bg dark:via-dark-surface dark:to-dark-card"></div>
        
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
        ${sidebarCollapsed ? 'md:w-20' : 'md:w-64'}
        fixed md:fixed z-50 w-72 sm:w-64 h-full
        flex flex-col relative overflow-hidden
        transition-all duration-300 ease-in-out
        shadow-2xl md:shadow-2xl
        ${isDarkMode 
          ? 'bg-black border-r border-orange-500/30' 
          : 'bg-white border-r border-gray-200'
        }
        ${isDarkMode ? 'text-white' : 'text-black'}
        rounded-2xl md:rounded-2xl
        m-4 md:m-4
        h-[calc(100vh-2rem)] h-[calc(100dvh-2rem)]
      `}>
        {/* Subtle top-left orange accent (light mode only) */}
        {!isDarkMode && (
          <div className="pointer-events-none absolute -top-12 -left-12 w-56 h-56 rounded-full bg-gradient-to-br from-orange-400/25 via-orange-300/10 to-transparent blur-2xl" />
        )}
        
        {/* Header */}
        <div className={`
          flex items-center justify-between p-3 sm:p-4 border-b 
          ${sidebarCollapsed ? 'px-2' : ''}
          ${isDarkMode 
            ? 'border-orange-500/30 bg-black' 
            : 'border-slate-900/30'
          }
        `}>
          {/* Sidebar Header with Logo */}
          <div className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-b rounded-xl ${sidebarCollapsed ? 'px-2 justify-center' : ''} ${
            isDarkMode 
              ? 'border-orange-500/30 bg-gradient-to-r from-blue-900/50 to-black/50' 
              : 'border-gray-200 bg-gray-50'
          }`}>
            <img
              src={HLogo}
              alt="Company Logo"
              className={`${sidebarCollapsed ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-10 h-10 sm:w-12 sm:h-12'} object-contain`}
            />
            {!sidebarCollapsed && (
              <div>
                <h1 className={`text-base sm:text-lg font-bold ${
                  isDarkMode ? 'text-orange-400' : 'text-black'
                }`}>HITS</h1>
                <p className={`text-xs font-semibold ${
                  isDarkMode ? 'text-orange-300/70' : 'text-gray-700'
                }`}>Employee System</p>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className={`md:hidden p-1 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-orange-500/20 text-orange-300' 
                : 'hover:bg-white/10'
            }`}
          >
            <X size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>

        {/* User Section */}
        {user && (
          <div className={`p-3 sm:p-4 border-b ${sidebarCollapsed ? 'px-2' : ''} ${
            isDarkMode 
              ? 'border-orange-500/30 bg-black' 
              : 'border-gray-200 bg-gray-50'
          }`}>
            {!sidebarCollapsed ? (
              <div className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl border ${
                isDarkMode 
                  ? 'bg-orange-500/10 border-orange-500/30' 
                  : 'bg-gray-100 border-gray-200'
              }`}>
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={12} className="sm:w-[14px] sm:h-[14px]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs sm:text-sm font-bold truncate ${
                    isDarkMode ? 'text-orange-300' : 'text-black'
                  }`}>
                    {user.fullName ? user.fullName.split(' ')[0] : 'User'}
                  </p>
                  <p className={`text-xs font-semibold truncate ${
                    isDarkMode ? 'text-orange-400/70' : 'text-gray-700'
                  }`}>
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
              <h3 className={`text-xs font-semibold uppercase tracking-wider px-2 sm:px-3 ${
                isDarkMode ? 'text-orange-300' : 'text-gray-700'
              }`}>
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
          {toolItems.length > 0 && (
            <div className="space-y-2">
              {!sidebarCollapsed && (
                <h3 className={`text-xs font-semibold uppercase tracking-wider px-2 sm:px-3 ${
                  isDarkMode ? 'text-orange-300' : 'text-gray-700'
                }`}>
                  Tools
                </h3>
              )}
              {sidebarCollapsed && (
                <div className={`border-t ${
                  isDarkMode ? 'border-orange-500/40' : 'border-gray-200'
                }`} />
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
          )}
        </nav>

        {/* Footer */}
        <div className={`p-4 border-t space-y-1 ${sidebarCollapsed ? 'px-2' : ''} ${
          isDarkMode 
            ? 'border-orange-500/40 bg-black' 
            : 'border-gray-200 bg-gray-50'
        }`}>
          {/* Profile Button */}
          <button 
            onClick={() => setShowProfile(true)}
            className={`
              group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
              text-sm font-medium transition-all duration-200 text-left
              ${sidebarCollapsed ? 'justify-center px-2' : ''}
              ${isDarkMode 
                ? 'text-orange-300 hover:text-orange-200 hover:bg-orange-500/20' 
                : 'text-black font-semibold hover:text-blue-600 hover:bg-blue-50'
              }
            `}
            title={sidebarCollapsed ? 'Profile' : ''}
          >
            <div className={`flex-shrink-0 p-1.5 rounded-md transition-all duration-200 ${
              isDarkMode 
                ? 'group-hover:bg-orange-500/20' 
                : 'group-hover:bg-blue-100'
            }`}>
              <User size={16} />
            </div>
            {!sidebarCollapsed && <span>Profile</span>}
          </button>

          {/* Settings Button */}
          <button 
            onClick={() => setShowSettings(true)}
            className={`
              group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
              text-sm font-medium transition-all duration-200 text-left
              ${sidebarCollapsed ? 'justify-center px-2' : ''}
              ${isDarkMode 
                ? 'text-orange-300 hover:text-orange-200 hover:bg-orange-500/20' 
                : 'text-black font-semibold hover:text-blue-600 hover:bg-blue-50'
              }
            `}
            title={sidebarCollapsed ? 'Settings' : ''}
          >
            <div className={`flex-shrink-0 p-1.5 rounded-md transition-all duration-200 ${
              isDarkMode 
                ? 'group-hover:bg-orange-500/20' 
                : 'group-hover:bg-blue-100'
            }`}>
              <Settings size={16} />
            </div>
            {!sidebarCollapsed && <span>Settings</span>}
          </button>
          
          {/* Logout Button */}
          {onLogout && (
            <button 
              onClick={onLogout}
              className={`
                group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                text-sm font-medium transition-all duration-200 text-left
                ${sidebarCollapsed ? 'justify-center px-2' : ''}
                ${isDarkMode 
                  ? 'text-orange-300 hover:text-orange-200 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-600/20' 
                  : 'text-black font-semibold hover:text-red-600 hover:bg-red-50'
                }
              `}
              title={sidebarCollapsed ? 'Logout' : ''}
            >
              <div className={`flex-shrink-0 p-1.5 rounded-md transition-all duration-200 ${
                isDarkMode 
                  ? 'group-hover:bg-orange-500/20' 
                  : 'group-hover:bg-red-100'
              }`}>
                <LogOut size={16} />
              </div>
              {!sidebarCollapsed && <span>Logout</span>}
            </button>
          )}
        </div>
      </aside>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
          <div className={`rounded-lg shadow-2xl w-full max-w-md ${
            isDarkMode ? 'bg-dark-card border border-dark-border' : 'bg-white'
          }`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Profile</h2>
                <button 
                  onClick={() => setShowProfile(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'hover:bg-gray-800 text-gray-300' 
                      : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-500 to-blue-500 flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
                  <span className="text-3xl font-bold text-white">{user?.fullName?.[0] || 'U'}</span>
                </div>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>{user?.email || 'user@hits.com'}</p>
                <p className={`text-sm mt-1 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                } capitalize`}>{user?.role || 'user'}</p>
              </div>

              <div className={`border-t pt-4 ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
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
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4`}>
          <div className={`rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
            isDarkMode ? 'bg-dark-card border border-dark-border' : 'bg-white'
          }`}>
            <div className={`p-6 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Settings</h2>
                <button 
                  onClick={() => setShowSettings(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'hover:bg-gray-800 text-gray-300' 
                      : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* General Settings */}
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>General</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`flex items-center justify-between p-4 border rounded-lg ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-800' 
                      : 'border-gray-200 bg-white'
                  }`}>
                    <div className="flex items-center gap-3">
                      {isDarkMode ? (
                        <Moon className="w-5 h-5 text-orange-500" />
                      ) : (
                        <Sun className="w-5 h-5 text-yellow-500" />
                      )}
                      <span className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Dark mode</span>
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

                  <div className={`flex items-center justify-between p-4 border rounded-lg ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-800' 
                      : 'border-gray-200 bg-white'
                  }`}>
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-blue-500" />
                      <span className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Notifications</span>
                    </div>
                    <div className="w-12 h-6 bg-blue-500 rounded-full relative">
                      <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* User Preferences */}
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>User Preferences</h3>
                <div className="space-y-3">
                  <div className={`flex items-center justify-between p-3 border rounded-lg ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-800' 
                      : 'border-gray-200 bg-white'
                  }`}>
                    <span className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Language</span>
                    <select className={`px-3 py-1 border rounded text-sm ${
                      isDarkMode 
                        ? 'border-gray-600 bg-gray-700 text-white' 
                        : 'border-gray-300 bg-white text-gray-900'
                    }`}>
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                  <div className={`flex items-center justify-between p-3 border rounded-lg ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-800' 
                      : 'border-gray-200 bg-white'
                  }`}>
                    <span className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Time Zone</span>
                    <select className={`px-3 py-1 border rounded text-sm ${
                      isDarkMode 
                        ? 'border-gray-600 bg-gray-700 text-white' 
                        : 'border-gray-300 bg-white text-gray-900'
                    }`}>
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
      
      {/* Main Content Area with proper spacing */}
      <main className={`flex-1 transition-all duration-300 ${
        sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
      }`}>
        {/* Your main content goes here */}
        <div className="h-16 sm:h-20 md:h-24"></div>
      </main>
    </div>
    </>
  );
};

export default Sidebar;