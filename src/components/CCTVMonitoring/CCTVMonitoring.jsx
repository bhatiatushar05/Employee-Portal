import React from 'react';
import { Search, User } from 'lucide-react';
import CCTVFeed from '../CCTVFeed/CCTVFeed';
import MotionEvents from '../MotionEvents/MotionEvents';
import EmployeeCheckTabs from '../EmployeeCheckTabs/EmployeeCheckTabs';
import './CCTVMonitoring.css';

const CCTVMonitoring = ({ activeTab, setActiveTab }) => {
  return (
    <div className="cctv-monitoring-container">
      <div className="cctv-monitoring-header">
        <h1 className="cctv-monitoring-title">CCTV Real-Time Monitoring</h1>
        <div className="cctv-monitoring-header-actions">
          <span className="cctv-monitoring-time">25 Apr 10:14 AM</span>
          <Search size={24} className="cctv-monitoring-icon" />
          <User size={24} className="cctv-monitoring-icon" />
        </div>
      </div>

      <div className="cctv-monitoring-grid">
        {/* Left Column - CCTV Feed and Motion Events */}
        <div className="cctv-monitoring-left">
          <CCTVFeed />
          <MotionEvents />
        </div>

        {/* Right Sidebar */}
        <div className="cctv-monitoring-right">
          <EmployeeCheckTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <MotionEvents sidebar={true} />
        </div>
      </div>
    </div>
  );
};

export default CCTVMonitoring;