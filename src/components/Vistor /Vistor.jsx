import React, { useState, useEffect, useRef } from 'react';
import { Users, UserPlus, QrCode, Clock, MapPin, Phone, Mail, Building, CheckCircle, XCircle, Download, Camera, Grid, List, Filter, Calendar, TrendingUp, X } from 'lucide-react';
import QRCode from 'qrcode';

const VisitorManagement = ({ user }) => {
  const [visitors, setVisitors] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table', 'list', 'grid'
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'week', 'month', 'custom'
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    purpose: '',
    hostEmployee: user?.fullName || '',
    vehicleNumber: '',
    idProof: '',
    photo: ''
  });

  // Load visitors from state (replacing localStorage)
  useEffect(() => {
    // Initialize with some sample data if empty
    if (visitors.length === 0) {
      const sampleVisitors = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+91 9876543210',
          company: 'Tech Corp',
          purpose: 'Business Meeting',
          hostEmployee: 'Alice Johnson',
          vehicleNumber: 'KA01AB1234',
          idProof: 'driving-license',
          checkInTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString(),
          checkOutTime: null,
          status: 'checked-in',
          validUntil: new Date(Date.now() + 22 * 60 * 60 * 1000).toLocaleString(),
          createdBy: user?.email || 'admin@company.com',
          photo: ''
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@consulting.com',
          phone: '+91 9876543211',
          company: 'Consulting Ltd',
          purpose: 'Client Consultation',
          hostEmployee: 'Bob Wilson',
          vehicleNumber: 'MH02CD5678',
          idProof: 'aadhar',
          checkInTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString(),
          checkOutTime: new Date(Date.now() - 20 * 60 * 60 * 1000).toLocaleString(),
          status: 'checked-out',
          validUntil: new Date(Date.now() - 20 * 60 * 60 * 1000).toLocaleString(),
          createdBy: user?.email || 'admin@company.com',
          photo: ''
        }
      ];
      setVisitors(sampleVisitors);
    }
  }, []);

  // Cleanup camera stream on component unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Improved camera functions
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
      setFormData(prev => ({ ...prev, photo: photoDataURL }));
      
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
    setFormData(prev => ({ ...prev, photo: '' }));
  };

  const generateQRCode = (visitorData) => {
    const qrData = {
      visitorId: visitorData.id,
      name: visitorData.name,
      company: visitorData.company,
      checkInTime: visitorData.checkInTime,
      validUntil: visitorData.validUntil
    };
    return `data:text/plain;base64,${btoa(JSON.stringify(qrData))}`;
  };

  const handleCheckIn = () => {
    if (!formData.name || !formData.phone || !formData.purpose) {
      alert('Please fill in all required fields (Name, Phone, Purpose)');
      return;
    }
    if (!formData.photo) {
      alert('Please capture a photo of the visitor.');
      return;
    }

    const now = new Date();
    const validUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const newVisitor = {
      id: Date.now(),
      ...formData,
      checkInTime: now.toLocaleString(),
      checkOutTime: null,
      status: 'checked-in',
      validUntil: validUntil.toLocaleString(),
      qrCode: '',
      createdBy: user?.email || 'admin@company.com'
    };

    newVisitor.qrCode = generateQRCode(newVisitor);

    const updatedVisitors = [newVisitor, ...visitors];
    setVisitors(updatedVisitors);

    setSelectedVisitor(newVisitor);
    setShowQRCode(true);
    setShowAddForm(false);

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      purpose: '',
      hostEmployee: user?.fullName || '',
      vehicleNumber: '',
      idProof: '',
      photo: ''
    });
    setCapturedPhoto(null);
  };

  const handleCheckOut = (visitorId) => {
    const updatedVisitors = visitors.map(visitor =>
      visitor.id === visitorId
        ? { ...visitor, checkOutTime: new Date().toLocaleString(), status: 'checked-out' }
        : visitor
    );
    setVisitors(updatedVisitors);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'checked-in': return 'bg-green-100 text-green-800';
      case 'checked-out': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Date filtering functions
  const getFilteredVisitors = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return visitors.filter(visitor => {
      const visitorDate = new Date(visitor.checkInTime);
      
      switch (dateFilter) {
        case 'today':
          return visitorDate >= today;
        case 'week':
          return visitorDate >= weekAgo;
        case 'month':
          return visitorDate >= monthAgo;
        case 'custom':
          if (customDateRange.start && customDateRange.end) {
            const start = new Date(customDateRange.start);
            const end = new Date(customDateRange.end + 'T23:59:59');
            return visitorDate >= start && visitorDate <= end;
          }
          return true;
        default:
          return true;
      }
    });
  };

  const getTodayVisitors = () => {
    const today = new Date().toDateString();
    return visitors.filter(visitor => 
      new Date(visitor.checkInTime).toDateString() === today
    );
  };

  const getWeeklyVisitors = () => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return visitors.filter(visitor => 
      new Date(visitor.checkInTime) >= weekAgo
    );
  };

  const getActiveVisitors = () => {
    return visitors.filter(visitor => visitor.status === 'checked-in');
  };

  // PNG download for QR code and photo
  const downloadQRCode = async (visitor) => {
    const size = 320;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size + 80;
    const ctx = canvas.getContext('2d');

    // Fill background
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Generate QR code image
    const qrData = {
      visitorId: visitor.id,
      name: visitor.name,
      company: visitor.company,
      checkInTime: visitor.checkInTime,
      validUntil: visitor.validUntil
    };
    const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(qrData), { width: 128, margin: 1 });

    // Draw photo if available
    if (visitor.photo) {
      const img = new window.Image();
      img.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(size / 2, 48, 36, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, size / 2 - 36, 12, 72, 72);
        ctx.restore();

        // Draw QR code below photo
        const qrImg = new window.Image();
        qrImg.onload = () => {
          ctx.drawImage(qrImg, size / 2 - 64, 100, 128, 128);

          // Draw visitor name
          ctx.font = "bold 16px sans-serif";
          ctx.fillStyle = "#222";
          ctx.textAlign = "center";
          ctx.fillText(visitor.name, size / 2, 250);

          // Save as PNG
          const pngUrl = canvas.toDataURL("image/png");
          const a = document.createElement('a');
          a.href = pngUrl;
          a.download = `visitor-pass-${visitor.name.replace(/\s+/g, '-')}.png`;
          a.click();
        };
        qrImg.src = qrCodeUrl;
      };
      img.src = visitor.photo;
    } else {
      // Only QR code
      const qrImg = new window.Image();
      qrImg.onload = () => {
        ctx.drawImage(qrImg, size / 2 - 64, 40, 128, 128);

        ctx.font = "bold 16px sans-serif";
        ctx.fillStyle = "#222";
        ctx.textAlign = "center";
        ctx.fillText(visitor.name, size / 2, 190);

        const pngUrl = canvas.toDataURL("image/png");
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = `visitor-pass-${visitor.name.replace(/\s+/g, '-')}.png`;
        a.click();
      };
      qrImg.src = qrCodeUrl;
    }
  };

  const filteredVisitors = getFilteredVisitors();

  // Render functions for different view modes
  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Visitor Details</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Company</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Purpose</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Host Employee</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Check In Time</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {filteredVisitors.length > 0 ? (
            filteredVisitors.map((visitor, index) => (
              <tr key={visitor.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-200`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {visitor.photo ? (
                      <img src={visitor.photo} alt={visitor.name} className="w-10 h-10 rounded-full object-cover border-2 border-gray-200" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users size={20} className="text-gray-400" />
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="text-base font-semibold text-gray-900">{visitor.name}</div>
                      <div className="text-xs text-gray-600 flex items-center gap-2">
                        <Phone size={12} />
                        {visitor.phone}
                      </div>
                      {visitor.email && (
                        <div className="text-xs text-gray-600 flex items-center gap-2">
                          <Mail size={12} />
                          {visitor.email}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">
                    {visitor.company || 'Individual'}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {visitor.purpose}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-900">
                    {visitor.hostEmployee}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-xs text-gray-900">
                    {new Date(visitor.checkInTime).toLocaleString()}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-lg ${getStatusColor(visitor.status)}`}>
                    {visitor.status === 'checked-in' ? 'In Building' : 'Checked Out'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {visitor.status === 'checked-in' && (
                      <button
                        onClick={() => handleCheckOut(visitor.id)}
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium text-xs"
                      >
                        Check Out
                      </button>
                    )}
                    <button
                      onClick={() => downloadQRCode(visitor)}
                      className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-2 py-1 rounded-lg hover:from-blue-600 hover:to-orange-600 transition-all duration-300 font-medium text-xs flex items-center gap-1"
                    >
                      <QrCode size={12} />
                      Pass
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <Users size={32} className="text-gray-300" />
                  <div>
                    <p className="text-base font-medium">No visitors found</p>
                    <p className="text-xs text-gray-400">Add your first visitor to get started</p>
                  </div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4 p-4">
      {filteredVisitors.length > 0 ? (
        filteredVisitors.map((visitor) => (
          <div key={visitor.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start gap-4">
              {visitor.photo ? (
                <img src={visitor.photo} alt={visitor.name} className="w-16 h-16 rounded-full object-cover flex-shrink-0 border-2 border-gray-200" />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users size={24} className="text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{visitor.name}</h3>
                    <p className="text-sm text-gray-600">{visitor.company || 'Individual'}</p>
                  </div>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(visitor.status)}`}>
                    {visitor.status === 'checked-in' ? 'In Building' : 'Checked Out'}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Phone size={14} />
                    {visitor.phone}
                  </div>
                  {visitor.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={14} />
                      {visitor.email}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Building size={14} />
                    Host: {visitor.hostEmployee}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    {new Date(visitor.checkInTime).toLocaleString()}
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-700">{visitor.purpose}</p>
                <div className="mt-3 flex gap-2">
                  {visitor.status === 'checked-in' && (
                    <button
                      onClick={() => handleCheckOut(visitor.id)}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium text-sm"
                    >
                      Check Out
                    </button>
                  )}
                  <button
                    onClick={() => downloadQRCode(visitor)}
                    className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-3 py-1 rounded-lg hover:from-blue-600 hover:to-orange-600 transition-all duration-300 font-medium text-sm flex items-center gap-1"
                  >
                    <QrCode size={14} />
                    Download Pass
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <Users size={32} className="text-gray-300 mx-auto mb-2" />
          <p className="text-base font-medium text-gray-500">No visitors found</p>
          <p className="text-sm text-gray-400">Add your first visitor to get started</p>
        </div>
      )}
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {filteredVisitors.length > 0 ? (
        filteredVisitors.map((visitor) => (
          <div key={visitor.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
            <div className="text-center">
              {visitor.photo ? (
                <img src={visitor.photo} alt={visitor.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2 border-gray-200" />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users size={32} className="text-gray-400" />
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{visitor.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{visitor.company || 'Individual'}</p>
              <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(visitor.status)} mb-3`}>
                {visitor.status === 'checked-in' ? 'In Building' : 'Checked Out'}
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Phone size={14} />
                <span className="truncate">{visitor.phone}</span>
              </div>
              {visitor.email && (
                <div className="flex items-center gap-2">
                  <Mail size={14} />
                  <span className="truncate">{visitor.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Building size={14} />
                <span className="truncate">Host: {visitor.hostEmployee}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span className="text-xs">{new Date(visitor.checkInTime).toLocaleString()}</span>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4 line-clamp-2">{visitor.purpose}</p>
            <div className="flex gap-2">
              {visitor.status === 'checked-in' && (
                <button
                  onClick={() => handleCheckOut(visitor.id)}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium text-xs"
                >
                  Check Out
                </button>
              )}
              <button
                onClick={() => downloadQRCode(visitor)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-orange-500 text-white px-2 py-1 rounded-lg hover:from-blue-600 hover:to-orange-600 transition-all duration-300 font-medium text-xs flex items-center justify-center gap-1"
              >
                <QrCode size={12} />
                Pass
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-8">
          <Users size={32} className="text-gray-300 mx-auto mb-2" />
          <p className="text-base font-medium text-gray-500">No visitors found</p>
          <p className="text-sm text-gray-400">Add your first visitor to get started</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex-1 min-h-0 h-full bg-gradient-to-br from-blue-50 to-orange-50 p-4 md:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-xl shadow-lg">
                <Users size={18} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Visitor Management</h1>
                <p className="text-base text-gray-600 mt-1">Manage visitor check-ins and issue QR passes</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm"
            >
              <div className="flex items-center gap-2">
                <UserPlus size={16} />
                Add New Visitor
              </div>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-3 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-green-100 to-green-200 text-green-700 rounded-lg">
                <Users size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 text-xs">Today's Visitors</h3>
                <p className="text-xl font-bold text-green-600 mt-0.5">{getTodayVisitors().length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-3 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-lg">
                <CheckCircle size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 text-xs">Currently In</h3>
                <p className="text-xl font-bold text-blue-600 mt-0.5">{getActiveVisitors().length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-3 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 rounded-lg">
                <TrendingUp size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 text-xs">Weekly Visitors</h3>
                <p className="text-xl font-bold text-orange-600 mt-0.5">{getWeeklyVisitors().length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-3 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 rounded-lg">
                <Clock size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 text-xs">Current Time</h3>
                <p className="text-base font-bold text-purple-600 mt-0.5">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
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
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-blue-500 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <List size={14} className="inline mr-1" />
                  List
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

        {/* Visitor List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-orange-50">
            <h2 className="text-xl font-bold text-gray-900">Visitor Records</h2>
            <p className="text-gray-600 mt-1 text-sm">Track all visitor activities and manage check-ins/check-outs</p>
          </div>
          
          {viewMode === 'table' && renderTableView()}
          {viewMode === 'list' && renderListView()}
          {viewMode === 'grid' && renderGridView()}
        </div>

        {/* Add Visitor Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-orange-50">
                <h2 className="text-xl font-bold text-gray-900">Add New Visitor</h2>
                <p className="text-gray-600 mt-1 text-sm">Fill in the visitor details to generate a digital pass</p>
              </div>
              
              <div className="p-4">
                {/* Photo Capture Section */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Visitor Photo
                  </label>
                  <div className="flex items-center gap-4">
                    {capturedPhoto ? (
                      <div className="relative">
                        <img src={capturedPhoto} alt="Captured" className="w-24 h-24 rounded-full object-cover border-2 border-gray-300" />
                        <button
                          onClick={retakePhoto}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                        <Camera size={24} className="text-gray-400" />
                      </div>
                    )}
                    <button
                      onClick={capturedPhoto ? retakePhoto : startCamera}
                      className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-orange-600 transition-all duration-300 text-sm flex items-center gap-2"
                    >
                      <Camera size={16} />
                      {capturedPhoto ? 'Retake Photo' : 'Capture Photo'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm"
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm"
                      placeholder="Enter email address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company/Organization
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full p-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm"
                      placeholder="Enter company name"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Purpose of Visit *
                    </label>
                    <textarea
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full p-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm resize-none"
                      placeholder="Describe the purpose of the visit"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Host Employee
                    </label>
                    <input
                      type="text"
                      name="hostEmployee"
                      value={formData.hostEmployee}
                      onChange={handleInputChange}
                      className="w-full p-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm"
                      placeholder="Enter host employee name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Vehicle Number
                    </label>
                    <input
                      type="text"
                      name="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={handleInputChange}
                      className="w-full p-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm"
                      placeholder="Enter vehicle number"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ID Proof Type
                    </label>
                    <select
                      name="idProof"
                      value={formData.idProof}
                      onChange={handleInputChange}
                      className="w-full p-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm"
                    >
                      <option value="">Select ID Proof Type</option>
                      <option value="driving-license">Driving License</option>
                      <option value="aadhar">Aadhar Card</option>
                      <option value="pan">PAN Card</option>
                      <option value="passport">Passport</option>
                      <option value="voter-id">Voter ID</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleCheckIn}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-orange-500 text-white py-2 px-4 rounded-xl font-bold hover:from-blue-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle size={16} />
                      Check In & Generate Pass
                    </div>
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setCapturedPhoto(null);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        company: '',
                        purpose: '',
                        hostEmployee: user?.fullName || '',
                        vehicleNumber: '',
                        idProof: '',
                        photo: ''
                      });
                      stopCamera(); // Stop camera if it's running
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all duration-300 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Camera Modal - Fixed positioning and better video handling */}
        {showCamera && showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[70] p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-orange-50 rounded-t-2xl">
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
                    className="flex-1 bg-gradient-to-r from-blue-500 to-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* QR Code Modal */}
        {showQRCode && selectedVisitor && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
              <div className="p-4 border-b border-gray-200 text-center bg-gradient-to-r from-blue-50 to-orange-50 rounded-t-3xl">
                <QrCode size={48} className="mx-auto text-blue-600 mb-2" />
                <h2 className="text-xl font-bold text-gray-900">Visitor Pass Generated</h2>
                <p className="text-base text-gray-600 mt-2">Digital pass for {selectedVisitor.name}</p>
              </div>
              
              <div className="p-4 text-center">
                <div className="bg-gradient-to-r from-blue-50 to-orange-50 p-4 rounded-xl mb-4">
                  {selectedVisitor.photo && (
                    <img src={selectedVisitor.photo} alt={selectedVisitor.name} className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border-2 border-gray-200" />
                  )}
                  <QrCode size={60} className="mx-auto text-blue-600 mb-2" />
                  <p className="text-sm text-gray-600 font-semibold">
                    Visitor ID: {selectedVisitor.id}
                  </p>
                  <p className="text-sm text-gray-600 font-semibold mt-1">
                    Valid until: {new Date(selectedVisitor.validUntil).toLocaleString()}
                  </p>
                </div>
                
                <div className="space-y-2 text-sm text-gray-700 mb-4 bg-gray-50 p-3 rounded-xl">
                  <p><span className="font-semibold">Name:</span> {selectedVisitor.name}</p>
                  <p><span className="font-semibold">Company:</span> {selectedVisitor.company || 'Individual'}</p>
                  <p><span className="font-semibold">Purpose:</span> {selectedVisitor.purpose}</p>
                  <p><span className="font-semibold">Host:</span> {selectedVisitor.hostEmployee}</p>
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => downloadQRCode(selectedVisitor)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-orange-500 text-white py-2 px-4 rounded-xl font-bold hover:from-blue-700 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Download size={16} />
                      Download Pass
                    </div>
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowQRCode(false);
                      setSelectedVisitor(null);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all duration-300 text-sm"
                  >
                    Close
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

export default VisitorManagement