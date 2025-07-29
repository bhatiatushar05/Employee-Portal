import React from 'react';
import { Search, User } from 'lucide-react';
import FaceRecognitionAttendance from '../CCTVFeed/FaceRecognitionAttendance';
import MotionEvents from '../MotionEvents/MotionEvents';
import EmployeeCheckTabs from '../EmployeeCheckTabs/EmployeeCheckTabs';
// Removed: import './CCTVMonitoring.css';

const CCTVMonitoring = ({ activeTab, setActiveTab }) => {
  // Attendance log state
  const [attendanceLogs, setAttendanceLogs] = React.useState([]);

  // Handler for check-in/out
  const handleCheckInOut = (photo) => {
    setAttendanceLogs((prev) => [
      {
        name: 'User',
        time: new Date().toLocaleString(),
        photo,
      },
      ...prev,
    ]);
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 leading-tight">CCTV Real-Time Monitoring</h1>
        <div className="flex items-center gap-5">
          <span className="text-gray-500 text-sm font-medium">25 Apr 10:14 AM</span>
          <Search size={24} className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors" />
          <User size={24} className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors" />
        </div>
      </div>
      <div className="grid grid-cols-[2fr_1fr] gap-8 max-w-[1400px] mx-auto">
        {/* Left Column - Face Recognition Attendance */}
        <div className="flex flex-col gap-6">
          <FaceRecognitionAttendance onCheckInOut={handleCheckInOut} />
          <MotionEvents />
        </div>
        {/* Right Sidebar */}
        <div className="flex flex-col gap-6">
          <EmployeeCheckTabs activeTab={activeTab} setActiveTab={setActiveTab} attendanceLogs={attendanceLogs} />
          <MotionEvents sidebar={true} />
        </div>
      </div>
    </div>
  );
};

export default CCTVMonitoring;