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
import { useAuth, getGymDataKey } from '@/contexts/AuthContext';

function AddSubscriptionDialog({ isOpen, onClose, onAdd }) {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [startDate, setStartDate] = useState(new Date("2025-10-23").toISOString().split('T')[0]);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && user?.gymId) {
      const membersDataKey = getGymDataKey('members', user.gymId);
      const plansDataKey = getGymDataKey('subscription_plans', user.gymId);
      
      const storedMembers = JSON.parse(localStorage.getItem(membersDataKey) || '[]');
      const storedPlans = JSON.parse(localStorage.getItem(plansDataKey) || '[]');
      
      setMembers(storedMembers);
      setPlans(storedPlans);
      
      // Reset form
      setSelectedMember('');
      setSelectedPlanId('');
      setStartDate(new Date("2025-10-23").toISOString().split('T')[0]);
    }
  }, [isOpen, user]);
  
  const handlePlanChange = (planId) => {
      setSelectedPlanId(planId);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMember || !selectedPlanId || !startDate) {
        toast({ title: "Champs requis", description: "Veuillez sélectionner un membre, un plan et une date de début.", variant: "destructive" });
        return;
    }
    
    if (!user?.gymId) return;
    const subscriptionsDataKey = getGymDataKey('subscriptions', user.gymId);
    const allSubscriptions = JSON.parse(localStorage.getItem(subscriptionsDataKey) || '[]');
    const memberHasActiveSub = allSubscriptions.some(sub => 
        sub.memberId === selectedMember && new Date(sub.endDate) >= new Date("2025-10-23")
    );

    if (memberHasActiveSub) {
        toast({ title: "Abonnement Actif Existant", description: "Ce membre a déjà un abonnement actif. Vous ne pouvez pas en ajouter un autre.", variant: "destructive" });
        return;
    }

    const member = members.find(m => m.id === selectedMember);
    const plan = plans.find(p => p.id === selectedPlanId);
    if(!member || !plan) {
        toast({ title: "Erreur", description: "Membre ou plan non trouvé.", variant: "destructive" });
        return;
    }

    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + plan.duration);

    onAdd({ 
      memberId: selectedMember, 
      memberName: member.name, 
      planName: plan.name,
      planId: plan.id,
      price: plan.price, 
      startDate: start.toISOString().split('T')[0], 
      endDate: end.toISOString().split('T')[0], 
      status: 'active' 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-secondary border-border/50 rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gradient bg-gradient-to-r from-red-500 to-orange-500">Nouvel Abonnement</DialogTitle>
          <DialogDescription className="text-muted-foreground">Créez un nouvel abonnement pour un membre existant.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="sub-member" className="text-muted-foreground">Membre</Label>
            <select id="sub-member" value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)} className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground" required>
              <option value="">Sélectionner un membre</option>
              {members.map(member => <option key={member.id} value={member.id}>{member.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sub-plan" className="text-muted-foreground">Plan d'abonnement</Label>
            <select id="sub-plan" value={selectedPlanId} onChange={(e) => handlePlanChange(e.target.value)} className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground" required>
              <option value="">Sélectionner un plan</option>
              {plans.map(plan => <option key={plan.id} value={plan.id}>{plan.name} - {plan.price.toLocaleString()} FCFA</option>)}
            </select>
          </div>
          <div className="space-y-2">
              <Label htmlFor="start-date" className="text-muted-foreground">Date de début</Label>
              <input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground" required />
          </div>

          {selectedPlanId && (
            <div className="p-4 bg-background/50 rounded-lg border border-border/80 text-sm space-y-2">
                <p className="font-semibold text-foreground">Détails du plan sélectionné :</p>
                <div className="flex justify-between"><span className="text-muted-foreground">Prix:</span> <span>{plans.find(p=>p.id === selectedPlanId)?.price.toLocaleString()} FCFA</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Durée:</span> <span>{plans.find(p=>p.id === selectedPlanId)?.duration} jours</span></div>
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button type="submit" className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white">Créer Abonnement</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddSubscriptionDialog;