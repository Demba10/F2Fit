import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function ViewSwitcher({ view, setView }) {
  return (
    <div className="flex items-center p-1 bg-background/50 rounded-lg border border-border">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setView('card')}
        className={cn(
          'gap-2',
          view === 'card' && 'bg-primary/10 text-primary'
        )}
      >
        <LayoutGrid className="w-4 h-4" />
        Cartes
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setView('table')}
        className={cn(
          'gap-2',
          view === 'table' && 'bg-primary/10 text-primary'
        )}
      >
        <List className="w-4 h-4" />
        Tableau
      </Button>
    </div>
  );
}

export default ViewSwitcher;