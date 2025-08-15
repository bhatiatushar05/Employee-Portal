import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export function ChatNav({ loading, contacts, conversations, selectedConversationId, onSelectConversation, onCompose, collapseNav, onToggleNav }) {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white dark:bg-dark-card">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-dark-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chat</h2>
          <button
            onClick={onCompose}
            className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Recent Conversations ({filteredConversations.length})
          </h3>
          
          <div className="space-y-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                  selectedConversationId === conversation.id
                    ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {conversation.name.charAt(0)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {conversation.name}
                      </h4>
                      {conversation.unreadCount > 0 && (
                        <span className="flex-shrink-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                      {conversation.lastMessage}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
