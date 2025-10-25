
import React from 'react';
import { MoreVertical, PowerOff, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/DataTable';

const StatusBadge = ({ status }) => {
  const statusClasses = {
    active: 'bg-green-500/10 text-green-400',
    disabled: 'bg-gray-500/10 text-gray-400',
  };
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusClasses[status]}`}>
      {status === 'active' ? 'Active' : 'Désactivée'}
    </span>
  );
};

function GymsTable({ gyms, onEdit, onDeactivate, onDelete, onPageChange, pagination }) {
  const columns = [
    {
      header: 'Nom de la Salle',
      accessorKey: 'gymName',
      cell: ({ row }) => <span className="font-semibold">{row.original.gymName}</span>,
    },
    {
      header: 'Admin',
      accessorKey: 'name',
    },
    {
      header: 'Email Admin',
      accessorKey: 'email',
    },
    {
      header: 'Plan',
      accessorKey: 'plan',
      cell: ({ row }) => <span className="capitalize">{row.original.plan || 'N/A'}</span>,
    },
    {
      header: 'Statut',
      accessorKey: 'status',
      cell: ({ row }) => <StatusBadge status={row.original.status || 'active'} />,
    },
    {
      header: 'Abonnement Expire Le',
      accessorKey: 'subscriptionEndDate',
      cell: ({ row }) => {
        const isExpired = new Date(row.original.subscriptionEndDate) < new Date("2025-10-23");
        return (
          <span className={isExpired ? 'text-red-500 font-semibold' : ''}>
            {row.original.subscriptionEndDate ? new Date(row.original.subscriptionEndDate).toLocaleDateString() : 'N/A'}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(row.original)} className="gap-2"><Edit className="w-4 h-4" /> Modifier</DropdownMenuItem>
            {row.original.status === 'active' && <DropdownMenuItem onClick={() => onDeactivate(row.original.gymId)} className="gap-2 text-orange-500 focus:text-orange-500 focus:bg-orange-500/10">
              <PowerOff className="w-4 h-4" /> Désactiver
            </DropdownMenuItem>}
            {row.original.status === 'disabled' && (
                <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onDelete(row.original.gymId)} className="gap-2 text-red-500 focus:text-red-500 focus:bg-red-500/10">
                        <Trash2 className="w-4 h-4" /> Supprimer
                    </DropdownMenuItem>
                </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={gyms}
      pagination={pagination}
      onPageChange={onPageChange}
    />
  );
}

export default GymsTable;
