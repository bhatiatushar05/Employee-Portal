import React from 'react';
import { MoreVertical } from 'lucide-react';
import { checkedInEmployees, checkedOutEmployees } from '../../data/mockData';
import './EmployeeCheckTabs.css';

const EmployeeCheckTabs = ({ activeTab, setActiveTab }) => {
  const currentEmployees = activeTab === 'checkin' ? checkedInEmployees : checkedOutEmployees;

  return (
    <div>
      <div className="employee-check-tabs-header">
        <button 
          onClick={() => setActiveTab('checkin')}
          className={`employee-check-tab ${activeTab === 'checkin' ? 'employee-check-tab-active' : ''}`}
        >
          Check-In
        </button>
        <button 
          onClick={() => setActiveTab('checkout')}
          className={`employee-check-tab ${activeTab === 'checkout' ? 'employee-check-tab-active' : ''}`}
        >
          Check-Out
        </button>
      </div>
      
      {/* Employee List */}
      <div className="employee-check-list">
        {currentEmployees.map((employee, index) => (
          <div key={index} className="employee-check-item">
            <div className="employee-check-item-content">
              <div className="employee-check-avatar">
                {employee.avatar}
              </div>
              <div className="employee-check-info">
                <div className="employee-check-name">{employee.name}</div>
                <div className="employee-check-datetime">{employee.fullDateTime}</div>
              </div>
            </div>
            <div className="employee-check-actions">
              <div className={`employee-check-status ${activeTab === 'checkin' ? 'employee-check-status-in' : 'employee-check-status-out'}`}>
                {activeTab === 'checkin' ? 'IN' : 'OUT'}
              </div>
              <MoreVertical size={16} className="employee-check-menu" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeCheckTabs;