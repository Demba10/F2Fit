

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import GlobalGrowthChart from '@/components/reports/GlobalGrowthChart';
import GlobalRevenueAnalysis from '@/components/reports/GlobalRevenueAnalysis';
import StatCard from '@/components/dashboard/StatCard';
import { Building, TrendingUp, TrendingDown, Clock, Download, Tags, Wallet, Settings } from 'lucide-react';
import { useAuth, getGymDataKey } from '@/contexts/AuthContext';
import ReportFilters from '@/components/admin/ReportFilters';
import { exportData } from '@/lib/export';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'; // Added imports

const quickAccessItems = [
    { title: 'Gérer les Salles', description: 'Ajoutez, modifiez ou désactivez des salles.', path: '/gyms', icon: Building },
    { title: 'Gérer les Tarifs', description: 'Définissez les plans d\'abonnement globaux.', path: '/admin/tariffs', icon: Tags },
    { title: 'Paramètres', description: 'Configurez les options de la plateforme.', path: '#', icon: Settings },
];

function AdminDashboard() {
  const { user } = useAuth();
  const [period, setPeriod] = useState('month');
  const [reportData, setReportData] = useState({
    totalGyms: 0,
    activeGyms: 0,
    deactivatedGyms: 0,
    totalRevenue: 0,
    totalTariffs: 0,
    expiredSubscriptions: 0
  });

  const { toast } = useToast();
  const gymsDataKey = user ? getGymDataKey('gyms', user.gymId) : null;
  const tariffsDataKey = user ? getGymDataKey('tariffs', user.gymId) : null;

  useEffect(() => {
    if (!gymsDataKey || !tariffsDataKey) return;

    const allUsers = JSON.parse(localStorage.getItem(gymsDataKey) || '[]').filter(u => u.role === 'gym-admin');
    const allTariffs = JSON.parse(localStorage.getItem(tariffsDataKey) || '[]');
    
    const today = new Date("2025-10-24");
    
    const activeGymsCount = allUsers.filter(g => g.status === 'active').length;
    const deactivatedGymsCount = allUsers.filter(g => g.status === 'disabled').length;
    const expiredSubscriptionsCount = allUsers.filter(g => g.status === 'active' && new Date(g.subscriptionEndDate) < today).length;

    const planPrices = { starter: 10000, pro: 25000, premium: 50000 };
    const totalRevenue = allUsers
        .filter(g => g.status === 'active' && g.plan && planPrices[g.plan])
        .reduce((acc, gym) => acc + planPrices[gym.plan], 0);

    setReportData({
      totalGyms: allUsers.length,
      activeGyms: activeGymsCount,
      deactivatedGyms: deactivatedGymsCount,
      totalRevenue: totalRevenue,
      totalTariffs: allTariffs.length,
      expiredSubscriptions: expiredSubscriptionsCount
    });

  }, [period, gymsDataKey, tariffsDataKey]);
  
  const handleExport = (format) => {
    const dataToExport = [
      { metric: 'Salles Totales', value: reportData.totalGyms },
      { metric: 'Salles Actives', value: reportData.activeGyms },
      { metric: 'Salles Désactivées', value: reportData.deactivatedGyms },
      { metric: 'Revenus Mensuels Estimés (FCFA)', value: reportData.totalRevenue },
      { metric: 'Nombre de Tarifs Globaux', value: reportData.totalTariffs },
      { metric: 'Abonnements Expirés', value: reportData.expiredSubscriptions }
    ];
    const columns = [
      { header: 'Métrique', accessorKey: 'metric' },
      { header: 'Valeur', accessorKey: 'value' }
    ];
    exportData(format, dataToExport, columns, 'dashboard-super-admin', `Rapport du Tableau de Bord Super Admin`);
    toast({ title: "Exportation réussie !", description: `Le rapport a été exporté en ${format.toUpperCase()}.` });
  };
  
  const handleFutureFeatureClick = (e, path) => {
    if (path === '#') {
      e.preventDefault();
      toast({
        title: "🚧 Bientôt disponible !",
        description: "Cette fonctionnalité est en cours de développement. Revenez bientôt ! 🚀",
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <PageHeader 
          title="Tableau de Bord Super Admin"
          description="Vue d'ensemble et gestion de la plateforme F2FitManager."
          showExport={false}
        />
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            <StatCard icon={Building} title="Salles Actives" value={reportData.activeGyms} />
            <StatCard icon={Wallet} title="Revenus Mensuels" value={`${(reportData.totalRevenue/1000).toFixed(0)}K`} color="text-green-500" />
            <StatCard icon={Clock} title="Abon. Expirés" value={reportData.expiredSubscriptions} color="text-red-500" />
        </div>
        
        {/* Quick Access Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickAccessItems.map((item, index) => (
            <motion.div key={index} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Link to={item.path} onClick={(e) => handleFutureFeatureClick(e, item.path)}>
                <Card className="h-full bg-secondary border-border/50 hover:border-primary/50 transition-colors duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                    </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Charts & Reports Section */}
        <Card className="bg-secondary border-border/50 shadow-lg">
            <CardHeader className="flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <CardTitle>Rapports de la Plateforme</CardTitle>
                    <CardDescription>Analyse de la croissance et des revenus globaux.</CardDescription>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center gap-4">
                    <ReportFilters setPeriod={setPeriod} />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Exporter
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleExport('csv')}>Exporter en CSV</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExport('xlsx')}>Exporter en Excel</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExport('pdf')}>Exporter en PDF</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                 <GlobalGrowthChart period={period} />
                 <GlobalRevenueAnalysis />
            </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default AdminDashboard;

