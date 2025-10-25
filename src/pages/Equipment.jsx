import React, { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, Edit, Trash2, Dumbbell } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import AddEquipmentDialog from '@/components/equipment/AddEquipmentDialog';
import { useToast } from '@/components/ui/use-toast';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import EquipmentCard from '@/components/equipment/EquipmentCard';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { motion } from 'framer-motion';

function Equipment() {
  const [view, setView] = useState('card');
  const [equipment, setEquipment] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingEquipmentId, setDeletingEquipmentId] = useState(null);
  const { toast } = useToast();

  useEffect(() => { loadEquipment(); }, []);

  const loadEquipment = () => setEquipment(JSON.parse(localStorage.getItem('f2fit_equipment') || '[]'));

  const handleAddEquipment = (equipmentData) => {
    const newEquipment = { id: Date.now().toString(), ...equipmentData, createdAt: new Date().toISOString() };
    const updatedEquipment = [...equipment, newEquipment];
    setEquipment(updatedEquipment);
    localStorage.setItem('f2fit_equipment', JSON.stringify(updatedEquipment));
    toast({ title: "Équipement ajouté !", description: `${equipmentData.name} a été ajouté avec succès.` });
    setIsAddDialogOpen(false);
  };
  
  const handleOpenEditDialog = (item) => {
    toast({title: "Bientôt disponible!", description: "La modification des équipements sera bientôt possible."});
  }

  const handleOpenDeleteDialog = (id) => {
    setDeletingEquipmentId(id);
    setIsDeleteDialogOpen(true);
  }

  const handleDeleteEquipment = () => {
    const updatedEquipment = equipment.filter(e => e.id !== deletingEquipmentId);
    setEquipment(updatedEquipment);
    localStorage.setItem('f2fit_equipment', JSON.stringify(updatedEquipment));
    toast({ title: "Équipement supprimé", description: "L'équipement a été supprimé.", variant: "destructive" });
    setIsDeleteDialogOpen(false);
    setDeletingEquipmentId(null);
  };

  const handleExport = (format) => {
    toast({
      title: '🚧 Exportation en cours...',
      description: `Préparation de l'exportation des ${filteredEquipment.length} équipements en format ${format}. Cette fonctionnalité est en cours de développement. 🚀`,
    });
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });
  
  const getStatusInfo = (status) => {
      switch(status) {
          case 'En service': return { text: 'En service', color: 'text-green-500' };
          case 'En maintenance': return { text: 'En Maintenance', color: 'text-orange-400' };
          case 'Hors service': return { text: 'Hors Service', color: 'text-red-500' };
          default: return { text: 'Inconnu', color: 'text-gray-400' };
      }
  };

  const columns = [
    { accessorKey: 'name', header: 'Nom', cell: ({ row: { original } }) => <div className="font-medium text-foreground">{original.name}</div> },
    { accessorKey: 'quantity', header: 'Quantité' },
    { accessorKey: 'status', header: 'Statut', cell: ({ row: { original } }) => {
      const status = getStatusInfo(original.status);
      return <div className={`flex items-center gap-2 font-medium ${status.color}`}><span className={`h-2 w-2 rounded-full ${status.color.replace('text-','bg-')}`}></span>{status.text}</div>;
    }},
    { accessorKey: 'lastMaintenance', header: 'Dern. Maintenance', cell: ({ row: { original } }) => original.lastMaintenance ? new Date(original.lastMaintenance).toLocaleDateString('fr-FR') : 'N/A' },
    { accessorKey: 'actions', header: '', cell: ({ row: { original } }) => (
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="w-8 h-8"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleOpenEditDialog(original)}><Edit className="w-4 h-4 mr-2" />Modifier</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOpenDeleteDialog(original.id)} className="text-red-500 focus:text-red-500"><Trash2 className="w-4 h-4 mr-2" />Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )},
  ];
  
  const filterComponent = (
     <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input type="text" placeholder="Rechercher un équipement..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-background/50 border border-border rounded-lg" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full md:w-auto px-4 py-2 bg-background/50 border border-border rounded-lg">
            <option value="all">Tous les statuts</option>
            <option value="En service">En service</option>
            <option value="En maintenance">En maintenance</option>
            <option value="Hors service">Hors service</option>
        </select>
     </div>
  );

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader 
          title="Équipements"
          description="Gérez votre inventaire et la maintenance du matériel."
          actionButton={
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white">
              <Plus className="w-4 h-4" /> Nouvel Équipement
            </Button>
          }
          view={view}
          setView={setView}
          onExport={handleExport}
        />

        {view === 'table' ? (
            <DataTable columns={columns} data={filteredEquipment} filterComponent={filterComponent} />
        ) : (
            <>
              <div className="pb-4 border-b border-border/50">{filterComponent}</div>
              {filteredEquipment.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredEquipment.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <EquipmentCard equipment={item} onDelete={handleOpenDeleteDialog} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-secondary rounded-xl border border-border/50">
                    <Dumbbell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Aucun équipement trouvé</h3>
                    <p className="text-muted-foreground">Essayez d'ajuster vos filtres ou d'ajouter un nouvel équipement.</p>
                </div>
              )}
            </>
        )}

        <AddEquipmentDialog isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} onAdd={handleAddEquipment} />
        <ConfirmationDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} onConfirm={handleDeleteEquipment} title="Supprimer l'équipement ?" description="Cette action est irréversible. Êtes-vous sûr ?" />
      </div>
    </Layout>
  );
}

export default Equipment;