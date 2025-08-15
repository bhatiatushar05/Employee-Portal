import React, { useState } from 'react';
import { ChatLayout } from './ChatLayout';
import { ChatNav } from './ChatNav';
import { ChatHeader } from './ChatHeader';
import { ChatMessageList } from './ChatMessageList';
import { ChatMessageInput } from './ChatMessageInput';
import { ChatCompose } from './ChatCompose';
import { useTheme } from '../../contexts/ThemeContext';

// Mock data for demonstration
const mockContacts = [
  { id: 1, name: 'John Doe', email: 'john@company.com', status: 'online' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@company.com', status: 'offline' },
  { id: 3, name: 'Mike Chen', email: 'mike@company.com', status: 'online' },
  { id: 4, name: 'Emma Davis', email: 'emma@company.com', status: 'online' },
];

const mockConversations = [
  { id: 1, name: 'John Doe', lastMessage: 'Hey, how are you doing?', unreadCount: 2 },
  { id: 2, name: 'Sarah Johnson', lastMessage: 'Meeting at 3 PM today', unreadCount: 0 },
  { id: 3, name: 'Mike Chen', lastMessage: 'Project update ready', unreadCount: 1 },
];

const mockMessages = [
  { id: 1, content: 'Hey there! How are you doing today?', senderId: 2, senderName: 'John Doe', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), type: 'text' },
  { id: 2, content: "I'm doing great! Just finished the project review.", senderId: 1, senderName: 'You', timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), type: 'text' },
  { id: 3, content: 'That sounds good! Can you share the details?', senderId: 2, senderName: 'John Doe', timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(), type: 'text' },
  { id: 4, content: "Sure! Here's the project file.", senderId: 1, senderName: 'You', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), type: 'file', fileName: 'project-review.pdf', fileSize: '2.4 MB' },
];

export function Chat() {
  const { isDarkMode } = useTheme();
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [collapseNav, setCollapseNav] = useState(false);
  const [messages, setMessages] = useState(mockMessages);
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCompose, setShowCompose] = useState(false);

  const currentUserId = 1;

  const handleSelectConversation = (conversationId) => {
    setSelectedConversationId(conversationId);
    setMessages(mockMessages);
  };

  const handleCompose = () => setShowCompose(true);
  const handleStartConversation = (contacts) => {
    if (contacts.length > 0) {
      const newConversationId = Date.now();
      setSelectedConversationId(newConversationId);
      setMessages([]);
    }
  };
  const handleSendMessage = (messageData) => {
    const newMessage = { id: Date.now(), ...messageData, senderId: currentUserId, senderName: 'You' };
    setMessages((prev) => [...prev, newMessage]);
  };
  const handleToggleNav = () => setCollapseNav(!collapseNav);
  const handleMenuClick = () => {};
  const handleClearReply = () => setReplyTo(null);

  const getCurrentParticipant = () => {
    if (!selectedConversationId) return null;
    const conversation = mockConversations.find((c) => c.id === selectedConversationId);
    if (!conversation) return null;
    return { name: conversation.name, status: 'online', memberCount: 2 };
  };

  return (
    <div className="w-full h-full p-6 ">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Chat <span className="text-orange-500">Management</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Communicate with team members and manage conversations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analytics
            </button>
            <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Chat
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-dark-card p-4 rounded-xl border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Conversations</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{mockConversations.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-dark-card p-4 rounded-xl border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Unread Messages</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {mockConversations.reduce((sum, conv) => sum + conv.unreadCount, 0)}
              </p>
            </div>
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-dark-card p-4 rounded-xl border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Online Contacts</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {mockContacts.filter(c => c.status === 'online').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-dark-card p-4 rounded-xl border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Messages</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{mockMessages.length}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border shadow-sm overflow-hidden">
        <ChatLayout
          slots={{
            nav: (
              <ChatNav
                loading={loading}
                contacts={mockContacts}
                conversations={mockConversations}
                selectedConversationId={selectedConversationId}
                onSelectConversation={handleSelectConversation}
                onCompose={handleCompose}
                collapseNav={collapseNav}
                onToggleNav={handleToggleNav}
              />
            ),
            header: selectedConversationId ? (
              <ChatHeader
                participant={getCurrentParticipant()}
                isGroup={false}
                onToggleNav={handleToggleNav}
                collapseNav={collapseNav}
                onMenuClick={handleMenuClick}
              />
            ) : (
              <div className="h-18 flex items-center justify-center border-b border-gray-200 dark:border-dark-border bg-gradient-to-r from-orange-50 via-blue-50 to-orange-50 dark:from-orange-900/10 dark:via-blue-900/10 dark:to-orange-900/10">
                <div className="text-center">
                  <div className="w-16 h-16 mt-3 bg-gradient-to-br from-orange-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Welcome to Chat</h3>
                  <p className="text-gray-500 dark:text-gray-400">Select a conversation to start messaging</p>
                </div>
              </div>
            ),
            main: selectedConversationId ? (
              <ChatMessageList messages={messages} loading={loading} currentUserId={currentUserId} />
            ) : null,
            details: selectedConversationId ? (
              <ChatMessageInput onSendMessage={handleSendMessage} replyTo={replyTo} onClearReply={handleClearReply} />
            ) : null,
          }}
        />
      </div>

      {showCompose && (
        <ChatCompose contacts={mockContacts} onStartConversation={handleStartConversation} onClose={() => setShowCompose(false)} />
      )}
    </div>
  );
}
