import React from 'react';
import './StatusProgress.css';

const StatusProgress = ({ stages, currentStatus }) => {
  const getStageIndex = (status) => {
    const statusMap = {
      'request': 0,
      'verification': 1,
      'approved': 2,
      'payment': 3,
      'payment-initiated': 3,
      'reimbursed': 4
    };
    return statusMap[status] || 0;
  };

  const currentIndex = getStageIndex(currentStatus);

  return (
    <div className="status-progress-container">
      {stages.map((stage, index) => (
        <React.Fragment key={stage}>
          <div className={`status-progress-circle ${index <= currentIndex ? 'status-progress-active' : 'status-progress-inactive'}`}>
            {index <= currentIndex ? '✓' : index + 1}
          </div>
          {index < stages.length - 1 && (
            <div className={`status-progress-line ${index < currentIndex ? 'status-progress-line-active' : 'status-progress-line-inactive'}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StatusProgress;