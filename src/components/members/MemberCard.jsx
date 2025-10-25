import React from 'react';
import { Mail, Phone, MoreVertical, Trash2, Edit, BarChart, Award, MessageCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

function MemberCard({ member, onDelete, onEdit, getSubscriptionStatusInfo }) {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const statusClasses = {
    active: 'bg-green-500/10 text-green-400',
    inactive: 'bg-gray-500/10 text-gray-400',
    suspended: 'bg-orange-500/10 text-orange-400',
  };

  const subscriptionStatus = getSubscriptionStatusInfo(member);

  const handleContact = (e) => {
    e.stopPropagation();
    navigate(`/messaging/${member.id}`);
  };

  const handleFutureFeature = (e) => {
    e.stopPropagation();
    toast({
      title: "🚧 Bientôt disponible !",
      description: "Cette fonctionnalité arrive très prochainement. 🚀"
    });
  }

  return (
    <div className="bg-secondary rounded-xl shadow-lg border border-border/50 p-5 space-y-4 hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
            {member.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-lg text-foreground truncate">{member.name}</h3>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusClasses[member.status]}`}>
              {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
            </span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8 flex-shrink-0">
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background border-border">
            <DropdownMenuItem className="gap-2" onClick={() => onEdit(member)}><Edit className="w-4 h-4" /> Modifier</DropdownMenuItem>
            <DropdownMenuItem className="gap-2" onClick={handleFutureFeature}><BarChart className="w-4 h-4" /> Voir Stats</DropdownMenuItem>
            <DropdownMenuItem className="gap-2" onClick={handleContact}><MessageCircle className="w-4 h-4" /> Contacter</DropdownMenuItem>
            <DropdownMenuItem className="gap-2" onClick={handleFutureFeature}><Award className="w-4 h-4" /> Gérer Badges</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(member.id)} className="gap-2 text-red-500 focus:text-red-500 focus:bg-red-500/10">
              <Trash2 className="w-4 h-4" /> Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="space-y-2 text-sm text-muted-foreground flex-grow">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{member.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 flex-shrink-0" />
          <span>{member.phone}</span>
        </div>
        <div className="flex items-center gap-2 pt-2">
            <span className={`h-2 w-2 rounded-full ${subscriptionStatus.color.replace('text-','bg-')}`}></span>
            <span className={`font-medium ${subscriptionStatus.color}`}>{subscriptionStatus.text}</span>
        </div>
      </div>
      <div className="text-xs text-muted-foreground pt-3 mt-auto border-t border-border/50">
        Membre depuis: {new Date(member.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}

export default MemberCard;