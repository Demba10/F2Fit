import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

function AddEquipmentDialog({ isOpen, onClose, onAdd }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [status, setStatus] = useState('En service');
  const [lastMaintenance, setLastMaintenance] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !quantity) {
        toast({ title: "Champs requis", description: "Le nom et la quantité sont obligatoires.", variant: "destructive" });
        return;
    }
    onAdd({ name, quantity: Number(quantity), status, lastMaintenance });
    setName('');
    setQuantity('');
    setStatus('En service');
    setLastMaintenance('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-secondary border-border/50 rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gradient bg-gradient-to-r from-red-500 to-orange-500">Nouvel Équipement</DialogTitle>
          <DialogDescription className="text-muted-foreground">Ajoutez un équipement à votre inventaire.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="equip-name" className="text-muted-foreground">Nom de l'équipement</Label>
            <input id="equip-name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="quantity" className="text-muted-foreground">Quantité</Label>
                <input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="status" className="text-muted-foreground">Statut</Label>
                <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground">
                <option>En service</option>
                <option>En maintenance</option>
                <option>Hors service</option>
                </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="maintenance" className="text-muted-foreground">Date de dernière maintenance</Label>
            <input id="maintenance" type="date" value={lastMaintenance} onChange={(e) => setLastMaintenance(e.target.value)} className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground" />
          </div>
          <DialogFooter className="pt-4">
            <Button type="submit" className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white">Ajouter Équipement</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddEquipmentDialog;