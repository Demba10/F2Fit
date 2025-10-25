
import React, { useState, useEffect } from 'react';
import { UserPlus, Search, MoreVertical, Edit, Trash2, Mail, Users, MessageCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import AddCoachDialog from '@/components/coaches/AddCoachDialog';
import EditCoachDialog from '@/components/coaches/EditCoachDialog';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { useToast } from '@/components/ui/use-toast';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import CoachCard from '@/components/coaches/CoachCard';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { exportData } from '@/lib/export';
import { useAuth, getGymDataKey } from '@/contexts/AuthContext';

function Coaches() {
  const { user } = useAuth();
  const [view, setView] = useState('card');
  const [coaches, setCoaches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCoach, setEditingCoach] = useState(null);
  const [deletingCoachId, setDeletingCoachId] = useState(null);
  const { toast } = useToast();

  const coachesDataKey = user ? getGymDataKey('coaches', user.gymId) : null;

  useEffect(() => {
    if (user?.gymId) {
      loadCoaches();
    }
  }, [user]);

  const loadCoaches = () => {
    if (!coachesDataKey) return;
    const storedCoaches = JSON.parse(localStorage.getItem(coachesDataKey) || '[]');
    setCoaches(storedCoaches);
  };

  const handleAddCoach = (coachData) => {
    if (!coachesDataKey) return;
    const newCoach = { 
      id: `coach_${Date.now()}`, 
      ...coachData, 
      createdAt: new Date().toISOString(),
      gymId: user.gymId // Associate with current gym
    };
    const updatedCoaches = [...coaches, newCoach];
    localStorage.setItem(coachesDataKey, JSON.stringify(updatedCoaches));
    setCoaches(updatedCoaches);
    toast({ title: "Coach ajouté !", description: `${coachData.name} a été ajouté avec succès.` });
    setIsAddDialogOpen(false);
  };

  const handleOpenEditDialog = (coach) => {
    setEditingCoach(coach);
    setIsEditDialogOpen(true);
  };

  const handleUpdateCoach = (updatedCoachData) => {
    if (!coachesDataKey) return;
    const updatedCoaches = coaches.map(c => c.id === updatedCoachData.id ? { ...c, ...updatedCoachData } : c);
    localStorage.setItem(coachesDataKey, JSON.stringify(updatedCoaches));
    setCoaches(updatedCoaches);
    toast({ title: "Coach mis à jour !", description: `Les informations de ${updatedCoachData.name} ont été modifiées.` });
    setIsEditDialogOpen(false);
    setEditingCoach(null);
  };

  const handleOpenDeleteDialog = (coachId) => {
    setDeletingCoachId(coachId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCoach = () => {
    if (!coachesDataKey) return;
    const updatedCoaches = coaches.filter(c => c.id !== deletingCoachId);
    localStorage.setItem(coachesDataKey, JSON.stringify(updatedCoaches));
    setCoaches(updatedCoaches);
    toast({ title: "Coach supprimé", description: "Le coach a été supprimé.", variant: "destructive" });
    setIsDeleteDialogOpen(false);
    setDeletingCoachId(null);
  };

  const handleExport = (format) => {
    toast({
      title: 'Exportation en cours...',
      description: `Génération du fichier ${format.toUpperCase()}.`,
    });
    exportData(format, filteredCoaches, columns, 'coaches', 'Liste des Coachs');
  };

  const filteredCoaches = coaches.filter(coach =>
    coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coach.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coach.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const columns = [
    { accessorKey: 'name', header: 'Nom', cell: ({ row }) => <div className="font-medium text-foreground">{row.original.name}</div> },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'phone', header: 'Téléphone' },
    { accessorKey: 'specialties', header: 'Spécialités', cell: ({ row }) => row.original.specialties.join(', ') },
    { accessorKey: 'actions', header: '', cell: ({ row }) => (
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="w-8 h-8"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleOpenEditDialog(row.original)}><Edit className="w-4 h-4 mr-2" />Modifier</DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.location.href = `mailto:${row.original.email}`}><Mail className="w-4 h-4 mr-2" />Contacter</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOpenDeleteDialog(row.original.id)} className="text-red-500 focus:text-red-500"><Trash2 className="w-4 h-4 mr-2" />Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )},
  ];
  
  const filterComponent = (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
      <input type="text" placeholder="Rechercher par nom, email ou spécialité..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-background/50 border border-border rounded-lg" />
    </div>
  );

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader
          title="Coachs"
          description="Gérez votre équipe de coachs professionnels."
          actionButton={
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white">
              <UserPlus className="w-4 h-4" /> Ajouter un Coach
            </Button>
          }
          view={view}
          setView={setView}
          onExport={handleExport}
        />
        
        {view === 'table' ? (
          <DataTable columns={columns} data={filteredCoaches} filterComponent={filterComponent} />
        ) : (
          <>
            <div className="pb-4 border-b border-border/50">{filterComponent}</div>
            {filteredCoaches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCoaches.map((coach, index) => (
                    <motion.div
                        key={coach.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                    <CoachCard coach={coach} onDelete={handleOpenDeleteDialog} onEdit={handleOpenEditDialog} />
                    </motion.div>
                ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-secondary rounded-xl border border-border/50">
                    <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Aucun coach trouvé</h3>
                    <p className="text-muted-foreground">Essayez d'ajuster votre recherche ou d'ajouter un nouveau coach.</p>
                </div>
            )}
          </>
        )}

        <AddCoachDialog isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} onAdd={handleAddCoach} />
        {editingCoach && <EditCoachDialog isOpen={isEditDialogOpen} onClose={() => { setIsEditDialogOpen(false); setEditingCoach(null); }} onUpdate={handleUpdateCoach} coach={editingCoach} />}
        <ConfirmationDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} onConfirm={handleDeleteCoach} title="Supprimer le coach ?" description="Cette action est irréversible. Êtes-vous sûr de vouloir supprimer ce coach ?" />
      </div>
    </Layout>
  );
}

export default Coaches;
