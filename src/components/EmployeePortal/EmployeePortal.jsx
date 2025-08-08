import React, { useState, useEffect } from 'react';

// Mock data for demonstration
const expenseRequests = [
  { id: 1, type: 'Travel Expenses', amount: 150.00, description: 'Business trip to New York', submittedDate: 'Apr 5, 2025', status: 'payment' },
  { id: 2, type: 'Office Supplies', amount: 45.00, description: 'Notebooks and pens', submittedDate: 'Apr 3, 2025', status: 'verification' },
  { id: 3, type: 'Travel Expenses', amount: 320.00, description: 'Flight tickets for conference', submittedDate: 'Jul 28, 2025', status: 'verification' },
  { id: 4, type: 'Mileage', amount: 127.00, description: 'Client visits', submittedDate: 'Oct 28, 2024', status: 'approved' },
  { id: 5, type: 'Equipment Rental', amount: 220.00, description: 'Projector rental', submittedDate: 'Sep 28, 2024', status: 'approved' },
  { id: 6, type: 'Meals & Entertainment', amount: 120.00, description: 'Client dinner', submittedDate: 'Jan 2, 2024', status: 'approved' },
  { id: 7, type: 'Transportation', amount: 440.00, description: 'Taxi expenses', submittedDate: 'Aug 18, 2024', status: 'approved' },
  { id: 8, type: 'Conference Fees', amount: 890.00, description: 'Tech conference registration', submittedDate: 'Mar 15, 2025', status: 'reimbursed' },
  { id: 9, type: 'Training Materials', amount: 75.00, description: 'Online course materials', submittedDate: 'Feb 10, 2025', status: 'reimbursed' }
];

