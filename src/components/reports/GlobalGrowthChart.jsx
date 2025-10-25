import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth, getGymDataKey } from '@/contexts/AuthContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-secondary/80 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg">
        <p className="label font-semibold text-foreground">{label}</p>
        <p className="intro text-green-400">{`Nouvelles Salles : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

function GlobalGrowthChart({ period }) {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const gymsDataKey = user ? getGymDataKey('gyms', user.gymId) : null;

  useEffect(() => {
    if (!gymsDataKey) return;

    const allUsers = JSON.parse(localStorage.getItem(gymsDataKey) || '[]').filter(u => u.role === 'gym-admin');
    const growthData = {};
    const today = new Date("2025-10-24");
    const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
    
    allUsers.forEach(admin => {
        if (admin.createdAt) {
            const date = new Date(admin.createdAt);
            let key;
            if (period === 'year') {
                key = monthNames[date.getMonth()];
            } else if (period === 'month') {
                key = `Sem ${Math.ceil(date.getDate() / 7)}`;
            } else { // week, day
                key = date.toLocaleDateString('fr-FR', { weekday: 'short' });
            }
            if (!growthData[key]) {
                growthData[key] = 0;
            }
            growthData[key]++;
        }
    });
    
    let chartData = [];
    if (period === 'year') {
        chartData = monthNames.map(month => ({ name: month, gyms: growthData[month] || 0 }));
    } else if (period === 'month') {
        chartData = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'].map(week => ({ name: week, gyms: growthData[week] || 0 }));
    } else { // week or day
        const weekDays = ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.'];
        chartData = weekDays.map(day => ({ name: day, gyms: growthData[day] || 0 }));
    }
    
    setData(chartData);
  }, [period, gymsDataKey]);

  return (
    <div className="bg-secondary rounded-xl shadow-lg border border-border/50 p-6 h-full">
      <h3 className="text-lg font-semibold text-foreground mb-4">Croissance des Salles (Nouveaux Comptes)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
           <defs>
            <linearGradient id="colorGyms" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(34, 197, 94, 0.1)' }}/>
          <Area type="monotone" dataKey="gyms" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorGyms)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GlobalGrowthChart;