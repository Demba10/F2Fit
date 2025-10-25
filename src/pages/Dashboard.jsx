
import React, { useState, useEffect } from 'react';
import { Users, UserCheck, DollarSign, AlertCircle, Dumbbell } from 'lucide-react';
import Layout from '@/components/Layout';
import StatCard from '@/components/dashboard/StatCard';
import RevenueChart from '@/components/dashboard/RevenueChart';
import RecentActivity from '@/components/dashboard/RecentActivity';
import UpcomingClasses from '@/components/dashboard/UpcomingClasses';
import PageHeader from '@/components/PageHeader';
import { useAuth, getGymDataKey } from '@/contexts/AuthContext';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalCoaches: 0,
    totalClasses: 0,
    expiringSubscriptions: 0
  });

  useEffect(() => {
    if (!user || !user.gymId) return;

    const membersKey = getGymDataKey('members', user.gymId);
    const coachesKey = getGymDataKey('coaches', user.gymId);
    const classesKey = getGymDataKey('classes', user.gymId);
    const subscriptionsKey = getGymDataKey('subscriptions', user.gymId);

    const members = JSON.parse(localStorage.getItem(membersKey) || '[]');
    const coaches = JSON.parse(localStorage.getItem(coachesKey) || '[]');
    const classes = JSON.parse(localStorage.getItem(classesKey) || '[]');
    const subscriptions = JSON.parse(localStorage.getItem(subscriptionsKey) || '[]');
    
    const activeSubs = subscriptions.filter(s => {
      const today = new Date("2025-10-24");
      const endDate = new Date(s.endDate);
      return endDate >= today;
    });

    const today = new Date("2025-10-24");
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const expiringCount = activeSubs.filter(s => {
      const endDate = new Date(s.endDate);
      return endDate >= today && endDate <= nextWeek;
    }).length;

    setStats({
      totalMembers: members.length,
      totalCoaches: coaches.length,
      totalClasses: classes.length,
      expiringSubscriptions: expiringCount
    });
  }, [user]);

  return (
    <Layout>
      <div className="space-y-8">
        <PageHeader 
          title="Tableau de Bord"
          description={`Vue d'ensemble de la performance de ${user?.gymName || 'votre salle'}.`}
          showExport={false}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Membres Totaux" value={stats.totalMembers} icon={Users} color="red" trend="+12%" linkTo="/members" />
          <StatCard title="Coachs" value={stats.totalCoaches} icon={UserCheck} color="green" trend="+2" linkTo="/coaches" />
          <StatCard title="Cours Planifiés" value={stats.totalClasses} icon={Dumbbell} color="purple" trend="+5" linkTo="/classes" />
          <StatCard title="Abonnements Expirant" value={stats.expiringSubscriptions} icon={AlertCircle} color="orange" trend="dans les 7 jours" linkTo="/subscriptions" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <RevenueChart />
          </div>
          <div className="lg:col-span-2">
            <UpcomingClasses />
          </div>
        </div>

        <div className="grid grid-cols-1">
          <RecentActivity />
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
