import React from 'react';
import { Calendar, RefreshCw, Trash2, MoreVertical, AlertTriangle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

function SubscriptionCard({ subscription, onDelete }) {
  const { toast } = useToast();
  
  const getStatusInfo = (status, endDate) => {
    const today = new Date("2025-10-23");
    const end = new Date(endDate);
    const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

    if (status === 'expired' || diffDays < 0) {
      return { text: 'Expiré', classes: 'bg-red-500/10 text-red-400' };
    }
    if (diffDays <= 7 && status === 'active') {
      return { text: `Expire dans ${diffDays}j`, classes: 'bg-orange-500/10 text-orange-400' };
    }
    if (status === 'active') {
      return { text: 'Actif', classes: 'bg-green-500/10 text-green-400' };
    }
    return { text: 'En attente', classes: 'bg-yellow-500/10 text-yellow-400' };
  };

  const statusInfo = getStatusInfo(subscription.status, subscription.endDate);
  
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
        <div className="min-w-0">
          <h3 className="font-semibold text-lg text-foreground truncate">{subscription.planName}</h3>
          <p className="text-sm text-muted-foreground truncate">{subscription.memberName}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8 flex-shrink-0">
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background border-border">
            <DropdownMenuItem className="gap-2" onClick={handleFutureFeature}><RefreshCw className="w-4 h-4" /> Renouveller</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(subscription.id)} className="gap-2 text-red-500 focus:text-red-500 focus:bg-red-500/10">
              <Trash2 className="w-4 h-4" /> Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex items-center justify-between flex-grow">
        <p className="font-bold text-xl text-gradient bg-gradient-to-r from-red-400 to-orange-400">{subscription.price.toLocaleString()} FCFA</p>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusInfo.classes}`}>
          {statusInfo.text}
        </span>
      </div>

      <div className="space-y-2 text-sm text-muted-foreground pt-3 mt-auto border-t border-border/50">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>Début: {new Date(subscription.startDate).toLocaleDateString('fr-FR')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-red-500" />
          <span>Fin: {new Date(subscription.endDate).toLocaleDateString('fr-FR')}</span>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionCard;