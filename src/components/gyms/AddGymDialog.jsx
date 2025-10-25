
import React, { useState } from 'react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
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
import { User, Mail, Lock, Building } from 'lucide-react';

const isSenegalPhoneNumber = (phone) => {
    if (!phone) return false;
    // Basic validation: starts with +221 and has 12 digits total, or is a local 9-digit number starting with 77, 78, 76, 70.
    const senegalRegex = /^(?:\+221)?(7[0678])\d{7}$/;
    // Remove spaces for validation
    const sanitizedPhone = phone.replace(/\s/g, '');
    if (sanitizedPhone.startsWith('+221')) {
         return isValidPhoneNumber(sanitizedPhone);
    }
    // For local numbers, prepend country code for validation library
    return isValidPhoneNumber(`+221${sanitizedPhone}`);
};


function AddGymDialog({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    gymName: '',
    adminName: '',
    adminEmail: '',
    password: '',
  });
  const [phone, setPhone] = useState();
  const { toast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.gymName.trim() || !formData.adminEmail.trim() || !formData.adminName.trim() || !formData.password.trim()) {
      toast({ title: "Champs requis", description: "Veuillez remplir tous les champs.", variant: "destructive" });
      return;
    }
    if (phone && !isSenegalPhoneNumber(phone)) {
      toast({ title: "Numéro de téléphone invalide", description: "Veuillez entrer un numéro sénégalais valide (ex: +221 77... ou 77...).", variant: "destructive" });
      return;
    }
    onAdd({ ...formData, phone });
    setFormData({ gymName: '', adminName: '', adminEmail: '', password: '' });
    setPhone('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-secondary border-border/50 rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gradient bg-gradient-to-r from-red-500 to-orange-500">Nouvelle Salle de Sport</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Créez un nouveau compte pour une salle et son administrateur.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input type="text" name="gymName" placeholder="Nom de la salle" value={formData.gymName} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg" />
          </div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input type="text" name="adminName" placeholder="Nom de l'admin" value={formData.adminName} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg" />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input type="email" name="adminEmail" placeholder="Email de l'admin" value={formData.adminEmail} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg" />
          </div>
          <PhoneInput
            international
            defaultCountry="SN"
            countryCallingCodeEditable={false}
            placeholder="Numéro de téléphone"
            value={phone}
            onChange={setPhone}
            className="PhoneInput"
          />
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input type="password" name="password" placeholder="Mot de passe initial" value={formData.password} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg" />
          </div>
          <DialogFooter className="pt-4">
            <Button type="submit" className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white">Ajouter la Salle</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddGymDialog;
