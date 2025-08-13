import React, { useState, useEffect, useRef } from 'react';
import { Clock, Calendar, Users, CheckCircle, XCircle, Timer, MapPin, User, Camera, Grid, List, Filter, TrendingUp, X } from 'lucide-react';
import TopRightHeader from '../TopRightHeader/TopRightHeader';

const EmployeeAttendance = ({ user }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [todayRecord, setTodayRecord] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState('');
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table', 'grid'
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'week', 'month', 'custom'
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load attendance data from memory
  useEffect(() => {
    // Initialize with some sample data if empty
    if (attendanceRecords.length === 0) {
      const sampleRecords = [
        {
          id: 1,
          employeeId: user?.email || 'john@company.com',
          employeeName: user?.fullName || 'John Doe',
          date: new Date().toISOString(),
          checkInTime: '09:00:00',
          checkOutTime: null,
          status: 'checked-in',
          location: '12.9716, 77.5946',
          workingHours: 0,
          checkInPhoto: '',
          checkOutPhoto: ''
        },
        {
          id: 2,
          employeeId: user?.email || 'john@company.com',
          employeeName: user?.fullName || 'John Doe',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          checkInTime: '09:15:00',
          checkOutTime: '18:30:00',
          status: 'checked-out',
          location: '12.9716, 77.5946',
          workingHours: 9.25,
          checkInPhoto: '',
          checkOutPhoto: ''
        }
      ];
      setAttendanceRecords(sampleRecords);
    }
    
    // Find today's record
    const today = new Date().toDateString();
    const todayRec = attendanceRecords.find(record => 
      new Date(record.date).toDateString() === today && 
      record.employeeId === (user?.email || 'john@company.com')
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
  }, [user, attendanceRecords.length]);

  // Cleanup camera stream on component unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      setCameraStream(stream);
      setShowCamera(true);
      
      // Small delay to ensure modal is rendered before setting video source
      setTimeout(() => {
        if (videoRef.current && stream) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch(console.error);
          };
        }
      }, 100);
      
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Unable to access camera. Please check permissions and try again.');
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && videoRef.current.videoWidth > 0) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to data URL with good quality
      const photoDataURL = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedPhoto(photoDataURL);
      
      // Stop camera and close modal
      stopCamera();
      setShowCamera(false);
    } else {
      alert('Camera not ready. Please wait a moment and try again.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
  };

  const handleCheckIn = () => {
    if (!capturedPhoto) {
      alert('Please capture your photo for check-in verification.');
      return;
    }

    const now = new Date();
    const today = now.toDateString();
    
    const newRecord = {
      id: Date.now(),
      employeeId: user?.email || 'john@company.com',
      employeeName: user?.fullName || 'John Doe',
      date: now.toISOString(),
      checkInTime: now.toLocaleTimeString(),
      checkOutTime: null,
      status: 'checked-in',
      location: location,
      workingHours: 0,
      checkInPhoto: capturedPhoto,
      checkOutPhoto: ''
    };

    const updatedRecords = [...attendanceRecords.filter(r => 
      !(new Date(r.date).toDateString() === today && r.employeeId === (user?.email || 'john@company.com'))
    ), newRecord];
    
    setAttendanceRecords(updatedRecords);
    setTodayRecord(newRecord);
    setCurrentStatus('checked-in');
    setShowCheckInModal(false);
    setCapturedPhoto(null);
  };

  const handleCheckOut = () => {
    if (!todayRecord) return;
    if (!capturedPhoto) {
      alert('Please capture your photo for check-out verification.');
      return;
    }
    
    const now = new Date();
    const checkInTime = new Date(`${new Date(todayRecord.date).toDateString()} ${todayRecord.checkInTime}`);
    const workingHours = ((now - checkInTime) / (1000 * 60 * 60)).toFixed(2);
    
    const updatedRecord = {
      ...todayRecord,
      checkOutTime: now.toLocaleTimeString(),
      status: 'checked-out',
      workingHours: parseFloat(workingHours),
      checkOutPhoto: capturedPhoto
    };

    const updatedRecords = attendanceRecords.map(record =>
      record.id === todayRecord.id ? updatedRecord : record
    );
    
    setAttendanceRecords(updatedRecords);
    setTodayRecord(updatedRecord);
    setCurrentStatus('checked-out');
    setShowCheckOutModal(false);
    setCapturedPhoto(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'checked-in': return 'bg-green-100 text-green-800';
      case 'checked-out': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Date filtering functions
  const getFilteredRecords = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return attendanceRecords
      .filter(record => record.employeeId === (user?.email || 'john@company.com'))
      .filter(record => {
        const recordDate = new Date(record.date);
        
        switch (dateFilter) {
          case 'today':
            return recordDate >= today;
          case 'week':
            return recordDate >= weekAgo;
          case 'month':
            return recordDate >= monthAgo;
          case 'custom':
            if (customDateRange.start && customDateRange.end) {
              const start = new Date(customDateRange.start);
              const end = new Date(customDateRange.end + 'T23:59:59');
              return recordDate >= start && recordDate <= end;
            }
            return true;
          default:
            return true;
        }
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const getTodayRecords = () => {
    const today = new Date().toDateString();
    return attendanceRecords.filter(record => 
      new Date(record.date).toDateString() === today && 
      record.employeeId === (user?.email || 'john@company.com')
    );
  };

  const getWeeklyRecords = () => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return attendanceRecords.filter(record => 
      new Date(record.date) >= weekAgo && 
      record.employeeId === (user?.email || 'john@company.com')
    );
  };

  const getTotalWorkingHours = () => {
    const weeklyRecords = getWeeklyRecords();
    return weeklyRecords.reduce((total, record) => total + (record.workingHours || 0), 0).toFixed(1);
  };

  const filteredRecords = getFilteredRecords();

  // Render functions for different view modes
  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Check In</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Check Out</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Working Hours</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Photos</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record, index) => (
              <tr key={record.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-200`}>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {record.checkInTime}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {record.checkOutTime || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {record.workingHours ? `${record.workingHours} hrs` : '-'}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-lg ${getStatusColor(record.status)}`}>
                    {record.status === 'checked-in' ? 'Checked In' : 'Checked Out'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {record.checkInPhoto && (
                      <img src={record.checkInPhoto} alt="Check In" className="w-8 h-8 rounded-full object-cover border border-gray-300" title="Check In Photo" />
                    )}
                    {record.checkOutPhoto && (
                      <img src={record.checkOutPhoto} alt="Check Out" className="w-8 h-8 rounded-full object-cover border border-gray-300" title="Check Out Photo" />
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <Clock size={32} className="text-gray-300" />
                  <div>
                    <p className="text-base font-medium">No attendance records found</p>
                    <p className="text-xs text-gray-400">Your attendance history will appear here</p>
                  </div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {filteredRecords.length > 0 ? (
        filteredRecords.map((record) => (
          <div key={record.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
            <div className="text-center mb-3">
              <div className="flex justify-center gap-2 mb-2">
                {record.checkInPhoto && (
                  <img src={record.checkInPhoto} alt="Check In" className="w-12 h-12 rounded-full object-cover border-2 border-green-300" title="Check In Photo" />
                )}
                {record.checkOutPhoto && (
                  <img src={record.checkOutPhoto} alt="Check Out" className="w-12 h-12 rounded-full object-cover border-2 border-blue-300" title="Check Out Photo" />
                )}
                {!record.checkInPhoto && !record.checkOutPhoto && (
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User size={24} className="text-gray-400" />
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {new Date(record.date).toLocaleDateString()}
              </h3>
              <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)} mb-3`}>
                {record.status === 'checked-in' ? 'Checked In' : 'Checked Out'}
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500" />
                <span>Check In: {record.checkInTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle size={14} className="text-blue-500" />
                <span>Check Out: {record.checkOutTime || 'Not checked out'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer size={14} className="text-orange-500" />
                <span>Hours: {record.workingHours ? `${record.workingHours} hrs` : 'In progress...'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-gray-500" />
                <span className="truncate">Location: {record.location}</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-8">
          <Clock size={32} className="text-gray-300 mx-auto mb-2" />
          <p className="text-base font-medium text-gray-500">No attendance records found</p>
          <p className="text-sm text-gray-400">Your attendance history will appear here</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex-1 min-h-0 h-full bg-gradient-to-br from-blue-50 to-indigo-100 overflow-y-auto">
      {/* Top right header */}
      <TopRightHeader user={user} />
      
      {/* Main Content with proper spacing */}
      <div className="pt-20 pb-2 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-b from-orange-600 to-blue-400 text-white rounded-xl shadow-lg">
                <Clock size={18} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Employee Attendance</h1>
                <p className="text-base text-gray-600 mt-1">Track your daily work hours and attendance with photo verification</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right text-sm">
                <p className="font-semibold text-gray-900">{currentTime.toLocaleTimeString()}</p>
                <p className="text-gray-600">{currentTime.toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-3 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-lg">
                <Timer size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 text-xs">Current Time</h3>
                <p className="text-xl font-bold text-blue-600 mt-0.5">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-3 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-green-100 to-green-200 text-green-700 rounded-lg">
                <User size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 text-xs">Employee</h3>
                <p className="text-base font-bold text-green-600 mt-0.5">{user?.fullName || 'John Doe'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-3 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${currentStatus === 'checked-in' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {currentStatus === 'checked-in' ? <CheckCircle size={18} /> : <XCircle size={18} />}
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 text-xs">Status</h3>
                <p className={`text-base font-bold mt-0.5 ${currentStatus === 'checked-in' ? 'text-green-600' : 'text-gray-600'}`}>
                  {currentStatus === 'checked-in' ? 'Checked In' : 
                   currentStatus === 'checked-out' ? 'Checked Out' : 'Not Checked In'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-3 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 rounded-lg">
                <TrendingUp size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 text-xs">Weekly Hours</h3>
                <p className="text-xl font-bold text-orange-600 mt-0.5">{getTotalWorkingHours()}h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Check In/Out Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Attendance Actions</h2>
          
          {todayRecord && (
            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-4">Today's Record</h3>
              <div className="grid md:grid-cols-4 gap-4">
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
                <div>
                  <p className="text-sm text-blue-600">Photos</p>
                  <div className="flex gap-2 mt-1">
                    {todayRecord.checkInPhoto && (
                      <img src={todayRecord.checkInPhoto} alt="Check In" className="w-8 h-8 rounded-full object-cover border border-blue-300" title="Check In Photo" />
                    )}
                    {todayRecord.checkOutPhoto && (
                      <img src={todayRecord.checkOutPhoto} alt="Check Out" className="w-8 h-8 rounded-full object-cover border border-blue-300" title="Check Out Photo" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => setShowCheckInModal(true)}
              disabled={currentStatus === 'checked-in'}
              className={`flex-1 py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 
                ${currentStatus === 'checked-in' 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
            >
              <div className="flex items-center justify-center gap-2">
                <CheckCircle size={20} />
                <Camera size={20} />
                Check In with Photo
              </div>
            </button>
            
            <button
              onClick={() => setShowCheckOutModal(true)}
              disabled={currentStatus !== 'checked-in'}
              className={`flex-1 py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300
                ${currentStatus !== 'checked-in'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
            >
              <div className="flex items-center justify-center gap-2">
                <XCircle size={20} />
                <Camera size={20} />
                Check Out with Photo
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

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">View:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                    viewMode === 'table' 
                      ? 'bg-blue-500 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <List size={14} className="inline mr-1" />
                  Table
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-blue-500 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Grid size={14} className="inline mr-1" />
                  Grid
                </button>
              </div>
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-500" />
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              {/* Custom Date Range */}
              {dateFilter === 'custom' && (
                <div className="flex items-center gap-2 text-sm">
                  <input
                    type="date"
                    value={customDateRange.start}
                    onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="date"
                    value={customDateRange.end}
                    onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Attendance Records */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-xl font-bold text-gray-900">Attendance Records</h2>
            <p className="text-gray-600 mt-1 text-sm">Track your daily attendance with photo verification</p>
          </div>
          
          {viewMode === 'table' && renderTableView()}
          {viewMode === 'grid' && renderGridView()}
        </div>

        {/* Check In Modal */}
        {showCheckInModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100 rounded-t-2xl">
                <h2 className="text-xl font-bold text-gray-900">Check In</h2>
                <p className="text-gray-600 mt-1 text-sm">Capture your photo to verify check-in</p>
              </div>
              
              <div className="p-4">
                {capturedPhoto ? (
                  <div className="text-center">
                    <img src={capturedPhoto} alt="Captured" className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-green-300" />
                    <p className="text-sm text-gray-600 mb-4">Photo captured successfully!</p>
                    <div className="flex gap-4">
                      <button
                        onClick={handleCheckIn}
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-300"
                      >
                        Confirm Check In
                      </button>
                      <button
                        onClick={retakePhoto}
                        className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all duration-300"
                      >
                        Retake
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-dashed border-gray-300">
                      <Camera size={48} className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Please capture your photo for check-in verification</p>
                    <div className="flex gap-4">
                      <button
                        onClick={startCamera}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Camera size={16} />
                        Take Photo
                      </button>
                      <button
                        onClick={() => setShowCheckInModal(false)}
                        className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Check Out Modal */}
        {showCheckOutModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-red-50 to-red-100 rounded-t-2xl">
                <h2 className="text-xl font-bold text-gray-900">Check Out</h2>
                <p className="text-gray-600 mt-1 text-sm">Capture your photo to verify check-out</p>
              </div>
              
              <div className="p-4">
                {capturedPhoto ? (
                  <div className="text-center">
                    <img src={capturedPhoto} alt="Captured" className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-red-300" />
                    <p className="text-sm text-gray-600 mb-4">Photo captured successfully!</p>
                    <div className="flex gap-4">
                      <button
                        onClick={handleCheckOut}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all duration-300"
                      >
                        Confirm Check Out
                      </button>
                      <button
                        onClick={retakePhoto}
                        className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all duration-300"
                      >
                        Retake
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-dashed border-gray-300">
                      <Camera size={48} className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Please capture your photo for check-out verification</p>
                    <div className="flex gap-4">
                      <button
                        onClick={startCamera}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Camera size={16} />
                        Take Photo
                      </button>
                      <button
                        onClick={() => setShowCheckOutModal(false)}
                        className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Camera Modal */}
        {showCamera && (showCheckInModal || showCheckOutModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[70] p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-2xl">
                <h3 className="text-lg font-bold text-gray-900">Capture Photo</h3>
                <p className="text-sm text-gray-600">Position yourself in the camera and click capture</p>
              </div>
              
              <div className="p-4 text-center">
                <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-72 object-cover"
                    style={{ transform: 'scaleX(-1)' }} // Mirror effect for selfie
                  />
                  {!cameraStream && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <div className="text-white text-center">
                        <Camera size={48} className="mx-auto mb-2 opacity-50" />
                        <p>Loading camera...</p>
                      </div>
                    </div>
                  )}
                </div>
                <canvas ref={canvasRef} className="hidden" />
                
                <div className="flex gap-4">
                  <button
                    onClick={capturePhoto}
                    disabled={!cameraStream}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Camera size={16} />
                    Capture Photo
                  </button>
                  
                  <button
                    onClick={stopCamera}
                    className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeAttendance;