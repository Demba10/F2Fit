import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ViewSwitcher from '@/components/ViewSwitcher';

function PageHeader({ title, description, actionButton, view, setView, onExport, showExport = true }) {

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gradient bg-gradient-to-r from-red-500 to-orange-500">{title}</h1>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {setView && <ViewSwitcher view={view} setView={setView} />}
        {showExport && onExport && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onExport('csv')}>Exporter en CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport('xlsx')}>Exporter en Excel</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport('pdf')}>Exporter en PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {actionButton}
      </div>
    </div>
  );
}

export default PageHeader;