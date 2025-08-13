import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Plus, Search, Download,
  Calendar, DollarSign, Clock, CheckCircle,
  AlertCircle, XCircle, Banknote, TrendingUp,
  FileText, Eye, Edit, Trash2, X, MoreVertical, LayoutGrid, List
} from 'lucide-react';
import TopRightHeader from '../TopRightHeader/TopRightHeader';

const EmployeePortal = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingRequest, setViewingRequest] = useState(null);
  const [editingRequestId, setEditingRequestId] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [openMenuForId, setOpenMenuForId] = useState(null);

  // Close row action menu on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpenMenuForId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggleRowMenu = useCallback((id) => {
    setOpenMenuForId((prev) => (prev === id ? null : id));
  }, []);

  // Initial data (used if no saved data is present)
  const initialRequests = [
    {
      id: '#001',
      type: 'Travel Expenses',
      amount: 150.00,
      submittedDate: '2025-04-05',
      status: 'payment_processing',
      description: 'Business trip to New York',
      category: 'travel'
    },
    {
      id: '#002',
      type: 'Office Supplies',
      amount: 45.00,
      submittedDate: '2025-04-03',
      status: 'under_verification',
      description: 'Stationery and printing materials',
      category: 'office'
    },
    {
      id: '#003',
      type: 'Travel Expenses',
      amount: 320.00,
      submittedDate: '2025-07-28',
      status: 'under_verification',
      description: 'Client meeting in Chicago',
      category: 'travel'
    },
    {
      id: '#004',
      type: 'Mileage',
      amount: 127.00,
      submittedDate: '2024-10-28',
      status: 'approved',
      description: 'Monthly mileage reimbursement',
      category: 'travel'
    },
    {
      id: '#005',
      type: 'Equipment Rental',
      amount: 220.00,
      submittedDate: '2024-09-28',
      status: 'approved',
      description: 'Laptop rental for project',
      category: 'equipment'
    },
    {
      id: '#006',
      type: 'Meals & Entertainment',
      amount: 120.00,
      submittedDate: '2024-01-02',
      status: 'approved',
      description: 'Client dinner',
      category: 'meals'
    },
    {
      id: '#007',
      type: 'Transportation',
      amount: 440.00,
      submittedDate: '2024-08-18',
      status: 'approved',
      description: 'Taxi and flight expenses',
      category: 'travel'
    },
    {
      id: '#008',
      type: 'Conference Fees',
      amount: 890.00,
      submittedDate: '2025-03-15',
      status: 'reimbursed',
      description: 'Tech conference registration',
      category: 'education'
    }
  ];

  // Requests state with localStorage persistence
  const [requests, setRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('employee_portal_requests');
      return saved ? JSON.parse(saved) : initialRequests;
    } catch (_) {
      return initialRequests;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('employee_portal_requests', JSON.stringify(requests));
    } catch (_) {
      // ignore storage errors to avoid crashing UI
    }
  }, [requests]);

  // New request form state
  const [newRequest, setNewRequest] = useState({
    type: '',
    amount: '',
    submittedDate: new Date().toISOString().slice(0, 10),
    status: 'under_verification',
    description: '',
    category: 'other'
  });

  const resetNewRequest = useCallback(() => {
    setNewRequest({
      type: '',
      amount: '',
      submittedDate: new Date().toISOString().slice(0, 10),
      status: 'under_verification',
      description: '',
      category: 'other'
    });
  }, []);

  const getStatusConfig = (status) => {
    const configs = {
      payment_processing: {
        label: 'Payment Processing',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock
      },
      under_verification: {
        label: 'Under Verification',
        className: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: AlertCircle
      },
      approved: {
        label: 'Approved',
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: CheckCircle
      },
      reimbursed: {
        label: 'Reimbursed',
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: Banknote
      },
      rejected: {
        label: 'Rejected',
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle
      }
    };
    return configs[status] || configs.under_verification;
  };

  // Memoized filtered and sorted data
  const filteredAndSortedRequests = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    let filtered = requests.filter(request => {
      const typeLower = String(request.type || '').toLowerCase();
      const idLower = String(request.id || '').toLowerCase();
      const descLower = String(request.description || '').toLowerCase();
      const matchesSearch = !term || typeLower.includes(term) || idLower.includes(term) || descLower.includes(term);
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
      return matchesSearch && matchesStatus;
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
  }, [requests, searchTerm, statusFilter, sortBy, sortOrder]);

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
      currency: 'USD'
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
        type,
        amount: Math.round(amountNumber * 100) / 100,
        submittedDate: newRequest.submittedDate,
        status: newRequest.status,
        description,
        category: newRequest.category || 'other'
      };
      setRequests(prev => [request, ...prev]);
    }
    closeModal();
  }, [newRequest, generateNextId, closeModal, editingRequestId]);

  const handleDelete = useCallback((id) => {
    setRequests(prev => prev.filter(r => r.id !== id));
  }, []);

  const exportCsv = useCallback(() => {
    const header = ['Request ID', 'Expense Type', 'Amount', 'Submitted Date', 'Status', 'Description', 'Category'];
    const rows = filteredAndSortedRequests.map(r => [
      r.id,
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

  return (
    <div className="flex-1 min-h-0 h-full overflow-y-auto bg-gradient-to-br from-orange-50 via-blue-50 to-orange-100">
      {/* Top right header */}
      <TopRightHeader user={user} />
      
      {/* Main Content with proper spacing */}
      <div className="pt-20 pb-2 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Employee <span className="text-orange-600">Portal</span>
              </h1>
              <p className="text-gray-600 mt-3 text-lg">Manage your expense requests and reimbursements</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button onClick={exportCsv} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                <Download size={16} />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button onClick={openNewRequestModal} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-blue-600 text-white rounded-lg hover:from-orange-600 hover:to-blue-700 shadow hover:shadow-md transition-all text-sm font-medium">
                <Plus size={16} />
                New Request
              </button>
              <div className="hidden sm:flex items-center border border-gray-200 rounded-lg overflow-hidden ml-1">
                <button
                  aria-label="List view"
                  onClick={() => setViewMode('list')}
                  className={`px-2.5 py-1.5 text-xs flex items-center gap-1.5 ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  <List size={14} />
                </button>
                <button
                  aria-label="Grid view"
                  onClick={() => setViewMode('grid')}
                  className={`px-2.5 py-1.5 text-xs flex items-center gap-1.5 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  <LayoutGrid size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Submitted</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(summaryStats.total)}</p>
                </div>
                <div className="p-2.5 bg-blue-100 rounded-lg shrink-0">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Pending Amount</p>
                  <p className="text-2xl font-bold text-orange-600">{formatCurrency(summaryStats.pending)}</p>
                </div>
                <div className="p-2.5 bg-orange-100 rounded-lg shrink-0">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Approved Items</p>
                  <p className="text-2xl font-bold text-blue-600">{summaryStats.approved}</p>
                </div>
                <div className="p-2.5 bg-blue-100 rounded-lg shrink-0">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Reimbursed</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(summaryStats.reimbursed)}</p>
                </div>
                <div className="p-2.5 bg-green-100 rounded-lg shrink-0">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="lg:w-52">
              <select
                className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="payment_processing">Payment Processing</option>
                <option value="under_verification">Under Verification</option>
                <option value="approved">Approved</option>
                <option value="reimbursed">Reimbursed</option>
              </select>
            </div>

            {/* Sort */}
            <div className="lg:w-52">
              <select
                className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors text-sm"
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
            </div>
          </div>
        </div>

        {/* Requests: List or Grid */}
        {viewMode === 'list' ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-orange-50 to-blue-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left py-3 px-5 font-semibold text-gray-900 text-xs">Request ID</th>
                    <th className="text-left py-3 px-5 font-semibold text-gray-900 text-xs">Expense Type</th>
                    <th className="text-left py-3 px-5 font-semibold text-gray-900 text-xs">Amount</th>
                    <th className="text-left py-3 px-5 font-semibold text-gray-900 text-xs">Submitted Date</th>
                    <th className="text-left py-3 px-5 font-semibold text-gray-900 text-xs">Status</th>
                    <th className="text-left py-3 px-5 font-semibold text-gray-900 text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAndSortedRequests.map((request) => {
                    const statusConfig = getStatusConfig(request.status);
                    const StatusIcon = statusConfig.icon;
                    return (
                      <tr key={request.id} className="hover:bg-orange-50/40 transition-colors">
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-orange-100 rounded-md shrink-0">
                              <FileText className="w-3.5 h-3.5 text-orange-600" />
                            </div>
                            <span className="font-medium text-orange-600 text-xs">{request.id}</span>
                          </div>
                        </td>
                        <td className="py-3 px-5">
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{request.type}</div>
                            <div className="text-xs text-gray-500 truncate max-w-56">{request.description}</div>
                          </div>
                        </td>
                        <td className="py-3 px-5">
                          <span className="font-semibold text-gray-900 text-sm">{formatCurrency(request.amount)}</span>
                        </td>
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formatDate(request.submittedDate)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-5">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${statusConfig.className}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.label}
                          </div>
                        </td>
                        <td className="py-3 px-5">
                          <div className="relative inline-block text-left">
                            <button onClick={() => toggleRowMenu(request.id)} className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-md">
                              <MoreVertical size={14} />
                            </button>
                            {openMenuForId === request.id && (
                              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                <button onClick={() => { setEditingRequestId(null); setViewingRequest(request); setIsModalOpen(true); setOpenMenuForId(null); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">View</button>
                                <button onClick={() => { setViewingRequest(null); setEditingRequestId(request.id); setNewRequest({ type: request.type, amount: String(request.amount), submittedDate: request.submittedDate, status: request.status, description: request.description, category: request.category || 'other' }); setIsModalOpen(true); setOpenMenuForId(null); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Edit</button>
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
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-base font-medium text-gray-900 mb-2">No requests found</h3>
                <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAndSortedRequests.map((request) => {
                const statusConfig = getStatusConfig(request.status);
                const StatusIcon = statusConfig.icon;
                return (
                  <div key={request.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow relative">
                    <button onClick={() => toggleRowMenu(request.id)} className="absolute top-2 right-2 p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg">
                      <MoreVertical size={16} />
                    </button>
                    {openMenuForId === request.id && (
                      <div className="absolute top-8 right-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <button onClick={() => { setEditingRequestId(null); setViewingRequest(request); setIsModalOpen(true); setOpenMenuForId(null); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">View</button>
                        <button onClick={() => { setViewingRequest(null); setEditingRequestId(request.id); setNewRequest({ type: request.type, amount: String(request.amount), submittedDate: request.submittedDate, status: request.status, description: request.description, category: request.category || 'other' }); setIsModalOpen(true); setOpenMenuForId(null); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Edit</button>
                        <button onClick={() => { handleDelete(request.id); setOpenMenuForId(null); }} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50">Delete</button>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <FileText className="w-4 h-4 text-orange-600" />
                      </div>
                      <span className="font-medium text-orange-600 text-sm">{request.id}</span>
                    </div>
                    <div className="font-medium text-gray-900 text-sm">{request.type}</div>
                    <div className="text-xs text-gray-500 line-clamp-2 mb-2">{request.description}</div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="font-semibold">{formatCurrency(request.amount)}</span>
                      <span className="flex items-center gap-1 text-gray-600">
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
              <div className="text-center py-10">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-medium text-gray-900 mb-1">No requests found</h3>
                <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )
        }

        {/* Results Info */}
        <div className="mt-6 flex items-center justify-between text-base text-gray-500">
          <span>
            Showing {filteredAndSortedRequests.length} of {requests.length} requests
          </span>
          <span>
            Total Amount: <strong className="text-gray-900">{formatCurrency(summaryStats.total)}</strong>
          </span>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-orange-500 to-blue-600">
              <h3 className="text-white font-semibold text-lg">{
                viewingRequest ? 'Request Details' : (editingRequestId ? 'Edit Expense Request' : 'New Expense Request')
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
                      <div className="text-sm text-gray-500 mb-2">Request ID</div>
                      <div className="font-medium text-gray-900 text-base">{viewingRequest.id}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Submitted</div>
                      <div className="font-medium text-gray-900 text-base">{formatDate(viewingRequest.submittedDate)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Type</div>
                      <div className="font-medium text-gray-900 text-base">{viewingRequest.type}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Amount</div>
                      <div className="font-medium text-gray-900 text-base">{formatCurrency(viewingRequest.amount)}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-sm text-gray-500 mb-2">Description</div>
                      <div className="font-medium text-gray-900 text-base">{viewingRequest.description || '—'}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCreateRequest} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-base text-gray-600 mb-2">Expense Type</label>
                      <input
                        type="text"
                        value={newRequest.type}
                        onChange={(e) => handleNewRequestChange('type', e.target.value)}
                        placeholder="e.g. Travel Expenses"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-base text-gray-600 mb-2">Amount</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={newRequest.amount}
                        onChange={(e) => handleNewRequestChange('amount', e.target.value)}
                        placeholder="0.00"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-base text-gray-600 mb-2">Date</label>
                      <input
                        type="date"
                        value={newRequest.submittedDate}
                        onChange={(e) => handleNewRequestChange('submittedDate', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-base text-gray-600 mb-2">Status</label>
                      <select
                        value={newRequest.status}
                        onChange={(e) => handleNewRequestChange('status', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
                      >
                        <option value="under_verification">Under Verification</option>
                        <option value="payment_processing">Payment Processing</option>
                        <option value="approved">Approved</option>
                        <option value="reimbursed">Reimbursed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-base text-gray-600 mb-2">Category</label>
                      <select
                        value={newRequest.category}
                        onChange={(e) => handleNewRequestChange('category', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
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
                      <label className="block text-base text-gray-600 mb-2">Description</label>
                      <textarea
                        value={newRequest.description}
                        onChange={(e) => handleNewRequestChange('description', e.target.value)}
                        rows={3}
                        placeholder="Optional details"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-y text-base"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-4 pt-4">
                    <button type="button" onClick={closeModal} className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-base">Cancel</button>
                    <button type="submit" className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-blue-600 text-white hover:from-orange-600 hover:to-blue-700 shadow text-base font-medium">
                      {editingRequestId ? 'Update Request' : 'Create Request'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeePortal;