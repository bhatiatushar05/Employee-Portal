import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Settings, X, User, LogOut, ChevronDown, Info, Moon, Sun, Contrast, ArrowLeftRight, MoveVertical, Palette, Maximize2, RotateCcw } from 'lucide-react';

const TopRightHeader = ({ user }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [contrast, setContrast] = useState(false);
  const [rtl, setRtl] = useState(false);
  const [compact, setCompact] = useState(true);
  const [navLayout, setNavLayout] = useState('vertical');
  const [navColor, setNavColor] = useState('integrate');
  const [colorPreset, setColorPreset] = useState('green');
  
  const searchRef = useRef(null);
  const notificationsRef = useRef(null);
  const settingsRef = useRef(null);
  const profileRef = useRef(null);

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
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
        setShowSettings(false);
        setShowProfile(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Search results
  const searchResults = [
    { name: 'User', path: '/dashboard/user/dashboard', category: 'Overview', icon: User },
    { name: 'Hirings', path: '/dashboard', category: 'Overview', icon: User },
    { name: 'Kanban', path: '/dashboard/kanban', category: 'Services', icon: User },
    { name: 'Chat', path: '/dashboard/chat', category: 'Services', icon: User },
    { name: 'File Manager', path: '/dashboard/file-manager', category: 'Services', icon: User },
    { name: 'Calendar', path: '/dashboard/calendar', category: 'Services', icon: User },
  ];

  const filteredResults = searchResults.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...');
    setShowProfile(false);
  };

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

        {/* Settings */}
        <button 
          className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings size={20} className="text-gray-500" />
        </button>

        {/* Profile */}
        <div 
          className="w-9 h-9 rounded-full border-2 border-gradient-to-r from-orange-400 to-green-400 flex items-center justify-center bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setShowProfile(!showProfile)}
        >
          <span className="font-bold text-lg text-purple-700">{user?.fullName?.[0] || 'T'}</span>
        </div>
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
                      <item.icon size={20} className="text-gray-500" />
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

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
          <div ref={settingsRef} className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Maximize2 size={20} className="text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <RotateCcw size={20} className="text-gray-500" />
                  </button>
                  <button 
                    onClick={() => setShowSettings(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* General Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">General</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      {darkMode ? <Moon size={20} className="text-gray-600" /> : <Sun size={20} className="text-gray-600" />}
                      <span className="font-medium">Dark mode</span>
                    </div>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-blue-500' : 'bg-gray-300'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Contrast size={20} className="text-gray-600" />
                      <span className="font-medium">Contrast</span>
                    </div>
                    <button
                      onClick={() => setContrast(!contrast)}
                      className={`w-12 h-6 rounded-full transition-colors ${contrast ? 'bg-blue-500' : 'bg-gray-300'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${contrast ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <ArrowLeftRight size={20} className="text-gray-600" />
                      <span className="font-medium">Right to left</span>
                    </div>
                    <button
                      onClick={() => setRtl(!rtl)}
                      className={`w-12 h-6 rounded-full transition-colors ${rtl ? 'bg-blue-500' : 'bg-gray-300'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${rtl ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MoveVertical size={20} className="text-gray-600" />
                      <span className="font-medium">Compact</span>
                      <Info size={16} className="text-gray-400" />
                    </div>
                    <button
                      onClick={() => setCompact(!compact)}
                      className={`w-12 h-6 rounded-full transition-colors ${compact ? 'bg-blue-500' : 'bg-gray-300'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${compact ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation Settings */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">Nav</h3>
                  <Info size={16} className="text-gray-400" />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Layout</h4>
                    <div className="flex gap-3">
                      {['vertical', 'horizontal', 'compact'].map((layout) => (
                        <button
                          key={layout}
                          onClick={() => setNavLayout(layout)}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            navLayout === layout 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="w-16 h-12 flex items-center">
                            {layout === 'vertical' && (
                              <div className="w-4 h-full bg-gray-400 rounded mr-2"></div>
                            )}
                            {layout === 'horizontal' && (
                              <div className="w-full h-4 bg-gray-400 rounded mb-2"></div>
                            )}
                            {layout === 'compact' && (
                              <div className="w-4 h-full bg-gray-400 rounded mr-1"></div>
                            )}
                            <div className="flex-1 h-full bg-gray-300 rounded"></div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Color</h4>
                    <div className="flex gap-3">
                      {['integrate', 'apparent'].map((color) => (
                        <button
                          key={color}
                          onClick={() => setNavColor(color)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            navColor === color 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {color === 'integrate' ? <Palette size={16} className="inline mr-2" /> : <Palette size={16} className="inline mr-2" />}
                          {color.charAt(0).toUpperCase() + color.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Presets */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Presets</h3>
                <div className="grid grid-cols-6 gap-3">
                  {['green', 'blue', 'purple', 'orange', 'red', 'teal'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setColorPreset(color)}
                      className={`w-12 h-12 rounded-lg border-2 transition-colors ${
                        colorPreset === color 
                          ? 'border-green-500' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{
                        background: `linear-gradient(135deg, var(--${color}-500) 0%, var(--${color}-600) 100%)`
                      }}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-2 h-8 bg-white rounded mr-1"></div>
                        <div className="w-6 h-2 bg-white rounded"></div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
          <div ref={profileRef} className="bg-white rounded-lg shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
                <button 
                  onClick={() => setShowProfile(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-green-500 flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
                  <span className="text-3xl font-bold text-white">{user?.fullName?.[0] || 'T'}</span>
                </div>
                <p className="text-gray-600">{user?.email || 'tushar.bhatia@f13.tech'}</p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <button
                  onClick={handleLogout}
                  className="w-full py-3 px-4 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopRightHeader;