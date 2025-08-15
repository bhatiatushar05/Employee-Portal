import React from 'react';
// Removed: import './StatusProgress.css';

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
    <div className="flex items-center gap-2 mt-3">
      {stages.map((stage, index) => (
        <React.Fragment key={stage}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${index <= currentIndex ? 'bg-teal-600 text-white' : 'bg-gray-300 text-gray-500'}`}>{index <= currentIndex ? '✓' : index + 1}</div>
          {index < stages.length - 1 && (
            <div className={`flex-1 h-0.5 min-w-[20px] ${index < currentIndex ? 'bg-teal-600' : 'bg-gray-300'}`}></div>
          )}
        </React.Fragment>
      ))}
      
      {/* Footer Blank Space */}
      <div className="h-16 sm:h-20 md:h-24"></div>
    </div>
  );
};

export default StatusProgress;