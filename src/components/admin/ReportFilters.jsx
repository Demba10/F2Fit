import React from 'react';
import { Button } from '@/components/ui/button';

function ReportFilters({ setPeriod }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground mr-2">Filtrer par:</span>
      <Button variant="outline" size="sm" onClick={() => setPeriod('day')}>Aujourd'hui</Button>
      <Button variant="outline" size="sm" onClick={() => setPeriod('week')}>Cette Semaine</Button>
      <Button variant="outline" size="sm" onClick={() => setPeriod('month')}>Ce Mois</Button>
      <Button variant="outline" size="sm" onClick={() => setPeriod('year')}>Cette Année</Button>
    </div>
  );
}

export default ReportFilters;