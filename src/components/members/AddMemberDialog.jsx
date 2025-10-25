
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
import { useToast } from '@/components/ui/use-toast';
import { User, Mail, Phone } from 'lucide-react';

function AddMemberDialog({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const { toast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({ title: "Champs requis", description: "Veuillez remplir au moins le nom et l'email.", variant: "destructive" });
      return;
    }
    onAdd({
      ...formData,
      password: 'passer1234', // Default password
      mustChangePassword: true, // Force password change on first login
    });
    setFormData({ name: '', email: '', phone: '' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-secondary border-border/50 rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gradient bg-gradient-to-r from-red-500 to-orange-500">Nouveau Membre</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Ajoutez un nouveau membre à votre salle. Le mot de passe par défaut est 'passer1234'.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input type="text" name="name" placeholder="Nom complet" value={formData.name} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg" />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg" />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input type="tel" name="phone" placeholder="Téléphone (optionnel)" value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg" />
          </div>
          <DialogFooter className="pt-4">
            <Button type="submit" className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white">Ajouter le Membre</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddMemberDialog;
