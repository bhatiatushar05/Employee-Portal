import React, { useState } from 'react';
import { Search, Camera, MapPin, Settings, Eye, Wifi, WifiOff, AlertTriangle, CheckCircle, Clock, BarChart3, TrendingUp, Activity, X } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import { useTheme } from '../../contexts/ThemeContext';
import TopRightHeader from '../TopRightHeader/TopRightHeader';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Enhanced camera data with more information
const CAMERAS = [
  { 
    id: 1, 
    name: 'Main Entrance', 
    location: 'Building A - Front Door', 
    status: 'active', 
    type: 'live',
    resolution: '4K',
    fps: '30',
    lastMaintenance: '2024-01-15',
    uptime: '99.8%',
    recording: true,
    motionDetection: true,
    nightVision: true
  },
  { 
    id: 2, 
    name: 'Reception Area', 
    location: 'Building A - Lobby', 
    status: 'active', 
    type: 'live',
    resolution: '1080p',
    fps: '25',
    lastMaintenance: '2024-01-10',
    uptime: '99.9%',
    recording: true,
    motionDetection: true,
    nightVision: false
  },
  { 
    id: 3, 
    name: 'Parking Lot', 
    location: 'Outdoor - Section B', 
    status: 'active', 
    type: 'live',
    resolution: '4K',
    fps: '30',
    lastMaintenance: '2024-01-12',
    uptime: '98.5%',
    recording: true,
    motionDetection: true,
    nightVision: true
  },
  { 
    id: 4, 
    name: 'Break Room', 
    location: 'Building A - 2nd Floor', 
    status: 'maintenance', 
    type: 'offline',
    resolution: '1080p',
    fps: '25',
    lastMaintenance: '2024-01-20',
    uptime: '0%',
    recording: false,
    motionDetection: false,
    nightVision: false
  },
  { 
    id: 5, 
    name: 'Conference Room', 
    location: 'Building A - 3rd Floor', 
    status: 'active', 
    type: 'live',
    resolution: '1080p',
    fps: '25',
    lastMaintenance: '2024-01-08',
    uptime: '99.7%',
    recording: true,
    motionDetection: true,
    nightVision: false
  },
  { 
    id: 6, 
    name: 'Server Room', 
    location: 'Building A - Basement', 
    status: 'active', 
    type: 'live',
    resolution: '4K',
    fps: '30',
    lastMaintenance: '2024-01-18',
    uptime: '99.9%',
    recording: true,
    motionDetection: true,
    nightVision: true
  },
  { 
    id: 7, 
    name: 'Loading Dock', 
    location: 'Building B - Rear', 
    status: 'active', 
    type: 'live',
    resolution: '1080p',
    fps: '25',
    lastMaintenance: '2024-01-14',
    uptime: '99.2%',
    recording: true,
    motionDetection: true,
    nightVision: true
  },
  { 
    id: 8, 
    name: 'Security Office', 
    location: 'Building A - 1st Floor', 
    status: 'active', 
    type: 'live',
    resolution: '1080p',
    fps: '25',
    lastMaintenance: '2024-01-16',
    uptime: '99.8%',
    recording: true,
    motionDetection: true,
    nightVision: false
  }
];

