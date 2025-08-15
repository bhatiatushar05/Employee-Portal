import React, { useState } from 'react';
import { Search, X, Users } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function ChatCompose({ contacts, onStartConversation, onClose }) {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);

  const filteredContacts = contacts.filter(contact =>
    contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSelect = (contact) => {
    if (selectedContacts.find(c => c.id === contact.id)) {
      setSelectedContacts(prev => prev.filter(c => c.id !== contact.id));
    } else {
      setSelectedContacts(prev => [...prev, contact]);
    }
  };

  const handleStartConversation = () => {
    if (selectedContacts.length > 0) {
      onStartConversation(selectedContacts);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-border">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">New Conversation</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-lg transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-dark-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>
        </div>

        {/* Selected Contacts */}
        {selectedContacts.length > 0 && (
          <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-dark-border">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selected ({selectedContacts.length})</h3>
            <div className="flex flex-wrap gap-2">
              {selectedContacts.map(contact => (
                <div
                  key={contact.id}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                >
                  <span>{contact.name}</span>
                  <button
                    onClick={() => handleContactSelect(contact)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {filteredContacts.length > 0 ? (
            <div className="p-4 space-y-2">
              {filteredContacts.map(contact => (
                <button
                  key={contact.id}
                  onClick={() => handleContactSelect(contact)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
                    selectedContacts.find(c => c.id === contact.id)
                      ? 'bg-blue-100 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-600'
                      : 'hover:bg-gray-100 dark:hover:bg-dark-surface'
                  }`}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {contact.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {contact.name || 'Unknown User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {contact.email || 'No email'}
                    </p>
                  </div>
                  {selectedContacts.find(c => c.id === contact.id) && (
                    <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <Users size={32} className="mx-auto mb-2 opacity-50" />
              <p>No contacts found</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-dark-border">
          <button
            onClick={handleStartConversation}
            disabled={selectedContacts.length === 0}
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200 disabled:cursor-not-allowed"
          >
            Start Conversation
          </button>
        </div>
      </div>
    </div>
  );
}
