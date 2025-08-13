import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';

const TopRightHeader = ({ user }) => (
  <div className="fixed top-6 right-8 z-50 flex items-center gap-6">
    {/* Search */}
    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm">
      <Search size={18} className="text-gray-500" />
      <span className="text-xs text-gray-500 font-mono">⌘K</span>
    </div>
    {/* Notification */}
    <button className="relative p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50">
      <Bell size={20} className="text-gray-500" />
    </button>
    {/* Settings */}
    <button className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50">
      <Settings size={20} className="text-gray-500" />
    </button>
    {/* Profile */}
    <div className="w-9 h-9 rounded-full border-2 border-gradient-to-r from-orange-400 to-green-400 flex items-center justify-center bg-white shadow-sm">
      <span className="font-bold text-lg text-purple-700">{user?.fullName?.[0] || 'U'}</span>
    </div>
  </div>
);

export default TopRightHeader;