// Analytics Section Component with Chart.js
const AnalyticsSection = ({ cameras }) => {
  const { isDarkMode } = useTheme();
  
  // Chart.js options for dark/light mode
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: isDarkMode ? '#e5e7eb' : '#374151',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        titleColor: isDarkMode ? '#e5e7eb' : '#111827',
        bodyColor: isDarkMode ? '#d1d5db' : '#374151',
        borderColor: isDarkMode ? '#374151' : '#d1d5db',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? '#9ca3af' : '#6b7280'
        },
        grid: {
          color: isDarkMode ? '#374151' : '#e5e7eb'
        }
      },
      y: {
        ticks: {
          color: isDarkMode ? '#9ca3af' : '#6b7280'
        },
        grid: {
          color: isDarkMode ? '#374151' : '#e5e7eb'
        }
      }
    }
  };

  // Status Distribution Chart Data
  const getStatusData = () => {
    const statusCounts = { active: 0, maintenance: 0, offline: 0 };
    cameras.forEach(camera => {
      statusCounts[camera.status]++;
    });
    
    return {
      labels: ['Active', 'Maintenance', 'Offline'],
      datasets: [{
        data: [statusCounts.active, statusCounts.maintenance, statusCounts.offline],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderColor: ['#059669', '#d97706', '#dc2626'],
        borderWidth: 2,
        hoverOffset: 4
      }]
    };
  };

  // Resolution Breakdown Chart Data
  const getResolutionData = () => {
    const resolutionCounts = {};
    cameras.forEach(camera => {
      resolutionCounts[camera.resolution] = (resolutionCounts[camera.resolution] || 0) + 1;
    });
    
    return {
      labels: Object.keys(resolutionCounts),
      datasets: [{
        data: Object.values(resolutionCounts),
        backgroundColor: ['#8b5cf6', '#3b82f6', '#06b6d4', '#10b981'],
        borderColor: ['#7c3aed', '#2563eb', '#0891b2', '#059669'],
        borderWidth: 2,
        hoverOffset: 4
      }]
    };
  };

  // Feature Analysis Chart Data
  const getFeatureData = () => {
    let motionCount = 0, nightVisionCount = 0, recordingCount = 0;
    cameras.forEach(camera => {
      if (camera.motionDetection) motionCount++;
      if (camera.nightVision) nightVisionCount++;
      if (camera.recording) recordingCount++;
    });
    
    return {
      labels: ['Motion Detection', 'Night Vision', 'Recording'],
      datasets: [{
        data: [motionCount, nightVisionCount, recordingCount],
        backgroundColor: ['#06b6d4', '#7c3aed', '#059669'],
        borderColor: ['#0891b2', '#6d28d9', '#047857'],
        borderWidth: 2,
        hoverOffset: 4
      }]
    };
  };

  // Uptime Performance Chart Data
  const getUptimeData = () => {
    const avgUptime = cameras.reduce((sum, camera) => {
      const uptime = parseFloat(camera.uptime.replace('%', ''));
      return sum + uptime;
    }, 0) / cameras.length;
    
    return {
      labels: ['Average Uptime', 'Remaining'],
      datasets: [{
        data: [Math.round(avgUptime), Math.round(100 - avgUptime)],
        backgroundColor: ['#10b981', '#6b7280'],
        borderColor: ['#059669', '#4b5563'],
        borderWidth: 2,
        hoverOffset: 4
      }]
    };
  };

  // Monthly Maintenance Chart Data
  const getMaintenanceData = () => {
    const maintenanceByMonth = {};
    cameras.forEach(camera => {
      const month = new Date(camera.lastMaintenance).toLocaleDateString('en-US', { month: 'short' });
      maintenanceByMonth[month] = (maintenanceByMonth[month] || 0) + 1;
    });
    
    return {
      labels: Object.keys(maintenanceByMonth),
      datasets: [{
        label: 'Maintenance Count',
        data: Object.values(maintenanceByMonth),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: '#3b82f6',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }]
    };
  };

  // Camera Performance Trend Chart Data
  const getPerformanceData = () => {
    const performanceData = cameras.map(camera => ({
      name: camera.name,
      uptime: parseFloat(camera.uptime.replace('%', '')),
      fps: parseInt(camera.fps),
      resolution: camera.resolution === '4K' ? 4 : 1
    }));
    
    return {
      labels: performanceData.map(c => c.name),
      datasets: [
        {
          label: 'Uptime %',
          data: performanceData.map(c => c.uptime),
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderColor: '#10b981',
          borderWidth: 2,
          yAxisID: 'y'
        },
        {
          label: 'FPS',
          data: performanceData.map(c => c.fps),
          backgroundColor: 'rgba(139, 92, 246, 0.8)',
          borderColor: '#8b5cf6',
          borderWidth: 2,
          yAxisID: 'y1'
        }
      ]
    };
  };

  // Performance Chart Options with dual Y-axis
  const performanceChartOptions = {
    ...chartOptions,
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? '#9ca3af' : '#6b7280'
        },
        grid: {
          color: isDarkMode ? '#374151' : '#e5e7eb'
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        ticks: {
          color: isDarkMode ? '#9ca3af' : '#6b7280'
        },
        grid: {
          color: isDarkMode ? '#374151' : '#e5e7eb'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        ticks: {
          color: isDarkMode ? '#9ca3af' : '#6b7280'
        },
        grid: {
          drawOnChartArea: false
        }
      }
    }
  };

  return (
    <div className={`rounded-xl shadow-md border p-4 ${
      isDarkMode 
        ? 'bg-dark-card border-dark-border shadow-dark' 
        : 'bg-white border-gray-100'
    }`}>
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 size={20} className={`${
          isDarkMode ? 'text-orange-400' : 'text-orange-600'
        }`} />
        <h3 className={`text-lg font-semibold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Advanced Camera Analytics</h3>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Status Distribution */}
        <div className="text-center">
          <h4 className={`text-sm font-medium mb-4 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Camera Status Distribution</h4>
          <div className="h-64">
            <Doughnut 
              data={getStatusData()} 
              options={chartOptions}
            />
          </div>
        </div>

        {/* Resolution Breakdown */}
        <div className="text-center">
          <h4 className={`text-sm font-medium mb-4 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Resolution Distribution</h4>
          <div className="h-64">
            <Pie 
              data={getResolutionData()} 
              options={chartOptions}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Feature Analysis */}
        <div className="text-center">
          <h4 className={`text-sm font-medium mb-4 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Feature Analysis</h4>
          <div className="h-64">
            <Doughnut 
              data={getFeatureData()} 
              options={chartOptions}
            />
          </div>
        </div>

        {/* Uptime Performance */}
        <div className="text-center">
          <h4 className={`text-sm font-medium mb-4 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Uptime Performance</h4>
          <div className="h-64">
            <Doughnut 
              data={getUptimeData()} 
              options={chartOptions}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Maintenance Trend */}
        <div>
          <h4 className={`text-sm font-medium mb-4 text-center ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Monthly Maintenance Trend</h4>
          <div className="h-64">
            <Line 
              data={getMaintenanceData()} 
              options={chartOptions}
            />
          </div>
        </div>

        {/* Camera Performance Comparison */}
        <div>
          <h4 className={`text-sm font-medium mb-4 text-center ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Camera Performance Comparison</h4>
          <div className="h-64">
            <Bar 
              data={getPerformanceData()} 
              options={performanceChartOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const CameraFeed = ({ camera }) => {
  const { isDarkMode } = useTheme();
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Online';
      case 'maintenance': return 'Maintenance';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  return (
    <div className={`rounded-xl shadow-lg border overflow-hidden transition-all duration-300 hover:shadow-xl ${
      isDarkMode 
        ? 'bg-dark-card border-dark-border hover:border-orange-500/50' 
        : 'bg-gradient-to-br from-orange-50 via-blue-50 to-orange-100'
    }`}>
      {/* Camera Header */}
      <div className={`p-3 border-b ${
        isDarkMode ? 'border-dark-border bg-dark-surface' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera size={16} className={`${
              isDarkMode ? 'text-orange-400' : 'text-orange-600'
            }`} />
            <span className={`font-semibold text-sm ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>{camera.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(camera.status)}`}></div>
            <span className={`text-xs font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>{getStatusText(camera.status)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <MapPin size={12} className={`${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <span className={`text-xs ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>{camera.location}</span>
        </div>
        </div>
        
      {/* Camera Feed */}
      <div className="relative">
        <div className={`aspect-video ${
          isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
        } flex items-center justify-center relative overflow-hidden`}>
          {camera.status === 'active' ? (
            <>
              {/* Mock camera feed with animated elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 animate-pulse"></div>
              <div className="relative z-10 text-center">
                <Camera size={48} className={`mx-auto mb-2 ${
                  isDarkMode ? 'text-orange-400' : 'text-orange-600'
                } opacity-75`} />
                <p className={`text-sm font-medium ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{camera.name}</p>
                <p className={`text-xs ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>{camera.location}</p>
              </div>
              
              {/* Live indicator */}
              <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                LIVE
              </div>
              
              {/* Camera info overlay */}
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                {camera.resolution} • {camera.fps}fps
              </div>
            </>
          ) : (
            <div className="text-center">
              <AlertTriangle size={48} className={`mx-auto mb-2 ${
                isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
              }`} />
              <p className={`text-sm font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Camera Offline</p>
              <p className={`text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>{camera.status === 'maintenance' ? 'Under Maintenance' : 'Connection Lost'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Camera Details */}
      <div className={`p-3 space-y-2 ${
        isDarkMode ? 'bg-dark-surface' : 'bg-gray-50'
      }`}>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <span className={`${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Resolution:</span>
            <span className={`font-medium ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>{camera.resolution}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={`${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>FPS:</span>
            <span className={`font-medium ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>{camera.fps}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={`${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Uptime:</span>
            <span className={`font-medium ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>{camera.uptime}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={`${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Recording:</span>
            <span className={`font-medium ${
              camera.recording 
                ? (isDarkMode ? 'text-green-400' : 'text-green-600')
                : (isDarkMode ? 'text-red-400' : 'text-red-600')
            }`}>{camera.recording ? 'Yes' : 'No'}</span>
          </div>
        </div>
        
        {/* Feature indicators */}
        <div className={`flex items-center gap-2 pt-2 border-t ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          {camera.motionDetection && (
            <div className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
              isDarkMode 
                ? 'bg-blue-900/30 text-blue-300' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              <Eye size={12} />
              Motion
            </div>
          )}
          {camera.nightVision && (
            <div className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
              isDarkMode 
                ? 'bg-purple-900/30 text-purple-300' 
                : 'bg-purple-100 text-purple-800'
            }`}>
              <Eye size={12} />
              Night
            </div>
          )}
          <div className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
            isDarkMode 
              ? 'bg-gray-800 text-gray-300' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            <Clock size={12} />
            {camera.lastMaintenance}
          </div>
        </div>
      </div>
    </div>
  );
};

const CCTVMonitoring = ({ user }) => {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAnalytics, setShowAnalytics] = useState(false);

  const filteredCameras = CAMERAS.filter(camera => {
    const matchesSearch = camera.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         camera.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || camera.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusCounts = () => {
    const counts = { active: 0, maintenance: 0, offline: 0 };
    CAMERAS.forEach(camera => {
      counts[camera.status]++;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className={`flex-1 min-h-0 h-full overflow-y-auto ${
      isDarkMode 
        ? 'bg-black' 
        : 'bg-gradient-to-br from-orange-50 via-blue-50 to-orange-100'
    }`}>
      {/* Top right header */}
      <TopRightHeader user={user} />
      
      {/* Main Content */}
      <div className={`pt-16 sm:pt-20 pb-2 px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto space-y-4 sm:space-y-6 ${
        isDarkMode 
          ? 'bg-transparent' 
          : 'bg-gradient-to-br from-orange-50 via-blue-50 to-orange-100'
      }`}>
        {/* Header */}
        <div className={`rounded-xl shadow-md border p-3 sm:p-4 ${
          isDarkMode 
            ? 'bg-dark-card border-dark-border shadow-dark' 
            : 'bg-white border-gray-100'
        }`}>
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-lg shadow-md">
                <Camera size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className={`text-lg sm:text-xl md:text-2xl font-bold leading-tight ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>CCTV</span>{' '}
                  <span className="text-orange-500">Real-Time Monitoring</span>
                </h1>
                <p className={`text-xs sm:text-sm mt-1 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {CAMERAS.length} Cameras • Real-time surveillance and monitoring
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className={`text-xs sm:text-sm font-medium ${
                      isDarkMode ? 'text-green-400' : 'text-green-600'
                    }`}>{statusCounts.active} Active</span>
                  </div>
                  <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                    <span className={`text-xs sm:text-sm ${
                      isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                    }`}>{statusCounts.maintenance} Maintenance</span>
                  </div>
                  <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                    <span className={`text-xs sm:text-sm ${
                      isDarkMode ? 'text-red-400' : 'text-red-600'
                    }`}>{statusCounts.offline} Offline</span>
                  </div>
                </div>
              </div>
            </div>
              <div className="text-right">
              <div className={`text-xs sm:text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>Current Time</div>
              <div className={`text-base sm:text-lg font-bold ${
                isDarkMode ? 'text-orange-400' : 'text-blue-600'
              }`}>
                  {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className={`rounded-xl shadow-md border p-4 ${
          isDarkMode 
            ? 'bg-dark-card border-dark-border shadow-dark' 
            : 'bg-white border-gray-100'
        }`}>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search size={20} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search cameras by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-dark-surface border-dark-border text-white placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
            </div>
            
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-4 py-2 border rounded-lg text-sm transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-dark-surface border-dark-border text-white focus:ring-orange-500 focus:border-orange-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
              }`}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="offline">Offline</option>
            </select>

            {/* Analytics Button */}
            <button
              onClick={() => setShowAnalytics(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-xl' 
                  : 'bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg'
              }`}
            >
              <BarChart3 size={16} />
              Analytics
            </button>
          </div>
        </div>

        {/* Camera Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredCameras.map((camera) => (
            <CameraFeed key={camera.id} camera={camera} />
          ))}
        </div>

        {/* No Results */}
        {filteredCameras.length === 0 && (
          <div className={`text-center py-12 rounded-xl border ${
            isDarkMode 
              ? 'bg-dark-card border-dark-border' 
              : 'bg-white border-gray-200'
          }`}>
            <Camera size={48} className={`mx-auto mb-4 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <h3 className={`text-lg font-semibold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>No cameras found</h3>
            <p className={`${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Try adjusting your search or filter criteria.</p>
          </div>
        )}
        
        {/* Analytics Modal */}
        {showAnalytics && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAnalytics(false)} />
            <div className={`relative w-full max-w-7xl rounded-2xl shadow-2xl border overflow-hidden max-h-[90vh] transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-dark-card border-dark-border' 
                : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-orange-500 to-blue-600">
                <h3 className="text-white font-semibold text-xl">Camera Analytics Dashboard</h3>
                <button onClick={() => setShowAnalytics(false)} className="p-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <AnalyticsSection cameras={CAMERAS} />
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

export default CCTVMonitoring;