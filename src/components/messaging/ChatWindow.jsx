import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatMessage from '@/components/messaging/ChatMessage';
import { useAuth } from '@/contexts/AuthContext';

function ChatWindow({ contact }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const conversationId = `chat_${contact.id}`;

  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem(conversationId) || '[]');
    setMessages(storedMessages);
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const message = {
      id: Date.now(),
      text: newMessage,
      senderId: user.id, // Assuming user object has an id
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem(conversationId, JSON.stringify(updatedMessages));
    setNewMessage('');
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex items-center gap-4 p-4 border-b border-border/50 bg-secondary/50">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold">
          {contact.name.charAt(0)}
        </div>
        <div>
          <h3 className="font-bold text-foreground">{contact.name}</h3>
          <p className="text-sm text-muted-foreground">{contact.type === 'coach' ? 'Coach' : 'Membre'}</p>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} isMe={msg.senderId === user.id} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border/50 bg-secondary/50">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1 px-4 py-2 bg-background/50 border border-border rounded-full focus:ring-2 focus:ring-primary"
          />
          <Button type="submit" size="icon" className="rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white">
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ChatWindow;