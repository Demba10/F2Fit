import React from 'react';

function ChatMessage({ message, isMe }) {
  const alignment = isMe ? 'justify-end' : 'justify-start';
  const bubbleColor = isMe
    ? 'bg-gradient-to-br from-red-500 to-orange-500 text-white'
    : 'bg-background border border-border/50 text-foreground';

  return (
    <div className={`flex ${alignment}`}>
      <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${bubbleColor} shadow-md`}>
        <p className="text-sm">{message.text}</p>
        <p className={`text-xs mt-1 ${isMe ? 'text-white/70' : 'text-muted-foreground'} text-right`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

export default ChatMessage;