import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useAuth, getGymDataKey } from '@/contexts/AuthContext';

function UpcomingClasses() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const { toast } = useToast();

  const classesDataKey = user ? getGymDataKey('classes', user.gymId) : null;

  useEffect(() => {
    if (classesDataKey) {
        loadUpcomingClasses();
    }
  }, [classesDataKey]);

  const loadUpcomingClasses = () => {
    if (!classesDataKey) return;
    
    const storedClasses = JSON.parse(localStorage.getItem(classesDataKey) || '[]');
    const today = new Date("2025-10-23");
    today.setHours(0, 0, 0, 0);

    const upcoming = storedClasses
      .filter(c => new Date(c.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date) || a.time.localeCompare(b.time))
      .slice(0, 3); // Show top 3 upcoming classes
    setClasses(upcoming);
  };

  const handleBooking = (classId) => {
    if (!classesDataKey) return;

    const allClasses = JSON.parse(localStorage.getItem(classesDataKey) || '[]');
    const classIndex = allClasses.findIndex(c => c.id === classId);

    if (classIndex === -1) {
      toast({
        title: "Erreur",
        description: "Ce cours n'a pas été trouvé.",
        variant: "destructive",
      });
      return;
    }

    const classToBook = allClasses[classIndex];

    if (classToBook.participants >= classToBook.maxParticipants) {
      toast({
        title: "Cours Complet",
        description: "Il n'y a plus de places pour ce cours.",
        variant: "destructive",
      });
      return;
    }

    allClasses[classIndex].participants += 1;
    localStorage.setItem(classesDataKey, JSON.stringify(allClasses));

    // Update state to re-render
    loadUpcomingClasses();

    toast({
      title: "Réservation confirmée !",
      description: `Vous êtes inscrit au cours de ${classToBook.name}.`,
    });
  };

  const getRelativeDate = (dateString) => {
    const today = new Date("2025-10-23");
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const classDate = new Date(dateString);
    classDate.setHours(0, 0, 0, 0);

    if (classDate.getTime() === today.getTime()) {
      return "Aujourd'hui";
    }
    if (classDate.getTime() === tomorrow.getTime()) {
      return 'Demain';
    }
    return new Date(dateString).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric' });
  };

  return (
    <div className="bg-secondary rounded-xl shadow-lg border border-border/50 p-6 h-full">
      <h3 className="text-lg font-semibold text-foreground mb-4">Cours à Venir</h3>
      <div className="space-y-4">
        {classes.length > 0 ? (
          classes.map((classItem) => (
            <div key={classItem.id} className="bg-background/50 rounded-lg p-4 transition-all hover:bg-background">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-foreground">{classItem.name}</h4>
                  <p className="text-xs text-muted-foreground">par {classItem.coachName}</p>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-medium">
                  {getRelativeDate(classItem.date)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Clock size={14} /> {classItem.time}</span>
                  <span className="flex items-center gap-1.5"><Users size={14} /> {classItem.participants}/{classItem.maxParticipants}</span>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleBooking(classItem.id)} disabled={classItem.participants >= classItem.maxParticipants}>
                  {classItem.participants >= classItem.maxParticipants ? 'Complet' : 'Réserver'}
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Aucun cours à venir pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UpcomingClasses;