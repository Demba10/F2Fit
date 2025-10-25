import React from 'react';
import { MoreVertical, Edit, PowerOff, Power, ShieldCheck, Tag, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';


function PlanCard({ plan, onEdit, onDeactivate, isSuperAdmin = false }) {
    const { toast } = useToast();
    const status = plan.status || 'active';
    const isCustom = !plan.isDefault;

    const statusClasses = {
      active: 'bg-green-500/10 text-green-400',
      disabled: 'bg-gray-500/10 text-gray-400',
    };
  
    const handleAction = (action, e) => {
        if (plan.isDefault && action !== 'deactivate') {
            e.preventDefault();
            toast({
                title: 'Action non autorisée',
                description: 'Les plans par défaut ne peuvent être que (dés)activés par un admin.',
                variant: 'destructive',
            });
            return;
        }
        if (action === 'edit') onEdit();
        if (action === 'deactivate') onDeactivate();
    };

  return (
    <div className={cn("bg-secondary rounded-xl shadow-lg border border-border/50 p-6 space-y-4 hover:border-primary/50 transition-all duration-300 h-full flex flex-col", status === 'disabled' && 'opacity-60')}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isCustom ? 'bg-gradient-to-br from-red-500 to-orange-500' : 'bg-primary/10'}`}>
                {isCustom ? <Tag className="w-6 h-6 text-white" /> : <ShieldCheck className="w-6 h-6 text-primary" />}
            </div>
            <div>
              <h3 className="font-bold text-xl text-foreground truncate">{plan.name}</h3>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusClasses[status]}`}>{status === 'active' ? 'Actif' : 'Inactif'}</span>
            </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8 flex-shrink-0">
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background border-border">
            <DropdownMenuItem className="gap-2" onClick={(e) => handleAction('edit', e)} disabled={plan.isDefault && !isSuperAdmin}>
                <Edit className="w-4 h-4" /> Modifier
            </DropdownMenuItem>
             <DropdownMenuItem onClick={(e) => handleAction('deactivate', e)} className={cn("gap-2", status === 'active' ? 'text-orange-500 focus:text-orange-500' : 'text-green-500 focus:text-green-500')}>
              {status === 'active' ? <><PowerOff className="w-4 h-4" /> Désactiver</> : <><Power className="w-4 h-4" /> Activer</>}
            </DropdownMenuItem>
             {!plan.isDefault && (
                <>
                 <DropdownMenuSeparator />
                 <DropdownMenuItem className="gap-2 text-red-500 focus:text-red-500" onClick={() => onDeactivate(true)}>
                    <Trash2 className="w-4 h-4" /> Supprimer
                </DropdownMenuItem>
                </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex-grow space-y-3">
        <div className="flex items-baseline gap-2">
            <p className="font-bold text-3xl text-gradient bg-gradient-to-r from-red-400 to-orange-400">{plan.price.toLocaleString()} FCFA</p>
            <span className="text-muted-foreground">/ {plan.duration} jours</span>
        </div>
        <p className="text-sm text-muted-foreground min-h-[40px]">{plan.benefits}</p>
      </div>

       <div className="text-xs text-muted-foreground pt-3 mt-auto border-t border-border/50">
        {isCustom ? 'Plan personnalisé' : 'Tarif global'}
      </div>
    </div>
  );
}

export default PlanCard;