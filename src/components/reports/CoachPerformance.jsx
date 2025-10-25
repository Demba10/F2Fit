import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Aïcha N.', hours: 45 },
  { name: 'Moussa S.', hours: 52 },
  { name: 'Mariama F.', hours: 48 },
  { name: 'Abdou K.', hours: 61 },
  { name: 'Pape D.', hours: 55 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-secondary/80 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg">
        <p className="label font-semibold text-foreground">{label}</p>
        <p className="intro text-purple-400">{`Heures : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

function CoachPerformance({ timeframe }) {
  return (
    <div className="bg-secondary rounded-xl shadow-lg border border-border/50 p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Performance des Coachs (Heures/{timeframe})</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
           <defs>
            <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#d946ef" stopOpacity={0.4}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(168, 85, 247, 0.1)' }} />
          <Bar dataKey="hours" fill="url(#colorHours)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CoachPerformance;