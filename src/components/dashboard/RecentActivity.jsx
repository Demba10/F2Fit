import React from 'react';
import { UserPlus, CreditCard, Calendar, Award } from 'lucide-react';

const activities = [
  {
    id: 1, icon: UserPlus, title: 'Nouveau membre : Amadou Diallo', time: 'Il y a 2h', color: 'text-blue-400 bg-blue-400/10'
  },
  {
    id: 2, icon: CreditCard, title: 'Paiement reçu : 25,000 FCFA de Fatou Sow', time: 'Il y a 4h', color: 'text-green-400 bg-green-400/10'
  },
  {
    id: 3, icon: Award, title: 'Badge débloqué : "Lève-tôt" par Ibrahima Gueye', time: 'Il y a 5h', color: 'text-yellow-400 bg-yellow-400/10'
  },
  {
    id: 4, icon: Calendar, title: 'Nouveau cours : "Zumba Intense" ajouté', time: 'Il y a 6h', color: 'text-purple-400 bg-purple-400/10'
  },
];

function RecentActivity() {
  return (
    <div className="bg-secondary rounded-xl shadow-lg border border-border/50 p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Activité Récente</h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-center gap-4">
              <div className={`p-2.5 rounded-full ${activity.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RecentActivity;