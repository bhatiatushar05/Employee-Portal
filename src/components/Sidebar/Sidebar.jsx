import React from 'react';
import { Home, PieChart, Camera, CheckCircle, FolderOpen, Settings, X, LogOut, Building2, LayoutDashboard, User, ChevronLeft, ChevronRight, Clock, Users } from 'lucide-react';

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
  const handleSectionChange = (section) => {
    setActiveSection(section);
    // Close sidebar on mobile after selection
    if (setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Desktop Collapse Toggle Button */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className={`
          hidden md:flex fixed top-1/2 -translate-y-1/2 z-50
          w-6 h-12 bg-gradient-to-b from-blue-700 to-blue-800
          hover:from-blue-600 hover:to-blue-700
          text-white items-center justify-center
          border border-blue-600 shadow-lg hover:shadow-xl
          transition-all duration-500 ease-in-out
          ${sidebarCollapsed ? 'left-0 rounded-r-lg' : 'left-64 rounded-l-lg'}
        `}
        title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {sidebarCollapsed ? (
          <ChevronRight size={14} className="text-blue-200" />
        ) : (
          <ChevronLeft size={14} className="text-blue-200" />
        )}
      </button>

      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 
        ${sidebarCollapsed ? 'md:-translate-x-full md:w-0' : 'md:translate-x-0 md:w-64'}
        fixed md:static
        z-50 md:z-auto
        w-64
        bg-gradient-to-b from-blue-800 via-sky-800 to-blue-900
        text-white
        h-full md:h-screen
        flex flex-col 
        flex-shrink-0
        transition-all duration-500 ease-in-out
        shadow-2xl md:shadow-xl
        border-r border-blue-700/50
        overflow-hidden
      `}>
        
        {/* Mobile Close Button */}
        <div className="md:hidden flex justify-end p-3 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-blue-700/50 transition-all duration-300 hover:scale-110"
          >
            <X size={18} />
          </button>
        </div>

        {/* Main Content Container - Fixed height and scrollable */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Top Section - Fixed */}
          <div className="flex-shrink-0 p-4 md:p-5 pt-2 md:pt-4">
            {/* Enhanced Logo Section - Compact */}
            <div className="flex items-center gap-3 mb-4 pl-1 animate-slide-in-left">
              <div className="relative">
                <Building2 className="w-7 h-7 text-blue-300" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <div className="text-lg md:text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Portal
                </div>
                <div className="text-xs text-blue-300 font-medium">Employee System</div>
              </div>
            </div>

            {/* User Welcome Section - Compact */}
            {user && (
              <div className="bg-blue-700/30 backdrop-blur-sm border border-blue-600/20 rounded-xl p-3 mb-4 animate-slide-in-left">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-blue-600/50 rounded-lg">
                    <User size={14} className="text-blue-200" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {user.fullName ? `Welcome, ${user.fullName.split(' ')[0]}!` : 'Welcome!'}
                    </div>
                    <div className="text-xs text-blue-300">
                      {user.email || 'Employee Portal'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Scrollable Navigation Section */}
          <div className="flex-1 px-4 md:px-5 overflow-y-auto min-h-0">
            <div className="text-xs font-bold text-blue-200 mb-3 pl-3 uppercase tracking-wider animate-slide-in-left-delay">
              MAIN NAVIGATION
            </div>
            
            {/* Navigation buttons - Compact spacing */}
            <div className="flex flex-col gap-1.5">
              {/* Dashboard Button */}
              <button 
                onClick={() => handleSectionChange('dashboard')}
                className={`
                  group w-full flex items-center gap-3 p-3 rounded-xl 
                  bg-transparent border-none text-white cursor-pointer 
                  text-sm font-medium transition-all duration-300 text-left
                  hover:scale-105
                  ${activeSection === 'dashboard' 
                    ? 'bg-gradient-to-r from-blue-600 to-sky-600 shadow-lg shadow-blue-500/25' 
                    : 'hover:bg-blue-700/50 hover:shadow-md'
                  }
                  animate-slide-in-left-delay-2
                `}
              >
                <div className={`p-1.5 rounded-lg transition-all duration-300 ${activeSection === 'dashboard' ? 'bg-white/20' : 'group-hover:bg-white/10'}`}>
                  <LayoutDashboard size={18} />
                </div>
                <span className="font-semibold">Dashboard</span>
                {activeSection === 'dashboard' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
              
              <button 
                onClick={() => handleSectionChange('employee')}
                className={`
                  group w-full flex items-center gap-3 p-3 rounded-xl 
                  bg-transparent border-none text-white cursor-pointer 
                  text-sm font-medium transition-all duration-300 text-left
                  hover:scale-105
                  ${activeSection === 'employee' 
                    ? 'bg-gradient-to-r from-blue-600 to-sky-600 shadow-lg shadow-blue-500/25' 
                    : 'hover:bg-blue-700/50 hover:shadow-md'
                  }
                  animate-slide-in-left-delay-2
                `}
              >
                <div className={`p-1.5 rounded-lg transition-all duration-300 ${activeSection === 'employee' ? 'bg-white/20' : 'group-hover:bg-white/10'}`}>
                  <Home size={18} />
                </div>
                <span className="font-semibold">Employee Portal</span>
                {activeSection === 'employee' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>

              {/* Attendance Section */}
              <button 
                onClick={() => handleSectionChange('attendance')}
                className={`
                  group w-full flex items-center gap-3 p-3 rounded-xl 
                  bg-transparent border-none text-white cursor-pointer 
                  text-sm font-medium transition-all duration-300 text-left
                  hover:scale-105
                  ${activeSection === 'attendance' 
                    ? 'bg-gradient-to-r from-blue-600 to-sky-600 shadow-lg shadow-blue-500/25' 
                    : 'hover:bg-blue-700/50 hover:shadow-md'
                  }
                  animate-slide-in-left-delay-2
                `}
              >
                <div className={`p-1.5 rounded-lg transition-all duration-300 ${activeSection === 'attendance' ? 'bg-white/20' : 'group-hover:bg-white/10'}`}>
                  <Clock size={18} />
                </div>
                <span className="font-semibold">Attendance</span>
                {activeSection === 'attendance' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>

              {/* Visitor Management Section */}
              <button 
                onClick={() => handleSectionChange('visitor')}
                className={`
                  group w-full flex items-center gap-3 p-3 rounded-xl 
                  bg-transparent border-none text-white cursor-pointer 
                  text-sm font-medium transition-all duration-300 text-left
                  hover:scale-105
                  ${activeSection === 'visitor' 
                    ? 'bg-gradient-to-r from-blue-600 to-sky-600 shadow-lg shadow-blue-500/25' 
                    : 'hover:bg-blue-700/50 hover:shadow-md'
                  }
                  animate-slide-in-left-delay-2
                `}
              >
                <div className={`p-1.5 rounded-lg transition-all duration-300 ${activeSection === 'visitor' ? 'bg-white/20' : 'group-hover:bg-white/10'}`}>
                  <Users size={18} />
                </div>
                <span className="font-semibold">Visitor Management</span>
                {activeSection === 'visitor' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
              
              <button 
                onClick={() => handleSectionChange('accounts')}
                className={`
                  group w-full flex items-center gap-3 p-3 rounded-xl 
                  bg-transparent border-none text-white cursor-pointer 
                  text-sm font-medium transition-all duration-300 text-left
                  hover:scale-105
                  ${activeSection === 'accounts' 
                    ? 'bg-gradient-to-r from-blue-600 to-sky-600 shadow-lg shadow-blue-500/25' 
                    : 'hover:bg-blue-700/50 hover:shadow-md'
                  }
                  animate-slide-in-left-delay-2
                `}
              >
                <div className={`p-1.5 rounded-lg transition-all duration-300 ${activeSection === 'accounts' ? 'bg-white/20' : 'group-hover:bg-white/10'}`}>
                  <PieChart size={18} />
                </div>
                <span className="font-semibold">Accounts Portal</span>
                {activeSection === 'accounts' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
              
              <button 
                onClick={() => handleSectionChange('cctv')}
                className={`
                  group w-full flex items-center gap-3 p-3 rounded-xl 
                  bg-transparent border-none text-white cursor-pointer 
                  text-sm font-medium transition-all duration-300 text-left
                  hover:scale-105
                  ${activeSection === 'cctv' 
                    ? 'bg-gradient-to-r from-blue-600 to-sky-600 shadow-lg shadow-blue-500/25' 
                    : 'hover:bg-blue-700/50 hover:shadow-md'
                  }
                  animate-slide-in-left-delay-2
                `}
              >
                <div className={`p-1.5 rounded-lg transition-all duration-300 ${activeSection === 'cctv' ? 'bg-white/20' : 'group-hover:bg-white/10'}`}>
                  <Camera size={18} />
                </div>
                <span className="font-semibold">CCTV Monitoring</span>
                {activeSection === 'cctv' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
              
              <div className="text-xs font-bold text-blue-200 mb-3 mt-4 pl-3 uppercase tracking-wider animate-slide-in-left-delay">
                TOOLS
              </div>
              
              <button 
                onClick={() => handleSectionChange('checkin')}
                className="
                  group w-full flex items-center gap-3 p-3 rounded-xl 
                  bg-transparent border-none text-white cursor-pointer 
                  text-sm font-medium transition-all duration-300 text-left 
                  hover:bg-blue-700/50 hover:scale-105
                  animate-slide-in-left-delay-2
                "
              >
                <div className="p-1.5 rounded-lg transition-all duration-300 group-hover:bg-white/10">
                  <CheckCircle size={18} />
                </div>
                <span className="font-semibold">Check-In</span>
              </button>
              
              <button 
                onClick={() => handleSectionChange('files')}
                className="
                  group w-full flex items-center gap-3 p-3 rounded-xl 
                  bg-transparent border-none text-white cursor-pointer 
                  text-sm font-medium transition-all duration-300 text-left 
                  hover:bg-blue-700/50 hover:scale-105
                  animate-slide-in-left-delay-2
                "
              >
                <div className="p-1.5 rounded-lg transition-all duration-300 group-hover:bg-white/10">
                  <FolderOpen size={18} />
                </div>
                <span className="font-semibold">File Manager</span>
              </button>
            </div>
          </div>
          
          {/* Bottom section - Fixed at bottom */}
          <div className="flex-shrink-0 px-4 md:px-5 pb-3 md:pb-4 pt-3 border-t border-blue-200/20">
            <button 
              onClick={() => handleSectionChange('settings')}
              className="
                group w-full flex items-center gap-3 p-3 rounded-xl 
                bg-transparent border-none text-white cursor-pointer 
                text-sm font-medium transition-all duration-300 text-left 
                hover:bg-blue-700/50 hover:scale-105
                animate-slide-in-left-delay-2
              "
            >
              <div className="p-1.5 rounded-lg transition-all duration-300 group-hover:bg-white/10">
                <Settings size={18} />
              </div>
              <span className="font-semibold">Settings</span>
            </button>
            
            {onLogout && (
              <button 
                onClick={onLogout}
                className="
                  group w-full flex items-center gap-3 p-3 rounded-xl mt-1.5
                  bg-transparent border-none text-pink-300 cursor-pointer 
                  text-sm font-medium transition-all duration-300 text-left 
                  hover:bg-pink-500/20 hover:text-pink-200 hover:scale-105
                  animate-slide-in-left-delay-2
                "
              >
                <div className="p-1.5 rounded-lg transition-all duration-300 group-hover:bg-pink-500/20">
                  <LogOut size={18} />
                </div>
                <span className="font-semibold">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;