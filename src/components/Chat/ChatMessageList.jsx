import React, { useEffect, useRef } from 'react';
import { ChatMessageItem } from './ChatMessageItem';
import { useTheme } from '../../contexts/ThemeContext';

export function ChatMessageList({ 
  messages = [], 
  loading = false,
  currentUserId 
}) {
  const { isDarkMode } = useTheme();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-dark-surface">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-dark-surface">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 dark:bg-dark-surface rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No messages yet</h3>
          <p className="text-gray-500 dark:text-gray-400">Start a conversation by sending a message</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-dark-surface p-4 space-y-4">
      {messages.map((message) => (
        <ChatMessageItem
          key={message.id}
          message={message}
          isOwn={message.senderId === currentUserId}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