const EmployeePortal = () => {
  const [requests, setRequests] = useState(expenseRequests);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newRequest, setNewRequest] = useState({
    type: '',
    amount: '',
    description: ''
  });
  const [updateRequest, setUpdateRequest] = useState({
    type: '',
    amount: '',
    description: ''
  });
  const [openMenuId, setOpenMenuId] = useState(null);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'reimbursed':
        return { text: 'Reimbursed', class: 'bg-emerald-100 text-emerald-800' };
      case 'payment':
        return { text: 'Payment Processing', class: 'bg-yellow-100 text-yellow-800' };
      case 'approved':
        return { text: 'Approved', class: 'bg-blue-100 text-blue-800' };
      case 'verification':
        return { text: 'Under Verification', class: 'bg-red-100 text-red-800' };
      default:
        return { text: 'Submitted', class: 'bg-gray-100 text-gray-600' };
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequest(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    if (newRequest.type && newRequest.amount) {
      const request = {
        id: requests.length > 0 ? Math.max(...requests.map(r => r.id)) + 1 : 1,
        type: newRequest.type,
        amount: parseFloat(newRequest.amount),
        description: newRequest.description,
        submittedDate: new Date().toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        status: 'verification',
        stages: ['request', 'verification', 'approved', 'payment', 'reimbursed']
      };
      setRequests(prev => [...prev, request].sort((a, b) => {
        const dateA = new Date(a.submittedDate);
        const dateB = new Date(b.submittedDate);
        if (dateB.getTime() !== dateA.getTime()) {
          return dateB.getTime() - dateA.getTime();
        }
        return b.id - a.id;
      }));
      setNewRequest({ type: '', amount: '', description: '' });
      setShowModal(false);
    }
  };

  const handleDeleteRequest = (requestId) => {
    setRequests(prev => prev.filter(request => request.id !== requestId));
    setOpenMenuId(null);
  };

  const handleUpdateRequest = (request) => {
    setSelectedRequest(request);
    setUpdateRequest({
      type: request.type,
      amount: request.amount.toString(),
      description: request.description || ''
    });
    setShowUpdateModal(true);
    setOpenMenuId(null);
  };

  const handleViewDescription = (request) => {
    setSelectedRequest(request);
    setShowDescriptionModal(true);
    setOpenMenuId(null);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (updateRequest.type && updateRequest.amount) {
      setRequests(prev => prev.map(request => 
        request.id === selectedRequest.id 
          ? {
              ...request,
              type: updateRequest.type,
              amount: parseFloat(updateRequest.amount),
              description: updateRequest.description
            }
          : request
      ));
      setShowUpdateModal(false);
      setSelectedRequest(null);
      setUpdateRequest({ type: '', amount: '', description: '' });
    }
  };

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateRequest(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleMenu = (requestId) => {
    setOpenMenuId(openMenuId === requestId ? null : requestId);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId && !event.target.closest('.menu-container')) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  const expenseTypes = [
    'Travel Expenses',
    'Office Supplies',
    'Mileage',
    'Meals & Entertainment',
    'Conference Fees',
    'Transportation',
    'Training Materials',
    'Equipment Rental'
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-4 md:p-6 lg:p-8 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-800 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2 leading-tight">
                Employee Portal
              </h1>
              <p className="text-gray-600 text-lg font-medium">
                Your Expense Requests & Reimbursements
              </p>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600 font-medium">Active Portal</span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <span className="text-sm text-gray-500">{requests.length} Total Requests</span>
              </div>
            </div>
            <button 
              className="group relative bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 md:px-8 md:py-4 rounded-2xl font-semibold border-none cursor-pointer text-sm transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 transform"
              onClick={() => setShowModal(true)}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>New Request</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl border border-white/20">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[800px] lg:min-w-[1000px]">
                <thead className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b-2 border-emerald-100 sticky top-0">
                  <tr>
                    <th className="px-6 py-6 text-left font-bold text-xs text-emerald-700 uppercase tracking-wider">Request ID</th>
                    <th className="px-6 py-6 text-left font-bold text-xs text-emerald-700 uppercase tracking-wider">Expense Type</th>
                    <th className="px-6 py-6 text-left font-bold text-xs text-emerald-700 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-6 text-left font-bold text-xs text-emerald-700 uppercase tracking-wider">Submitted Date</th>
                    <th className="px-6 py-6 text-left font-bold text-xs text-emerald-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-6 text-left font-bold text-xs text-emerald-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => {
                    const statusBadge = getStatusBadge(request.status);
                    return (
                      <tr 
                        key={request.id} 
                        className="border-b border-emerald-50 transition-all duration-300 hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50 last:border-b-0 group"
                      >
                        <td className="px-6 py-6 font-bold text-emerald-600 font-mono group-hover:text-emerald-700 transition-colors">
                          #{request.id.toString().padStart(3, '0')}
                        </td>
                        <td className="px-6 py-6 font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                          {request.type}
                        </td>
                        <td className="px-6 py-6 font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 text-xl group-hover:from-emerald-700 group-hover:to-teal-700 transition-all duration-300">
                          ${request.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-6 text-gray-600 group-hover:text-gray-700 transition-colors">
                          {request.submittedDate}
                        </td>
                        <td className="px-6 py-6">
                          <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider min-w-[140px] text-center shadow-sm transition-all duration-300 group-hover:scale-105 ${statusBadge.class}`}>
                            {statusBadge.text}
                          </span>
                        </td>
                        <td className="px-6 py-6 relative">
                          <button
                            onClick={() => toggleMenu(request.id)}
                            className="p-3 rounded-xl text-emerald-500 hover:text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-300 group-hover:scale-110"
                            title="Actions"
                          >
                            <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                          
                          {/* Dropdown Menu */}
                          {openMenuId === request.id && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-emerald-100 z-50 menu-container">
                              <div className="py-2">
                                {/* Actions */}
                                <button
                                  onClick={() => handleUpdateRequest(request)}
                                  className="w-full text-left px-4 py-3 text-sm text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 flex items-center transition-all duration-200 rounded-xl mx-2"
                                >
                                  <svg className="w-4 h-4 mr-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Update Request
                                </button>
                                
                                {request.description && (
                                  <button
                                    onClick={() => handleViewDescription(request)}
                                    className="w-full text-left px-4 py-3 text-sm text-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 flex items-center transition-all duration-200 rounded-xl mx-2"
                                  >
                                    <svg className="w-4 h-4 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    View Description
                                  </button>
                                )}
                                
                                <button
                                  onClick={() => handleDeleteRequest(request.id)}
                                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 flex items-center transition-all duration-200 rounded-xl mx-2"
                                >
                                  <svg className="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Delete Request
                                </button>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* New Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000]" onClick={() => setShowModal(false)}>
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-[90%] max-w-[500px] max-h-[90vh] overflow-y-auto border border-white/20" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center px-8 pt-8 pb-0 border-b border-emerald-100 mb-8">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent m-0">Submit New Expense Request</h2>
                <p className="text-gray-500 text-sm mt-1">Create a new expense request for reimbursement</p>
              </div>
              <button 
                className="bg-none border-none text-2xl text-gray-400 cursor-pointer p-2 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmitRequest} className="px-8 pb-8">
              <div className="mb-6">
                <label htmlFor="type" className="block font-bold text-gray-700 mb-2 text-sm">Expense Type *</label>
                <select
                  id="type"
                  name="type"
                  value={newRequest.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-sm text-gray-800 bg-white/50 backdrop-blur-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300"
                >
                  <option value="">Select expense type</option>
                  {expenseTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label htmlFor="amount" className="block font-bold text-gray-700 mb-2 text-sm">Amount *</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={newRequest.amount}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  required
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-sm text-gray-800 bg-white/50 backdrop-blur-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="description" className="block font-bold text-gray-700 mb-2 text-sm">Description (Optional)</label>
                <textarea
                  id="description"
                  name="description"
                  value={newRequest.description}
                  onChange={handleInputChange}
                  placeholder="Add any additional details about this expense..."
                  rows="4"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-sm text-gray-800 bg-white/50 backdrop-blur-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 resize-vertical font-sans transition-all duration-300"
                />
              </div>
              <div className="flex gap-4 justify-end mt-8 pt-6 border-t border-emerald-100">
                <button 
                  type="button" 
                  className="px-6 py-3 border-2 border-gray-300 bg-white text-gray-700 rounded-xl font-semibold cursor-pointer transition-all duration-300 hover:bg-gray-50 hover:border-gray-400 hover:scale-105"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-none rounded-xl font-semibold cursor-pointer transition-all duration-300 hover:from-emerald-600 hover:to-teal-600 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Request Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000]" onClick={() => setShowUpdateModal(false)}>
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-[90%] max-w-[500px] max-h-[90vh] overflow-y-auto border border-white/20" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center px-8 pt-8 pb-0 border-b border-emerald-100 mb-8">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent m-0">Update Expense Request</h2>
                <p className="text-gray-500 text-sm mt-1">Modify your expense request details</p>
              </div>
              <button 
                className="bg-none border-none text-2xl text-gray-400 cursor-pointer p-2 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110"
                onClick={() => setShowUpdateModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateSubmit} className="px-8 pb-8">
              <div className="mb-6">
                <label htmlFor="update-type" className="block font-bold text-gray-700 mb-2 text-sm">Expense Type *</label>
                <select
                  id="update-type"
                  name="type"
                  value={updateRequest.type}
                  onChange={handleUpdateInputChange}
                  required
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-sm text-gray-800 bg-white/50 backdrop-blur-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300"
                >
                  <option value="">Select expense type</option>
                  {expenseTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label htmlFor="update-amount" className="block font-bold text-gray-700 mb-2 text-sm">Amount *</label>
                <input
                  type="number"
                  id="update-amount"
                  name="amount"
                  value={updateRequest.amount}
                  onChange={handleUpdateInputChange}
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  required
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-sm text-gray-800 bg-white/50 backdrop-blur-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="update-description" className="block font-bold text-gray-700 mb-2 text-sm">Description (Optional)</label>
                <textarea
                  id="update-description"
                  name="description"
                  value={updateRequest.description}
                  onChange={handleUpdateInputChange}
                  placeholder="Add any additional details about this expense..."
                  rows="4"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-sm text-gray-800 bg-white/50 backdrop-blur-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 resize-vertical font-sans transition-all duration-300"
                />
              </div>
              <div className="flex gap-4 justify-end mt-8 pt-6 border-t border-emerald-100">
                <button 
                  type="button" 
                  className="px-6 py-3 border-2 border-gray-300 bg-white text-gray-700 rounded-xl font-semibold cursor-pointer transition-all duration-300 hover:bg-gray-50 hover:border-gray-400 hover:scale-105"
                  onClick={() => setShowUpdateModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-none rounded-xl font-semibold cursor-pointer transition-all duration-300 hover:from-emerald-600 hover:to-teal-600 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Update Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Description Modal */}
      {showDescriptionModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000]" onClick={() => setShowDescriptionModal(false)}>
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-[90%] max-w-[500px] max-h-[90vh] overflow-y-auto border border-white/20" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center px-8 pt-8 pb-0 border-b border-emerald-100 mb-8">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent m-0">Request Description</h2>
                <p className="text-gray-500 text-sm mt-1">View detailed information about this request</p>
              </div>
              <button 
                className="bg-none border-none text-2xl text-gray-400 cursor-pointer p-2 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110"
                onClick={() => setShowDescriptionModal(false)}
              >
                ×
              </button>
            </div>
            <div className="px-8 pb-8">
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1 text-sm">Request ID</label>
                    <p className="text-gray-900 font-mono">#{selectedRequest.id.toString().padStart(3, '0')}</p>
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1 text-sm">Expense Type</label>
                    <p className="text-gray-900">{selectedRequest.type}</p>
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1 text-sm">Amount</label>
                    <p className="text-emerald-600 font-bold text-lg">${selectedRequest.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1 text-sm">Status</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${getStatusBadge(selectedRequest.status).class}`}>
                      {getStatusBadge(selectedRequest.status).text}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">Description</label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{selectedRequest.description}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button 
                  type="button" 
                  className="px-5 py-2 bg-emerald-500 text-white border-none rounded-md font-medium cursor-pointer transition-colors hover:bg-emerald-600"
                  onClick={() => setShowDescriptionModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default EmployeePortal