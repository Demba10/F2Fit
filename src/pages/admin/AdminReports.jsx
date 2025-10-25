import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import GlobalGrowthChart from '@/components/reports/GlobalGrowthChart';
import GlobalRevenueAnalysis from '@/components/reports/GlobalRevenueAnalysis';
import StatCard from '@/components/dashboard/StatCard';
import { Building, TrendingUp, TrendingDown, Clock, Download } from 'lucide-react';
import { useAuth, getGymDataKey } from '@/contexts/AuthContext';
import ReportFilters from '@/components/admin/ReportFilters';
import { exportData } from '@/lib/export';
import { useToast } from '@/components/ui/use-toast';

function AdminReports() {
  const { user } = useAuth();
  const [period, setPeriod] = useState('month');
  const [reportData, setReportData] = useState({
    activeGyms: 0,
    deactivatedGyms: 0,
    newGyms: 0,
    expiredSubscriptions: 0
  });

  const { toast } = useToast();
  const gymsDataKey = user ? getGymDataKey('gyms', user.gymId) : null;

  useEffect(() => {
    if (!gymsDataKey) return;

    const allUsers = JSON.parse(localStorage.getItem(gymsDataKey) || '[]').filter(u => u.role === 'gym-admin');

    const today = new Date("2025-10-24");
    let startDate;

    switch (period) {
      case 'day':
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        break;
      case 'week':
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
        break;
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(0); // Epoch for all time
    }

    const filteredGyms = allUsers.filter(gym => new Date(gym.createdAt) >= startDate);

    const newGymsCount = filteredGyms.length;
    const activeGymsCount = allUsers.filter(g => g.status === 'active').length;
    const deactivatedGymsCount = allUsers.filter(g => g.status === 'disabled').length;
    const expiredSubscriptionsCount = allUsers.filter(g => g.status === 'active' && new Date(g.subscriptionEndDate) < today).length;

    setReportData({
      activeGyms: activeGymsCount,
      deactivatedGyms: deactivatedGymsCount,
      newGyms: newGymsCount,
      expiredSubscriptions: expiredSubscriptionsCount
    });

  }, [period, gymsDataKey]);
  
  const handleExport = (format) => {
    const dataToExport = [
      { metric: 'Salles Actives', value: reportData.activeGyms },
      { metric: 'Salles Désactivées', value: reportData.deactivatedGyms },
      { metric: `Nouvelles Salles (${period})`, value: reportData.newGyms },
      { metric: 'Abonnements Expirés', value: reportData.expiredSubscriptions }
    ];
    const columns = [
      { header: 'Métrique', accessorKey: 'metric' },
      { header: 'Valeur', accessorKey: 'value' }
    ];
    exportData(format, dataToExport, columns, 'rapport-global', `Rapport Global - Période: ${period}`);
    toast({ title: "Exportation réussie !", description: `Le rapport a été exporté en ${format.toUpperCase()}.` });
  };


  return (
    <Layout>
      <div className="space-y-8">
        <PageHeader 
          title="Rapports Globaux"
          description="Vue d'ensemble de la performance de F2FitManager."
          actionButton={<ReportFilters setPeriod={setPeriod} />}
          onExport={handleExport}
          showViewSwitcher={false}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={Building} title="Salles Actives" value={reportData.activeGyms} />
            <StatCard icon={TrendingUp} title={`Nouvelles Salles (${period})`} value={reportData.newGyms} color="text-green-500" />
            <StatCard icon={TrendingDown} title="Salles Désactivées" value={reportData.deactivatedGyms} color="text-orange-500" />
            <StatCard icon={Clock} title="Abonnements Expirés" value={reportData.expiredSubscriptions} color="text-red-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <GlobalGrowthChart period={period} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <GlobalRevenueAnalysis />
          </motion.div>
        </div>
        
      </div>
    </Layout>
  );
}

export default AdminReports;