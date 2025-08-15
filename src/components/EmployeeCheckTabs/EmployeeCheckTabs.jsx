import React from 'react';
import { MoreVertical } from 'lucide-react';
import { checkedInEmployees, checkedOutEmployees } from '../../data/mockData';
// Removed: import './EmployeeCheckTabs.css';

const EmployeeCheckTabs = ({ activeTab, setActiveTab, attendanceLogs = [] }) => {
  const currentEmployees = activeTab === 'checkin' ? checkedInEmployees : checkedOutEmployees;

  return (
    <div>
      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('checkin')}
          className={`px-4 py-3 border-b-2 text-gray-500 font-medium bg-transparent border-none cursor-pointer text-base outline-none ${activeTab === 'checkin' ? 'border-teal-600 text-teal-600' : 'border-transparent'}`}
        >
          Check-In
        </button>
        <button 
          onClick={() => setActiveTab('checkout')}
          className={`px-4 py-3 border-b-2 text-gray-500 font-medium bg-transparent border-none cursor-pointer text-base outline-none ${activeTab === 'checkout' ? 'border-teal-600 text-teal-600' : 'border-transparent'}`}
        >
          Check-Out
        </button>
      </div>
      {/* Attendance Logs with Photos */}
      {attendanceLogs.length > 0 && (
        <div className="mt-4 flex flex-col gap-3">
          {attendanceLogs.map((log, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
              <div className="flex items-center gap-3">
                <img src={log.photo} alt="Attendance" className="w-10 h-10 rounded-full object-cover border-2 border-blue-400" />
                <div>
                  <div className="font-medium text-gray-800">{log.name}</div>
                  <div className="text-sm text-gray-500">{log.time}</div>
                </div>
              </div>
              <div className="px-2 py-1 rounded-xl text-xs font-medium bg-blue-100 text-blue-800">Photo Log</div>
            </div>
          ))}
        </div>
      )}
      {/* Employee List */}
      <div className="mt-4 flex flex-col gap-3 max-h-[400px] overflow-y-auto">
        {currentEmployees.map((employee, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-base">
                {employee.avatar}
              </div>
              <div>
                <div className="font-medium text-gray-800">{employee.name}</div>
                <div className="text-sm text-gray-500">{employee.fullDateTime}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-2 py-1 rounded-xl text-xs font-medium ${activeTab === 'checkin' ? 'bg-emerald-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{activeTab === 'checkin' ? 'IN' : 'OUT'}</div>
              <MoreVertical size={16} className="text-gray-400" />
            </div>
          </div>
        ))}
        
        {/* Footer Blank Space */}
        <div className="h-16 sm:h-20 md:h-24"></div>
      </div>
    </div>
  );
};

export default EmployeeCheckTabs;