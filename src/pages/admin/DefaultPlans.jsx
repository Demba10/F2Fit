import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Tags, Search } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import PlanDialog from '@/components/subscriptions/PlanDialog';
import PageHeader from '@/components/PageHeader';
import PlanCard from '@/components/subscriptions/PlanCard';
import { motion } from 'framer-motion';
import { exportData } from '@/lib/export';

const TARIFFS_STORAGE_KEY = 'f2fit_default_tariffs';

const defaultPlansData = [
  { id: 'starter', name: 'Starter', price: 10000, duration: 30, benefits: 'Idéal pour démarrer. Jusqu\'à 50 membres.', isDefault: true, status: 'active' },
  { id: 'pro', name: 'Pro', price: 25000, duration: 30, benefits: 'Pour les salles en croissance. Jusqu\'à 300 membres.', isDefault: true, status: 'active' },
  { id: 'premium', name: 'Premium', price: 50000, duration: 30, benefits: 'La solution complète. Membres illimités.', isDefault: true, status: 'active' },
];

function DefaultPlans() {
  const [allPlans, setAllPlans] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [deactivatingPlanId, setDeactivatingPlanId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    const storedPlans = JSON.parse(localStorage.getItem(TARIFFS_STORAGE_KEY));
    if (storedPlans && storedPlans.length > 0) {
      setAllPlans(storedPlans);
    } else {
      setAllPlans(defaultPlansData);
      localStorage.setItem(TARIFFS_STORAGE_KEY, JSON.stringify(defaultPlansData));
    }
  }, []);

  const savePlans = (updatedPlans) => {
    setAllPlans(updatedPlans);
    localStorage.setItem(TARIFFS_STORAGE_KEY, JSON.stringify(updatedPlans));
  };
  
  const filteredPlans = useMemo(() => {
    return allPlans.filter(plan => {
      const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase());
      const planStatus = plan.status || 'active';
      const matchesFilter = statusFilter === 'all' || planStatus === statusFilter;
      return matchesSearch && matchesFilter;
    });
  }, [allPlans, searchTerm, statusFilter]);

  const handleOpenDialog = (plan = null) => {
    setEditingPlan(plan);
    setIsDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setEditingPlan(null);
    setIsDialogOpen(false);
  };
  const handleSavePlan = (planData) => {
    let updatedPlans;
    if (editingPlan) {
      updatedPlans = allPlans.map(p => p.id === editingPlan.id ? { ...p, ...planData } : p);
      toast({ title: "Tarif modifié !", description: "Le tarif a été mis à jour." });
    } else {
      updatedPlans = [...allPlans, { id: `tariff_${Date.now()}`, ...planData, isDefault: true, status: 'active' }];
      toast({ title: "Tarif ajouté !", description: "Le nouveau tarif a été créé." });
    }
    savePlans(updatedPlans);
    handleCloseDialog();
  };
  const handleOpenDeactivateDialog = (planId) => {
    setDeactivatingPlanId(planId);
    setIsDeactivateDialogOpen(true);
  };
  const handleDeactivatePlan = () => {
    const updatedPlans = allPlans.map(p => {
      if(p.id === deactivatingPlanId) {
        return { ...p, status: p.status === 'active' ? 'disabled' : 'active' };
      }
      return p;
    });
    savePlans(updatedPlans);
    toast({ title: "Statut du tarif modifié !", variant: "default" });
    setIsDeactivateDialogOpen(false);
    setDeactivatingPlanId(null);
  };
  
  const handleExport = (format) => {
    const columns = [
        { header: 'Nom', accessorKey: 'name' },
        { header: 'Prix (FCFA)', accessorKey: 'price' },
        { header: 'Durée (jours)', accessorKey: 'duration' },
        { header: 'Statut', accessorKey: 'status' },
    ];
    exportData(format, filteredPlans, columns, 'tarifs-globaux', 'Liste des Tarifs Globaux');
    toast({ title: "Exportation réussie !", description: `Les tarifs ont été exportés en ${format.toUpperCase()}.` });
  };
  
  const FilterComponent = (
     <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="relative w-full sm:w-auto flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <input
          type="text"
          placeholder="Rechercher un tarif..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-background/50 border border-border rounded-lg"
        />
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant={statusFilter === 'all' ? 'default' : 'outline'} onClick={() => setStatusFilter('all')}>Tous</Button>
        <Button variant={statusFilter === 'active' ? 'default' : 'outline'} onClick={() => setStatusFilter('active')}>Actifs</Button>
        <Button variant={statusFilter === 'disabled' ? 'default' : 'outline'} onClick={() => setStatusFilter('disabled')}>Inactifs</Button>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader
          title="Gestion des Tarifs Globaux"
          description="Gérez les tarifs qui seront proposés à toutes les salles."
          actionButton={
            <Button onClick={() => handleOpenDialog()} className="gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white">
              <Plus className="w-4 h-4" /> Nouveau Tarif
            </Button>
          }
          onExport={handleExport}
          showViewSwitcher={false}
        />
        
        <div className="bg-secondary rounded-xl shadow-lg border border-border/50 p-6">
            {FilterComponent}
        </div>
        
        {filteredPlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlans.map((plan, index) => (
                <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                >
                    <PlanCard plan={plan} onEdit={() => handleOpenDialog(plan)} onDeactivate={() => handleOpenDeactivateDialog(plan.id)} isSuperAdmin={true}/>
                </motion.div>
                ))}
            </div>
        ) : (
            <div className="text-center py-12 bg-secondary rounded-xl border border-border/50">
                <Tags className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Aucun tarif trouvé</h3>
                <p className="text-muted-foreground mb-4">Essayez de modifier vos filtres ou créez un nouveau tarif.</p>
            </div>
        )}
        
        <PlanDialog isOpen={isDialogOpen} onClose={handleCloseDialog} onSave={handleSavePlan} plan={editingPlan} />
        <ConfirmationDialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen} onConfirm={handleDeactivatePlan} title="Modifier le statut de ce tarif ?" description="Cette action changera la visibilité de ce tarif pour les nouvelles inscriptions. Êtes-vous sûr ?" />
      </div>
    </Layout>
  );
}

export default DefaultPlans;