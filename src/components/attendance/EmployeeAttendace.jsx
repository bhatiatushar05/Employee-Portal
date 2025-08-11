import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Users, CheckCircle, XCircle, Timer, MapPin, User } from 'lucide-react';

const EmployeeAttendance = ({ user }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [todayRecord, setTodayRecord] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState('');

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load attendance data from memory
  useEffect(() => {
    const records = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
    setAttendanceRecords(records);
    
    // Find today's record
    const today = new Date().toDateString();
    const todayRec = records.find(record => 
      new Date(record.date).toDateString() === today && 
      record.employeeId === user?.email
    );
    
    if (todayRec) {
      setTodayRecord(todayRec);
      setCurrentStatus(todayRec.status);
    }
    
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`);
        },
        () => {
          setLocation('Location not available');
        }
      );
    }
  }, [user]);

  const handleCheckIn = () => {
    const now = new Date();
    const today = now.toDateString();
    
    const newRecord = {
      id: Date.now(),
      employeeId: user.email,
      employeeName: user.fullName,
      date: now.toISOString(),
      checkInTime: now.toLocaleTimeString(),
      checkOutTime: null,
      status: 'checked-in',
      location: location,
      workingHours: 0
    };

    const updatedRecords = [...attendanceRecords.filter(r => 
      !(new Date(r.date).toDateString() === today && r.employeeId === user.email)
    ), newRecord];
    
    setAttendanceRecords(updatedRecords);
    setTodayRecord(newRecord);
    setCurrentStatus('checked-in');
    localStorage.setItem('attendanceRecords', JSON.stringify(updatedRecords));
  };

  const handleCheckOut = () => {
    if (!todayRecord) return;
    
    const now = new Date();
    const checkInTime = new Date(`${new Date(todayRecord.date).toDateString()} ${todayRecord.checkInTime}`);
    const workingHours = ((now - checkInTime) / (1000 * 60 * 60)).toFixed(2);
    
    const updatedRecord = {
      ...todayRecord,
      checkOutTime: now.toLocaleTimeString(),
      status: 'checked-out',
      workingHours: parseFloat(workingHours)
    };

    const updatedRecords = attendanceRecords.map(record =>
      record.id === todayRecord.id ? updatedRecord : record
    );
    
    setAttendanceRecords(updatedRecords);
    setTodayRecord(updatedRecord);
    setCurrentStatus('checked-out');
    localStorage.setItem('attendanceRecords', JSON.stringify(updatedRecords));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'checked-in': return 'bg-green-100 text-green-800';
      case 'checked-out': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecentRecords = () => {
    return attendanceRecords
      .filter(record => record.employeeId === user?.email)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg">
              <Clock size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Employee Attendance</h1>
              <p className="text-gray-600">Track your daily work hours and attendance</p>
            </div>
          </div>
        </div>

        {/* Current Time & Status */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <Timer size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Current Time</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {currentTime.toLocaleTimeString()}
                </p>
                <p className="text-sm text-gray-500">
                  {currentTime.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                <User size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Employee</h3>
                <p className="text-lg font-bold text-gray-800">{user?.fullName}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${currentStatus === 'checked-in' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                {currentStatus === 'checked-in' ? <CheckCircle size={24} /> : <XCircle size={24} />}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Status</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentStatus || 'not-checked-in')}`}>
                  {currentStatus === 'checked-in' ? 'Checked In' : 
                   currentStatus === 'checked-out' ? 'Checked Out' : 'Not Checked In'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Check In/Out Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Attendance Actions</h2>
          
          {todayRecord && (
            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-4">Today's Record</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-blue-600">Check In</p>
                  <p className="font-bold text-blue-900">{todayRecord.checkInTime}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Check Out</p>
                  <p className="font-bold text-blue-900">{todayRecord.checkOutTime || 'Not checked out'}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Working Hours</p>
                  <p className="font-bold text-blue-900">
                    {todayRecord.workingHours ? `${todayRecord.workingHours} hrs` : 'In progress...'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleCheckIn}
              disabled={currentStatus === 'checked-in'}
              className={`flex-1 py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 
                ${currentStatus === 'checked-in' 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
            >
              <div className="flex items-center justify-center gap-2">
                <CheckCircle size={20} />
                Check In
              </div>
            </button>
            
            <button
              onClick={handleCheckOut}
              disabled={currentStatus !== 'checked-in'}
              className={`flex-1 py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300
                ${currentStatus !== 'checked-in'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
            >
              <div className="flex items-center justify-center gap-2">
                <XCircle size={20} />
                Check Out
              </div>
            </button>
          </div>

          {location && (
            <div className="mt-4 text-sm text-gray-600 flex items-center gap-2">
              <MapPin size={16} />
              Location: {location}
            </div>
          )}
        </div>

        {/* Recent Records */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Recent Attendance Records</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getRecentRecords().length > 0 ? (
                  getRecentRecords().map((record, index) => (
                    <tr key={record.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.checkInTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.checkOutTime || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.workingHours ? `${record.workingHours} hrs` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                          {record.status === 'checked-in' ? 'Checked In' : 
                           record.status === 'checked-out' ? 'Checked Out' : 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAttendance;