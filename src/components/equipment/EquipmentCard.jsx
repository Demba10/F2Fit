import React from 'react';
import { Sliders, CheckCircle, AlertTriangle, MoreVertical, Trash2, Edit, Wrench as Tool } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

function EquipmentCard({ equipment, onDelete }) {
  const { toast } = useToast();
  
  const statusInfo = {
    'En service': { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
    'En maintenance': { icon: Tool, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    'Hors service': { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
  };

  const StatusIcon = statusInfo[equipment.status].icon;
  const statusClasses = `${statusInfo[equipment.status].color} ${statusInfo[equipment.status].bg}`;
  
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
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0">
            <Sliders className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-lg text-foreground truncate">{equipment.name}</h3>
            <p className="text-sm text-muted-foreground">Quantité: {equipment.quantity}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8 flex-shrink-0">
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background border-border">
            <DropdownMenuItem className="gap-2" onClick={handleFutureFeature}><Edit className="w-4 h-4" /> Modifier</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(equipment.id)} className="gap-2 text-red-500 focus:text-red-500">
              <Trash2 className="w-4 h-4" /> Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className={`flex items-center gap-2 text-sm font-medium ${statusInfo[equipment.status].color} mt-auto`}>
        <StatusIcon className="w-4 h-4" />
        <span>{equipment.status}</span>
      </div>

      {equipment.lastMaintenance && (
        <p className="text-xs text-muted-foreground pt-3 border-t border-border/50">
          Dernière maintenance: {new Date(equipment.lastMaintenance).toLocaleDateString('fr-FR')}
        </p>
      )}
    </div>
  );
}

export default EquipmentCard;