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

function AddSubscriptionPlanDialog({ isOpen, onClose, onAdd, gymId }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !price || !duration) {
      toast({ title: "Champs requis", variant: "destructive" });
      return;
    }
    onAdd({ gymId, name, price: Number(price), duration: Number(duration) });
    setName('');
    setPrice('');
    setDuration('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-secondary border-border/50 rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gradient bg-gradient-to-r from-red-500 to-orange-500">Nouveau Plan d'Abonnement</DialogTitle>
          <DialogDescription className="text-muted-foreground">Créez un nouveau plan pour votre salle.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="plan-name" className="text-muted-foreground">Nom du Plan</Label>
            <input id="plan-name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="plan-price" className="text-muted-foreground">Prix (FCFA)</Label>
                <input id="plan-price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="plan-duration" className="text-muted-foreground">Durée (jours)</Label>
                <input id="plan-duration" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg" required />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="submit" className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white">Ajouter Plan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddSubscriptionPlanDialog;