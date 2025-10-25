
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

function AddClassDialog({ isOpen, onClose, onAdd }) {
  const { user } = useAuth();
  const [coaches, setCoaches] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('Collectif');
  const [selectedCoach, setSelectedCoach] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && user?.gymId) {
      const coachesDataKey = getGymDataKey('coaches', user.gymId);
      const storedCoaches = JSON.parse(localStorage.getItem(coachesDataKey) || '[]');
      setCoaches(storedCoaches);
    }
  }, [isOpen, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !selectedCoach || !date || !time || !maxParticipants) {
        toast({ title: "Champs requis", description: "Veuillez remplir tous les champs.", variant: "destructive" });
        return;
    }
    const coachName = coaches.find(c => c.id === selectedCoach)?.name;
    onAdd({ name, type, coachId: selectedCoach, coachName, date, time, maxParticipants: Number(maxParticipants), participants: 0 });
    setName('');
    setType('Collectif');
    setSelectedCoach('');
    setDate('');
    setTime('');
    setMaxParticipants('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-secondary border-border/50 rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gradient bg-gradient-to-r from-red-500 to-orange-500">Nouveau Cours</DialogTitle>
          <DialogDescription className="text-muted-foreground">Planifiez un nouveau cours.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="class-name" className="text-muted-foreground">Nom du cours</Label>
            <input id="class-name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="class-type" className="text-muted-foreground">Type</Label>
                <select id="class-type" value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground">
                    <option>Collectif</option>
                    <option>Individuel</option>
                </select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="class-coach" className="text-muted-foreground">Coach</Label>
                <select id="class-coach" value={selectedCoach} onChange={(e) => setSelectedCoach(e.target.value)} className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground" required>
                <option value="">Sélectionner</option>
                {coaches.map(coach => <option key={coach.id} value={coach.id}>{coach.name}</option>)}
                </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="class-date" className="text-muted-foreground">Date</Label>
              <input id="class-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class-time" className="text-muted-foreground">Heure</Label>
              <input id="class-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground" required />
            </div>
          </div>
           <div className="space-y-2">
            <Label htmlFor="max-participants" className="text-muted-foreground">Places maximum</Label>
            <input id="max-participants" type="number" value={maxParticipants} onChange={(e) => setMaxParticipants(e.target.value)} className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground" required />
          </div>
          <DialogFooter className="pt-4">
            <Button type="submit" className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white">Ajouter Cours</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddClassDialog;
