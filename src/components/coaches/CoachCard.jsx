import React from 'react';
import { Mail, Phone, MoreVertical, Trash2, Edit, Award, MessageCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

function CoachCard({ coach, onDelete, onEdit }) {
  const navigate = useNavigate();
  
  const handleContact = (e) => {
    e.stopPropagation();
    navigate(`/messaging/${coach.id}`);
  }

  return (
    <div className="bg-secondary rounded-xl shadow-lg border border-border/50 p-5 space-y-4 hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
            {coach.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-lg text-foreground truncate">{coach.name}</h3>
            <p className="text-sm text-primary truncate">{coach.specialties.join(', ')}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8 flex-shrink-0">
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background border-border">
            <DropdownMenuItem className="gap-2" onClick={() => onEdit(coach)}><Edit className="w-4 h-4" /> Modifier</DropdownMenuItem>
            <DropdownMenuItem className="gap-2" onClick={handleContact}><MessageCircle className="w-4 h-4" /> Contacter</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(coach.id)} className="gap-2 text-red-500 focus:text-red-500 focus:bg-red-500/10">
              <Trash2 className="w-4 h-4" /> Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="space-y-2 text-sm text-muted-foreground flex-grow">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{coach.email}</span>
        </div>
        {coach.phone && (
            <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span>{coach.phone}</span>
            </div>
        )}
      </div>
       <div className="text-xs text-muted-foreground pt-3 mt-auto border-t border-border/50">
        Coach depuis: {new Date(coach.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}

export default CoachCard;