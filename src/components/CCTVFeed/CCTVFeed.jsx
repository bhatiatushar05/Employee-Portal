import React from 'react';
import './CCTVFeed.css';

const CCTVFeed = () => {
  return (
    <div className="cctv-feed-container">
      <div className="cctv-feed-display">
        <div className="cctv-feed-background">
          {/* Simulated people in hallway */}
          <div className="cctv-feed-overlay">
            {/* Person 1 - John (recognized) */}
            <div className="cctv-person person-recognized">
              <div className="cctv-person-box">
                <div className="cctv-person-label cctv-person-label-recognized">
                  John
                </div>
              </div>
            </div>

            {/* Person 2 - Unknown (motion detected) */}
            <div className="cctv-person person-unknown">
              <div className="cctv-person-box cctv-person-box-unknown"></div>
            </div>

            {/* Additional silhouettes for realism */}
            <div className="cctv-silhouette silhouette-1"></div>
            <div className="cctv-silhouette silhouette-2"></div>
          </div>

          {/* Camera info overlay */}
          <div className="cctv-camera-info">
            CAM 01 • LIVE
          </div>
        </div>
      </div>
    </div>
  );
};

export default CCTVFeed;