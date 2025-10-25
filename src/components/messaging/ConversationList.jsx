import React, { useState } from 'react';
import { Search } from 'lucide-react';
import ConversationListItem from '@/components/messaging/ConversationListItem';

function ConversationList({ conversations, selectedConversation, onSelectConversation }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-border/50 flex flex-col">
      <div className="p-4 border-b border-border/50">
        <h2 className="text-xl font-bold text-foreground mb-4">Conversations</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          filteredConversations.map(conv => (
            <ConversationListItem
              key={conv.id}
              contact={conv}
              isSelected={selectedConversation?.id === conv.id}
              onSelect={() => onSelectConversation(conv)}
            />
          ))
        ) : (
          <p className="p-4 text-center text-muted-foreground">Aucune conversation trouvée.</p>
        )}
      </div>
    </div>
  );
}

export default ConversationList;