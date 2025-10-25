
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Building, Search } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import GymCard from '@/components/gyms/GymCard';
import PageHeader from '@/components/PageHeader';
import AddGymDialog from '@/components/gyms/AddGymDialog';
import EditGymDialog from '@/components/gyms/EditGymDialog';
import GymsTable from '@/components/gyms/GymsTable';
import { exportData } from '@/lib/export';
import { useAuth, getGymDataKey } from '@/contexts/AuthContext';

const isSubscriptionExpired = (gym) => {
    if (!gym.subscriptionEndDate) return true; // No end date means expired
    const endDate = new Date(gym.subscriptionEndDate);
    const today = new Date("2025-10-24");
    return endDate < today;
};

function Gyms() {
  const { user } = useAuth();
  const [allGyms, setAllGyms] = useState([]);
  const [view, setView] = useState('card');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingGym, setEditingGym] = useState(null);
  
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [deactivatingGymId, setDeactivatingGymId] = useState(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingGymId, setDeletingGymId] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const { toast } = useToast();
  
  const gymsDataKey = user ? getGymDataKey('gyms', user.gymId) : null;
  const tariffsDataKey = user ? getGymDataKey('tariffs', user.gymId) : null;

  useEffect(() => {
    if (gymsDataKey && tariffsDataKey) {
        loadGyms();
    }
  }, [gymsDataKey, tariffsDataKey]);

  const loadGyms = () => {
    const allUsers = JSON.parse(localStorage.getItem(gymsDataKey) || '[]');
    const gymAdmins = allUsers.filter(u => u.role === 'gym-admin');
    
    const allTariffs = JSON.parse(localStorage.getItem(tariffsDataKey) || '[]');
    const tariffsMap = new Map(allTariffs.map(t => [t.id, t.name]));

    const gymsWithTariffs = gymAdmins.map(gym => ({
        ...gym,
        tariffName: tariffsMap.get(gym.plan) || gym.plan,
    }));
    
    setAllGyms(gymsWithTariffs);
  };

  const filteredGyms = useMemo(() => {
    return allGyms
      .filter(gym => {
        if (statusFilter === 'all') return true;
        if (statusFilter === 'expired') return isSubscriptionExpired(gym);
        const gymStatus = gym.status || 'active';
        return gymStatus === statusFilter;
      })
      .filter(gym => 
        gym.gymName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (gym.email && gym.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
  }, [allGyms, searchTerm, statusFilter]);

  const paginatedGyms = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredGyms.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredGyms, currentPage, rowsPerPage]);

  const pagination = {
    page: currentPage,
    total: filteredGyms.length,
    rowsPerPage,
  };

  const handleAddGym = (gymData) => {
    const allUsers = JSON.parse(localStorage.getItem(gymsDataKey) || '[]');
    const existingGym = allUsers.find(u => u.gymName.toLowerCase() === gymData.gymName.toLowerCase() || u.email === gymData.adminEmail);
    if (existingGym) {
        toast({ title: "Erreur", description: "Une salle avec ce nom ou cet email existe déjà.", variant: "destructive" });
        return;
    }

    const defaultTariffs = JSON.parse(localStorage.getItem(tariffsDataKey) || '[]');
    const defaultPlan = defaultTariffs.find(p => p.isDefault) || defaultTariffs[0];

    const newGymId = `gym_${Date.now()}`;
    const newAdmin = {
      id: `user_${Date.now()}`,
      gymId: newGymId,
      name: gymData.adminName,
      email: gymData.adminEmail,
      phone: gymData.phone,
      password: gymData.password,
      role: 'gym-admin',
      gymName: gymData.gymName,
      plan: defaultPlan ? defaultPlan.id : 'basic', 
      status: 'active',
      createdAt: new Date().toISOString(),
      subscriptionEndDate: new Date(new Date("2025-10-24").setMonth(new Date("2025-10-24").getMonth() + 1)).toISOString(),
    };
    
    const updatedUsers = [...allUsers, newAdmin];
    localStorage.setItem(gymsDataKey, JSON.stringify(updatedUsers));
    
    const plansDataKey = getGymDataKey('subscription_plans', newGymId);
    const initialPlans = defaultTariffs
        .filter(p => p.status === 'active')
        .map(p => ({ ...p, id: `default_${p.id}`, gymId: newGymId, isDefault: true }));

    localStorage.setItem(plansDataKey, JSON.stringify(initialPlans));

    loadGyms();
    toast({ title: "Salle ajoutée !", description: `La salle ${gymData.gymName} et son admin ont été créés.` });
    setIsAddDialogOpen(false);
  };

  const handleOpenEditDialog = (gym) => {
    setEditingGym(gym);
    setIsEditDialogOpen(true);
  };

  const handleUpdateGym = (updatedGymData) => {
    const allUsers = JSON.parse(localStorage.getItem(gymsDataKey) || '[]');
    const conflictingGym = allUsers.find(u => u.gymId !== updatedGymData.gymId && (u.gymName.toLowerCase() === updatedGymData.gymName.toLowerCase() || u.email === updatedGymData.email));
    if (conflictingGym) {
        toast({ title: "Erreur", description: "Une autre salle utilise déjà ce nom ou cet email.", variant: "destructive" });
        return;
    }

    const finalUsers = allUsers.map(u => u.gymId === updatedGymData.gymId ? { ...u, ...updatedGymData } : u);
    localStorage.setItem(gymsDataKey, JSON.stringify(finalUsers));

    loadGyms();
    toast({ title: "Salle modifiée", description: "Les informations de la salle ont été mises à jour." });
    setIsEditDialogOpen(false);
    setEditingGym(null);
  };

  const handleOpenDeactivateDialog = (gymId) => {
    setDeactivatingGymId(gymId);
    setIsDeactivateDialogOpen(true);
  };

  const handleDeactivateGym = () => {
    const allUsers = JSON.parse(localStorage.getItem(gymsDataKey) || '[]');
    const finalUsers = allUsers.map(u => {
      if (u.gymId === deactivatingGymId) {
        return { ...u, status: 'disabled' };
      }
      return u;
    });
    localStorage.setItem(gymsDataKey, JSON.stringify(finalUsers));
    
    loadGyms();
    toast({ title: "Salle désactivée", description: "La salle a été marquée comme inactive.", variant: "destructive" });
    setIsDeactivateDialogOpen(false);
    setDeactivatingGymId(null);
  };

  const handleOpenDeleteDialog = (gymId) => {
    setDeletingGymId(gymId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteGym = () => {
    const allUsers = JSON.parse(localStorage.getItem(gymsDataKey) || '[]');
    const finalUsers = allUsers.filter(u => u.gymId !== deletingGymId);
    localStorage.setItem(gymsDataKey, JSON.stringify(finalUsers));
    
    const dataTypesToDelete = ['members', 'coaches', 'classes', 'equipment', 'subscriptions', 'subscription_plans'];
    dataTypesToDelete.forEach(type => {
        const dataKey = getGymDataKey(type, deletingGymId);
        localStorage.removeItem(dataKey);
    });

    loadGyms();
    toast({ title: "Salle supprimée", description: "La salle et toutes ses données ont été supprimées définitivement.", variant: "destructive" });
    setIsDeleteDialogOpen(false);
    setDeletingGymId(null);
  };

  const handleExport = (format) => {
    const columns = [
        { header: 'Nom de la Salle', accessorKey: 'gymName' },
        { header: 'Tarif', accessorKey: 'tariffName' },
        { header: 'Admin', accessorKey: 'name' },
        { header: 'Email Admin', accessorKey: 'email' },
        { header: 'Téléphone', accessorKey: 'phone' },
        { header: 'Statut', accessorKey: 'status', cell: ({row}) => row.original.status === 'active' ? 'Active' : 'Désactivée' },
        { header: 'Abonnement Expire Le', accessorKey: 'subscriptionEndDate', cell: ({row}) => row.original.subscriptionEndDate ? new Date(row.original.subscriptionEndDate).toLocaleDateString() : 'N/A' },
        { header: 'Date d\'inscription', accessorKey: 'createdAt', cell: ({row}) => new Date(row.original.createdAt).toLocaleDateString() },
    ];
    exportData(format, filteredGyms, columns, 'salles', 'Liste des Salles');
    toast({ title: 'Exportation réussie', description: `La liste des salles a été exportée en ${format.toUpperCase()}.` });
  };

  const FilterComponent = (
    <div className="flex flex-col md:flex-row items-center gap-4">
      <div className="relative w-full md:flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <input
          type="text"
          placeholder="Rechercher une salle..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-background/50 border border-border rounded-lg"
        />
      </div>
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <Button variant={statusFilter === 'all' ? 'default' : 'outline'} onClick={() => setStatusFilter('all')}>Toutes</Button>
        <Button variant={statusFilter === 'active' ? 'default' : 'outline'} onClick={() => setStatusFilter('active')}>Actives</Button>
        <Button variant={statusFilter === 'disabled' ? 'default' : 'outline'} onClick={() => setStatusFilter('disabled')}>Inactives</Button>
        <Button variant={statusFilter === 'expired' ? 'destructive' : 'outline'} onClick={() => setStatusFilter('expired')}>Expirées</Button>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader 
          title="Gestion des Salles"
          description="Gérez toutes les salles de sport inscrites sur la plateforme."
          actionButton={
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white">
              <Plus className="w-4 h-4" /> Nouvelle Salle
            </Button>
          }
          view={view}
          setView={setView}
          onExport={handleExport}
        />
        
        <div className="bg-secondary rounded-xl shadow-lg border border-border/50 p-4 sm:p-6">{FilterComponent}</div>

        {filteredGyms.length > 0 ? (
          view === 'card' ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedGyms.map((gym, index) => (
                  <motion.div
                    key={gym.gymId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <GymCard gym={gym} onEdit={handleOpenEditDialog} onDeactivate={handleOpenDeactivateDialog} onDelete={handleOpenDeleteDialog} />
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <GymsTable gyms={paginatedGyms} onEdit={handleOpenEditDialog} onDeactivate={handleOpenDeactivateDialog} onDelete={handleOpenDeleteDialog} pagination={pagination} onPageChange={setCurrentPage} />
          )
        ) : (
          <div className="text-center py-12 bg-secondary rounded-xl border border-border/50">
            <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Aucune salle trouvée</h3>
            <p className="text-muted-foreground mb-4">Essayez de modifier vos filtres ou ajoutez une nouvelle salle.</p>
          </div>
        )}
      </div>

      <AddGymDialog isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} onAdd={handleAddGym} />
      <EditGymDialog isOpen={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} onUpdate={handleUpdateGym} gym={editingGym} />
      <ConfirmationDialog
        open={isDeactivateDialogOpen}
        onOpenChange={setIsDeactivateDialogOpen}
        onConfirm={handleDeactivateGym}
        title="Désactiver la salle ?"
        description="Cette action marquera la salle comme inactive. L'administrateur ne pourra plus se connecter. Êtes-vous sûr ?"
      />
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteGym}
        title="Supprimer la salle ?"
        description="Cette action est irréversible et supprimera la salle et toutes ses données (membres, coachs, etc.). Êtes-vous sûr ?"
      />
    </Layout>
  );
}

export default Gyms;
