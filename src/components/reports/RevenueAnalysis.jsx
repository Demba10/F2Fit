import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Abonnements', value: 400000 },
  { name: 'Cours Part.', value: 120000 },
  { name: 'Produits', value: 80000 },
];

const COLORS = ['#a855f7', '#ec4899', '#f97316'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-secondary/80 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg">
        <p className="label text-foreground">{`${payload[0].name} : ${payload[0].value.toLocaleString()} FCFA (${payload[0].payload.percent}%)`}</p>
      </div>
    );
  }
  return null;
};

function RevenueAnalysis({ timeframe }) {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  const dataWithPercent = data.map(entry => ({...entry, percent: ((entry.value / total) * 100).toFixed(0)}));

  return (
    <div className="bg-secondary rounded-xl shadow-lg border border-border/50 p-6 h-full">
      <h3 className="text-lg font-semibold text-foreground mb-4">Analyse des Revenus ({timeframe})</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={dataWithPercent}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            innerRadius={70}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={5}
            label={({ name, percent }) => `${name} ${percent}%`}
          >
            {dataWithPercent.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenueAnalysis;