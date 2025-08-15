import React, { useState } from 'react';
import { MoreVertical, Reply, Edit, Trash2, Smile } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function ChatMessageItem({ message, isOwn = false }) {
  const { isDarkMode } = useTheme();
  const [showActions, setShowActions] = useState(false);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessageContent = () => {
    if (message.type === 'image') {
      return (
        <img
          src={message.content}
          alt="Message attachment"
          className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity duration-200"
          onClick={() => window.open(message.content, '_blank')}
        />
      );
    }

    if (message.type === 'file') {
      return (
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg max-w-xs">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {message.fileName || 'File'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {message.fileSize || 'Unknown size'}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-xs">
        <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap break-words">
          {message.content}
        </p>
        {message.replyTo && (
          <div className="mt-2 p-2 bg-gray-100 dark:bg-dark-surface border-l-4 border-blue-500 rounded-r-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Replying to {message.replyTo.senderName}
            </p>
            <p className="text-xs text-gray-800 dark:text-gray-200 truncate">
              {message.replyTo.content}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`relative group max-w-xs ${isOwn ? 'order-2' : 'order-1'}`}>
        {/* Message Content */}
        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwn
              ? 'bg-blue-500 text-white rounded-br-md'
              : 'bg-white dark:bg-dark-card text-gray-900 dark:text-white border border-gray-200 dark:border-dark-border rounded-bl-md'
          }`}
        >
          {renderMessageContent()}
        </div>

        {/* Message Actions */}
        <div
          className={`absolute top-0 ${
            isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'
          } opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 p-1`}
        >
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-surface rounded transition-colors duration-200"
          >
            <MoreVertical size={14} />
          </button>
        </div>

        {/* Action Menu */}
        {showActions && (
          <div
            className={`absolute top-0 z-10 ${
              isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'
            } bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg shadow-lg p-1 min-w-[120px]`}
          >
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface rounded transition-colors duration-200">
              <Reply size={14} />
              Reply
            </button>
            {isOwn && (
              <>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface rounded transition-colors duration-200">
                  <Edit size={14} />
                  Edit
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-200">
                  <Trash2 size={14} />
                  Delete
                </button>
              </>
            )}
          </div>
        )}

        {/* Timestamp */}
        <div className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${
          isOwn ? 'text-right' : 'text-left'
        }`}>
          {formatTime(message.timestamp)}
          {message.edited && (
            <span className="ml-1 text-gray-400 dark:text-gray-500">(edited)</span>
          )}
        </div>
      </div>

      {/* Avatar for other users */}
      {!isOwn && (
        <div className="order-1 mr-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
            {message.senderName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        </div>
      )}
    </div>
  );
}
