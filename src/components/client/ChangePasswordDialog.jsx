
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
import { Lock } from 'lucide-react';

function ChangePasswordDialog({ isOpen, onSave, isFirstLogin = false }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();

  const handleSave = () => {
    if (password.length < 6) {
      toast({
        title: "Mot de passe trop court",
        description: "Votre mot de passe doit contenir au moins 6 caractères.",
        variant: "destructive"
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Mots de passe différents",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive"
      });
      return;
    }
    onSave(password);
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={!isFirstLogin ? undefined : () => {}}>
      <DialogContent className="sm:max-w-md bg-secondary border-border/50 rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gradient bg-gradient-to-r from-red-500 to-orange-500">
            {isFirstLogin ? "Sécurisez votre compte" : "Changer de mot de passe"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isFirstLogin 
              ? "Pour votre sécurité, veuillez définir un nouveau mot de passe personnel."
              : "Entrez un nouveau mot de passe pour votre compte."
            }
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input 
              type="password" 
              placeholder="Nouveau mot de passe" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input 
              type="password" 
              placeholder="Confirmez le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} 
              className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white">
            Enregistrer le mot de passe
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ChangePasswordDialog;
