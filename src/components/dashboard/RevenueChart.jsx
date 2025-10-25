import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { useAuth, getGymDataKey } from '@/contexts/AuthContext';

function RevenueChart() {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState('monthly');
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!user || !user.gymId) return;

    const subscriptionsKey = getGymDataKey('subscriptions', user.gymId);
    const subs = JSON.parse(localStorage.getItem(subscriptionsKey) || '[]');
    const now = new Date("2025-10-23");
    let chartData = [];

    if (timeframe === 'weekly') {
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - (i * 7));
        const weekEnd = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 6);
        const revenue = subs
          .filter(s => {
            const subDate = new Date(s.startDate);
            return subDate >= weekStart && subDate <= weekEnd;
          })
          .reduce((sum, s) => sum + s.price, 0);
        chartData.push({ name: `S-${4-i}`, revenue });
      }
    } else if (timeframe === 'yearly') {
      const currentYear = now.getFullYear();
      for (let i = 2; i >= 0; i--) {
          const year = currentYear - i;
          const revenue = subs
              .filter(s => new Date(s.startDate).getFullYear() === year)
              .reduce((sum, s) => sum + s.price, 0);
          chartData.push({ name: `${year}`, revenue });
      }
    } else { // monthly
      const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const month = date.getMonth();
        const year = date.getFullYear();
        const revenue = subs
          .filter(s => {
            const subDate = new Date(s.startDate);
            return subDate.getMonth() === month && subDate.getFullYear() === year;
          })
          .reduce((sum, s) => sum + s.price, 0);
        chartData.push({ name: monthNames[month], revenue });
      }
    }
    setData(chartData);
  }, [timeframe, user]);


  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-secondary/80 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg">
          <p className="label font-semibold text-foreground">{label}</p>
          <p className="intro text-primary">{`Revenus : ${payload[0].value.toLocaleString()} FCFA`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-secondary rounded-xl shadow-lg border border-border/50 p-6 h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h3 className="text-lg font-semibold text-foreground">Aperçu des Revenus</h3>
        <div className="flex items-center p-1 bg-background/50 rounded-lg border border-border">
          <Button size="sm" variant={timeframe === 'weekly' ? 'default' : 'ghost'} onClick={() => setTimeframe('weekly')} className="text-xs">Semaine</Button>
          <Button size="sm" variant={timeframe === 'monthly' ? 'default' : 'ghost'} onClick={() => setTimeframe('monthly')} className="text-xs">Mois</Button>
          <Button size="sm" variant={timeframe === 'yearly' ? 'default' : 'ghost'} onClick={() => setTimeframe('yearly')} className="text-xs">Année</Button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#f97316" stopOpacity={0.4}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${(value / 1000)}k`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(239, 68, 68, 0.1)' }} />
          <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenueChart;