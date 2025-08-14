import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, X } from 'lucide-react';

const TopRightHeader = ({ user }) => {
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
    console.log(`Navigating to: ${item.path}`);
    // Add navigation logic here
    setShowSearch(false);
    setSearchQuery('');
  };

  return (
    <>
      <div className="fixed top-6 right-8 z-50 flex items-center gap-6">
        {/* Search */}
        <div 
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setShowSearch(true)}
        >
          <Search size={18} className="text-gray-500" />
          <span className="text-xs text-gray-500 font-mono">⌘K</span>
        </div>

        {/* Notification */}
        <button 
          className="relative p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell size={20} className="text-gray-500" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
            0
          </span>
        </button>
      </div>

      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-start justify-center pt-20">
          <div ref={searchRef} className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Search size={20} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-lg outline-none"
                  autoFocus
                />
                <button
                  onClick={() => setShowSearch(false)}
                  className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700"
                >
                  Esc
                </button>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {filteredResults.map((item, index) => (
                <div 
                  key={index} 
                  className="p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors"
                  onClick={() => handleSearchResultClick(item)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.path}</div>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 text-center text-gray-500 text-sm">
              No Pending tasks
            </div>
          </div>
        </div>
      )}

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed top-20 right-8 z-[100]">
          <div ref={notificationsRef} className="bg-white rounded-lg shadow-2xl border border-gray-200 w-80">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <div className="flex items-center gap-2">
                  <select className="text-sm border border-gray-300 rounded px-2 py-1">
                    <option>Kanban</option>
                  </select>
                  <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-full">
                    Unread <span className="ml-1 bg-white text-blue-500 rounded-full px-1.5 text-xs">0</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">🔔</div>
              <p className="text-gray-500">No notifications</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopRightHeader;