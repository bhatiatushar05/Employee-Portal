import React from 'react';
import { Phone, Video, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function ChatHeader({ 
  participant, 
  isGroup = false, 
  onToggleNav, 
  collapseNav,
  onMenuClick 
}) {
  const { isDarkMode } = useTheme();

  const renderParticipantInfo = () => {
    if (isGroup) {
      return (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {participant?.name?.charAt(0)?.toUpperCase() || 'G'}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {participant?.name || 'Group Chat'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {participant?.memberCount || 0} members
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {participant?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {participant?.name || 'Unknown User'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {participant?.status === 'online' ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="h-18 flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card">
      {/* Left side - Participant info and toggle button */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleNav}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-lg transition-colors duration-200"
        >
          {collapseNav ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
        {renderParticipantInfo()}
      </div>

      {/* Right side - Action buttons */}
      <div className="flex items-center gap-2">
        <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200">
          <Phone size={18} />
        </button>
        <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors duration-200">
          <Video size={18} />
        </button>
        <button 
          onClick={onMenuClick}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-lg transition-colors duration-200"
        >
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
}
