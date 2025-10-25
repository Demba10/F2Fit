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
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const senegalPhoneRegex = /^(70|75|76|77|78)\d{7}$/;
const availableSpecialties = ["Yoga", "CrossFit", "Musculation", "Cardio", "Pilates", "Boxe"];

function AddCoachDialog({ isOpen, onClose, onAdd }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const { toast } = useToast();

  const handleSpecialtyChange = (specialty) => {
    setSpecialties(prev => 
      prev.includes(specialty) 
        ? prev.filter(s => s !== specialty) 
        : [...prev, specialty]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({ title: "Nom requis", description: "Veuillez entrer le nom du coach.", variant: "destructive" });
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
    if (specialties.length === 0) {
        toast({ title: "Spécialité requise", description: "Veuillez sélectionner au moins une spécialité.", variant: "destructive" });
        return;
    }

    onAdd({ 
      name, 
      email, 
      phone: phone ? `+221${phone}` : '', 
      specialties 
    });
    
    setName('');
    setEmail('');
    setPhone('');
    setSpecialties([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-secondary border-border/50 rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gradient bg-gradient-to-r from-red-500 to-orange-500">Nouveau Coach</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Remplissez les informations ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="coach-name" className="text-muted-foreground">Nom complet</Label>
            <input id="coach-name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coach-email" className="text-muted-foreground">Email</Label>
            <input id="coach-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coach-phone" className="text-muted-foreground">Téléphone (Sénégal)</Label>
            <div className="flex items-center w-full bg-background/50 border border-border rounded-lg focus-within:ring-2 focus-within:ring-primary">
              <span className="px-3 text-muted-foreground">+221</span>
              <input id="coach-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} maxLength="9" className="flex-1 h-full bg-transparent border-none outline-none text-foreground py-2" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialties" className="text-muted-foreground">Spécialités</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="truncate">{specialties.length > 0 ? specialties.join(', ') : 'Sélectionner...'}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-background border-border">
                {availableSpecialties.map(spec => (
                  <DropdownMenuItem key={spec} onSelect={(e) => e.preventDefault()} onClick={() => handleSpecialtyChange(spec)}>
                    <Checkbox checked={specialties.includes(spec)} className="mr-2" />
                    <span>{spec}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <DialogFooter className="pt-4">
            <Button type="submit" className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white">Ajouter Coach</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddCoachDialog;