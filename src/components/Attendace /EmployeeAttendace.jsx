import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Clock, Calendar, Users, CheckCircle, XCircle, Timer, MapPin, User, Camera, Grid, List, Filter, TrendingUp, X, BarChart3, PieChart, Activity, Search, Download, Eye, ChevronDown, RefreshCw, Bell } from 'lucide-react';
import TopRightHeader from '../TopRightHeader/TopRightHeader';
import { useAuth } from '../../contexts/AuthContext';
import Pooja from '../../assets/Pooja.png';


const EmployeeAttendance = ({ user }) => {
  const { isAdmin, isEmployee } = useAuth();
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
  const [searchTerm, setSearchTerm] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
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
    console.log('Loading attendance data for user:', user?.email);
    // Load existing data from localStorage first
    let saved = null;
    try {
      saved = localStorage.getItem('hits_attendance_records');
      console.log('Found saved data:', saved ? 'yes' : 'no');
      if (saved) {
        const parsedRecords = JSON.parse(saved);
        console.log('Parsed records:', parsedRecords.length);
        setAttendanceRecords(parsedRecords);
      }
    } catch (error) {
      console.error('Error loading attendance records:', error);
    }
    
    // Initialize with sample data only if no data exists in localStorage
    if (!saved || attendanceRecords.length === 0) {
      const sampleRecords = [
        {
          id: 1,
          employeeId: 'Vikas@company.com',
          employeeName: 'Vikas',
          date: new Date().toISOString(),
          checkInTime: '09:00:00',
          checkOutTime: null,
          status: 'checked-in',
          location: '12.9716, 77.5946',
          workingHours: 0,
          checkInPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          checkOutPhoto: ''
        },
        {
          id: 2,
          employeeId: 'Viraj@company.com',
          employeeName: 'Viraj',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          checkInTime: '09:15:00',
          checkOutTime: '18:30:00',
          status: 'checked-out',
          location: '12.9716, 77.5946',
          workingHours: 9.25,
          checkInPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          checkOutPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
        },
        {
          id: 3,
          employeeId: 'Pooja@company.com',
          employeeName: 'Pooja',
          date: new Date().toISOString(),
          checkInTime: '08:45:00',
          checkOutTime: null,
          status: 'checked-in',
          location: '12.9716, 77.5946',
          workingHours: 0,
          checkInPhoto: Pooja,
          checkOutPhoto: ''
        },
        {
          id: 4,
          employeeId: 'Nirmal@company.com',
          employeeName: 'Nirmal',
          date: new Date().toISOString(),
          checkInTime: '09:30:00',
          checkOutTime: null,
          status: 'checked-in',
          location: '12.9716, 77.5946',
          workingHours: 0,
          checkInPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          checkOutPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
        },
        {
          id: 5,
          employeeId: 'Avnish@company.com',
          employeeName: 'Avnish Ji',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          checkInTime: '08:30:00',
          checkOutTime: '17:45:00',
          status: 'checked-out',
          location: '12.9716, 77.5946',
          workingHours: 9.25,
          checkInPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          checkOutPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        }
      ];
      setAttendanceRecords(sampleRecords);
      
      // Save sample data to localStorage
      try {
        localStorage.setItem('hits_attendance_records', JSON.stringify(sampleRecords));
      } catch (error) {
        console.error('Error saving sample records:', error);
      }
    }
    
    // Find today's record for current user
    const today = new Date().toDateString();
    const currentUserEmail = user?.email || 'john@company.com';
    
    // First check in the loaded records
    let todayRec = attendanceRecords.find(record => 
      new Date(record.date).toDateString() === today && 
      record.employeeId === currentUserEmail
    );
    
    // If not found in current records, check in the saved data
    if (!todayRec && saved) {
      try {
        const parsedRecords = JSON.parse(saved);
        todayRec = parsedRecords.find(record => 
          new Date(record.date).toDateString() === today && 
          record.employeeId === currentUserEmail
        );
      } catch (error) {
        console.error('Error parsing saved records:', error);
      }
    }
    
    if (todayRec) {
      setTodayRecord(todayRec);
      setCurrentStatus(todayRec.status);
    } else {
      setCurrentStatus('not-checked-in');
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

  // Listen for localStorage changes to refresh data in real-time
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'hits_attendance_records') {
        try {
          if (e.newValue) {
            const parsedRecords = JSON.parse(e.newValue);
            setAttendanceRecords(parsedRecords);
            
            // Update current status for current user
            const today = new Date().toDateString();
            const todayRec = parsedRecords.find(record => 
              new Date(record.date).toDateString() === today && 
              record.employeeId === (user?.email || 'john@company.com')
            );
            
            if (todayRec) {
              setTodayRecord(todayRec);
              setCurrentStatus(todayRec.status);
            } else {
              setCurrentStatus('not-checked-in');
            }
          }
        } catch (error) {
          console.error('Error refreshing attendance records:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check for changes every 2 seconds for same-tab updates
    const interval = setInterval(() => {
      try {
        const saved = localStorage.getItem('attendance_records');
        if (saved) {
          const parsedRecords = JSON.parse(saved);
          if (JSON.stringify(parsedRecords) !== JSON.stringify(attendanceRecords)) {
            setAttendanceRecords(parsedRecords);
            
            // Update current status for current user
            const today = new Date().toDateString();
            const todayRec = parsedRecords.find(record => 
              new Date(record.date).toDateString() === today && 
              record.employeeId === (user?.email || 'john@company.com')
            );
            
            if (todayRec) {
              setTodayRecord(todayRec);
              setCurrentStatus(todayRec.status);
            } else {
              setCurrentStatus('not-checked-in');
            }
          }
        }
      } catch (error) {
        console.error('Error checking attendance records:', error);
      }
    }, 2000); // Check every 2 seconds for better performance

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [attendanceRecords, user]);



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
    console.log('Starting check-in process for user:', user?.email);
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
    
    // Save to localStorage for persistence and notify other tabs/windows
    try {
      localStorage.setItem('attendance_records', JSON.stringify(updatedRecords));
      // Trigger storage event for other tabs/windows to sync
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'attendance_records',
        newValue: JSON.stringify(updatedRecords)
      }));
    } catch (error) {
      console.error('Error saving attendance records:', error);
    }
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
    
    // Save to localStorage for persistence and notify other tabs/windows
    try {
      localStorage.setItem('attendance_records', JSON.stringify(updatedRecords));
      // Trigger storage event for other tabs/windows to sync
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'attendance_records',
        newValue: JSON.stringify(updatedRecords)
      }));
    } catch (error) {
      console.error('Error saving attendance records:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'checked-in': return 'bg-green-100 text-green-800';
      case 'checked-out': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Show notification for admin when employees check in/out
  const showNotificationMessage = (message) => {
    console.log('Showing notification:', message);
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000); // Hide after 5 seconds
  };



  // Date filtering functions
  const getFilteredRecords = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    let filteredRecords = attendanceRecords;
    
    // For employees, only show their own records
    if (!isAdmin()) {
      filteredRecords = filteredRecords.filter(record => 
        record.employeeId === (user?.email || 'john@company.com')
      );
    }
    
    // Apply search filter
    if (searchTerm) {
      filteredRecords = filteredRecords.filter(record =>
        record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(record.date).toLocaleDateString().includes(searchTerm)
      );
    }
    
    // Apply employee filter (admin only)
    if (isAdmin() && employeeFilter !== 'all') {
      filteredRecords = filteredRecords.filter(record => 
        record.employeeId === employeeFilter
      );
    }
    
    // Apply status filter (admin only)
    if (isAdmin() && statusFilter !== 'all') {
      filteredRecords = filteredRecords.filter(record => 
        record.status === statusFilter
      );
    }
    
    // Apply date filter
    filteredRecords = filteredRecords.filter(record => {
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
    });
    
    return filteredRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const getTodayRecords = () => {
    const today = new Date().toDateString();
    let records = attendanceRecords.filter(record => 
      new Date(record.date).toDateString() === today
    );
    
    // For employees, only show their own records
    if (!isAdmin()) {
      records = records.filter(record => 
        record.employeeId === (user?.email || 'john@company.com')
      );
    }
    
    return records;
  };

  // Get real-time attendance status for admin dashboard
  const getRealTimeAttendanceStatus = () => {
    const today = new Date().toDateString();
    const todayRecords = attendanceRecords.filter(record => 
      new Date(record.date).toDateString() === today
    );
    
    return {
      totalEmployees: 4, // Total employees in the system
      checkedIn: todayRecords.filter(r => r.status === 'checked-in').length,
      checkedOut: todayRecords.filter(r => r.status === 'checked-out').length,
      notCheckedIn: 4 - todayRecords.filter(r => r.status === 'checked-in' || r.status === 'checked-out').length
    };
  };

  const getWeeklyRecords = () => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    let records = attendanceRecords.filter(record => 
      new Date(record.date) >= weekAgo
    );
    
    // For employees, only show their own records
    if (!isAdmin()) {
      records = records.filter(record => 
      record.employeeId === (user?.email || 'john@company.com')
    );
    }
    
    return records;
  };

  const getTotalWorkingHours = () => {
    const weeklyRecords = getWeeklyRecords();
    return weeklyRecords.reduce((total, record) => total + (record.workingHours || 0), 0).toFixed(1);
  };

  const filteredRecords = getFilteredRecords();

  // Export attendance data to CSV
  const exportAttendanceData = () => {
    const headers = ['Employee Name', 'Employee ID', 'Date', 'Check In Time', 'Check Out Time', 'Working Hours', 'Status', 'Location'];
    const csvData = filteredRecords.map(record => [
      record.employeeName,
      record.employeeId,
      new Date(record.date).toLocaleDateString(),
      record.checkInTime,
      record.checkOutTime || 'Not checked out',
              record.workingHours ? `${record.workingHours} hrs` : 'In progress',
      record.status === 'checked-in' ? 'Checked In' : 'Checked Out',
      record.location
    ]);
    
    const csvContent = [headers, ...csvData]
              .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
          link.setAttribute('download', `attendance_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Analytics calculations
  const analyticsData = useMemo(() => {
    const allRecords = attendanceRecords;
    const today = new Date().toDateString();
    
    // Today's statistics
    const todayRecords = allRecords.filter(record => 
      new Date(record.date).toDateString() === today
    );
    
    // Weekly statistics
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyRecords = allRecords.filter(record => 
      new Date(record.date) >= weekAgo
    );
    
    // Monthly statistics
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const monthlyRecords = allRecords.filter(record => 
      new Date(record.date) >= monthAgo
    );
    
    // Check-in time analysis
    const checkInTimes = allRecords
      .filter(record => record.checkInTime)
      .map(record => {
        const [hours, minutes] = record.checkInTime.split(':').map(Number);
        return hours + minutes / 60;
      });
    
    const averageCheckInTime = checkInTimes.length > 0 
      ? (checkInTimes.reduce((sum, time) => sum + time, 0) / checkInTimes.length).toFixed(1)
      : 0;
    
    const earlyCheckIns = checkInTimes.filter(time => time < 9).length;
    const lateCheckIns = checkInTimes.filter(time => time > 9.5).length;
    
    // Employee performance
    const employeeStats = {};
    allRecords.forEach(record => {
      if (!employeeStats[record.employeeId]) {
        employeeStats[record.employeeId] = {
          name: record.employeeName,
          totalDays: 0,
          totalHours: 0,
          averageHours: 0,
          earlyCheckIns: 0,
          lateCheckIns: 0
        };
      }
      
      employeeStats[record.employeeId].totalDays++;
      if (record.workingHours) {
        employeeStats[record.employeeId].totalHours += record.workingHours;
      }
      
      const [hours, minutes] = record.checkInTime.split(':').map(Number);
      const checkInHour = hours + minutes / 60;
      if (checkInHour < 9) {
        employeeStats[record.employeeId].earlyCheckIns++;
      } else if (checkInHour > 9.5) {
        employeeStats[record.employeeId].lateCheckIns++;
      }
    });
    
    // Calculate averages
    Object.values(employeeStats).forEach(emp => {
      emp.averageHours = emp.totalDays > 0 ? (emp.totalHours / emp.totalDays).toFixed(1) : 0;
    });
    
    // Department analysis (mock data)
    const departmentData = {
      'Engineering': { total: 15, present: 12, absent: 3 },
      'Sales': { total: 8, present: 7, absent: 1 },
      'Marketing': { total: 6, present: 5, absent: 1 },
      'HR': { total: 4, present: 4, absent: 0 }
    };
    
    return {
      today: {
        total: todayRecords.length,
        checkedIn: todayRecords.filter(r => r.status === 'checked-in').length,
        checkedOut: todayRecords.filter(r => r.status === 'checked-out').length
      },
      weekly: {
        total: weeklyRecords.length,
        averageHours: weeklyRecords.length > 0 
          ? (weeklyRecords.reduce((sum, r) => sum + (r.workingHours || 0), 0) / weeklyRecords.length).toFixed(1)
          : 0
      },
      monthly: {
        total: monthlyRecords.length,
        totalHours: monthlyRecords.reduce((sum, r) => sum + (r.workingHours || 0), 0).toFixed(1)
      },
      checkInAnalysis: {
        average: averageCheckInTime,
        early: earlyCheckIns,
        late: lateCheckIns,
        onTime: checkInTimes.length - earlyCheckIns - lateCheckIns
      },
      employeeStats,
      departmentData
    };
  }, [attendanceRecords]);

  // Render functions for different view modes
  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Employee</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Check In</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Check Out</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Working Hours</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Photos</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-50">
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record, index) => (
              <tr key={record.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-200`}>
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                  {record.employeeName}
                </td>
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
                      <button
                        onClick={() => { setSelectedPhoto(record.checkInPhoto); setShowPhotoModal(true); }}
                        className="w-8 h-8 rounded-full overflow-hidden border border-gray-300 hover:border-blue-500 transition-colors"
                      >
                        <img src={record.checkInPhoto} alt="Check In" className="w-full h-full object-cover" title="View Check In Photo" />
                      </button>
                    )}
                    {record.checkOutPhoto && (
                      <button
                        onClick={() => { setSelectedPhoto(record.checkOutPhoto); setShowPhotoModal(true); }}
                        className="w-8 h-8 rounded-full overflow-hidden border border-gray-300 hover:border-blue-500 transition-colors"
                      >
                        <img src={record.checkOutPhoto} alt="Check Out" className="w-full h-full object-cover" title="View Check Out Photo" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <Clock size={32} className="text-gray-300" />
                  <div>
                    <p className="text-base font-medium">No attendance records found</p>
                    <p className="text-xs text-gray-400">Attendance records will appear here</p>
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
    <div className="flex-1 min-h-0 h-full bg-gradient-to-br from-orange-50 via-blue-50 to-orange-100 overflow-y-auto">
      {/* Top right header */}
      <TopRightHeader user={user} />
      
      {/* Admin Notification */}
      {isAdmin() && showNotification && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg max-w-sm">
          <div className="flex items-center gap-3">
            <CheckCircle size={20} />
            <span className="font-medium">{notificationMessage}</span>
            <button 
              onClick={() => setShowNotification(false)}
              className="ml-auto text-white hover:text-green-100"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
      
      {/* Main Content with proper spacing */}
      <div className="pt-16 sm:pt-6 pb-2 px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-3 sm:p-4">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-lg shadow-lg">
                <Clock size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                  {isAdmin() ? (
                    <>
                      <span className="text-gray-900">Employee</span> <span className="text-orange-500">Attendance Management</span>
                    </>
                  ) : (
                    <>
                      <span className="text-gray-900">Employee</span> <span className="text-orange-500">Attendance</span>
                    </>
                  )}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
                  {isAdmin() 
                    ? 'Monitor employee attendance, check-in times, and working hours across the organization'
                    : 'Track your daily work hours and attendance with photo verification'
                  }
                </p>
              </div>
            </div>
            {isAdmin() ? (
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setShowAnalytics(true)}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg text-xs sm:text-sm font-medium border border-gray-200"
                >
                  <BarChart3 size={12} className="sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Analytics</span>
                  <span className="sm:hidden">A</span>
                </button>
                <button 
                  onClick={() => exportAttendanceData()}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg text-xs sm:text-sm font-medium border border-gray-200"
                >
                  <Download size={12} className="sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Export</span>
                  <span className="sm:hidden">E</span>
                </button>
                <button 
                  onClick={() => {
                    try {
                      const saved = localStorage.getItem('hits_attendance_records');
                      if (saved) {
                        const parsedRecords = JSON.parse(saved);
                        setAttendanceRecords(parsedRecords);
                        
                        // Update current status for current user
                        const today = new Date().toDateString();
                        const todayRec = parsedRecords.find(record => 
                          new Date(record.date).toDateString() === today && 
                          record.employeeId === (user?.email || 'john@company.com')
                        );
                        
                        if (todayRec) {
                          setTodayRecord(todayRec);
                          setCurrentStatus(todayRec.status);
                        } else {
                          setCurrentStatus('not-checked-in');
                        }
                      }
                    } catch (error) {
                      console.error('Error refreshing data:', error);
                    }
                  }}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg text-xs sm:text-sm font-medium"
                >
                  <RefreshCw size={12} className="sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Refresh</span>
                  <span className="sm:hidden">R</span>
                </button>
                
                
                </div>
              ) : (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{currentTime.toLocaleTimeString()}</p>
                  <p className="text-sm sm:text-base md:text-lg text-gray-600">{currentTime.toLocaleDateString()}</p>
            </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        {isAdmin() ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-lg flex-shrink-0">
                  <Users size={16} />
              </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-gray-700 text-xs truncate">Today's Attendance</h3>
                  <p className="text-base sm:text-lg font-bold text-blue-600 mt-1">
                    {analyticsData.today.checkedIn}/{analyticsData.today.total}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-gradient-to-r from-green-100 to-green-200 text-green-700 rounded-lg flex-shrink-0">
                  <Clock size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-gray-700 text-xs truncate">Avg Check-in Time</h3>
                  <p className="text-base sm:text-lg font-bold text-green-600 mt-1">{analyticsData.checkInAnalysis.average}:00</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 rounded-lg flex-shrink-0">
                  <Timer size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-gray-700 text-xs truncate">Weekly Avg Hours</h3>
                  <p className="text-base sm:text-lg font-bold text-orange-600 mt-1">{analyticsData.weekly.averageHours}h</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 rounded-lg flex-shrink-0">
                  <TrendingUp size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-gray-700 text-xs truncate">Monthly Total</h3>
                  <p className="text-base sm:text-lg font-bold text-purple-600 mt-1">{analyticsData.monthly.totalHours}h</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-lg flex-shrink-0">
                  <Timer size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-gray-700 text-xs truncate">Current Time</h3>
                  <p className="text-base sm:text-lg font-bold text-blue-600 mt-1">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>

            <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-gradient-to-r from-green-100 to-green-200 text-green-700 rounded-lg flex-shrink-0">
                  <User size={16} />
              </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-gray-700 text-xs truncate">Employee</h3>
                  <p className="text-sm font-bold text-green-600 mt-1 truncate">{user?.fullName || 'John Doe'}</p>
              </div>
            </div>
          </div>

            <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`p-2 rounded-lg flex-shrink-0 ${currentStatus === 'checked-in' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {currentStatus === 'checked-in' ? <CheckCircle size={16} /> : <XCircle size={16} />}
              </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-gray-700 text-xs truncate">Status</h3>
                  <p className={`text-sm font-bold mt-1 truncate ${currentStatus === 'checked-in' ? 'text-green-600' : 'text-gray-600'}`}>
                  {currentStatus === 'checked-in' ? 'Checked In' : 
                   currentStatus === 'checked-out' ? 'Checked Out' : 'Not Checked In'}
                </p>
              </div>
            </div>
          </div>

            <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 rounded-lg flex-shrink-0">
                  <TrendingUp size={16} />
              </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-gray-700 text-xs truncate">Weekly Hours</h3>
                  <p className="text-base sm:text-lg font-bold text-orange-600 mt-1">{getTotalWorkingHours()}h</p>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Employee Check-in/Check-out Section */}
        {isEmployee() && (
          <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 border border-gray-100">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Attendance Actions</h2>
          
          {todayRecord && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3 sm:mb-4 text-base sm:text-lg">Today's Record</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                  <div className="text-center">
                    <p className="text-xs sm:text-sm text-blue-600 font-medium">Check In</p>
                    <p className="font-bold text-blue-900 text-base sm:text-lg">{todayRecord.checkInTime}</p>
                </div>
                  <div className="text-center">
                    <p className="text-xs sm:text-sm text-blue-600 font-medium">Check Out</p>
                    <p className="font-bold text-blue-900 text-base sm:text-lg">{todayRecord.checkOutTime || 'Not checked out'}</p>
                </div>
                  <div className="text-center">
                    <p className="text-xs sm:text-sm text-blue-600 font-medium">Working Hours</p>
                    <p className="font-bold text-blue-900 text-base sm:text-lg">
                    {todayRecord.workingHours ? `${todayRecord.workingHours} hrs` : 'In progress...'}
                  </p>
                </div>
                  <div className="text-center">
                    <p className="text-xs sm:text-sm text-blue-600 font-medium mb-2">Photos</p>
                    <div className="flex justify-center gap-2 sm:gap-3">
                    {todayRecord.checkInPhoto && (
                        <img src={todayRecord.checkInPhoto} alt="Check In" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-blue-300 shadow-md" title="Check In Photo" />
                    )}
                    {todayRecord.checkOutPhoto && (
                        <img src={todayRecord.checkOutPhoto} alt="Check Out" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-blue-300 shadow-md" title="Check Out Photo" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
            <button
              onClick={() => setShowCheckInModal(true)}
              disabled={currentStatus === 'checked-in'}
                className={`flex-1 py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl font-medium text-white transition-all duration-300 
                ${currentStatus === 'checked-in' 
                  ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-md hover:shadow-lg transform hover:scale-105'
                  }`}
              >
                <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                  <CheckCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <Camera size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="text-xs sm:text-sm">Check In with Photo</span>
              </div>
            </button>
            
            <button
              onClick={() => setShowCheckOutModal(true)}
              disabled={currentStatus !== 'checked-in'}
                className={`flex-1 py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl font-medium text-white transition-all duration-300
                ${currentStatus !== 'checked-in'
                  ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:scale-105'
                  }`}
              >
                <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                  <XCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <Camera size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="text-xs sm:text-sm">Check Out with Photo</span>
              </div>
            </button>
          </div>

          {location && (
              <div className="mt-4 sm:mt-6 text-sm sm:text-base text-gray-600 flex items-center gap-2 sm:gap-3 justify-center">
                <MapPin size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="font-medium">Location: {location}</span>
            </div>
          )}
        </div>
        )}

                {/* Search and Filters - Admin Only */}
        {isAdmin() && (
          <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 border border-gray-100">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Search & Filters</h2>
            
            <div className="space-y-4 sm:space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 sm:w-5 sm:h-5" size={18} />
                <input
                  type="text"
                  placeholder="Search by employee name, ID, or date..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                />
              </div>
              
              {/* Filter Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {/* Employee Filter */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Employee</label>
                  <div className="relative">
                    <select
                      value={employeeFilter}
                      onChange={(e) => setEmployeeFilter(e.target.value)}
                      className="w-full pl-3 sm:pl-4 pr-8 sm:pr-10 py-2.5 sm:py-3 border border-gray-300 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    >
                      <option value="all">All Employees</option>
                      <option value="john@company.com">John Doe</option>
                      <option value="sarah@company.com">Sarah Johnson</option>
                      <option value="mike@company.com">Mike Chen</option>
                      <option value="emma@company.com">Emma Davis</option>
                    </select>
                    <ChevronDown className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 sm:w-[18px] sm:h-[18px]" size={16} />
                  </div>
                </div>
                
                {/* Status Filter */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Status</label>
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full pl-3 sm:pl-4 pr-8 sm:pr-10 py-2.5 sm:py-3 border border-gray-300 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    >
                      <option value="all">All Status</option>
                      <option value="checked-in">Checked In</option>
                      <option value="checked-out">Checked Out</option>
                    </select>
                    <ChevronDown className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 sm:w-[18px] sm:h-[18px]" size={16} />
                  </div>
                </div>
                
                {/* Date Filter */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Date Range</label>
                  <div className="relative">
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full pl-3 sm:pl-4 pr-8 sm:pr-10 py-2.5 sm:py-3 border border-gray-300 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="custom">Custom Range</option>
                    </select>
                    <ChevronDown className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 sm:w-[18px] sm:h-[18px]" size={16} />
                  </div>
                </div>
                
                {/* View Mode */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">View Mode</label>
                  <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('table')}
                      className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                    viewMode === 'table' 
                      ? 'bg-blue-500 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                      <List size={14} className="inline mr-1.5 sm:mr-2 sm:w-4 sm:h-4" />
                  Table
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                      className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-blue-500 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                      <Grid size={14} className="inline mr-1.5 sm:mr-2 sm:w-4 sm:h-4" />
                  Grid
                </button>
              </div>
            </div>
              </div>

              {/* Custom Date Range */}
              {dateFilter === 'custom' && (
                <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
                  <div className="flex items-center gap-4">
                    <Calendar size={20} className="text-gray-500" />
                  <input
                    type="date"
                    value={customDateRange.start}
                    onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                    <span className="text-gray-500 font-medium">to</span>
                  <input
                    type="date"
                    value={customDateRange.end}
                    onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Attendance Records */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-lg font-bold text-gray-900">
              {isAdmin() ? 'All Employee Attendance Records' : 'Your Attendance Records'}
            </h2>
            <p className="text-gray-600 mt-1 text-sm">
              {isAdmin() 
                ? 'Monitor and analyze employee attendance across the organization'
                : 'Track your daily attendance with photo verification'
              }
            </p>
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

        {/* Analytics Modal - Admin Only */}
        {isAdmin() && showAnalytics && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAnalytics(false)} />
            <div className="relative w-full max-w-7xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-[90vh]">
              <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-blue-500 to-purple-600">
                <h3 className="text-white font-semibold text-xl">Attendance Analytics & Insights</h3>
                <button onClick={() => setShowAnalytics(false)} className="p-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-600 font-medium">Today's Attendance</p>
                        <p className="text-2xl font-bold text-blue-900">{analyticsData.today.checkedIn}/{analyticsData.today.total}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Clock size={20} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-green-600 font-medium">Avg Check-in Time</p>
                        <p className="text-2xl font-bold text-green-900">{analyticsData.checkInAnalysis.average}:00</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Timer size={20} className="text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-orange-600 font-medium">Weekly Avg Hours</p>
                        <p className="text-2xl font-bold text-orange-900">{analyticsData.weekly.averageHours}h</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <TrendingUp size={20} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-purple-600 font-medium">Monthly Total</p>
                        <p className="text-2xl font-bold text-purple-900">{analyticsData.monthly.totalHours}h</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Check-in Time Distribution */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Check-in Time Distribution</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Early Check-ins (Before 9:00 AM)</span>
                        <span className="font-semibold text-green-600">{analyticsData.checkInAnalysis.early}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-green-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${(analyticsData.checkInAnalysis.early / (analyticsData.checkInAnalysis.early + analyticsData.checkInAnalysis.onTime + analyticsData.checkInAnalysis.late)) * 100}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">On Time (9:00 - 9:30 AM)</span>
                        <span className="font-semibold text-blue-600">{analyticsData.checkInAnalysis.onTime}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${(analyticsData.checkInAnalysis.onTime / (analyticsData.checkInAnalysis.early + analyticsData.checkInAnalysis.onTime + analyticsData.checkInAnalysis.late)) * 100}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Late Check-ins (After 9:30 AM)</span>
                        <span className="font-semibold text-red-600">{analyticsData.checkInAnalysis.late}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-red-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${(analyticsData.checkInAnalysis.late / (analyticsData.checkInAnalysis.early + analyticsData.checkInAnalysis.late)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Department Performance */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Department Attendance</h4>
                    <div className="space-y-4">
                      {Object.entries(analyticsData.departmentData).map(([dept, data]) => (
                        <div key={dept}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">{dept}</span>
                            <span className="text-sm text-gray-600">{data.present}/{data.total}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(data.present / data.total) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Employee Performance Table */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Employee Performance Summary</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 text-sm font-medium text-gray-700">Employee</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-700">Total Days</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-700">Avg Hours</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-700">Early Check-ins</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-700">Late Check-ins</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.values(analyticsData.employeeStats).map((emp, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-2 text-sm font-medium text-gray-900">{emp.name}</td>
                            <td className="py-2 text-sm text-gray-600">{emp.totalDays}</td>
                            <td className="py-2 text-sm text-gray-600">{emp.averageHours}h</td>
                            <td className="py-2 text-sm text-green-600">{emp.earlyCheckIns}</td>
                            <td className="py-2 text-sm text-red-600">{emp.lateCheckIns}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Photo Modal - Admin Only */}
        {isAdmin() && showPhotoModal && selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowPhotoModal(false)} />
            <div className="relative max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Attendance Photo</h3>
                <button onClick={() => setShowPhotoModal(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 text-center">
                <img src={selectedPhoto} alt="Attendance Photo" className="w-full h-auto rounded-lg shadow-lg" />
              </div>
            </div>
          </div>
        )}
        
        {/* Footer Blank Space */}
        <div className="h-16 sm:h-20 md:h-24"></div>
      </div>
    </div>
  );
};

export default EmployeeAttendance;