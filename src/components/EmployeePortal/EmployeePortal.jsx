import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  Plus, Search, Download, 
  Calendar, IndianRupee, Clock, CheckCircle,
  AlertCircle, XCircle, Banknote, TrendingUp,
  FileText, Eye, Edit, Trash2, X, MoreVertical, LayoutGrid, List, ChevronDown, Building2
} from 'lucide-react';
import TopRightHeader from '../TopRightHeader/TopRightHeader';
import { useAuth } from '../../contexts/AuthContext';

const EmployeePortal = ({ user }) => {
  const { isAdmin, isEmployee } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingRequest, setViewingRequest] = useState(null);
  const [editingRequestId, setEditingRequestId] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [openMenuForId, setOpenMenuForId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  
  // Admin-specific state
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [dateRangeFilter, setDateRangeFilter] = useState({ start: '', end: '' });
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [auditLog, setAuditLog] = useState([]);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Close row action menu on Escape and click outside
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpenMenuForId(null);
    };
    
    const handleClickOutside = (e) => {
      if (openMenuForId && !e.target.closest('.action-menu-container')) {
        setOpenMenuForId(null);
      }
    };
    
    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuForId]);

  const toggleRowMenu = useCallback((id, event) => {
    if (openMenuForId === id) {
      setOpenMenuForId(null);
    } else {
      setOpenMenuForId(id);
      // Store the button position for menu positioning with boundary detection
      if (event) {
        const rect = event.currentTarget.getBoundingClientRect();
        const menuWidth = 200; // w-48 = 192px + some padding
        const menuHeight = 120; // Approximate height of menu with fewer options
        
        // Calculate initial position to the right of the button
        let left = rect.right + 10;
        let top = rect.top;
        
        // Check right boundary - if menu would go off-screen, position to the left
        if (left + menuWidth > window.innerWidth) {
          left = rect.left - menuWidth - 10;
        }
        
        // Check bottom boundary - if menu would go off-screen, position above
        if (top + menuHeight > window.innerHeight) {
          top = rect.top - menuHeight - 10;
        }
        
        // Ensure left boundary
        if (left < 10) {
          left = 10;
        }
        
        // Ensure top boundary
        if (top < 10) {
          top = 10;
        }
        
        setMenuPosition({ top, left });
      }
    }
  }, [openMenuForId]);

  // Initial data - empty array for fresh start (no mock data)
  const initialRequests = [];

  // Requests state with localStorage persistence
  const [requests, setRequests] = useState(() => {
    try {
      // Load existing data for both employees and admins
      const saved = localStorage.getItem('employee_portal_requests');
      return saved ? JSON.parse(saved) : initialRequests;
    } catch (_) {
      return initialRequests;
    }
  });

  useEffect(() => {
    try {
      // Save data for both employees and admins
      localStorage.setItem('employee_portal_requests', JSON.stringify(requests));
    } catch (_) {
      // ignore storage errors to avoid crashing UI
    }
  }, [requests]);

  // New request form state
  const [newRequest, setNewRequest] = useState({
    employeeName: '',
    employeeId: '',
    type: '',
    amount: '',
    submittedDate: new Date().toISOString().slice(0, 10),
    status: 'pending',
    description: '',
    category: 'other'
  });

  const resetNewRequest = useCallback(() => {
    setNewRequest({
      employeeName: '',
      employeeId: '',
      type: '',
      amount: '',
      submittedDate: new Date().toISOString().slice(0, 10),
      status: 'pending',
      description: '',
      category: 'other'
    });
  }, []);

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: 'Pending',
        className: 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700',
        icon: Clock
      },
      payment_processing: {
        label: 'Payment Processing',
        className: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700',
        icon: Clock
      },
      under_verification: {
        label: 'Under Verification',
        className: 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-700',
        icon: AlertCircle
      },
      approved: {
        label: 'Approved',
        className: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700',
        icon: CheckCircle
      },
      reimbursed: {
        label: 'Reimbursed',
        className: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700',
        icon: Banknote
      },
      rejected: {
        label: 'Rejected',
        className: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700',
        icon: XCircle
      }
    };
    return configs[status] || configs.pending;
  };

  // Memoized filtered and sorted data
  const filteredAndSortedRequests = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    let filtered = requests.filter(request => {
      const typeLower = String(request.type || '').toLowerCase();
      const idLower = String(request.id || '').toLowerCase();
      const descLower = String(request.description || '').toLowerCase();
      const employeeNameLower = String(request.employeeName || '').toLowerCase();
      const employeeIdLower = String(request.employeeId || '').toLowerCase();
      
      const matchesSearch = !term || 
        typeLower.includes(term) || 
        idLower.includes(term) || 
        descLower.includes(term) ||
        employeeNameLower.includes(term) ||
        employeeIdLower.includes(term);
      
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
      
      // Date range filtering for admin
      let matchesDateRange = true;
      if (isAdmin() && dateRangeFilter.start && dateRangeFilter.end) {
        const requestDate = new Date(request.submittedDate);
        const startDate = new Date(dateRangeFilter.start);
        const endDate = new Date(dateRangeFilter.end);
        matchesDateRange = requestDate >= startDate && requestDate <= endDate;
      }
      
      return matchesSearch && matchesStatus && matchesDateRange;
    });

    filtered.sort((a, b) => {
      let compareValue = 0;
      
      switch (sortBy) {
        case 'amount':
          compareValue = a.amount - b.amount;
          break;
        case 'date':
          compareValue = new Date(a.submittedDate) - new Date(b.submittedDate);
          break;
        case 'status':
          compareValue = a.status.localeCompare(b.status);
          break;
        case 'type':
          compareValue = a.type.localeCompare(b.type);
          break;
        default:
          compareValue = 0;
      }
      
      return sortOrder === 'desc' ? -compareValue : compareValue;
    });

    return filtered;
  }, [requests, searchTerm, statusFilter, dateRangeFilter, sortBy, sortOrder, isAdmin]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const total = requests.reduce((sum, req) => sum + req.amount, 0);
    const pending = requests
      .filter(req => req.status === 'payment_processing' || req.status === 'under_verification')
      .reduce((sum, req) => sum + req.amount, 0);
    const approved = requests.filter(req => req.status === 'approved').length;
    const reimbursed = requests
      .filter(req => req.status === 'reimbursed')
      .reduce((sum, req) => sum + req.amount, 0);

    return { total, pending, approved, reimbursed };
  }, [requests]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
              currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const openNewRequestModal = useCallback(() => {
    resetNewRequest();
    setViewingRequest(null);
    setEditingRequestId(null);
    setIsModalOpen(true);
  }, [resetNewRequest]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setViewingRequest(null);
    setEditingRequestId(null);
  }, []);

  const handleNewRequestChange = useCallback((field, value) => {
    setNewRequest(prev => ({ ...prev, [field]: value }));
  }, []);

  const generateNextId = useCallback(() => {
    const maxId = requests.reduce((max, r) => {
      const num = parseInt(String(r.id).replace('#', ''), 10);
      return Number.isFinite(num) && num > max ? num : max;
    }, 0);
    const next = String(maxId + 1).padStart(3, '0');
            return `#${next}`;
  }, [requests]);

  const handleCreateRequest = useCallback((e) => {
    e?.preventDefault?.();
    const type = newRequest.type.trim();
    const description = newRequest.description.trim();
    const amountNumber = Number(newRequest.amount);
    if (!type || !Number.isFinite(amountNumber) || amountNumber <= 0) return;

    if (editingRequestId) {
      // update existing
      setRequests(prev => prev.map(r => r.id === editingRequestId ? {
        ...r,
        type,
        amount: Math.round(amountNumber * 100) / 100,
        submittedDate: newRequest.submittedDate,
        status: newRequest.status,
        description,
        category: newRequest.category || 'other'
      } : r));
    } else {
      // create new
      const request = {
        id: generateNextId(),
        employeeName: newRequest.employeeName,
        employeeId: newRequest.employeeId,
        type,
        amount: Math.round(amountNumber * 100) / 100,
        submittedDate: newRequest.submittedDate,
        status: isEmployee() ? 'pending' : newRequest.status, // Employees always get 'pending' status
        description,
        category: newRequest.category || 'other'
      };
      setRequests(prev => [request, ...prev]);
    }
    closeModal();
  }, [newRequest, generateNextId, closeModal, editingRequestId, isEmployee]);

  const handleDelete = useCallback((id) => {
    setRequests(prev => prev.filter(r => r.id !== id));
  }, []);

  const handleStatusChange = useCallback((id, currentStatus) => {
          const newStatus = prompt(`Change status for request ${id}:\n\nCurrent: ${getStatusConfig(currentStatus).label}\n\nEnter new status:\n- pending\n- under_verification\n- payment_processing\n- approved\n- reimbursed\n- rejected`);
    
    if (newStatus && ['pending', 'under_verification', 'payment_processing', 'approved', 'reimbursed', 'rejected'].includes(newStatus)) {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      
      // Log admin action
      if (isAdmin()) {
        const logEntry = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          adminUser: user?.email || 'Admin',
          action: 'Status Change',
          requestId: id,
          oldStatus: currentStatus,
          newStatus: newStatus,
          details: `Status changed from ${getStatusConfig(currentStatus).label} to ${getStatusConfig(newStatus).label}`
        };
        setAuditLog(prev => [logEntry, ...prev]);
      }
    }
  }, [isAdmin, user]);

  const exportCsv = useCallback(() => {
    const header = ['Request ID', 'Employee Name', 'Employee ID', 'Expense Type', 'Amount', 'Submitted Date', 'Status', 'Description', 'Category'];
    
    const rows = filteredAndSortedRequests.map(r => [
      r.id,
      r.employeeName || 'N/A',
      r.employeeId || 'N/A',
      r.type,
      r.amount,
      r.submittedDate,
      r.status,
      r.description.replace(/\n|\r/g, ' '),
      r.category
    ]);
    
            const csv = [header, ...rows].map(cols => cols.map(String).map(s => `"${s.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'employee_requests.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [filteredAndSortedRequests]);

  // Admin-specific functions
  const handleBulkAction = useCallback((action) => {
    if (selectedRequests.length === 0) return;
    
    const newStatus = action === 'approve' ? 'approved' : 
                     action === 'reject' ? 'rejected' : 
                     action === 'reimburse' ? 'reimbursed' : 'pending';
    
    setRequests(prev => prev.map(r => 
      selectedRequests.includes(r.id) ? { ...r, status: newStatus } : r
    ));
    
    // Log bulk action
    const logEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      adminUser: user?.email || 'Admin',
      action: 'Bulk Action',
      requestIds: selectedRequests,
      newStatus: newStatus,
              details: `Bulk ${action} for ${selectedRequests.length} requests`
    };
    setAuditLog(prev => [logEntry, ...prev]);
    
    setSelectedRequests([]);
    setShowBulkActions(false);
  }, [selectedRequests, user]);



  const handleSelectRequest = useCallback((id) => {
    setSelectedRequests(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  }, []);

  // Analytics and Insights Functions
  const analyticsData = useMemo(() => {
    if (!requests.length) return null;

    // Monthly trends
    const monthlyData = {};
    requests.forEach(request => {
      const date = new Date(request.submittedDate);
              const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { count: 0, totalAmount: 0, month: monthYear };
      }
      monthlyData[monthYear].count++;
      monthlyData[monthYear].totalAmount += request.amount;
    });

    // Department trends (using employee ID prefix as department)
    const departmentData = {};
    requests.forEach(request => {
      const dept = request.employeeId ? request.employeeId.substring(0, 2).toUpperCase() : 'UN';
      if (!departmentData[dept]) {
        departmentData[dept] = { count: 0, totalAmount: 0, department: dept };
      }
      departmentData[dept].count++;
      departmentData[dept].totalAmount += request.amount;
    });

    // Expense category trends
    const categoryData = {};
    requests.forEach(request => {
      const category = request.category || 'other';
      if (!categoryData[category]) {
        categoryData[category] = { count: 0, totalAmount: 0, category };
      }
      categoryData[category].count++;
      categoryData[category].totalAmount += request.amount;
    });

    // High-value requests (top 5 by amount)
    const highValueRequests = [...requests]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
      .map(req => ({
        id: req.id,
        employeeName: req.employeeName || 'N/A',
        amount: req.amount,
        type: req.type,
        status: req.status,
        date: req.submittedDate
      }));

    // Frequent submitters (top 5 by request count)
    const submitterCounts = {};
    requests.forEach(request => {
      const submitter = request.employeeName || request.employeeId || 'Unknown';
      submitterCounts[submitter] = (submitterCounts[submitter] || 0) + 1;
    });

    const frequentSubmitters = Object.entries(submitterCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([submitter, count]) => ({
        submitter,
        count,
        totalAmount: requests
          .filter(req => (req.employeeName || req.employeeId) === submitter)
          .reduce((sum, req) => sum + req.amount, 0)
      }));

    // Status distribution
    const statusDistribution = {};
    requests.forEach(request => {
      const status = request.status;
      statusDistribution[status] = (statusDistribution[status] || 0) + 1;
    });

    return {
      monthlyData: Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month)),
      departmentData: Object.values(departmentData).sort((a, b) => b.totalAmount - a.totalAmount),
      categoryData: Object.values(categoryData).sort((a, b) => b.totalAmount - a.totalAmount),
      highValueRequests,
      frequentSubmitters,
      statusDistribution,
      totalRequests: requests.length,
      totalAmount: requests.reduce((sum, req) => sum + req.amount, 0),
      averageAmount: requests.reduce((sum, req) => sum + req.amount, 0) / requests.length
    };
  }, [requests]);

  return (
    <div className="flex-1 min-h-0 h-full overflow-y-auto bg-gradient-to-br from-orange-50 via-blue-50 to-orange-100 dark:from-dark-bg dark:via-dark-surface dark:to-dark-card transition-colors duration-300">
      {/* Top right header */}
      <TopRightHeader user={user} />
      
      {/* Main Content with compact spacing */}
      <div className="pt-2 pb-2 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                {isAdmin() ? 'Request ' : 'Employee '}<span className="text-orange-600 dark:text-orange-400">{isAdmin() ? 'Management' : 'Portal'}</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-base transition-colors duration-300">
                {isEmployee() ? 'Submit and track your expense requests' : 'Comprehensive expense request management and approval system'}
              </p>
            </div>
            
                         <div className="flex items-center gap-3">
               {isAdmin() && (
                 <>
                   <button onClick={() => setShowAnalytics(true)} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-card transition-colors shadow-sm">
                     <TrendingUp size={16} />
                     <span className="hidden sm:inline">Analytics</span>
                   </button>
                   <button onClick={exportCsv} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-card transition-colors shadow-sm">
                     <Download size={16} />
                     <span className="hidden sm:inline">Export</span>
                   </button>
                 </>
               )}
               <button onClick={openNewRequestModal} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-blue-600 text-white rounded-lg hover:from-orange-600 hover:to-blue-700 shadow hover:shadow-md transition-all text-sm font-medium">
                 <Plus size={16} />
                 {isEmployee() ? 'Submit Request' : 'Add New Request'}
               </button>
              <div className="hidden sm:flex items-center border border-gray-200 dark:border-dark-border rounded-lg overflow-hidden ml-1">
                <button
                  aria-label="List view"
                  onClick={() => setViewMode('list')}
                  className={`px-2.5 py-1.5 text-xs flex items-center gap-1.5 ${viewMode === 'list' ? 'bg-gray-100 dark:bg-dark-card text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
                >
                  <List size={14} />
                </button>
                <button
                  aria-label="Grid view"
                  onClick={() => setViewMode('grid')}
                  className={`px-2.5 py-1.5 text-xs flex items-center gap-1.5 ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-dark-card text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
                >
                  <LayoutGrid size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards - Admin Only */}
          {isAdmin() && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
              <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-100 dark:border-dark-border shadow-sm transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-300">Total Submitted</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{formatCurrency(summaryStats.total)}</p>
                  </div>
                  <div className="p-2.5 bg-blue-100 dark:bg-blue-900/20 rounded-lg shrink-0">
                    <IndianRupee className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-100 dark:border-dark-border shadow-sm transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-300">Pending Amount</p>
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 transition-colors duration-300">{formatCurrency(summaryStats.pending)}</p>
                  </div>
                  <div className="p-2.5 bg-orange-100 dark:bg-orange-900/20 rounded-lg shrink-0">
                    <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-100 dark:border-dark-border shadow-sm transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-300">Approved Items</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-300">{summaryStats.approved}</p>
                  </div>
                  <div className="p-2.5 bg-blue-100 dark:bg-blue-900/20 rounded-lg shrink-0">
                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-100 dark:border-dark-border shadow-sm transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-300">Reimbursed</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400 transition-colors duration-300">{formatCurrency(summaryStats.reimbursed)}</p>
                  </div>
                  <div className="p-2.5 bg-green-100 dark:bg-green-900/20 rounded-lg shrink-0">
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Filters and Search for Admin */}
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border shadow-sm p-6 mb-4 transition-colors duration-300">
          <div className="space-y-4">
            {/* Search Row */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1 transition-colors duration-300">Search Requests</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by employee name, request ID, or expense type..."
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors text-sm bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Filters Row */}
            {isAdmin() && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1 transition-colors duration-300">Status</label>
                  <div className="relative">
                    <select
                      className="w-full px-3 py-3 pl-10 border border-gray-200 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors text-sm appearance-none bg-white dark:bg-dark-surface text-gray-900 dark:text-white"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="payment_processing">Payment Processing</option>
                      <option value="under_verification">Under Verification</option>
                      <option value="approved">Approved</option>
                      <option value="reimbursed">Reimbursed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CheckCircle className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                </div>

                {/* Date Range Filter */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1 transition-colors duration-300">Date Range</label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="date"
                        className="w-full px-3 py-3 pl-10 border border-gray-200 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors text-sm bg-white dark:bg-dark-surface text-gray-900 dark:text-white"
                        value={dateRangeFilter.start}
                        onChange={(e) => setDateRangeFilter(prev => ({ ...prev, start: e.target.value }))}
                        placeholder="Start Date"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      </div>
                    </div>
                    <div className="text-gray-400 dark:text-gray-500 text-sm font-medium transition-colors duration-300">to</div>
                    <div className="relative flex-1">
                      <input
                        type="date"
                        className="w-full px-3 py-3 pl-10 border border-gray-200 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors text-sm bg-white dark:bg-dark-surface text-gray-900 dark:text-white"
                        value={dateRangeFilter.end}
                        onChange={(e) => setDateRangeFilter(prev => ({ ...prev, end: e.target.value }))}
                        placeholder="End Date"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sort */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1 transition-colors duration-300">Sort By</label>
                  <div className="relative">
                    <select
                      className="w-full px-3 py-3 pl-10 border border-gray-200 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors text-sm appearance-none bg-white dark:bg-dark-surface text-gray-900 dark:text-white"
                      value={`${sortBy}-${sortOrder}`}
                      onChange={(e) => {
                        const [field, order] = e.target.value.split('-');
                        setSortBy(field);
                        setSortOrder(order);
                      }}
                    >
                      <option value="date-desc">Latest First</option>
                      <option value="date-asc">Oldest First</option>
                      <option value="amount-desc">Highest Amount</option>
                      <option value="amount-asc">Lowest Amount</option>
                      <option value="status-asc">Status A-Z</option>
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <TrendingUp className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons Row */}
            {isAdmin() && (
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-dark-border">
                <div className="flex items-center gap-2">
                  {/* Active Filters Indicator */}
                  {(searchTerm || statusFilter !== 'all' || dateRangeFilter.start || dateRangeFilter.end || sortBy !== 'date' || sortOrder !== 'desc') && (
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 transition-colors duration-300">
                      <span className="font-medium">Active Filters:</span>
                      {searchTerm && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md transition-colors duration-300">
                          Search: "{searchTerm}"
                          <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-blue-800 dark:hover:text-blue-200">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {statusFilter !== 'all' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md transition-colors duration-300">
                          Status: {statusFilter}
                          <button onClick={() => setStatusFilter('all')} className="ml-1 hover:text-green-800 dark:hover:text-green-200">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {(dateRangeFilter.start || dateRangeFilter.end) && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-md transition-colors duration-300">
                          Date: {dateRangeFilter.start || 'Any'} - {dateRangeFilter.end || 'Any'}
                          <button onClick={() => setDateRangeFilter({ start: '', end: '' })} className="ml-1 hover:text-purple-800 dark:hover:text-purple-200">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                    </div>
                  )}
                  
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setDateRangeFilter({ start: '', end: '' });
                      setSortBy('date');
                      setSortOrder('desc');
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-dark-surface hover:bg-gray-100 dark:hover:bg-dark-card rounded-lg transition-colors font-medium"
                  >
                    <X className="w-4 h-4" />
                    Clear All
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      // Apply filters logic - currently filters are applied automatically
                      // This button can be used for future enhancements
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bulk Actions - Admin Only */}
        {isAdmin() && (
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border shadow-sm p-4 mb-4 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedRequests.length === filteredAndSortedRequests.length && filteredAndSortedRequests.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRequests(filteredAndSortedRequests.map(r => r.id));
                      } else {
                        setSelectedRequests([]);
                      }
                    }}
                    className="rounded border-gray-300 dark:border-gray-600 text-orange-600 dark:text-orange-400 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-white transition-colors duration-300">Select All</span>
                </label>
                {selectedRequests.length > 0 && (
                  <span className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                    {selectedRequests.length} request(s) selected
                  </span>
                )}
              </div>
              
              {selectedRequests.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBulkAction('approve')}
                    className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Approve Selected
                  </button>
                  <button
                    onClick={() => handleBulkAction('reject')}
                    className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reject Selected
                  </button>
                  <button
                    onClick={() => handleBulkAction('reimburse')}
                    className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Mark Reimbursed
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Requests: List or Grid */}
        {viewMode === 'list' ? (
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border shadow-sm overflow-hidden mb-4 transition-colors duration-300">
            <div className="overflow-x-auto min-w-full">
              <table className="w-full min-w-full">
                <thead className="bg-gradient-to-r from-orange-50 to-blue-50 dark:from-orange-900/10 dark:to-blue-900/10 border-b border-gray-100 dark:border-dark-border">
                  <tr>
                    {isAdmin() && (
                      <th className="text-left py-2 px-4 font-semibold text-gray-900 dark:text-white text-xs w-12 transition-colors duration-300">
                        <input
                          type="checkbox"
                          checked={selectedRequests.length === filteredAndSortedRequests.length && filteredAndSortedRequests.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRequests(filteredAndSortedRequests.map(r => r.id));
                            } else {
                              setSelectedRequests([]);
                            }
                          }}
                          className="rounded border-gray-300 dark:border-gray-600 text-orange-600 dark:text-orange-400 focus:ring-orange-500"
                        />
                      </th>
                    )}
                    <th className="text-left py-2 px-4 font-semibold text-gray-900 dark:text-white text-xs w-20 transition-colors duration-300">Request ID</th>
                    <th className="text-left py-2 px-4 font-semibold text-gray-900 dark:text-white text-xs w-32 transition-colors duration-300">Employee Name</th>
                    <th className="text-left py-2 px-4 font-semibold text-gray-900 dark:text-white text-xs w-28 transition-colors duration-300">Employee ID</th>
                    <th className="text-left py-2 px-4 font-semibold text-gray-900 dark:text-white text-xs w-40 transition-colors duration-300">Expense Type</th>
                    <th className="text-left py-2 px-4 font-semibold text-gray-900 dark:text-white text-xs w-24 transition-colors duration-300">Amount</th>
                    <th className="text-left py-2 px-4 font-semibold text-gray-900 dark:text-white text-xs w-32 transition-colors duration-300">Submitted Date</th>
                    <th className="text-left py-2 px-4 font-semibold text-gray-900 dark:text-white text-xs w-24 transition-colors duration-300">Status</th>
                    <th className="text-left py-2 px-4 font-semibold text-gray-900 dark:text-white text-xs w-20 transition-colors duration-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                  {filteredAndSortedRequests.map((request) => {
                    const statusConfig = getStatusConfig(request.status);
                    const StatusIcon = statusConfig.icon;
                    return (
                      <tr key={request.id} className="hover:bg-orange-50/40 dark:hover:bg-orange-900/10 transition-colors">
                        {isAdmin() && (
                          <td className="py-2 px-4">
                            <input
                              type="checkbox"
                              checked={selectedRequests.includes(request.id)}
                              onChange={() => handleSelectRequest(request.id)}
                              className="rounded border-gray-300 dark:border-gray-600 text-orange-600 dark:text-orange-400 focus:ring-orange-500"
                            />
                          </td>
                        )}
                        <td className="py-2 px-4">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-orange-100 dark:bg-orange-900/20 rounded-md shrink-0">
                              <FileText className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                            </div>
                            <span className="font-medium text-orange-600 dark:text-orange-400 text-xs transition-colors duration-300">{request.id}</span>
                          </div>
                        </td>
                        <td className="py-2 px-4">
                          <div className="font-medium text-gray-900 dark:text-white text-sm truncate transition-colors duration-300">{request.employeeName || 'N/A'}</div>
                        </td>
                        <td className="py-2 px-4">
                          <div className="font-medium text-gray-900 dark:text-white text-sm truncate transition-colors duration-300">{request.employeeId || 'N/A'}</div>
                        </td>
                        <td className="py-2 px-4">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white text-sm truncate transition-colors duration-300">{request.type}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-32 transition-colors duration-300">{request.description}</div>
                          </div>
                        </td>
                        <td className="py-2 px-4">
                          <span className="font-semibold text-gray-900 dark:text-white text-sm transition-colors duration-300">{formatCurrency(request.amount)}</span>
                        </td>
                        <td className="py-2 px-4">
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-xs transition-colors duration-300">
                            <Calendar className="w-3 h-3" />
                            <span className="truncate">{formatDate(request.submittedDate)}</span>
                          </div>
                        </td>
                        <td className="py-2 px-4">
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium border ${statusConfig.className}`}>
                            <StatusIcon className="w-2.5 h-2.5" />
                            {statusConfig.label}
                          </div>
                        </td>
                        <td className="py-2 px-4">
                          <div className="relative inline-block text-left">
                            <button onClick={(e) => toggleRowMenu(request.id, e)} className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-surface rounded-md transition-colors">
                              <MoreVertical size={14} />
                            </button>
                            {openMenuForId === request.id && (
                              <div className="fixed z-50 w-48 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg shadow-lg action-menu-container transition-colors duration-300" style={{
                                top: menuPosition.top,
                                left: menuPosition.left
                              }}>
                                <button onClick={() => { setEditingRequestId(null); setViewingRequest(request); setIsModalOpen(true); setOpenMenuForId(null); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-dark-card transition-colors">View</button>
                                {isAdmin() && (
                                  <>
                                    <button onClick={() => { setViewingRequest(null); setEditingRequestId(request.id); setNewRequest({ employeeName: request.employeeName, employeeId: request.employeeId, type: request.type, amount: String(request.amount), submittedDate: request.submittedDate, status: request.status, description: request.description, category: request.category || 'other' }); setIsModalOpen(true); setOpenMenuForId(null); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-dark-card transition-colors">Edit</button>
                                    <button onClick={() => { handleStatusChange(request.id, request.status); setOpenMenuForId(null); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-dark-card transition-colors">Change Status</button>
                                  </>
                                )}
                                <button onClick={() => { handleDelete(request.id); setOpenMenuForId(null); }} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50">Delete</button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredAndSortedRequests.length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3 transition-colors duration-300" />
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                  {isEmployee() ? 'No requests submitted yet' : 'No requests found'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">
                  {isEmployee() ? 'Click "Submit Request" to create your first expense request' : 'Try adjusting your search or filters'}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm p-4 mb-4 transition-colors duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAndSortedRequests.map((request) => {
                const statusConfig = getStatusConfig(request.status);
                const StatusIcon = statusConfig.icon;
                return (
                  <div key={request.id} className="border border-gray-100 dark:border-dark-border rounded-xl p-4 hover:shadow-sm transition-shadow relative">
                    <button onClick={(e) => toggleRowMenu(request.id, e)} className="absolute top-2 right-2 p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-surface rounded-lg transition-colors">
                      <MoreVertical size={16} />
                    </button>
                    {openMenuForId === request.id && (
                      <div className="fixed z-50 w-48 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg shadow-lg action-menu-container transition-colors duration-300" style={{
                        top: menuPosition.top,
                        left: menuPosition.left
                      }}>
                        <button onClick={() => { setEditingRequestId(null); setViewingRequest(request); setIsModalOpen(true); setOpenMenuForId(null); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-dark-card transition-colors">View</button>
                                                    {isAdmin() && (
                              <>
                                <button onClick={() => { setViewingRequest(null); setEditingRequestId(request.id); setNewRequest({ employeeName: request.employeeName, employeeId: request.employeeId, type: request.type, amount: String(request.amount), submittedDate: request.submittedDate, status: request.status, description: request.description, category: request.category || 'other' }); setIsModalOpen(true); setOpenMenuForId(null); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-dark-card transition-colors">Edit</button>
                                <button onClick={() => { handleStatusChange(request.id, request.status); setOpenMenuForId(null); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-dark-card transition-colors">Change Status</button>
                              </>
                            )}
                        <button onClick={() => { handleDelete(request.id); setOpenMenuForId(null); }} className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">Delete</button>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                        <FileText className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <span className="font-medium text-orange-600 dark:text-orange-400 text-sm transition-colors duration-300">{request.id}</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-300">Employee: {request.employeeName || 'N/A'}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-300">ID: {request.employeeId || 'N/A'}</div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm transition-colors duration-300">{request.type}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2 transition-colors duration-300">{request.description}</div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{formatCurrency(request.amount)}</span>
                      <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400 transition-colors duration-300">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(request.submittedDate)}
                      </span>
                    </div>
                    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-medium border mt-3 ${statusConfig.className}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusConfig.label}
                    </div>
                  </div>
                );
              })}
            </div>
            {filteredAndSortedRequests.length === 0 && (
              <div className="text-center py-6">
                <FileText className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2 transition-colors duration-300" />
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1 transition-colors duration-300">
                  {isEmployee() ? 'No requests submitted yet' : 'No requests found'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">
                  {isEmployee() ? 'Click "Submit Request" to create your first expense request' : 'Try adjusting your search or filters'}
                </p>
              </div>
            )}
          </div>
        )
        }

        {/* Results Info */}
        <div className="mt-4 flex items-center justify-between text-base text-gray-500 dark:text-gray-400 transition-colors duration-300">
          <span>
            {isEmployee() 
                              ? `Showing ${filteredAndSortedRequests.length} of ${requests.length} submitted requests`
                : `Showing ${filteredAndSortedRequests.length} of ${requests.length} requests`
            }
          </span>
          {isAdmin() && (
            <span>
              Total Amount: <strong className="text-gray-900 dark:text-white transition-colors duration-300">{formatCurrency(summaryStats.total)}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Main Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-2xl bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-gray-100 dark:border-dark-border overflow-hidden transition-colors duration-300">
            <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-orange-500 to-blue-600">
              <h3 className="text-white font-semibold text-lg">{
                viewingRequest ? 'Request Details' : (editingRequestId ? 'Edit Expense Request' : (isEmployee() ? 'Submit New Request' : 'New Expense Request'))
              }</h3>
              <button onClick={closeModal} className="p-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-8">
              {viewingRequest ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-300">Request ID</div>
                      <div className="font-medium text-gray-900 dark:text-white text-base transition-colors duration-300">{viewingRequest.id}</div>
                    </div>
                    {(isEmployee() || isAdmin()) && (
                      <>
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-300">Employee Name</div>
                          <div className="font-medium text-gray-900 dark:text-white text-base transition-colors duration-300">{viewingRequest.employeeName || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-300">Employee ID</div>
                          <div className="font-medium text-gray-900 dark:text-white text-base transition-colors duration-300">{viewingRequest.employeeId || 'N/A'}</div>
                        </div>
                      </>
                    )}
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-300">Submitted</div>
                      <div className="font-medium text-gray-900 dark:text-white text-base transition-colors duration-300">{formatDate(viewingRequest.submittedDate)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-300">Type</div>
                      <div className="font-medium text-gray-900 dark:text-white text-base transition-colors duration-300">{viewingRequest.type}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-300">Amount</div>
                      <div className="font-medium text-gray-900 dark:text-white text-base transition-colors duration-300">{formatCurrency(viewingRequest.amount)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-300">Status</div>
                      <div className="font-medium text-gray-900 dark:text-white text-base transition-colors duration-300">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusConfig(viewingRequest.status).className}`}>
                          {(() => {
                            const StatusIcon = getStatusConfig(viewingRequest.status).icon;
                            return StatusIcon ? <StatusIcon className="w-3 h-3" /> : null;
                          })()}
                          {getStatusConfig(viewingRequest.status).label}
                        </span>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-300">Description</div>
                      <div className="font-medium text-gray-900 dark:text-white text-base transition-colors duration-300">{viewingRequest.description || '—'}</div>
                    </div>
                    

                  </div>
                </div>
              ) : (
                <form onSubmit={handleCreateRequest} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Employee Name and ID - Always visible for admin, conditional for employees */}
                    <div>
                      <label className="block text-base text-gray-600 dark:text-gray-200 mb-2 transition-colors duration-300">
                        {isEmployee() ? 'Your Name' : 'Employee Name'}
                      </label>
                      <input
                        type="text"
                        value={newRequest.employeeName || ''}
                        onChange={(e) => handleNewRequestChange('employeeName', e.target.value)}
                        placeholder={isEmployee() ? 'Your full name' : 'Enter employee name'}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-base text-gray-600 dark:text-gray-200 mb-2 transition-colors duration-300">
                        {isEmployee() ? 'Your Employee ID' : 'Employee ID'}
                      </label>
                      <input
                        type="text"
                        value={newRequest.employeeId || ''}
                        onChange={(e) => handleNewRequestChange('employeeId', e.target.value)}
                        placeholder={isEmployee() ? 'Your employee ID' : 'Enter employee ID'}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-base text-gray-600 dark:text-gray-200 mb-2 transition-colors duration-300">Expense Type</label>
                      <input
                        type="text"
                        value={newRequest.type}
                        onChange={(e) => handleNewRequestChange('type', e.target.value)}
                        placeholder="e.g. Travel Expenses"
                        className="w-full px-4 py-3 border border-gray-200 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-base text-gray-600 dark:text-gray-200 mb-2 transition-colors duration-300">Amount</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={newRequest.amount}
                        onChange={(e) => handleNewRequestChange('amount', e.target.value)}
                        placeholder="0.00"
                        className="w-full px-4 py-3 border border-gray-200 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-base text-gray-600 dark:text-gray-200 mb-2 transition-colors duration-300">Date</label>
                      <input
                        type="date"
                        value={newRequest.submittedDate}
                        onChange={(e) => handleNewRequestChange('submittedDate', e.target.value)}
                        className="w-full px-3 py-3 border border-gray-200 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base bg-white dark:bg-dark-surface text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    {isAdmin() && (
                      <div>
                        <label className="block text-base text-gray-600 dark:text-gray-200 mb-2 transition-colors duration-300">Status</label>
                        <select
                          value={newRequest.status}
                          onChange={(e) => handleNewRequestChange('status', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base bg-white dark:bg-dark-surface text-gray-900 dark:text-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="under_verification">Under Verification</option>
                          <option value="payment_processing">Payment Processing</option>
                          <option value="approved">Approved</option>
                          <option value="reimbursed">Reimbursed</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    )}
                    <div>
                      <label className="block text-base text-gray-600 dark:text-gray-200 mb-2 transition-colors duration-300">Category</label>
                      <select
                        value={newRequest.category}
                        onChange={(e) => handleNewRequestChange('category', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base bg-white dark:bg-dark-surface text-gray-900 dark:text-white"
                      >
                        <option value="travel">Travel</option>
                        <option value="office">Office</option>
                        <option value="equipment">Equipment</option>
                        <option value="meals">Meals & Entertainment</option>
                        <option value="education">Education</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-base text-gray-600 dark:text-gray-200 mb-2 transition-colors duration-300">Description</label>
                      <textarea
                        value={newRequest.description}
                        onChange={(e) => handleNewRequestChange('description', e.target.value)}
                        rows={3}
                        placeholder="Optional details"
                        className="w-full px-4 py-3 border border-gray-200 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-y text-base bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-4 pt-4">
                    <button type="button" onClick={closeModal} className="px-6 py-3 rounded-xl border border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-surface text-base transition-colors duration-300">Cancel</button>
                    <button type="submit" className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-blue-600 text-white hover:from-orange-600 hover:to-blue-700 shadow text-base font-medium">
                      {editingRequestId ? 'Update Request' : (isEmployee() ? 'Submit Request' : 'Create Request')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}



      {/* Analytics Modal */}
      {showAnalytics && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAnalytics(false)} />
          <div className="relative w-full max-w-7xl bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-gray-100 dark:border-dark-border overflow-hidden max-h-[90vh] transition-colors duration-300">
            <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-orange-500 to-blue-600">
              <h3 className="text-white font-semibold text-xl">Request Analytics & Insights</h3>
              <button onClick={() => setShowAnalytics(false)} className="p-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {!analyticsData ? (
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
                  <p className="text-gray-500">Submit some requests to see analytics and insights.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600 font-medium">Total Requests</p>
                          <p className="text-2xl font-bold text-blue-900">{analyticsData.totalRequests}</p>
                        </div>
                        <FileText className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-600 font-medium">Total Amount</p>
                          <p className="text-2xl font-bold text-green-900">{formatCurrency(analyticsData.totalAmount)}</p>
                        </div>
                        <IndianRupee className="w-8 h-8 text-green-600" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-purple-600 font-medium">Average Amount</p>
                          <p className="text-2xl font-bold text-purple-900">{formatCurrency(analyticsData.averageAmount)}</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-purple-600" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-orange-600 font-medium">Active Departments</p>
                          <p className="text-2xl font-bold text-orange-900">{analyticsData.departmentData.length}</p>
                        </div>
                        <Building2 className="w-8 h-8 text-orange-600" />
                      </div>
                    </div>
                  </div>

                  {/* Charts Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Monthly Trends Chart */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Monthly Request Trends</h4>
                      <div className="h-64">
                        {analyticsData.monthlyData.length > 0 ? (
                          <div className="space-y-3">
                            {analyticsData.monthlyData.map((month) => (
                              <div key={month.month} className="flex items-center gap-3">
                                <div className="w-24 text-sm text-gray-600">
                                  {new Date(month.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                </div>
                                <div className="flex-1 bg-gray-100 rounded-full h-3">
                                  <div 
                                    className="bg-gradient-to-r from-orange-400 to-blue-500 h-3 rounded-full transition-all duration-300"
                                    style={{ width: `${(month.count / Math.max(...analyticsData.monthlyData.map(m => m.count))) * 100}%` }}
                                  />
                                </div>
                                <div className="w-16 text-right text-sm font-medium text-gray-900">
                                  {month.count}
                                </div>
                                <div className="w-20 text-right text-sm text-gray-600">
                                  {formatCurrency(month.totalAmount)}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-gray-500 py-8">No monthly data available</div>
                        )}
                      </div>
                    </div>

                    {/* Status Distribution Chart */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h4>
                      <div className="h-64">
                        {Object.keys(analyticsData.statusDistribution).length > 0 ? (
                          <div className="space-y-3">
                            {Object.entries(analyticsData.statusDistribution).map(([status, count]) => {
                              const percentage = (count / analyticsData.totalRequests) * 100;
                              const statusConfig = getStatusConfig(status);
                              return (
                                <div key={status} className="flex items-center gap-3">
                                  <div className="w-32 flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${statusConfig.className.replace('border', 'bg').split(' ')[0]}`} />
                                    <span className="text-sm text-gray-700 capitalize">{statusConfig.label}</span>
                                  </div>
                                  <div className="flex-1 bg-gray-100 rounded-full h-3">
                                    <div 
                                                      className={`h-3 rounded-full transition-all duration-300 ${statusConfig.className.replace('border', 'bg').split(' ')[0]}`}
                style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                  <div className="w-16 text-right text-sm font-medium text-gray-900">
                                    {count}
                                  </div>
                                  <div className="w-16 text-right text-sm text-gray-600">
                                    {percentage.toFixed(1)}%
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center text-gray-500 py-8">No status data available</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Department and Category Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Department Performance */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Department Performance</h4>
                      <div className="h-64">
                        {analyticsData.departmentData.length > 0 ? (
                          <div className="space-y-3">
                            {analyticsData.departmentData.slice(0, 8).map((dept) => (
                              <div key={dept.department} className="flex items-center gap-3">
                                <div className="w-16 text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded text-center">
                                  {dept.department}
                                </div>
                                <div className="flex-1 bg-gray-100 rounded-full h-3">
                                  <div 
                                    className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-300"
                                    style={{ width: `${(dept.totalAmount / Math.max(...analyticsData.departmentData.map(d => d.totalAmount))) * 100}%` }}
                                  />
                                </div>
                                <div className="w-16 text-right text-sm font-medium text-gray-900">
                                  {dept.count}
                                </div>
                                <div className="w-24 text-right text-sm text-gray-600">
                                  {formatCurrency(dept.totalAmount)}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-gray-500 py-8">No department data available</div>
                        )}
                      </div>
                    </div>

                    {/* Expense Category Trends */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Expense Category Trends</h4>
                      <div className="h-64">
                        {analyticsData.categoryData.length > 0 ? (
                          <div className="space-y-3">
                            {analyticsData.categoryData.slice(0, 8).map((category) => (
                              <div key={category.category} className="flex items-center gap-3">
                                <div className="w-24 text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded text-center capitalize">
                                  {category.category}
                                </div>
                                <div className="flex-1 bg-gray-100 rounded-full h-3">
                                  <div 
                                    className="bg-gradient-to-r from-purple-400 to-pink-500 h-3 rounded-full transition-all duration-300"
                                    style={{ width: `${(category.totalAmount / Math.max(...analyticsData.categoryData.map(c => c.totalAmount))) * 100}%` }}
                                  />
                                </div>
                                <div className="w-16 text-right text-sm font-medium text-gray-900">
                                  {category.count}
                                </div>
                                <div className="w-24 text-right text-sm text-gray-600">
                                  {formatCurrency(category.totalAmount)}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-gray-500 py-8">No category data available</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* High-Value Requests and Frequent Submitters */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* High-Value Requests */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">High-Value Requests</h4>
                      <div className="space-y-3">
                        {analyticsData.highValueRequests.length > 0 ? (
                          analyticsData.highValueRequests.map((request, index) => (
                            <div key={request.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-orange-200">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">
                                  #{index + 1}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{request.employeeName}</div>
                                  <div className="text-sm text-gray-600">{request.type}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-lg text-orange-600">{formatCurrency(request.amount)}</div>
                                <div className="text-xs text-gray-500">{formatDate(request.date)}</div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-gray-500 py-8">No high-value requests</div>
                        )}
                      </div>
                    </div>

                    {/* Frequent Submitters */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Frequent Submitters</h4>
                      <div className="space-y-3">
                        {analyticsData.frequentSubmitters.length > 0 ? (
                          analyticsData.frequentSubmitters.map((submitter, index) => (
                            <div key={submitter.submitter} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                                  #{index + 1}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{submitter.submitter}</div>
                                  <div className="text-sm text-gray-600">{submitter.count} requests</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-lg text-blue-600">{formatCurrency(submitter.totalAmount)}</div>
                                <div className="text-xs text-gray-500">Total spent</div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-gray-500 py-8">No frequent submitters</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Audit Log Modal */}
      {isAdmin() && (
        <div className="fixed bottom-4 right-4 z-40">
          <button
            onClick={() => setShowAuditLog(!showAuditLog)}
            className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
            title="View Audit Log"
          >
            <Clock className="w-5 h-5" />
          </button>
          
          {showAuditLog && (
            <div className="absolute bottom-16 right-0 w-96 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Audit Log</h3>
                <p className="text-sm text-gray-600">Recent admin actions</p>
              </div>
              <div className="p-4">
                {auditLog.length === 0 ? (
                  <p className="text-gray-500 text-sm">No actions logged yet</p>
                ) : (
                  <div className="space-y-3">
                    {auditLog.slice(0, 10).map((log) => (
                      <div key={log.id} className="text-sm border-l-2 border-blue-500 pl-3">
                        <div className="font-medium text-gray-900">{log.action}</div>
                        <div className="text-gray-600">{log.details}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(log.timestamp).toLocaleString()} by {log.adminUser}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Footer Blank Space */}
      <div className="h-16 sm:h-20 md:h-24"></div>
    </div>
  );
};

export default EmployeePortal;