import React, { useRef, useEffect, useState } from 'react';
import { Search, User, Menu, X, Camera, MapPin, Settings, Eye } from 'lucide-react';
import TopRightHeader from '../TopRightHeader/TopRightHeader';

// Mock camera data
const CAMERAS = [
  { id: 1, name: 'Main Entrance', location: 'Building A - Front Door', status: 'active', type: 'live' },
  { id: 2, name: 'Reception Area', location: 'Building A - Lobby', status: 'active', type: 'fake' },
  { id: 3, name: 'Parking Lot', location: 'Outdoor - Section B', status: 'active', type: 'fake' },
  { id: 4, name: 'Break Room', location: 'Building A - 2nd Floor', status: 'maintenance', type: 'fake' },
  { id: 5, name: 'Conference Room', location: 'Building A - 3rd Floor', status: 'active', type: 'fake' },
  { id: 6, name: 'Server Room', location: 'Building A - Basement', status: 'active', type: 'fake' }
];

const FaceRecognitionAttendance = ({ onCheckInOut, currentCamera }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [status, setStatus] = useState('idle');
  const [liveness, setLiveness] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock face detection for live camera
  useEffect(() => {
    if (currentCamera.type === 'live') {
      // Start webcam for live camera
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          setStatus('fail');
        });

      // Mock face detection
      const interval = setInterval(() => {
        setStatus(Math.random() > 0.3 ? 'success' : 'fail');
      }, 1000);

      return () => {
        clearInterval(interval);
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach(track => track.stop());
        }
      };
    }
  }, [currentCamera]);

  const handleLiveness = () => {
    setLiveness(true);
    setTimeout(() => setLiveness(false), 1000);
  };

  const handleCheckInOut = () => {
    if (status === 'success' && videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const photo = canvas.toDataURL('image/png');
      onCheckInOut(photo);
    }
  };

  // Render fake camera feed
  if (currentCamera.type === 'fake') {
    return (
      <div className="bg-gray-800 rounded-lg overflow-hidden mb-6 flex flex-col items-center p-4">
        <div className="relative w-full max-w-md aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
          <div className="text-center text-white">
            <Camera size={48} className="mx-auto mb-2 opacity-50" />
            <p className="text-lg font-semibold">{currentCamera.name}</p>
            <p className="text-sm opacity-75">{currentCamera.location}</p>
            <div className="mt-4 flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs">Recording</span>
            </div>
          </div>
          <div className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold bg-green-600 text-white">
            Camera Active
          </div>
          <div className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold bg-blue-600 text-white">
            {currentCamera.id}/6
          </div>
        </div>
        <div className="mt-4 text-center text-gray-400">
          <p className="text-sm">Mock Camera Feed</p>
          <p className="text-xs">Face recognition not available on this camera</p>
        </div>
      </div>
    );
  }

  // Render live camera feed
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden mb-6 flex flex-col items-center p-4">
      <div className="relative w-full max-w-md aspect-video">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          width="100%"
          height="auto"
          className="rounded-lg shadow-lg bg-gray-900"
          style={{ width: '100%', height: 'auto' }}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          width={640}
          height={480}
        />
        <div 
          className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold"
          style={{ background: status === 'success' ? '#22c55e' : '#ef4444', color: 'white' }}
        >
          {status === 'success' ? 'Face Detected' : 'No Face'}
        </div>
        <div className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold bg-red-600 text-white flex items-center space-x-1">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span>LIVE</span>
        </div>
      </div>
      <button
        onClick={handleLiveness}
        className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded-lg shadow hover:bg-yellow-600 transition-colors"
      >
        Simulate Blink (Liveness)
      </button>
      <button
        onClick={handleCheckInOut}
        disabled={status !== 'success'}
        className="mt-3 px-8 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
      >
        Tap to Check In/Out
      </button>
      {liveness && (
        <div className="mt-2 text-green-400 font-bold animate-pulse">
          Liveness Detected!
        </div>
      )}
    </div>
  );
};



