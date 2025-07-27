import React from 'react';
import StatusProgress from '../StatusProgress/StatusProgress';
import { employeeReimbursements } from '../../data/mockData';
import './AccountsPortal.css';

const AccountsPortal = () => {
  const getStatusButton = (status) => {
    switch(status) {
      case 'reimbursed':
        return { text: 'Reimbursed', class: 'accounts-table-btn-reimbursed' };
      case 'payment-initiated':
        return { text: 'Initiate Payment', class: 'accounts-table-btn-payment' };
      case 'approved':
        return { text: 'Approve Payment', class: 'accounts-table-btn-approve' };
      case 'verification':
        return { text: 'Under Review', class: 'accounts-table-btn-review' };
      default:
        return { text: 'Pending', class: 'accounts-table-btn-pending' };
    }
  };

  return (
    <div className="accounts-portal-container">
      <div className="accounts-portal-content">
        <h1 className="accounts-portal-title">Accounts Portal</h1>
        <p className="accounts-portal-subtitle">Employee Bills and Reimbursements</p>

        <div className="accounts-table-container">
          <table className="accounts-table">
            <thead className="accounts-table-header">
              <tr>
                <th className="accounts-table-th">Employee Name</th>
                <th className="accounts-table-th">Expense Type</th>
                <th className="accounts-table-th">Amount</th>
                <th className="accounts-table-th">Date Submitted</th>
                <th className="accounts-table-th">Status</th>
                <th className="accounts-table-th">Action</th>
              </tr>
            </thead>
            <tbody>
              {employeeReimbursements.map((employee) => {
                const statusButton = getStatusButton(employee.status);
                return (
                  <tr key={employee.id} className="accounts-table-row">
                    <td className="accounts-table-td accounts-table-name">
                      {employee.name}
                    </td>
                    <td className="accounts-table-td">
                      {employee.type}
                    </td>
                    <td className="accounts-table-td accounts-table-amount">
                      ${employee.amount.toFixed(2)}
                    </td>
                    <td className="accounts-table-td">
                      {employee.date}
                    </td>
                    <td className="accounts-table-td">
                      <span className={`accounts-table-status ${employee.status === 'reimbursed' ? 'accounts-table-status-complete' : 
                                       employee.status === 'payment-initiated' ? 'accounts-table-status-payment' :
                                       employee.status === 'approved' ? 'accounts-table-status-approved' :
                                       'accounts-table-status-pending'}`}>
                        {employee.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </td>
                                       <td className="accounts-table-td">
                      <button className={`accounts-table-btn ${statusButton.class}`}>
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
  );
};

export default AccountsPortal;