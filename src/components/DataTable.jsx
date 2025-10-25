
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

function DataTable({ columns, data, filterComponent, pagination, onPageChange }) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = pagination?.rowsPerPage || 10;
  
  const totalItems = pagination ? pagination.total : data.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  
  const page = pagination ? pagination.page : currentPage;
  
  const currentData = pagination ? data : data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const goToPage = (pageNumber) => {
    const newPage = Math.max(1, Math.min(pageNumber, totalPages));
    if (onPageChange) {
      onPageChange(newPage);
    } else {
      setCurrentPage(newPage);
    }
  };
  
  return (
    <div className="bg-secondary rounded-xl shadow-lg border border-border/50 p-4 sm:p-6 space-y-4">
      {filterComponent && <div className="pb-4 border-b border-border/50">{filterComponent}</div>}
      <div className="overflow-x-auto custom-scrollbar">
        <div className="rounded-md border border-border/50">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                {columns.map((column) => (
                  <TableHead key={column.accessorKey} className="font-semibold whitespace-nowrap">
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.length > 0 ? (
                currentData.map((rowItem, rowIndex) => (
                  <TableRow key={rowItem.id || rowIndex} className="border-border/50 hover:bg-background/50">
                    {columns.map((column) => (
                      <TableCell key={column.accessorKey} className="whitespace-nowrap">
                        {column.cell ? column.cell({ row: { original: rowItem } }) : rowItem[column.accessorKey]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    Aucun résultat.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 flex-wrap gap-4">
          <div className="text-sm text-muted-foreground">
            {`Page ${page} sur ${totalPages}`}
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => goToPage(1)}
              disabled={page === 1}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Précédent</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
            >
              <span className="hidden sm:inline">Suivant</span>
              <ChevronRight className="h-4 w-4 sm:ml-1" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => goToPage(totalPages)}
              disabled={page === totalPages}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
