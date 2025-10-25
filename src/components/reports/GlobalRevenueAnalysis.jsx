import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = {
  starter: '#f97316', // Orange
  pro: '#a855f7', // Purple
  premium: '#ec4899', // Pink
};
const PLAN_NAMES = {
  starter: 'Starter',
  pro: 'Pro',
  premium: 'Premium',
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-3 bg-secondary/80 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg text-sm">
        <p className="label text-foreground font-bold">{data.name}</p>
        <p className="intro" style={{ color: data.fill }}>{`Salles : ${data.value}`}</p>
        <p className="text-muted-foreground">{`Revenu mensuel estimé : ${(data.revenue).toLocaleString()} FCFA`}</p>
      </div>
    );
  }
  return null;
};

function GlobalRevenueAnalysis() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const allUsers = JSON.parse(localStorage.getItem('f2fit_users') || '[]');
        const defaultPlans = JSON.parse(localStorage.getItem('f2fit_default_plans') || '[]');
        const gymAdmins = allUsers.filter(u => u.role === 'gym-admin');

        const planData = {};
        defaultPlans.forEach(p => {
          planData[p.id] = p;
        });

        // Initialize plan counts based on the default plans from landing page
        const planCounts = {
          starter: { count: 0, revenue: 0, price: 10000 },
          pro: { count: 0, revenue: 0, price: 25000 },
          premium: { count: 0, revenue: 0, price: 50000 },
        };
        
        gymAdmins.forEach(admin => {
            if (admin.plan && planCounts[admin.plan]) {
                planCounts[admin.plan].count++;
                planCounts[admin.plan].revenue += planCounts[admin.plan].price;
            }
        });
        
        const chartData = Object.keys(planCounts).map(planKey => ({
            name: PLAN_NAMES[planKey],
            value: planCounts[planKey].count,
            revenue: planCounts[planKey].revenue,
            fill: COLORS[planKey],
        })).filter(d => d.value > 0);

        setData(chartData);
    }, []);

  return (
    <div className="bg-secondary rounded-xl shadow-lg border border-border/50 p-6 h-full">
      <h3 className="text-lg font-semibold text-foreground mb-4">Répartition des Abonnements</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            innerRadius={60}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={5}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GlobalRevenueAnalysis;