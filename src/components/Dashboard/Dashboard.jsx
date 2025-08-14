import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import TopRightHeader from '../TopRightHeader/TopRightHeader'; // <-- Import your header
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  CreditCard, 
  Camera, 
  FileText, 
  Bell, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Video,
  Sparkles,
  ArrowRight,
  DollarSign,
  Eye,
  Shield,
  Activity
} from 'lucide-react';

const Dashboard = ({ user }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate data loading
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(loadingTimer);
  }, []);

  // Mock data for dashboard
  const dashboardData = {
    employeePortal: {
      totalRequests: 7,
      pendingRequests: 3,
      approvedRequests: 4,
      lastActivity: "2 hours ago",
      recentRequests: [
        { id: "#001", type: "Travel Expenses", amount: "$150.00", status: "Processing" },
        { id: "#002", type: "Office Supplies", amount: "$45.00", status: "Under Review" },
        { id: "#003", type: "Travel Expenses", amount: "$320.00", status: "Under Review" }
      ]
    },

    cctvFeed: {
      activeCameras: 12,
      totalCameras: 15,
      lastIncident: "3 days ago",
      systemStatus: "Online"
    }
  };

  const upcomingFeatures = [
    {
      icon: <Video className="w-6 h-6" />,
      title: "Video Calling",
      description: "Integrated video conferencing for team meetings",
      status: "In Development",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Smart Notifications",
      description: "Intelligent alerts and reminders system",
      status: "Testing Phase",
      color: "from-orange-500 to-red-500"
    }
  ];

  const quickStats = [
    {
      icon: <CreditCard className="w-8 h-8 text-orange-600" />,
      title: "Total Requests",
      value: dashboardData.employeePortal.totalRequests,
      change: "+2 this week",
      color: "bg-orange-50 border-orange-200"
    },
    {
      icon: <DollarSign className="w-8 h-8 text-blue-600" />,
      title: "Total Expenses",
      value: "$1,245.80",
      change: "+$456 this month",
      color: "bg-blue-50 border-blue-200"
    },
    {
      icon: <Camera className="w-8 h-8 text-purple-600" />,
      title: "Active Cameras",
      value: `${dashboardData.cctvFeed.activeCameras}/${dashboardData.cctvFeed.totalCameras}`,
      change: "System Online",
      color: "bg-purple-50 border-purple-200"
    },
    {
      icon: <Activity className="w-8 h-8 text-blue-600" />,
      title: "System Health",
      value: "98.5%",
      change: "All systems operational",
      color: "bg-blue-50 border-blue-200"
    }
  ];

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getFirstName = () => {
    if (!user?.fullName) return "User";
    return user.fullName.split(' ')[0];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50/30">
        {/* Top right header */}
        <TopRightHeader user={user} />
        
        {/* Main Content with proper spacing */}
        <div className="pt-20 pb-2 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Header Section Skeleton */}
          <div className="mb-8 mt-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div className="mb-6 lg:mb-0">
                <Skeleton height={48} width="350px" className="mb-3" />
                <Skeleton height={24} width="450px" />
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <Skeleton height={56} width="280px" className="rounded-xl" />
                <Skeleton height={56} width="180px" className="rounded-xl" />
              </div>
            </div>

            {/* Quick Stats Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border-2 border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton height={32} width={32} className="rounded" />
                    <Skeleton height={16} width={16} className="rounded" />
                  </div>
                  <Skeleton height={32} width="70%" className="mb-2" />
                  <Skeleton height={18} width="90%" className="mb-2" />
                  <Skeleton height={14} width="80%" />
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Grid Skeleton */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            {/* Left Column Skeleton */}
            <div className="xl:col-span-2 space-y-8">
              {/* Upcoming Features Skeleton */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <Skeleton height={40} width={40} className="rounded-lg mr-4" />
                  <Skeleton height={28} width="180px" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(2)].map((_, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <Skeleton height={40} width={40} className="rounded-lg mb-4" />
                      <Skeleton height={24} width="80%" className="mb-3" />
                      <Skeleton height={16} width="100%" className="mb-2" />
                      <Skeleton height={16} width="90%" className="mb-4" />
                      <Skeleton height={24} width="70%" className="rounded-full" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Requests Skeleton */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Skeleton height={40} width={40} className="rounded-lg mr-4" />
                    <Skeleton height={28} width="180px" />
                  </div>
                  <Skeleton height={20} width="100px" />
                </div>
                
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-4">
                        <Skeleton height={48} width={48} className="rounded-lg" />
                        <div>
                          <Skeleton height={18} width="140px" className="mb-2" />
                          <Skeleton height={16} width="100px" />
                        </div>
                      </div>
                      <Skeleton height={28} width="120px" className="rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column Skeleton */}
            <div className="space-y-8">
              {/* System Overview Skeleton */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <Skeleton height={40} width={40} className="rounded-lg mr-4" />
                  <Skeleton height={28} width="180px" />
                </div>
                
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Skeleton height={24} width={24} className="rounded" />
                        <Skeleton height={18} width="140px" />
                      </div>
                      <Skeleton height={16} width="80px" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Account Summary Skeleton */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <Skeleton height={40} width={40} className="rounded-lg mr-4" />
                  <Skeleton height={28} width="160px" />
                </div>
                
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex justify-between items-center p-3 rounded-lg">
                      <Skeleton height={18} width="120px" />
                      <Skeleton height={20} width="100px" />
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t border-gray-200">
                    <Skeleton height={16} width="180px" />
                  </div>
                </div>
              </div>

              {/* Security Status Skeleton */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <Skeleton height={40} width={40} className="rounded-lg mr-4" />
                  <Skeleton height={28} width="150px" />
                </div>
                
                <div className="space-y-4">
                  {[...Array(2)].map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg">
                      <Skeleton height={18} width="120px" />
                      <div className="flex items-center space-x-2">
                        <Skeleton height={12} width={12} className="rounded-full" />
                        <Skeleton height={18} width="80px" />
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t border-gray-200">
                    <Skeleton height={16} width="150px" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Top right header */}
      <TopRightHeader user={user} />
      
      {/* Main Content with proper spacing */}
      <div className="pt-20 pb-2 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 mt-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 leading-tight">
                {getGreeting()}, {getFirstName()}! 👋
              </h1>
              <p className="text-gray-600 text-lg md:text-xl">
                Welcome back to your dashboard. Here's what's happening today.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="bg-white rounded-xl px-6 py-4 shadow-sm border border-gray-200 hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    {currentTime.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
              
              <div className="bg-white rounded-xl px-6 py-4 shadow-sm border border-gray-200 hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 font-mono whitespace-nowrap">
                    {currentTime.toLocaleTimeString('en-US', { 
                      hour12: true, 
                      hour: '2-digit', 
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {quickStats.map((stat, index) => (
              <div
                key={index}
                className={`${stat.color} rounded-xl p-6 border-2 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer group relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    {stat.icon}
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                  <p className="text-sm text-gray-600 mb-2 font-medium">{stat.title}</p>
                  <p className="text-xs text-green-600 font-medium">{stat.change}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          {/* Left Column - Recent Activity & Updates */}
          <div className="xl:col-span-2 space-y-6">
            {/* Upcoming Features */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.01] cursor-pointer group">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-orange-500 rounded-lg mr-4 group-hover:scale-[1.05] transition-transform duration-300">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Coming Soon</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
                  >
                    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.color} opacity-10 rounded-full -mr-10 -mt-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                    <div className={`p-3 bg-gradient-to-r ${feature.color} rounded-lg inline-block mb-4 group-hover:scale-[1.05] transition-transform duration-300`}>
                      <div className="text-white">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-3 text-lg">{feature.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {feature.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Employee Requests */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.01] cursor-pointer group">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-lg mr-4 group-hover:scale-[1.05] transition-transform duration-300">
                    <FileText className="w-6 h-6 text-orange-600" />
                  </div>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Recent Requests</h2>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform duration-300">
                  View all <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              
              <div className="space-y-4">
                {dashboardData.employeePortal.recentRequests.map((request, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-[1.01] cursor-pointer group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:scale-[1.05] transition-transform duration-300">
                        <span className="text-orange-600 font-semibold text-sm">
                          {request.id.replace('#', '')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 mb-1">{request.type}</p>
                        <p className="text-sm text-gray-600">{request.amount}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                        request.status === 'Processing' 
                          ? 'bg-yellow-100 text-yellow-800 group-hover:bg-yellow-200'
                          : 'bg-orange-100 text-orange-800 group-hover:bg-orange-200'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="text-center text-gray-400 text-sm">
                  <p className="mb-4">All recent requests displayed</p>
                  <div className="flex items-center justify-center space-x-6 text-xs">
                    <span className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <span>Processing</span>
                    </span>
                    <span className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                      <span>Under Review</span>
                    </span>
                    <span className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span>Approved</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Access & System Status */}
          <div className="space-y-6">
            {/* System Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.01] cursor-pointer group">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-100 rounded-lg mr-4 group-hover:scale-[1.05] transition-transform duration-300">
                  <LayoutDashboard className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">System Overview</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-all duration-300 hover:scale-[1.01] cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-orange-600 group-hover:scale-[1.05] transition-transform duration-300" />
                    <span className="font-medium text-gray-900">Employee Portal</span>
                  </div>
                  <span className="text-sm text-orange-600 font-medium px-3 py-1 bg-orange-100 rounded-full">Active</span>
                </div>
                

                
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all duration-300 hover:scale-[1.01] cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <Eye className="w-5 h-5 text-purple-600 group-hover:scale-[1.05] transition-transform duration-300" />
                    <span className="font-medium text-gray-900">CCTV System</span>
                  </div>
                  <span className="text-sm text-purple-600 font-medium px-3 py-1 bg-purple-100 rounded-full">Monitoring</span>
                </div>
              </div>
            </div>



            {/* Security Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.01] cursor-pointer group">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-indigo-100 rounded-lg mr-4 group-hover:scale-[1.05] transition-transform duration-300">
                  <Shield className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Security Status</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between hover:bg-gray-50 p-3 rounded-lg transition-colors duration-300">
                  <span className="text-gray-600 font-medium">Active Cameras</span>
                  <span className="font-bold text-xl text-indigo-600">
                    {dashboardData.cctvFeed.activeCameras}/{dashboardData.cctvFeed.totalCameras}
                  </span>
                </div>
                
                <div className="flex items-center justify-between hover:bg-gray-50 p-3 rounded-lg transition-colors duration-300">
                  <span className="text-gray-600 font-medium">System Status</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-600 font-semibold">
                      {dashboardData.cctvFeed.systemStatus}
                    </span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Last incident: {dashboardData.cctvFeed.lastIncident}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;