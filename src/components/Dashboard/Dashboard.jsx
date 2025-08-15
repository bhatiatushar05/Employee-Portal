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
  IndianRupee,
  Eye,
  Shield,
  Activity,
  Download,
  Settings
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
    }, 500);

    return () => clearTimeout(loadingTimer);
  }, []);

  // Mock data for admin dashboard
  const dashboardData = {
    employeePortal: {
      totalRequests: 47,
      pendingRequests: 12,
      approvedRequests: 28,
      rejectedRequests: 7,
      lastActivity: "2 hours ago",
      recentRequests: [
        { id: "#001", type: "Travel Expenses", amount: "₹12,450.00", status: "Processing", employee: "John Doe", department: "Sales" },
        { id: "#002", type: "Office Supplies", amount: "₹3,735.00", status: "Under Review", employee: "Sarah Johnson", department: "Marketing" },
        { id: "#003", type: "Travel Expenses", amount: "₹26,560.00", status: "Under Review", employee: "Mike Chen", department: "Engineering" },
        { id: "#004", type: "Software License", amount: "₹7,469.17", status: "Approved", employee: "Emma Davis", department: "IT" },
        { id: "#005", type: "Training Course", amount: "₹16,517.00", status: "Processing", employee: "Alex Wilson", department: "HR" }
      ]
    },

    cctvFeed: {
      activeCameras: 12,
      totalCameras: 15,
      lastIncident: "3 days ago",
      systemStatus: "Online",
      securityAlerts: 2,
      unauthorizedAccess: 0
    },

    systemMetrics: {
      serverUptime: "99.8%",
      databaseHealth: "Excellent",
      backupStatus: "Last backup: 2 hours ago",
      performanceScore: 94
    },

    employeeStats: {
      totalEmployees: 156,
      activeToday: 142,
      onLeave: 8,
      newHires: 3,
      departments: 8
    },

    financialOverview: {
      monthlyBudget: "₹12,50,000",
      spentThisMonth: "₹8,94,500",
      remainingBudget: "₹3,55,500",
      topExpenseCategory: "Travel & Accommodation"
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
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Total Employees",
      value: dashboardData.employeeStats.totalEmployees,
              change: `+${dashboardData.employeeStats.newHires} this month`,
      color: "bg-blue-50 border-blue-200"
    },
    {
      icon: <CreditCard className="w-8 h-8 text-orange-600" />,
      title: "Pending Requests",
      value: dashboardData.employeePortal.pendingRequests,
              change: `${dashboardData.employeePortal.rejectedRequests} rejected`,
      color: "bg-orange-50 border-orange-200"
    },
    {
      icon: <IndianRupee className="w-8 h-8 text-green-600" />,
              title: "Monthly Budget (₹)",
      value: dashboardData.financialOverview.remainingBudget,
              change: `${dashboardData.financialOverview.spentThisMonth} spent`,
      color: "bg-green-50 border-green-200"
    },
    {
      icon: <Activity className="w-8 h-8 text-purple-600" />,
      title: "System Performance",
      value: dashboardData.systemMetrics.performanceScore + "%",
      change: "Uptime: " + dashboardData.systemMetrics.serverUptime,
      color: "bg-purple-50 border-purple-200"
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
      <div className="flex-1 min-h-0 h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-dark-bg dark:to-dark-surface overflow-y-auto transition-colors duration-300">
        {/* Top right header */}
        <TopRightHeader user={user} />
        
        {/* Main Content with proper spacing */}
        <div className="pt-16 sm:pt-20 pb-2 px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto space-y-4 sm:space-y-6">
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
                <div key={index} className="bg-white dark:bg-dark-card rounded-xl p-6 border-2 border-gray-100 dark:border-dark-border shadow-sm transition-colors duration-300">
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
              <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-200 dark:border-dark-border p-6 transition-colors duration-300">
                <div className="flex items-center mb-6">
                  <Skeleton height={40} width={40} className="rounded-lg mr-4" />
                  <Skeleton height={28} width="180px" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(2)].map((_, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-dark-surface rounded-xl p-6 border border-gray-200 dark:border-dark-border transition-colors duration-300">
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
              <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-200 dark:border-dark-border p-6 transition-colors duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Skeleton height={40} width={40} className="rounded-lg mr-4" />
                    <Skeleton height={28} width="180px" />
                  </div>
                  <Skeleton height={20} width="100px" />
                </div>
                
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-surface rounded-xl transition-colors duration-300">
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
              <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-200 dark:border-dark-border p-6 transition-colors duration-300">
                <div className="flex items-center mb-6">
                  <Skeleton height={40} width={40} className="rounded-lg mr-4" />
                  <Skeleton height={28} width="180px" />
                </div>
                
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-surface rounded-xl transition-colors duration-300">
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
              <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-200 dark:border-dark-border p-6 transition-colors duration-300">
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
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-dark-border">
                    <Skeleton height={16} width="180px" />
                  </div>
                </div>
              </div>

              {/* Security Status Skeleton */}
              <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-200 dark:border-dark-border p-6 transition-colors duration-300">
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
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-dark-border">
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
    <div className="flex-1 min-h-0 h-full bg-gradient-to-br from-orange-50 via-blue-50 to-orange-100 dark:from-dark-bg dark:via-dark-surface dark:to-dark-card overflow-y-auto transition-colors duration-300">
      {/* Top right header */}
      <TopRightHeader user={user} />
      
      {/* Main Content with proper spacing */}
      <div className="pt-2 pb-2 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-md border border-gray-100 dark:border-dark-border p-3 sm:p-4 transition-colors duration-300">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-lg shadow-md">
                <LayoutDashboard size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight transition-colors duration-300">
                  <span className="text-gray-900 dark:text-white">{getGreeting()}, {getFirstName()}! 👋</span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 hidden sm:block transition-colors duration-300">
                  Welcome back to your dashboard. Here's what's happening today.
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 bg-white dark:bg-dark-surface text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-card transition-all duration-300 shadow-md hover:shadow-lg text-xs sm:text-sm font-medium border border-gray-200 dark:border-dark-border">
                <Activity size={12} className="sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Analytics</span>
                <span className="sm:hidden">A</span>
              </button>
              <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 bg-white dark:bg-dark-surface text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-card transition-all duration-300 shadow-md hover:shadow-lg text-xs sm:text-sm font-medium border border-gray-200 dark:border-dark-border">
                <Download size={12} className="sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Export</span>
                <span className="sm:hidden">E</span>
              </button>
              <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg text-xs sm:text-sm font-medium">
                <Sparkles size={12} className="sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Quick Actions</span>
                <span className="sm:hidden">QA</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {quickStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white dark:bg-dark-card rounded-xl shadow-md p-3 sm:p-4 border border-gray-100 dark:border-dark-border hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 text-orange-700 dark:text-orange-300 rounded-lg flex-shrink-0 transition-colors duration-300">
                    {React.cloneElement(stat.icon, { 
                      className: "w-6 h-6 sm:w-8 sm:h-8", 
                      size: undefined 
                    })}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-700 dark:text-gray-200 text-xs truncate transition-colors duration-300">{stat.title}</h3>
                    <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mt-1 truncate transition-colors duration-300">{stat.value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate transition-colors duration-300">{stat.change}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 items-start">
          {/* Left Column - Recent Activity & Updates */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            {/* Quick Admin Actions */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-md border border-gray-100 dark:border-dark-border p-3 sm:p-4 transition-colors duration-300">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg mr-2 sm:mr-3">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">Quick Admin Actions</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <button className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg mb-3 group-hover:scale-[1.05] transition-transform duration-300">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-medium text-blue-900 dark:text-blue-300 text-sm text-center transition-colors duration-300">Add Employee</span>
                </button>
                
                <button className="flex flex-col items-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg mb-3 group-hover:scale-[1.05] transition-transform duration-300">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-medium text-green-900 dark:text-green-300 text-sm text-center transition-colors duration-300">Review Requests</span>
                </button>
                
                <button className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/10 dark:to-violet-900/10 rounded-xl border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg mb-3 group-hover:scale-[1.05] transition-transform duration-300">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-medium text-purple-900 dark:text-purple-300 text-sm text-center transition-colors duration-300">CCTV Settings</span>
                </button>
                
                <button className="flex flex-col items-center p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 rounded-xl border border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg mb-3 group-hover:scale-[1.05] transition-transform duration-300">
                    <IndianRupee className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-medium text-orange-900 dark:text-orange-300 text-sm text-center transition-colors duration-300">Budget Report</span>
                </button>
                
                <button className="flex flex-col items-center p-4 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 rounded-xl border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="p-3 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg mb-3 group-hover:scale-[1.05] transition-transform duration-300">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-medium text-indigo-900 dark:text-indigo-300 text-sm text-center transition-colors duration-300">System Health</span>
                </button>
                
                <button className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/10 dark:to-slate-900/10 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="p-3 bg-gradient-to-r from-gray-500 to-slate-600 rounded-lg mb-3 group-hover:scale-[1.05] transition-transform duration-300">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-300 text-sm text-center transition-colors duration-300">Settings</span>
                </button>
              </div>
            </div>

            {/* Upcoming Features */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-md border border-gray-100 dark:border-dark-border p-3 sm:p-4 transition-colors duration-300">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg mr-2 sm:mr-3">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">Coming Soon</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {upcomingFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-dark-surface dark:to-dark-card rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-dark-border hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
                  >
                    <div className={`absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${feature.color} opacity-10 rounded-full -mr-8 -mt-8 sm:-mr-10 sm:-mt-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                    <div className={`p-2 sm:p-3 bg-gradient-to-r ${feature.color} rounded-lg inline-block mb-3 sm:mb-4 group-hover:scale-[1.05] transition-transform duration-300`}>
                      <div className="text-white">
                        {React.cloneElement(feature.icon, { 
                          className: "w-5 h-5 sm:w-6 sm:h-6", 
                          size: undefined 
                        })}
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 text-base sm:text-lg">{feature.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 leading-relaxed">{feature.description}</p>
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 transition-colors duration-300">
                      {feature.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Employee Requests */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-md border border-gray-100 dark:border-dark-border p-3 sm:p-4 transition-colors duration-300">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg mr-2 sm:mr-3">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">Recent Requests</h2>
                </div>
                <button className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 text-xs sm:text-sm font-medium flex items-center hover:translate-x-1 transition-transform duration-300">
                  <span className="hidden sm:inline">View all</span>
                  <span className="sm:hidden">All</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                </button>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {dashboardData.employeePortal.recentRequests.map((request, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 lg:p-5 bg-gray-50 dark:bg-dark-surface rounded-xl hover:bg-gray-100 dark:hover:bg-dark-card transition-all duration-200 hover:scale-[1.01] cursor-pointer group space-y-2 sm:space-y-0"
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center group-hover:scale-[1.05] transition-transform duration-300 flex-shrink-0">
                        <span className="text-orange-600 dark:text-orange-300 font-semibold text-xs sm:text-sm transition-colors duration-300">
                          {request.id.replace('#', '')}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 dark:text-white mb-1 text-sm sm:text-base truncate">{request.type}</p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{request.amount} • {request.employee}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{request.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3">
                      <span className={`px-2 sm:px-3 py-1 sm:py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                        request.status === 'Processing' 
                          ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-900/30'
                          : request.status === 'Approved'
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 group-hover:bg-green-200 dark:group-hover:bg-green-900/30'
                          : 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/30'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-dark-border">
                <div className="text-center text-gray-400 dark:text-gray-500 text-sm transition-colors duration-300">
                  <p className="mb-3">All recent requests displayed</p>
                  <div className="flex items-center justify-center space-x-4 sm:space-x-6 text-xs">
                    <span className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-300">Processing</span>
                    </span>
                    <span className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-300">Under Review</span>
                    </span>
                    <span className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-300">Approved</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Employee Management Overview */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-md border border-gray-100 dark:border-dark-border p-3 sm:p-4 transition-colors duration-300">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg mr-2 sm:mr-3">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">Employee Management</h2>
                </div>
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs sm:text-sm font-medium flex items-center hover:translate-x-1 transition-transform duration-300">
                  <span className="hidden sm:inline">Manage All</span>
                  <span className="sm:hidden">All</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-3 sm:p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{dashboardData.employeeStats.totalEmployees}</div>
                  <div className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 font-medium">Total Employees</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-3 sm:p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{dashboardData.employeeStats.activeToday}</div>
                  <div className="text-xs sm:text-sm text-green-700 dark:text-green-300 font-medium">Active Today</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/10 rounded-xl p-3 sm:p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">{dashboardData.employeeStats.onLeave}</div>
                  <div className="text-xs sm:text-sm text-orange-700 dark:text-orange-300 font-medium">On Leave</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/10 rounded-xl p-3 sm:p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">{dashboardData.employeeStats.departments}</div>
                  <div className="text-xs sm:text-sm text-purple-700 dark:text-purple-300 font-medium">Departments</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Access & System Status */}
          <div className="space-y-4 sm:space-y-6">
            {/* System Overview */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-md border border-gray-100 dark:border-dark-border p-3 sm:p-4 transition-colors duration-300">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg mr-2 sm:mr-3">
                  <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">System Overview</h2>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between p-3 sm:p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/20 transition-all duration-300 hover:scale-[1.01] cursor-pointer group">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 group-hover:scale-[1.05] transition-transform duration-300" />
                    <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Employee Portal</span>
                  </div>
                  <span className="text-xs sm:text-sm text-orange-600 dark:text-orange-300 font-medium px-2 sm:px-3 py-1 bg-orange-100 dark:bg-orange-900/20 rounded-full">Active</span>
                </div>
                
                <div className="flex items-center justify-between p-3 sm:p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-all duration-300 hover:scale-[1.01] cursor-pointer group">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 group-hover:scale-[1.05] transition-transform duration-300" />
                    <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">CCTV System</span>
                  </div>
                  <span className="text-xs sm:text-sm text-purple-600 dark:text-purple-300 font-medium px-2 sm:px-3 py-1 bg-purple-100 dark:bg-purple-900/20 rounded-full">Monitoring</span>
                </div>

                <div className="flex items-center justify-between p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-[1.01] cursor-pointer group">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 group-hover:scale-[1.05] transition-transform duration-300" />
                    <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Database</span>
                  </div>
                  <span className="text-xs sm:text-sm text-blue-600 dark:text-blue-300 font-medium px-2 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900/20 rounded-full">{dashboardData.systemMetrics.databaseHealth}</span>
                </div>
              </div>
            </div>

            {/* System Metrics */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-md border border-gray-100 dark:border-dark-border p-3 sm:p-4 transition-colors duration-300">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg mr-2 sm:mr-3">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">System Metrics</h2>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-xl p-3 sm:p-4">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">{dashboardData.systemMetrics.performanceScore}%</div>
                    <div className="text-xs sm:text-sm text-indigo-700 dark:text-indigo-300 font-medium">Performance Score</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Server Uptime:</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">{dashboardData.systemMetrics.serverUptime}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Last Backup:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{dashboardData.systemMetrics.backupStatus.split(': ')[1]}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Alerts & Notifications */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-md border border-gray-100 dark:border-dark-border p-3 sm:p-4 transition-colors duration-300">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="p-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg mr-2 sm:mr-3">
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">Admin Alerts</h2>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-red-900 dark:text-red-300">Security Alert</span>
                  </div>
                  <span className="text-xs text-red-600 dark:text-red-300 font-medium">2 new</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium text-yellow-900 dark:text-yellow-300">Pending Approvals</span>
                  </div>
                  <span className="text-xs text-yellow-600 dark:text-yellow-300 font-medium">12 requests</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-300">System Update</span>
                  </div>
                  <span className="text-xs text-blue-600 dark:text-blue-300 font-medium">Available</span>
                </div>
              </div>
            </div>



            {/* Financial Overview */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-md border border-gray-100 dark:border-dark-border p-3 sm:p-4 transition-colors duration-300">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg mr-2 sm:mr-3">
                  <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">Financial Overview</h2>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl p-3 sm:p-4">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{dashboardData.financialOverview.remainingBudget}</div>
                    <div className="text-xs sm:text-sm text-green-700 dark:text-green-300 font-medium">Remaining Budget</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Monthly Budget:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{dashboardData.financialOverview.monthlyBudget}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Spent This Month:</span>
                    <span className="font-semibold text-orange-600 dark:text-orange-400">{dashboardData.financialOverview.spentThisMonth}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Top Category:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{dashboardData.financialOverview.topExpenseCategory}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Status */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-md border border-gray-100 dark:border-dark-border p-3 sm:p-4 transition-colors duration-300">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg mr-2 sm:mr-3">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">Security Status</h2>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900/10 p-2 sm:p-3 rounded-lg transition-colors duration-300">
                  <span className="text-gray-600 dark:text-gray-300 font-medium text-sm sm:text-base">Active Cameras</span>
                  <span className="font-bold text-lg sm:text-xl text-indigo-600 dark:text-indigo-400">
                    {dashboardData.cctvFeed.activeCameras}/{dashboardData.cctvFeed.totalCameras}
                  </span>
                </div>
                
                <div className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900/10 p-2 sm:p-3 rounded-lg transition-colors duration-300">
                  <span className="text-gray-600 dark:text-gray-300 font-medium text-sm sm:text-base">Security Alerts</span>
                  <span className="font-bold text-lg sm:text-xl text-red-600 dark:text-red-300">
                    {dashboardData.cctvFeed.securityAlerts}
                  </span>
                </div>
                
                <div className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900/10 p-2 sm:p-3 rounded-lg transition-colors duration-300">
                  <span className="text-gray-600 dark:text-gray-300 font-medium text-sm sm:text-base">System Status</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-600 dark:text-green-300 font-semibold text-sm sm:text-base">
                      {dashboardData.cctvFeed.systemStatus}
                    </span>
                  </div>
                </div>
                
                <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-dark-border">
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Last incident: {dashboardData.cctvFeed.lastIncident}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Blank Space */}
        <div className="h-16 sm:h-20 md:h-24"></div>
      </div>
    </div>
  );
  };
  
  export default Dashboard;