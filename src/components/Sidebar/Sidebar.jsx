import React from 'react';
import { Home, PieChart, Camera, CheckCircle, FolderOpen, Settings } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const handleMouseOver = (e, section) => {
    if (activeSection !== section) {
      e.target.classList.add('sidebar-button-hover');
    }
  };

  const handleMouseOut = (e, section) => {
    if (activeSection !== section) {
      e.target.classList.remove('sidebar-button-hover');
    }
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-content">
        <div className="sidebar-title">Portal</div>
        
        <nav className="sidebar-nav">
          <div className="sidebar-section-title">MAIN</div>
          
          <button 
            onClick={() => setActiveSection('employee')}
            className={`sidebar-button ${activeSection === 'employee' ? 'sidebar-button-active' : ''}`}
            onMouseOver={(e) => handleMouseOver(e, 'employee')}
            onMouseOut={(e) => handleMouseOut(e, 'employee')}
          >
            <Home size={20} />
            <span>Employee Portal</span>
          </button>
          
          <button 
            onClick={() => setActiveSection('accounts')}
            className={`sidebar-button ${activeSection === 'accounts' ? 'sidebar-button-active' : ''}`}
            onMouseOver={(e) => handleMouseOver(e, 'accounts')}
            onMouseOut={(e) => handleMouseOut(e, 'accounts')}
          >
            <PieChart size={20} />
            <span>Accounts Portal</span>
          </button>
          
          <button 
            onClick={() => setActiveSection('cctv')}
            className={`sidebar-button ${activeSection === 'cctv' ? 'sidebar-button-active' : ''}`}
            onMouseOver={(e) => handleMouseOver(e, 'cctv')}
            onMouseOut={(e) => handleMouseOut(e, 'cctv')}
          >
            <Camera size={20} />
            <span>CCTV Monitoring</span>
          </button>

          <div className="sidebar-section-title sidebar-section-logs">LOGS</div>
          
          <button className="sidebar-button">
            <CheckCircle size={20} />
            <span>Check-In</span>
          </button>
          
          <button className="sidebar-button">
            <FolderOpen size={20} />
            <span>File Manager</span>
          </button>
        </nav>
        
        <div className="sidebar-settings">
          <button className="sidebar-button">
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;