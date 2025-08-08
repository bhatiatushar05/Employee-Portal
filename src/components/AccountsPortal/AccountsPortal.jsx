import React from 'react';
import StatusProgress from '../StatusProgress/StatusProgress';
import { employeeReimbursements } from '../../data/mockData';

const AccountsPortal = () => {
  const getStatusButton = (status) => {
    switch(status) {
      case 'reimbursed':
        return { text: 'View Receipt', class: 'bg-emerald-600 hover:bg-emerald-700' };
      case 'payment-initiated':
        return { text: 'Mark Reimbursed', class: 'bg-emerald-600 hover:bg-emerald-600' };
      case 'approved':
        return { text: 'Initiate Payment', class: 'bg-emerald-600 hover:bg-emerald-600' };
      case 'verification':
        return { text: 'Verify', class: 'bg-emerald-600 hover:bg-emerald-600' };
      default:
        return { text: 'Pending', class: 'bg-emerald-600 hover:bg-emerald-600' };
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'reimbursed':
        return 'bg-emerald-100 text-emerald-800';
      case 'payment-initiated':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'verification':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-4 md:p-6 lg:p-8 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between">
            <div className="space-y-2 animate-slide-in-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent leading-tight">
                Accounts Portal
              </h1>
              <p className="text-gray-600 text-lg font-medium animate-slide-in-left-delay">
                Employee Bills and Reimbursements
              </p>
              <div className="flex items-center space-x-4 mt-4 animate-slide-in-left-delay-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600 font-medium">Active Processing</span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <span className="text-sm text-gray-500">{employeeReimbursements.length} Total Requests</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4 animate-bounce-in">
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-600">${employeeReimbursements.reduce((sum, emp) => sum + emp.amount, 0).toFixed(2)}</div>
                <div className="text-sm text-gray-500">Total Pending</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl border border-white/20 animate-slide-in-up">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[800px] lg:min-w-[1000px]">
                <thead className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b-2 border-emerald-100 sticky top-0">
                  <tr>
                    <th className="px-6 py-6 text-left font-bold text-xs text-emerald-700 uppercase tracking-wider">
                      Employee Name
                    </th>
                    <th className="px-6 py-6 text-left font-bold text-xs text-emerald-700 uppercase tracking-wider">
                      Expense Type
                    </th>
                    <th className="px-6 py-6 text-left font-bold text-xs text-emerald-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-6 text-left font-bold text-xs text-emerald-700 uppercase tracking-wider">
                      Date Submitted
                    </th>
                    <th className="px-6 py-6 text-left font-bold text-xs text-emerald-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-6 text-left font-bold text-xs text-emerald-700 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employeeReimbursements.map((employee, index) => {
                    const statusButton = getStatusButton(employee.status);
                    const statusBadge = getStatusBadge(employee.status);
                    return (
                      <tr 
                        key={employee.id} 
                        className="border-b border-emerald-50 transition-all duration-300 hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50 last:border-b-0 group animate-fade-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <td className="px-6 py-6 font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                          {employee.name}
                        </td>
                        <td className="px-6 py-6 text-gray-700 group-hover:text-gray-800 transition-colors">
                          {employee.type}
                        </td>
                        <td className="px-6 py-6 font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 text-xl group-hover:from-emerald-700 group-hover:to-teal-700 transition-all duration-300">
                          ${employee.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-6 text-gray-600 group-hover:text-gray-700 transition-colors">
                          {employee.date}
                        </td>
                        <td className="px-6 py-6">
                          <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider min-w-[140px] text-center shadow-sm transition-all duration-300 group-hover:scale-105 ${statusBadge}`}>
                            {employee.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </td>
                        <td className="px-6 py-6">
                          <button className={`px-6 py-3 rounded-xl font-semibold text-sm border-none cursor-pointer transition-all duration-300 text-white w-[140px] h-12 inline-flex items-center justify-center text-center whitespace-nowrap shadow-lg hover:shadow-xl hover:scale-105 ${statusButton.class}`}>
                            {statusButton.text}
                          </button>
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
    </div>
  );
};

export default AccountsPortal;