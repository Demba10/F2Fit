import React, { useState, useEffect } from 'react';
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

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const senegalPhoneRegex = /^(70|75|76|77|78)\d{7}$/;

function EditMemberDialog({ isOpen, onClose, onUpdate, member }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('active');
  const { toast } = useToast();

  useEffect(() => {
    if (member) {
      setName(member.name);
      setEmail(member.email);
      // Strip +221 for editing, if present
      setPhone(member.phone ? member.phone.replace('+221', '') : '');
      setStatus(member.status);
    }
  }, [member]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({ title: "Nom requis", description: "Veuillez entrer le nom du membre.", variant: "destructive" });
      return;
    }
    if (!emailRegex.test(email)) {
      toast({ title: "Email invalide", description: "Veuillez entrer une adresse email valide.", variant: "destructive" });
      return;
    }
    if (phone && !senegalPhoneRegex.test(phone)) {
      toast({ title: "Numéro invalide", description: "Veuillez entrer un numéro sénégalais valide (9 chiffres).", variant: "destructive" });
      return;
    }

    onUpdate({
      id: member.id,
      name,
      email,
      phone: phone ? `+221${phone}` : '',
      status
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-secondary border-border/50 rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gradient bg-gradient-to-r from-red-500 to-orange-500">Modifier Membre</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Mettez à jour les informations du membre.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-muted-foreground">Nom complet</Label>
            <input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-email" className="text-muted-foreground">Email</Label>
            <input id="edit-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-phone" className="text-muted-foreground">Téléphone (Sénégal)</Label>
            <div className="flex items-center w-full bg-background/50 border border-border rounded-lg focus-within:ring-2 focus-within:ring-primary">
              <span className="px-3 text-muted-foreground">+221</span>
              <input id="edit-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} maxLength="9" className="flex-1 h-full bg-transparent border-none outline-none text-foreground py-2" />
            </div>
          </div>
          <div className="space-y-2">
             <Label htmlFor="edit-status" className="text-muted-foreground">Statut</Label>
             <select id="edit-status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground">
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="suspended">Suspendu</option>
             </select>
          </div>
          <DialogFooter className="pt-4">
            <Button type="submit" className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditMemberDialog;