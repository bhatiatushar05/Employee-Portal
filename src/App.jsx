import React, { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import EmployeePortal from './components/EmployeePortal/EmployeePortal';
import AccountsPortal from './components/AccountsPortal/AccountsPortal';
import CCTVMonitoring from './components/CCTVMonitoring/CCTVMonitoring';
import './App.css';

const App = () => {
  const [activeSection, setActiveSection] = useState('employee');
  const [activeTab, setActiveTab] = useState('checkin');

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

  return (
    <div className="app-container">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      {renderContent()}
    </div>
  );
};

export default App;