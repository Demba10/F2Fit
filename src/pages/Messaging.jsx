import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ConversationList from '@/components/messaging/ConversationList';
import ChatWindow from '@/components/messaging/ChatWindow';
import { MessageSquare } from 'lucide-react';

function Messaging() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const { contactId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Load members and coaches to create conversation list
    const members = JSON.parse(localStorage.getItem('f2fit_members') || '[]');
    const coaches = JSON.parse(localStorage.getItem('f2fit_coaches') || '[]');
    const allContacts = [
      ...members.map(m => ({ ...m, type: 'member' })),
      ...coaches.map(c => ({ ...c, type: 'coach' }))
    ];
    setConversations(allContacts);

    if (contactId) {
      const contact = allContacts.find(c => c.id === contactId);
      if (contact) {
        setSelectedConversation(contact);
      }
    } else if (allContacts.length > 0) {
      // Select the first conversation by default if no contactId is provided
      setSelectedConversation(allContacts[0]);
    }
  }, [contactId]);

  const handleSelectConversation = (contact) => {
    setSelectedConversation(contact);
    navigate(`/messaging/${contact.id}`);
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-10rem)] md:h-[calc(100vh-6rem)] flex flex-col md:flex-row bg-secondary border border-border/50 rounded-xl overflow-hidden shadow-lg">
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={handleSelectConversation}
        />
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <ChatWindow contact={selectedConversation} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <MessageSquare className="w-24 h-24 text-muted-foreground/50 mb-6" />
              <h2 className="text-2xl font-bold text-foreground">Bienvenue dans votre Messagerie</h2>
              <p className="text-muted-foreground mt-2 max-w-sm">
                Sélectionnez une conversation pour commencer à discuter ou contactez un membre ou un coach depuis leur profil.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Messaging;