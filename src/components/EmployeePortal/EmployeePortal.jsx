import React, { useState } from 'react';
import { expenseRequests } from '../../data/mockData';
// Removed: import './EmployeePortal.css';

const EmployeePortal = () => {
  const [requests, setRequests] = useState(expenseRequests);
  const [showModal, setShowModal] = useState(false);
  const [newRequest, setNewRequest] = useState({
    type: '',
    amount: '',
    description: ''
  });

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
        id: Math.max(...requests.map(r => r.id)) + 1,
        type: newRequest.type,
        amount: parseFloat(newRequest.amount),
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
    <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2 leading-tight">Employee Portal</h1>
            <p className="text-gray-500 text-base m-0">Your Expense Requests & Reimbursements</p>
          </div>
          <button 
            className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold border-none cursor-pointer text-sm transition-colors shadow-sm hover:bg-emerald-600"
            onClick={() => setShowModal(true)}
          >
            + New Request
          </button>
        </div>
        <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[1000px]">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-xs text-gray-700 uppercase tracking-wider">Request ID</th>
                  <th className="px-6 py-4 text-left font-semibold text-xs text-gray-700 uppercase tracking-wider">Expense Type</th>
                  <th className="px-6 py-4 text-left font-semibold text-xs text-gray-700 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left font-semibold text-xs text-gray-700 uppercase tracking-wider">Submitted Date</th>
                  <th className="px-6 py-4 text-left font-semibold text-xs text-gray-700 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => {
                  const statusBadge = getStatusBadge(request.status);
                  return (
                    <tr key={request.id} className="border-b border-gray-100 transition-colors hover:bg-gray-50 last:border-b-0">
                      <td className="px-6 py-5 font-semibold text-gray-500 font-mono">#{request.id.toString().padStart(3, '0')}</td>
                      <td className="px-6 py-5 font-semibold text-gray-900">{request.type}</td>
                      <td className="px-6 py-5 font-bold text-emerald-600 text-lg">${request.amount.toFixed(2)}</td>
                      <td className="px-6 py-5 text-gray-700">{request.submittedDate}</td>
                      <td className="px-6 py-5">
                        <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider min-w-[120px] text-center ${statusBadge.class}`}>{statusBadge.text}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        {/* New Request Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-[500px] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center px-6 pt-6 pb-0 border-b border-gray-200 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 m-0">Submit New Expense Request</h2>
                <button 
                  className="bg-none border-none text-2xl text-gray-400 cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmitRequest} className="px-6 pb-6">
                <div className="mb-5">
                  <label htmlFor="type" className="block font-semibold text-gray-700 mb-1 text-sm">Expense Type *</label>
                  <select
                    id="type"
                    name="type"
                    value={newRequest.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">Select expense type</option>
                    {expenseTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-5">
                  <label htmlFor="amount" className="block font-semibold text-gray-700 mb-1 text-sm">Amount *</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={newRequest.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div className="mb-5">
                  <label htmlFor="description" className="block font-semibold text-gray-700 mb-1 text-sm">Description (Optional)</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newRequest.description}
                    onChange={handleInputChange}
                    placeholder="Add any additional details about this expense..."
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 resize-vertical font-sans"
                  />
                </div>
                <div className="flex gap-3 justify-end mt-8 pt-5 border-t border-gray-200">
                  <button 
                    type="button" 
                    className="px-5 py-2 border border-gray-300 bg-white text-gray-700 rounded-md font-medium cursor-pointer transition-colors hover:bg-gray-100"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2 bg-emerald-500 text-white border-none rounded-md font-medium cursor-pointer transition-colors hover:bg-emerald-600"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeePortal;