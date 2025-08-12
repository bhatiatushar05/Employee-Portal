import React, { useState, useCallback, useMemo } from 'react';
import { Home, PieChart, Camera, CheckCircle, FolderOpen, Settings, X, LogOut, Building2, LayoutDashboard, User, ChevronLeft, ChevronRight, Clock, Users, Menu } from 'lucide-react';
import HLogo from '../../assets/H logo.png'; // Make sure the file is in src/assets/

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
  // Memoized navigation items to prevent re-creation on every render
  const navigationItems = useMemo(() => [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'main' },
    { id: 'employee', label: 'Employee Portal', icon: Home, category: 'main' },
    { id: 'attendance', label: 'Attendance', icon: Clock, category: 'main' },
    { id: 'visitor', label: 'Visitor Management', icon: Users, category: 'main' },
    { id: 'accounts', label: 'Accounts Portal', icon: PieChart, category: 'main' },
    { id: 'cctv', label: 'CCTV Monitoring', icon: Camera, category: 'main' },
    { id: 'checkin', label: 'Check-In', icon: CheckCircle, category: 'tools' },
    { id: 'files', label: 'File Manager', icon: FolderOpen, category: 'tools' },
  ], []);

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
          group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
          text-sm font-medium transition-all duration-200 text-left
          ${sidebarCollapsed ? 'justify-center px-2' : ''}
          ${isActive 
            ? 'bg-white/10 text-white shadow-sm border border-white/10' 
            : 'text-gray-300 hover:text-white hover:bg-white/5'
          }
        `}
        title={sidebarCollapsed ? item.label : ''}
      >
        <div className={`
          flex-shrink-0 p-1.5 rounded-md transition-all duration-200
          ${isActive ? 'bg-white/15' : 'group-hover:bg-white/10'}
        `}>
          <Icon size={16} />
        </div>
        
        {!sidebarCollapsed && (
          <span className="truncate">{item.label}</span>
        )}
        
        {isActive && (
          <div className={`
            absolute w-1 h-6 bg-blue-400 rounded-r-full transition-all duration-200
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
        fixed md:relative z-50 md:z-auto w-64 h-full
        bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800
        text-white flex flex-col
        transition-all duration-300 ease-in-out
        border-r border-blue-700/40
        shadow-xl md:shadow-none
      `}>
        
        {/* Header */}
        <div className={`
          flex items-center justify-between p-4 border-b border-blue-700/40
          ${sidebarCollapsed ? 'px-2' : ''}
        `}>
          {/* Sidebar Header with Logo */}
          <div className={`flex items-center gap-3 p-4 border-b border-blue-700/40 ${sidebarCollapsed ? 'px-2 justify-center' : ''}`}>
            <img
              src={HLogo}
              alt="Company Logo"
              className="w-12 h-12 object-contain"
            />
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-lg font-bold text-white">HITS</h1>
                <p className="text-xs text-gray-400">Employee System</p>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Section */}
        {user && (
          <div className={`p-4 border-b border-blue-700/40 ${sidebarCollapsed ? 'px-2' : ''}`}>
            {!sidebarCollapsed ? (
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-blue-500 rounded-full flex items-center justify-center">
                  <User size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.fullName ? user.fullName.split(' ')[0] : 'User'}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user.email || 'employee@hits.com'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-blue-500 rounded-full flex items-center justify-center" title={user.fullName || 'User'}>
                  <User size={14} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className={`flex-1 p-4 space-y-6 overflow-y-auto ${sidebarCollapsed ? 'px-2' : ''}`}>
          {/* Main Navigation */}
          <div className="space-y-2">
            {!sidebarCollapsed && (
              <h3 className="text-xs font-semibold text-blue-200 uppercase tracking-wider px-3">
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
              <h3 className="text-xs font-semibold text-blue-200 uppercase tracking-wider px-3">
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
          <button 
            onClick={() => handleSectionChange('settings')}
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
    </div>
  );
};

export default Sidebar;