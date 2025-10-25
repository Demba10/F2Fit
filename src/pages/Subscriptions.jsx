import React, { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, Edit, Trash2, RefreshCw, CreditCard } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import AddSubscriptionDialog from '@/components/subscriptions/AddSubscriptionDialog';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { useToast } from '@/components/ui/use-toast';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import SubscriptionCard from '@/components/subscriptions/SubscriptionCard';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { exportData } from '@/lib/export';
import { useAuth, getGymDataKey } from '@/contexts/AuthContext';

function Subscriptions() {
  const { user } = useAuth();
  const [view, setView] = useState('card');
  const [subscriptions, setSubscriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingSubscriptionId, setDeletingSubscriptionId] = useState(null);
  const { toast } = useToast();

  const subscriptionsDataKey = user ? getGymDataKey('subscriptions', user.gymId) : null;

  useEffect(() => {
    if (subscriptionsDataKey) {
        loadSubscriptions();
    }
  }, [subscriptionsDataKey]);

  const loadSubscriptions = () => {
    if (!subscriptionsDataKey) return;
    setSubscriptions(JSON.parse(localStorage.getItem(subscriptionsDataKey) || '[]'));
  };

  const saveSubscriptions = (updatedSubscriptions) => {
    if (!subscriptionsDataKey) return;
    setSubscriptions(updatedSubscriptions);
    localStorage.setItem(subscriptionsDataKey, JSON.stringify(updatedSubscriptions));
  };


  const getStatusInfo = (sub) => {
    const today = new Date("2025-10-23");
    const endDate = new Date(sub.endDate);
    const diffDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: 'Expiré', color: 'text-red-500', bgColor: 'bg-red-500' };
    if (diffDays <= 7) return { text: 'Expire bientôt', color: 'text-orange-400', bgColor: 'bg-orange-400' };
    return { text: 'Actif', color: 'text-green-500', bgColor: 'bg-green-500' };
  };

  const handleAddSubscription = (subData) => {
    const newSubscription = { id: Date.now().toString(), ...subData, createdAt: new Date().toISOString(), gymId: user.gymId };
    const updatedSubscriptions = [...subscriptions, newSubscription];
    saveSubscriptions(updatedSubscriptions);
    toast({ title: "Abonnement créé !", description: "L'abonnement a été créé avec succès." });
    setIsAddDialogOpen(false);
  };
  
  const handleOpenDeleteDialog = (subId) => {
    setDeletingSubscriptionId(subId);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteSubscription = () => {
    const updatedSubscriptions = subscriptions.filter(s => s.id !== deletingSubscriptionId);
    saveSubscriptions(updatedSubscriptions);
    toast({ title: "Abonnement supprimé", description: "L'abonnement a été supprimé.", variant: "destructive" });
    setIsDeleteDialogOpen(false);
    setDeletingSubscriptionId(null);
  };
  
  const handleRenew = (sub) => {
     toast({
        title: "🚧 Bientôt disponible !",
        description: "Cette fonctionnalité est en cours de développement. 🚀",
      });
  };

  const handleExport = (format) => {
    toast({
      title: 'Exportation en cours...',
      description: `Génération du fichier ${format.toUpperCase()}.`,
    });
    // Add 'text' property to status for clean export
    const dataToExport = filteredSubscriptions.map(s => ({...s, statusText: getStatusInfo(s).text}));
    const columnsWithStatusText = columns.map(c => c.accessorKey === 'status' ? {...c, accessorKey: 'statusText'} : c);
    exportData(format, dataToExport, columnsWithStatusText, 'subscriptions', 'Liste des Abonnements');
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const statusInfo = getStatusInfo(sub);
    const memberName = sub.memberName || '';
    const planName = sub.planName || '';
    const matchesSearch = memberName.toLowerCase().includes(searchTerm.toLowerCase()) || planName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || statusInfo.text.toLowerCase().replace(/ /g, '') === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const columns = [
    { accessorKey: 'memberName', header: 'Membre', cell: ({ row }) => <div className="font-medium text-foreground">{row.original.memberName}</div> },
    { accessorKey: 'planName', header: 'Plan', accessorFn: row => row.planName },
    { accessorKey: 'price', header: 'Prix', cell: ({ row }) => `${row.original.price.toLocaleString()} FCFA` },
    { accessorKey: 'startDate', header: 'Début', cell: ({ row }) => new Date(row.original.startDate).toLocaleDateString('fr-FR') },
    { accessorKey: 'endDate', header: 'Fin', cell: ({ row }) => new Date(row.original.endDate).toLocaleDateString('fr-FR') },
    { accessorKey: 'status', header: 'Statut', cell: ({ row }) => {
      const status = getStatusInfo(row.original);
      return <div className={`flex items-center gap-2 font-medium ${status.color}`}><span className={`h-2 w-2 rounded-full ${status.bgColor}`}></span>{status.text}</div>;
    }},
    { accessorKey: 'actions', header: '', cell: ({ row }) => (
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="w-8 h-8"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleRenew(row.original)}><RefreshCw className="w-4 h-4 mr-2" />Renouveler</DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast({title: "Bientôt disponible!"})}><Edit className="w-4 h-4 mr-2" />Modifier</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOpenDeleteDialog(row.original.id)} className="text-red-500 focus:text-red-500"><Trash2 className="w-4 h-4 mr-2" />Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )},
  ];

  const filterComponent = (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <input type="text" placeholder="Rechercher par membre ou plan..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-background/50 border border-border rounded-lg" />
      </div>
      <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full md:w-auto px-4 py-2 bg-background/50 border border-border rounded-lg">
        <option value="all">Tous les statuts</option>
        <option value="actif">Actifs</option>
        <option value="expirebientôt">Expire bientôt</option>
        <option value="expiré">Expirés</option>
      </select>
    </div>
  );

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader 
          title="Abonnements" 
          description="Gérez les abonnements et les paiements des membres." 
          actionButton={
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white">
              <Plus className="w-4 h-4" /> Nouvel Abonnement
            </Button>
          }
          view={view}
          setView={setView}
          onExport={handleExport}
        />
        
        {view === 'table' ? (
          <DataTable columns={columns} data={filteredSubscriptions} filterComponent={filterComponent} />
        ) : (
          <>
            <div className="pb-4 border-b border-border/50">{filterComponent}</div>
            {filteredSubscriptions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredSubscriptions.map((sub, index) => (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <SubscriptionCard subscription={sub} onDelete={() => handleOpenDeleteDialog(sub.id)} />
                  </motion.div>
                ))}
              </div>
            ) : (
                <div className="text-center py-12 bg-secondary rounded-xl border border-border/50">
                    <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Aucun abonnement trouvé</h3>
                    <p className="text-muted-foreground">Essayez d'ajuster vos filtres ou de créer un nouvel abonnement.</p>
                </div>
            )}
          </>
        )}

        <AddSubscriptionDialog isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} onAdd={handleAddSubscription} />
        <ConfirmationDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} onConfirm={handleDeleteSubscription} title="Supprimer l'abonnement ?" description="Cette action est irréversible. Êtes-vous sûr ?" />
      </div>
    </Layout>
  );
}

export default Subscriptions;