
import React, { useState, useEffect } from 'react';
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
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Building, Mail, ToggleLeft, ToggleRight } from 'lucide-react';

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

function EditGymDialog({ isOpen, onClose, onUpdate, gym }) {
  const [formData, setFormData] = useState({ name: '', adminEmail: '', status: 'active' });
  const [phone, setPhone] = useState();
  const { toast } = useToast();

  useEffect(() => {
    if (gym) {
      setFormData({
        name: gym.gymName,
        adminEmail: gym.email,
        status: gym.status || 'active',
      });
      setPhone(gym.phone || '');
    }
  }, [gym]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleStatus = () => {
    setFormData(prev => ({ ...prev, status: prev.status === 'active' ? 'disabled' : 'active' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.adminEmail.trim()) {
      toast({ title: "Champs requis", variant: "destructive" });
      return;
    }
    if (phone && !isSenegalPhoneNumber(phone)) {
      toast({ title: "Numéro de téléphone invalide", description: "Veuillez entrer un numéro sénégalais valide.", variant: "destructive" });
      return;
    }
    onUpdate({ ...gym, gymName: formData.name, email: formData.adminEmail, status: formData.status, phone: phone });
  };

  if (!gym) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-secondary border-border/50 rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gradient bg-gradient-to-r from-red-500 to-orange-500">Modifier la Salle</DialogTitle>
          <DialogDescription className="text-muted-foreground">Mettez à jour les informations de {gym.gymName}.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input name="name" value={formData.name} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg" required />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input name="adminEmail" type="email" value={formData.adminEmail} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg" required />
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
          <div className="space-y-2">
            <Label className="text-muted-foreground">Statut</Label>
            <div className="flex items-center gap-4">
              <Button type="button" variant="ghost" onClick={toggleStatus} className="flex items-center gap-2 text-lg">
                {formData.status === 'active' ? <ToggleRight className="w-10 h-10 text-green-500" /> : <ToggleLeft className="w-10 h-10 text-muted-foreground" />}
                <span className={formData.status === 'active' ? 'text-green-500' : 'text-muted-foreground'}>
                  {formData.status === 'active' ? 'Active' : 'Désactivée'}
                </span>
              </Button>
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="submit" className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditGymDialog;
