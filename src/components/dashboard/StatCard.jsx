import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

function StatCard({ icon: Icon, title, value, color = 'text-primary' }) {
  return (
    <motion.div
      className="bg-secondary rounded-xl shadow-lg border border-border/50 p-6 flex items-center gap-6"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className={`p-4 rounded-lg bg-gradient-to-br from-red-500/10 to-orange-500/10 ${color}`}>
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-foreground">{value}</p>
      </div>
    </motion.div>
  );
}

export default StatCard;