const EmployeeCheckTabs = ({ activeTab, setActiveTab, attendanceLogs }) => {
  const tabs = ['Check-In', 'Check-Out'];
  
  const mockData = [
    { name: 'John', time: 'Fri, Jul 26, 2025 at 10:02 AM', avatar: '👨' },
    { name: 'Caroline', time: 'Fri, Jul 26, 2025 at 9:25 AM', avatar: '👩' },
    { name: 'Unknown', time: 'Fri, Jul 26, 2025 at 8:48 AM', avatar: '👤' },
    { name: 'Sarah Johnson', time: 'Fri, Jul 26, 2025 at 8:30 AM', avatar: '👩' },
    { name: 'Mike Chen', time: 'Fri, Jul 26, 2025 at 9:15 AM', avatar: '👨' }
  ];

  const allLogs = [...attendanceLogs, ...mockData];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {allLogs.slice(0, 6).map((log, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              {log.photo ? (
                <img 
                  src={log.photo} 
                  alt={log.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <span className="text-2xl">{log.avatar || '👤'}</span>
              )}
              <div>
                <div className="font-medium text-gray-900">{log.name}</div>
                <div className="text-sm text-gray-500">{log.time}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                IN
              </span>
              <button className="text-gray-400 hover:text-gray-600">
                <Settings size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CameraMenu = ({ cameras, currentCamera, onCameraSelect, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Menu Panel */}
      <div className="relative bg-white w-80 h-full shadow-2xl overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Camera Selection</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-2">
          {cameras.map((camera) => (
            <button
              key={camera.id}
              onClick={() => {
                onCameraSelect(camera);
                onClose();
              }}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                currentCamera.id === camera.id
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Camera size={18} className="text-gray-600" />
                  <span className="font-medium text-gray-900">{camera.name}</span>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  camera.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <MapPin size={14} />
                <span>{camera.location}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  camera.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {camera.status}
                </span>
                <span className="text-xs text-gray-400">
                  {camera.type === 'live' ? 'Live Feed' : 'Mock Feed'}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const CCTVMonitoring = ({ user }) => {
  const [activeTab, setActiveTab] = useState('Check-In');
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [currentCamera, setCurrentCamera] = useState(CAMERAS[0]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCheckInOut = (photo) => {
    setAttendanceLogs((prev) => [
      {
        name: 'User',
        time: new Date().toLocaleString(),
        photo,
        avatar: '👤'
      },
      ...prev,
    ]);
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 overflow-hidden">
      {/* Top right header */}
      <TopRightHeader user={user} />
      
      {/* Fixed Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-white/20 p-6 pt-24">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <Menu size={20} />
              </button>
              <div className="space-y-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-emerald-600 to-teal-600 bg-clip-text text-transparent leading-tight">
                  CCTV Real-Time Monitoring
                </h1>
                <p className="text-gray-600 text-lg font-medium">
                  {currentCamera.name} - {currentCamera.location}
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600 font-medium">Live Monitoring</span>
                  </div>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <span className="text-sm text-gray-500">{CAMERAS.length} Active Cameras</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Current Time</div>
                <div className="text-lg font-bold text-emerald-600">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-white/20 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-300 hover:scale-110 shadow-lg">
                  <Search size={20} />
                </button>
                <button className="p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-white/20 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-300 hover:scale-110 shadow-lg">
                  <User size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="h-full overflow-y-auto p-8" style={{ height: 'calc(100vh - 200px)' }}>
        <div className="max-w-[1400px] mx-auto">
          {/* Main Content Grid */}
          <div className="grid grid-cols-[2fr_1fr] gap-8 min-h-full">
            {/* Left Column - Face Recognition Attendance */}
            <div className="flex flex-col gap-6">
              <FaceRecognitionAttendance 
                onCheckInOut={handleCheckInOut} 
                currentCamera={currentCamera}
              />

            </div>
            {/* Right Sidebar */}
            <div className="flex flex-col gap-6">
              <EmployeeCheckTabs 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                attendanceLogs={attendanceLogs} 
              />

            </div>
          </div>
        </div>
      </div>

      {/* Camera Selection Menu */}
      <CameraMenu
        cameras={CAMERAS}
        currentCamera={currentCamera}
        onCameraSelect={setCurrentCamera}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </div>
  );
};

export default CCTVMonitoring;