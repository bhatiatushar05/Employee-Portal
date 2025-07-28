import React from 'react';
import { MoreVertical } from 'lucide-react';
import { motionEvents } from '../../data/mockData';
// Removed: import './MotionEvents.css';

const MotionEvents = ({ sidebar = false }) => {
  const containerClass = sidebar
    ? ''
    : '';
  const titleClass = sidebar
    ? 'text-lg font-semibold mb-4 text-gray-800'
    : 'text-xl font-semibold mb-4 text-gray-800';

  return (
    <div>
      <h3 className={titleClass}>Motion events</h3>
      <div className="flex flex-col gap-3">
        {motionEvents.map((event, index) => (
          <div
            key={index}
            className={`flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-200 ${sidebar ? 'justify-between' : ''}`}
          >
            <div className={`flex items-center gap-4 flex-1`}>
              <div className={`${sidebar ? 'w-10 h-10 text-base' : 'w-12 h-12 text-lg'} bg-gray-300 rounded-full flex items-center justify-center`}>
                {event.avatar}
              </div>
              {sidebar ? (
                <div className="text-gray-800 font-medium mb-0">{event.time}</div>
              ) : (
                <div className="flex-1">
                  <div className="text-gray-800 font-medium mb-1">{event.time}</div>
                  <div className="w-full bg-gray-200 rounded-[10px] h-1.5">
                    <div className="bg-teal-600 h-1.5 rounded-[10px] w-[65%]"></div>
                  </div>
                </div>
              )}
            </div>
            <MoreVertical size={sidebar ? 16 : 20} className="text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MotionEvents;