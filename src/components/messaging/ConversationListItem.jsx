import React from 'react';

function ConversationListItem({ contact, isSelected, onSelect }) {
  const roleText = contact.type === 'coach' ? 'Coach' : 'Membre';

  return (
    <div
      onClick={onSelect}
      className={`
        flex items-center gap-4 p-4 cursor-pointer transition-colors duration-200
        border-b border-border/50
        ${isSelected ? 'bg-primary/10' : 'hover:bg-secondary/80'}
      `}
    >
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl">
          {contact.name.charAt(0)}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-foreground truncate">{contact.name}</h4>
        </div>
        <p className="text-sm text-muted-foreground truncate">{roleText}</p>
      </div>
    </div>
  );
}

export default ConversationListItem;