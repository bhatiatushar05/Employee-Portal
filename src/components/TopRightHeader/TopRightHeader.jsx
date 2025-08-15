import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const TopRightHeader = ({ user }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const searchRef = useRef(null);
  const notificationsRef = useRef(null);

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.metaKey && event.key === 'k') {
        event.preventDefault();
        setShowSearch(true);
      }
      if (event.key === 'Escape') {
        setShowSearch(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Search results
  const searchResults = [
    { name: 'User', path: '/dashboard/user/dashboard', category: 'Overview', icon: '👤' },
    { name: 'Hirings', path: '/dashboard', category: 'Overview', icon: '💼' },
    { name: 'Kanban', path: '/dashboard/kanban', category: 'Services', icon: '📋' },
    { name: 'Chat', path: '/dashboard/chat', category: 'Services', icon: '💬' },
    { name: 'File Manager', path: '/dashboard/file-manager', category: 'Services', icon: '📁' },
    { name: 'Calendar', path: '/dashboard/calendar', category: 'Services', icon: '📅' },
  ];

  const filteredResults = searchResults.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchResultClick = (item) => {
    console.log(`Navigating to: ₹{item.path}`);
    // Add navigation logic here
    setShowSearch(false);
    setSearchQuery('');
  };

  return (
    <>
      <div className="fixed top-4 sm:top-6 right-3 sm:right-6 md:right-8 z-50 flex items-center gap-3 sm:gap-4 md:gap-6">
        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleDarkMode}
          className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border shadow-sm hover:bg-gray-50 dark:hover:bg-dark-card transition-colors"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? (
            <Sun size={18} className="text-orange-500 sm:w-5 sm:h-5" />
          ) : (
            <Moon size={18} className="text-blue-600 sm:w-5 sm:h-5" />
          )}
        </button>

        {/* Search */}
        <div 
          className="flex items-center gap-1 sm:gap-2 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-full px-2 sm:px-3 py-1 shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-card transition-colors"
          onClick={() => setShowSearch(true)}
        >
          <Search size={16} className="text-gray-500 dark:text-gray-400 sm:w-[18px] sm:h-[18px]" />
          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono hidden sm:inline">⌘K</span>
        </div>

        {/* Notification */}
        <button 
          className="relative p-1.5 sm:p-2 rounded-full bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border shadow-sm hover:bg-gray-50 dark:hover:bg-dark-card transition-colors"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell size={18} className="text-gray-500 dark:text-gray-400 sm:w-5 sm:h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
            0
          </span>
        </button>
      </div>

      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-start justify-center pt-16 sm:pt-20">
          <div ref={searchRef} className="bg-white dark:bg-dark-surface rounded-lg shadow-2xl w-full max-w-2xl mx-3 sm:mx-4">
            <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-dark-border">
              <div className="flex items-center gap-2 sm:gap-3">
                <Search size={18} className="text-gray-500 dark:text-gray-400 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-base sm:text-lg outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  autoFocus
                />
                <button
                  onClick={() => setShowSearch(false)}
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  Esc
                </button>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {filteredResults.map((item, index) => (
                <div 
                  key={index} 
                  className="p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-dark-card border-b border-gray-100 dark:border-dark-border last:border-b-0 cursor-pointer transition-colors"
                  onClick={() => handleSearchResultClick(item)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-lg sm:text-xl">{item.icon}</span>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{item.name}</div>
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{item.path}</div>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-dark-card text-gray-600 dark:text-gray-300 rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-3 sm:p-4 text-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
              No Pending tasks
            </div>
          </div>
        </div>
      )}

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed top-16 sm:top-20 right-3 sm:right-6 md:right-8 z-[100]">
          <div ref={notificationsRef} className="bg-white dark:bg-dark-surface rounded-lg shadow-2xl border border-gray-200 dark:border-dark-border w-72 sm:w-80">
            <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-dark-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
                <div className="flex items-center gap-2">
                  <select className="text-xs sm:text-sm border border-gray-300 dark:border-dark-border rounded px-2 py-1 bg-white dark:bg-dark-card text-gray-900 dark:text-white">
                    <option>Kanban</option>
                  </select>
                  <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-500 text-white rounded-full">
                    Unread <span className="ml-1 bg-white text-blue-500 rounded-full px-1.5 text-xs">0</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6 sm:p-8 text-center">
              <div className="text-gray-400 text-4xl sm:text-6xl mb-3 sm:mb-4">🔔</div>
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">No notifications</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer Blank Space */}
      <div className="h-16 sm:h-20 md:h-24"></div>
    </>
  );
};

export default TopRightHeader;