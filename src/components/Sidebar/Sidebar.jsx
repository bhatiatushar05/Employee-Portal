import React from 'react';
import { Home, PieChart, Camera, CheckCircle, FolderOpen, Settings, X } from 'lucide-react';

const Sidebar = ({ activeSection, setActiveSection, sidebarOpen, setSidebarOpen }) => {
  const handleSectionChange = (section) => {
    setActiveSection(section);
    // Close sidebar on mobile after selection
    if (setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 
        fixed md:relative 
        z-50 md:z-auto
        w-64 md:w-64 
        bg-teal-800 
        text-white 
        h-screen 
        flex flex-col 
        flex-shrink-0
        transition-transform duration-300 ease-in-out
        shadow-lg md:shadow-none
      `}>
        
        {/* Mobile Close Button */}
        <div className="md:hidden flex justify-end p-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md text-teal-200 hover:text-white hover:bg-teal-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col p-4 md:p-6 pt-2 md:pt-6 pb-6">
          <div className="text-xl md:text-2xl font-bold mb-6 md:mb-8 pl-1">Portal</div>
          
          <nav className="flex flex-col gap-1">
            <div className="text-xs font-semibold text-teal-200 mb-3 mt-2 pl-3 uppercase tracking-wider">
              MAIN
            </div>
            
            <button 
              onClick={() => handleSectionChange('employee')}
              className={`
                w-full flex items-center gap-3 p-3 md:p-3 rounded-md 
                bg-transparent border-none text-white cursor-pointer 
                text-sm font-medium transition-colors text-left
                min-h-[44px] md:min-h-0
                ${activeSection === 'employee' ? 'bg-teal-600' : 'hover:bg-teal-600'}
              `}
            >
              <Home size={20} />
              <span>Employee Portal</span>
            </button>
            
            <button 
              onClick={() => handleSectionChange('accounts')}
              className={`
                w-full flex items-center gap-3 p-3 md:p-3 rounded-md 
                bg-transparent border-none text-white cursor-pointer 
                text-sm font-medium transition-colors text-left
                min-h-[44px] md:min-h-0
                ${activeSection === 'accounts' ? 'bg-teal-600' : 'hover:bg-teal-600'}
              `}
            >
              <PieChart size={20} />
              <span>Accounts Portal</span>
            </button>
            
            <button 
              onClick={() => handleSectionChange('cctv')}
              className={`
                w-full flex items-center gap-3 p-3 md:p-3 rounded-md 
                bg-transparent border-none text-white cursor-pointer 
                text-sm font-medium transition-colors text-left
                min-h-[44px] md:min-h-0
                ${activeSection === 'cctv' ? 'bg-teal-600' : 'hover:bg-teal-600'}
              `}
            >
              <Camera size={20} />
              <span>CCTV Monitoring</span>
            </button>
            
            <div className="text-xs font-semibold text-teal-200 mb-3 mt-6 pl-3 uppercase tracking-wider">
              LOGS
            </div>
            
            <button className="
              w-full flex items-center gap-3 p-3 md:p-3 rounded-md 
              bg-transparent border-none text-white cursor-pointer 
              text-sm font-medium transition-colors text-left 
              hover:bg-teal-600
              min-h-[44px] md:min-h-0
            ">
              <CheckCircle size={20} />
              <span>Check-In</span>
            </button>
            
            <button className="
              w-full flex items-center gap-3 p-3 md:p-3 rounded-md 
              bg-transparent border-none text-white cursor-pointer 
              text-sm font-medium transition-colors text-left 
              hover:bg-teal-600
              min-h-[44px] md:min-h-0
            ">
              <FolderOpen size={20} />
              <span>File Manager</span>
            </button>
          </nav>
          
          <div className="mt-auto pt-6 border-t border-teal-200/10">
            <button className="
              w-full flex items-center gap-3 p-3 md:p-3 rounded-md 
              bg-transparent border-none text-white cursor-pointer 
              text-sm font-medium transition-colors text-left 
              hover:bg-teal-600
              min-h-[44px] md:min-h-0
            ">
              <Settings size={20} />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;