
import React from 'react';
import { Building, Mail, MoreVertical, PowerOff, Edit, Trash2, ShieldCheck, Phone } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function GymCard({ gym, onEdit, onDeactivate, onDelete }) {
  const status = gym.status || 'active';
  const statusClasses = {
    active: 'bg-green-500/10 text-green-400',
    disabled: 'bg-gray-500/10 text-gray-400',
  };

  const isExpired = new Date(gym.subscriptionEndDate) < new Date("2025-10-23");


  return (
    <div className={cn("bg-secondary rounded-xl shadow-lg border p-5 space-y-4 hover:border-primary/50 transition-all duration-300 h-full flex flex-col", isExpired && status === 'active' ? 'border-red-500/50' : 'border-border/50')}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white flex-shrink-0">
            <Building className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-lg text-foreground truncate">{gym.gymName}</h3>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusClasses[status]}`}>
              {status === 'active' ? 'Active' : 'Désactivée'}
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
            <DropdownMenuItem className="gap-2" onClick={() => onEdit(gym)}><Edit className="w-4 h-4" /> Modifier</DropdownMenuItem>
            {status === 'active' && <DropdownMenuItem onClick={() => onDeactivate(gym.gymId)} className="gap-2 text-orange-500 focus:text-orange-500 focus:bg-orange-500/10">
              <PowerOff className="w-4 h-4" /> Désactiver
            </DropdownMenuItem>}
            {status === 'disabled' && (
                <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onDelete(gym.gymId)} className="gap-2 text-red-500 focus:text-red-500 focus:bg-red-500/10">
                        <Trash2 className="w-4 h-4" /> Supprimer
                    </DropdownMenuItem>
                </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="space-y-3 text-sm text-muted-foreground flex-grow">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 flex-shrink-0 text-primary" />
          <span className="truncate font-medium text-foreground">{gym.tariffName || 'Plan non défini'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{gym.email}</span>
        </div>
        {gym.phone && <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{gym.phone}</span>
        </div>}
      </div>
      <div className="text-xs text-muted-foreground pt-3 mt-auto border-t border-border/50 flex justify-between">
        <span>Inscrite le: {new Date(gym.createdAt).toLocaleDateString()}</span>
        {isExpired && status === 'active' ? <span className="font-bold text-red-500">Expirée</span> : null}
      </div>
    </div>
  );
}

export default GymCard;
