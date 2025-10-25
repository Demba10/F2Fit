import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import MembershipGrowthChart from '@/components/reports/MembershipGrowthChart';
import RevenueAnalysis from '@/components/reports/RevenueAnalysis';
import CoachPerformance from '@/components/reports/CoachPerformance';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';

function Reports() {
  const [timeframe, setTimeframe] = useState('monthly');

  return (
    <Layout>
      <div className="space-y-8">
        <PageHeader 
          title="Rapports & Statistiques"
          description="Analysez les performances de votre salle en détail."
        />
        
        <div className="flex justify-end">
            <div className="flex items-center p-1 bg-secondary rounded-lg border border-border">
                <Button size="sm" variant={timeframe === 'daily' ? 'default' : 'ghost'} onClick={() => setTimeframe('daily')} className="text-xs">Jour</Button>
                <Button size="sm" variant={timeframe === 'weekly' ? 'default' : 'ghost'} onClick={() => setTimeframe('weekly')} className="text-xs">Semaine</Button>
                <Button size="sm" variant={timeframe === 'monthly' ? 'default' : 'ghost'} onClick={() => setTimeframe('monthly')} className="text-xs">Mois</Button>
                <Button size="sm" variant={timeframe === 'yearly' ? 'default' : 'ghost'} onClick={() => setTimeframe('yearly')} className="text-xs">Année</Button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <MembershipGrowthChart timeframe={timeframe} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <RevenueAnalysis timeframe={timeframe} />
          </motion.div>
        </div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <CoachPerformance timeframe={timeframe} />
        </motion.div>

      </div>
    </Layout>
  );
}

export default Reports;