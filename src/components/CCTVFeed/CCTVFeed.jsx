import React from 'react';
// Removed: import './CCTVFeed.css';

const CCTVFeed = () => {
  return (
    <div className="bg-gray-700 rounded-lg overflow-hidden mb-6">
      <div className="aspect-[16/9] relative">
        <div
          className="w-full h-full flex items-center justify-center relative"
          style={{
            background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
            backgroundImage: "url('data:image/svg+xml,%3Csvg width=600 height=400 xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=600 height=400 fill=\'%23374151\'/%3E%3Ctext x=300 y=200 font-family=\'Arial, sans-serif\' font-size=24 fill=\'%236b7280\' text-anchor=\'middle\'%3ELive Camera Feed%3C/text%3E%3C/svg%3E')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Simulated people in hallway */}
          <div className="absolute w-full h-full" style={{background: 'linear-gradient(to right, rgba(107,114,128,0.3), rgba(75,85,99,0.5))'}}>
            {/* Person 1 - John (recognized) */}
            <div className="absolute top-[25%] left-[60%] -translate-x-1/2 -translate-y-1/2">
              <div className="w-20 h-30 border-4 border-cyan-400 rounded relative">
                <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1 rounded bg-cyan-400 text-black text-sm font-bold">
                  John
                </div>
              </div>
            </div>
            {/* Person 2 - Unknown (motion detected) */}
            <div className="absolute bottom-[20%] right-[25%] translate-x-1/2 translate-y-1/2">
              <div className="w-[70px] h-[100px] border-4 border-red-500 rounded"></div>
            </div>
            {/* Additional silhouettes for realism */}
            <div className="absolute top-[40%] left-[20%] w-[60px] h-[90px] bg-gray-500/60 rounded"></div>
            <div className="absolute top-[35%] right-[40%] w-[65px] h-[95px] bg-gray-500/50 rounded"></div>
          </div>
          {/* Camera info overlay */}
          <div className="absolute top-4 left-4 text-white text-xs bg-black/50 px-2 py-1 rounded">
            CAM 01 • LIVE
          </div>
        </div>
      </div>
    </div>
  );
};

export default CCTVFeed;