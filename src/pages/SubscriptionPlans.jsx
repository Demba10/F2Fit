import React, { useState, useEffect } from 'react';
import { Plus, Package } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import PlanDialog from '@/components/subscriptions/PlanDialog';
import PageHeader from '@/components/PageHeader';
import PlanCard from '@/components/subscriptions/PlanCard';
import { motion } from 'framer-motion';
import { exportData } from '@/lib/export';
import { useAuth, getGymDataKey } from '@/contexts/AuthContext';

function SubscriptionPlans() {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [deactivatingPlanId, setDeactivatingPlanId] = useState(null);
  const { toast } = useToast();

  const plansDataKey = user ? getGymDataKey('subscription_plans', user.gymId) : null;
  const defaultPlansKey = 'f2fit_default_tariffs';

  useEffect(() => {
    if (!plansDataKey || !user) return;

    const storedPlans = JSON.parse(localStorage.getItem(plansDataKey));
    if (storedPlans && storedPlans.length > 0) {
      setPlans(storedPlans);
    } else {
      // Initialize with default tariffs for the specific gym
      const globalTariffs = JSON.parse(localStorage.getItem(defaultPlansKey) || '[]');
      const activeGlobalTariffs = globalTariffs.filter(p => p.status === 'active');
      const initialPlans = activeGlobalTariffs.map(p => ({
        ...p,
        id: `default_${p.id}`, // Make ID unique to avoid conflicts with custom plans
        gymId: user.gymId,
        isDefault: true // Mark as a default plan template
      }));
      setPlans(initialPlans);
      localStorage.setItem(plansDataKey, JSON.stringify(initialPlans));
    }
  }, [plansDataKey, user, defaultPlansKey]);

  const savePlans = (updatedPlans) => {
    if (!plansDataKey) return;
    setPlans(updatedPlans);
    localStorage.setItem(plansDataKey, JSON.stringify(updatedPlans));
  };

  const handleOpenDialog = (plan = null) => {
    if (plan && plan.isDefault) {
      toast({
        title: "Action non autorisée",
        description: "Les plans par défaut ne peuvent pas être modifiés. Créez un nouveau plan personnalisé.",
        variant: "destructive"
      });
      return;
    }
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
      updatedPlans = plans.map(p => p.id === editingPlan.id ? { ...p, ...planData } : p);
      toast({ title: "Plan modifié !", description: "Le plan personnalisé a été mis à jour." });
    } else {
      updatedPlans = [...plans, { 
          id: `custom_${Date.now()}`, 
          ...planData, 
          gymId: user.gymId, 
          isDefault: false,
          status: 'active'
        }];
      toast({ title: "Plan ajouté !", description: "Le nouveau plan personnalisé a été créé." });
    }
    savePlans(updatedPlans);
    handleCloseDialog();
  };

  const handleOpenDeactivateDialog = (planId) => {
    const plan = plans.find(p => p.id === planId);
    if(plan && plan.isDefault) {
       toast({ title: "Action non autorisée", description: "Vous ne pouvez pas désactiver un plan par défaut.", variant: "destructive" });
       return;
    }
    setDeactivatingPlanId(planId);
    setIsDeactivateDialogOpen(true);
  };

  const handleDeactivatePlan = () => {
    const updatedPlans = plans.map(p => {
      if(p.id === deactivatingPlanId) {
        return { ...p, status: p.status === 'active' ? 'disabled' : 'active' };
      }
      return p;
    });
    savePlans(updatedPlans);
    toast({ title: "Statut du plan modifié !", variant: "default" });
    setIsDeactivateDialogOpen(false);
    setDeactivatingPlanId(null);
  };

  const handleExport = (format) => {
     const columns = [
        { header: 'Nom', accessorKey: 'name' },
        { header: 'Prix (FCFA)', accessorKey: 'price' },
        { header: 'Durée (jours)', accessorKey: 'duration' },
        { header: 'Type', accessorKey: 'isDefault', cell: ({row}) => row.isDefault ? "Par Défaut" : "Personnalisé"},
        { header: 'Statut', accessorKey: 'status', cell: ({row}) => row.status === 'active' ? "Actif" : "Inactif" },
    ];
    exportData(format, plans, columns, 'plans-abonnements', 'Liste des Plans d\'Abonnement');
    toast({
      title: 'Exportation réussie',
      description: `La liste des plans a été exportée en ${format.toUpperCase()}.`,
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader
          title="Plans d'Abonnement"
          description="Gérez les plans d'abonnement disponibles pour votre salle."
          actionButton={
            <Button onClick={() => handleOpenDialog()} className="gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white">
              <Plus className="w-4 h-4" /> Nouveau Plan Personnalisé
            </Button>
          }
          onExport={handleExport}
          showViewSwitcher={false}
        />
        {plans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan, index) => (
                <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                >
                    <PlanCard plan={plan} onEdit={() => handleOpenDialog(plan)} onDeactivate={() => handleOpenDeactivateDialog(plan.id)} />
                </motion.div>
                ))}
            </div>
        ) : (
            <div className="text-center py-12 bg-secondary rounded-xl border border-border/50">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Aucun plan trouvé</h3>
                <p className="text-muted-foreground mb-4">Commencez par créer votre premier plan personnalisé.</p>
            </div>
        )}
        <PlanDialog isOpen={isDialogOpen} onClose={handleCloseDialog} onSave={handleSavePlan} plan={editingPlan} />
        <ConfirmationDialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen} onConfirm={handleDeactivatePlan} title="Modifier le statut de ce plan ?" description="Un plan désactivé n'apparaîtra plus lors de la création de nouveaux abonnements." />
      </div>
    </Layout>
  );
}

export default SubscriptionPlans;