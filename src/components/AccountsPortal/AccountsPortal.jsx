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
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-4 md:p-6 lg:p-8 bg-gray-50">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-1 md:mb-2 leading-tight">
            Accounts Portal
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            Employee Bills and Reimbursements
          </p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[800px] lg:min-w-[1000px]">
                <thead className="bg-gray-50 border-b-2 border-gray-200 sticky top-0">
                  <tr>
                    <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left font-semibold text-xs text-gray-700 uppercase tracking-wider">
                      Employee Name
                    </th>
                    <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left font-semibold text-xs text-gray-700 uppercase tracking-wider">
                      Expense Type
                    </th>
                    <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left font-semibold text-xs text-gray-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left font-semibold text-xs text-gray-700 uppercase tracking-wider">
                      Date Submitted
                    </th>
                    <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left font-semibold text-xs text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left font-semibold text-xs text-gray-700 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employeeReimbursements.map((employee) => {
                    const statusButton = getStatusButton(employee.status);
                    const statusBadge = getStatusBadge(employee.status);
                    return (
                      <tr key={employee.id} className="border-b border-gray-100 transition-colors hover:bg-gray-50 last:border-b-0">
                        <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4 lg:py-5 font-semibold text-gray-900 text-sm md:text-base">
                          {employee.name}
                        </td>
                        <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4 lg:py-5 text-gray-700 text-sm md:text-base">
                          {employee.type}
                        </td>
                        <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4 lg:py-5 font-semibold text-teal-600 text-base md:text-lg">
                          ${employee.amount.toFixed(2)}
                        </td>
                        <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4 lg:py-5 text-gray-700 text-sm md:text-base">
                          {employee.date}
                        </td>
                        <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4 lg:py-5">
                          <span className={`inline-block px-2 md:px-3 py-1 rounded-full text-[10px] md:text-[11px] font-semibold uppercase tracking-wider min-w-[80px] md:min-w-[100px] text-center ${statusBadge}`}>
                            {employee.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </td>
                        <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4 lg:py-5">
                          <button className={`px-3 md:px-4 py-2 rounded-md font-medium text-xs md:text-sm border-none cursor-pointer transition-colors text-white w-[100px] md:w-[132px] h-8 md:h-10 inline-flex items-center justify-center text-center whitespace-nowrap ${statusButton.class}`}>
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