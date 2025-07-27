import React from 'react';
import { MoreVertical } from 'lucide-react';
import { motionEvents } from '../../data/mockData';
import './MotionEvents.css';

const MotionEvents = ({ sidebar = false }) => {
  const containerClass = sidebar ? 'motion-events-sidebar' : 'motion-events-main';
  const titleClass = sidebar ? 'motion-events-title-sidebar' : 'motion-events-title-main';

  return (
    <div className={containerClass}>
      <h3 className={titleClass}>Motion events</h3>
      <div className="motion-events-list">
        {motionEvents.map((event, index) => (
          <div key={index} className={`motion-events-item ${sidebar ? 'motion-events-item-sidebar' : ''}`}>
            <div className="motion-events-item-content">
              <div className="motion-events-avatar">
                {event.avatar}
              </div>
              {sidebar ? (
                <div className="motion-events-time">{event.time}</div>
              ) : (
                <div className="motion-events-progress">
                  <div className="motion-events-time">{event.time}</div>
                  <div className="motion-events-progress-bar">
                    <div className="motion-events-progress-fill"></div>
                  </div>
                </div>
              )}
            </div>
            <MoreVertical size={sidebar ? 16 : 20} className="motion-events-menu" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MotionEvents;