import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const data = [
  { month: 'Jan', members: 65 },
  { month: 'Fév', members: 72 },
  { month: 'Mar', members: 80 },
  { month: 'Avr', members: 85 },
  { month: 'Mai', members: 92 },
  { month: 'Juin', members: 105 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-secondary/80 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg">
        <p className="label font-semibold text-foreground">{label}</p>
        <p className="intro text-green-400">{`Nouveaux Membres : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

function MembershipGrowthChart({ timeframe }) {
  // Mock data based on timeframe
  const getData = () => {
    switch (timeframe) {
      case 'daily':
        return [{ name: 'Aujourd\'hui', members: 5 }];
      case 'weekly':
        return [{ name: 'Cette Semaine', members: 25 }];
      case 'yearly':
        return [{ name: 'Cette Année', members: 450 }];
      case 'monthly':
      default:
        return data;
    }
  };
  const currentData = getData();

  return (
    <div className="bg-secondary rounded-xl shadow-lg border border-border/50 p-6 h-full">
      <h3 className="text-lg font-semibold text-foreground mb-4">Croissance des Membres</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={currentData}>
           <defs>
            <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis dataKey="month" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(34, 197, 94, 0.1)' }}/>
          <Area type="monotone" dataKey="members" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorMembers)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MembershipGrowthChart;