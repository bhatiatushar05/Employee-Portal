import React, { useState } from 'react';
import { expenseRequests } from '../../data/mockData';
import './EmployeePortal.css';

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
        return { text: 'Reimbursed', class: 'employee-status-reimbursed' };
      case 'payment':
        return { text: 'Payment Processing', class: 'employee-status-payment' };
      case 'approved':
        return { text: 'Approved', class: 'employee-status-approved' };
      case 'verification':
        return { text: 'Under Verification', class: 'employee-status-verification' };
      default:
        return { text: 'Submitted', class: 'employee-status-pending' };
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
        // Sort by date (newest first), then by ID (highest first)
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
    <div className="employee-portal-container">
      <div className="employee-portal-content">
        <div className="employee-portal-header">
          <div>
            <h1 className="employee-portal-title">Employee Portal</h1>
            <p className="employee-portal-subtitle">Your Expense Requests & Reimbursements</p>
          </div>
          <button 
            className="employee-portal-new-request-btn"
            onClick={() => setShowModal(true)}
          >
            + New Request
          </button>
        </div>

        <div className="employee-table-container">
          <table className="employee-table">
            <thead className="employee-table-header">
              <tr>
                <th className="employee-table-th">Request ID</th>
                <th className="employee-table-th">Expense Type</th>
                <th className="employee-table-th">Amount</th>
                <th className="employee-table-th">Submitted Date</th>
                <th className="employee-table-th">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => {
                const statusBadge = getStatusBadge(request.status);
                return (
                  <tr key={request.id} className="employee-table-row">
                    <td className="employee-table-td employee-table-id">
                      #{request.id.toString().padStart(3, '0')}
                    </td>
                    <td className="employee-table-td employee-table-type">
                      {request.type}
                    </td>
                    <td className="employee-table-td employee-table-amount">
                      ${request.amount.toFixed(2)}
                    </td>
                    <td className="employee-table-td">
                      {request.submittedDate}
                    </td>
                    <td className="employee-table-td">
                      <span className={`employee-status-badge ${statusBadge.class}`}>
                        {statusBadge.text}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* New Request Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Submit New Expense Request</h2>
                <button 
                  className="modal-close-btn"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleSubmitRequest} className="modal-form">
                <div className="form-group">
                  <label htmlFor="type">Expense Type *</label>
                  <select
                    id="type"
                    name="type"
                    value={newRequest.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select expense type</option>
                    {expenseTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="amount">Amount *</label>
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
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description (Optional)</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newRequest.description}
                    onChange={handleInputChange}
                    placeholder="Add any additional details about this expense..."
                    rows="3"
                  />
                </div>

                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="submit-btn"
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