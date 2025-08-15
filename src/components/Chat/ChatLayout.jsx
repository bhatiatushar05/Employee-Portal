import React from 'react';

// ----------------------------------------------------------------------

export function ChatLayout({ slots, sx, ...other }) {
  return (
    <div className="w-full h-full flex overflow-hidden" {...other}>
      {/* Navigation Sidebar */}
      <div className="flex-shrink-0 border-r border-gray-200 dark:border-dark-border w-80">
        {slots.nav}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="flex-shrink-0">
          {slots.header}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Main Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {slots.main}
          </div>

          {/* Message Input */}
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card">
            {slots.details}
          </div>
        </div>
      </div>
    </div>
  );
}
