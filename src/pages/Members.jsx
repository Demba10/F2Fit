import React, { useState, useEffect } from 'react';
import { Search, UserPlus, MoreVertical, Edit, Trash2, Mail, Users, BarChart } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import AddMemberDialog from '@/components/members/AddMemberDialog';
import EditMemberDialog from '@/components/members/EditMemberDialog';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { useToast } from '@/components/ui/use-toast';
import DataTable from '@/components/DataTable';
import PageHeader from '@/components/PageHeader';
import MemberCard from '@/components/members/MemberCard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { exportData } from '@/lib/export';
import { useAuth, getGymDataKey } from '@/contexts/AuthContext';

function Members() {
  const { user } = useAuth();
  const [view, setView] = useState('card');
  const [members, setMembers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deletingMemberId, setDeletingMemberId] = useState(null);
  const { toast } = useToast();

  const membersDataKey = user ? getGymDataKey('members', user.gymId) : null;
  const subscriptionsDataKey = user ? getGymDataKey('subscriptions', user.gymId) : null;
  const plansDataKey = user ? getGymDataKey('subscription_plans', user.gymId) : null;

  useEffect(() => { 
    if (user?.gymId) {
      loadData();
    }
  }, [user]);

  const loadData = () => {
    if (!membersDataKey || !subscriptionsDataKey) return;
    const storedMembers = JSON.parse(localStorage.getItem(membersDataKey) || '[]');
    const storedSubscriptions = JSON.parse(localStorage.getItem(subscriptionsDataKey) || '[]');
    setMembers(storedMembers.map(m => ({ ...m, status: m.status || 'active' })));
    setSubscriptions(storedSubscriptions);
  };
  
  const getSubscriptionStatusInfo = (member) => {
    const memberSubs = subscriptions.filter(s => s.memberId === member.id);
    if(memberSubs.length === 0) return { text: 'Sans abo.', color: 'text-gray-400' };

    const activeSub = memberSubs.find(s => new Date(s.endDate) >= new Date("2025-10-24"));
    if (!activeSub) return { text: 'Expiré', color: 'text-red-500' };

    const today = new Date("2025-10-24");
    const endDate = new Date(activeSub.endDate);
    const diffDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) return { text: 'Expire bientôt', color: 'text-orange-400' };
    return { text: 'Actif', color: 'text-green-500' };
  };

  const handleAddMember = (memberData) => {
    if (!membersDataKey) return;
    const newMemberId = `member_${Date.now()}`;
    const newMember = { 
        id: newMemberId, 
        name: memberData.name, 
        email: memberData.email, 
        phone: memberData.phone, 
        password: memberData.password, // Store password for client login
        status: 'active', 
        createdAt: new Date().toISOString(), 
        gymId: user.gymId 
    };
    
    const currentMembers = JSON.parse(localStorage.getItem(membersDataKey) || '[]');
    const updatedMembers = [...currentMembers, newMember];
    localStorage.setItem(membersDataKey, JSON.stringify(updatedMembers));

    let toastDescription = `${memberData.name} a été ajouté avec succès.`;

    if (memberData.planId) {
        if (!plansDataKey || !subscriptionsDataKey) return;
        const plans = JSON.parse(localStorage.getItem(plansDataKey) || '[]');
        const plan = plans.find(p => p.id === memberData.planId);
        if (plan) {
            const startDate = new Date("2025-10-24");
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + plan.duration);
            
            const newSubscription = { 
                id: `sub_${Date.now()}`, 
                memberId: newMemberId, 
                memberName: newMember.name, 
                planName: plan.name, 
                planId: plan.id, 
                price: plan.price, 
                startDate: startDate.toISOString().split('T')[0], 
                endDate: endDate.toISOString().split('T')[0], 
                status: 'active',
                gymId: user.gymId
            };
            
            const currentSubscriptions = JSON.parse(localStorage.getItem(subscriptionsDataKey) || '[]');
            const updatedSubscriptions = [...currentSubscriptions, newSubscription];
            localStorage.setItem(subscriptionsDataKey, JSON.stringify(updatedSubscriptions));
            toastDescription = `${memberData.name} a été ajouté avec un abonnement '${plan.name}'.`;
        }
    }
    
    loadData();
    toast({ title: "Compte Membre Créé !", description: toastDescription });
    setIsAddDialogOpen(false);
  };
  
  const handleOpenEditDialog = (member) => {
    setEditingMember(member);
    setIsEditDialogOpen(true);
  };

  const handleUpdateMember = (updatedMemberData) => {
    if (!membersDataKey || !subscriptionsDataKey) return;

    const updatedMembers = members.map(m => m.id === updatedMemberData.id ? { ...m, ...updatedMemberData } : m);
    localStorage.setItem(membersDataKey, JSON.stringify(updatedMembers));
    
    const updatedSubscriptions = subscriptions.map(s => s.memberId === updatedMemberData.id ? { ...s, memberName: updatedMemberData.name } : s);
    localStorage.setItem(subscriptionsDataKey, JSON.stringify(updatedSubscriptions));

    loadData();
    toast({ title: "Membre mis à jour !", description: `${updatedMemberData.name} a été modifié avec succès.` });
    setIsEditDialogOpen(false);
    setEditingMember(null);
  };

  const handleOpenDeleteDialog = (memberId) => {
    setDeletingMemberId(memberId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteMember = () => {
    if (!membersDataKey || !subscriptionsDataKey) return;

    const updatedMembers = members.filter(m => m.id !== deletingMemberId);
    localStorage.setItem(membersDataKey, JSON.stringify(updatedMembers));
    
    const updatedSubscriptions = subscriptions.filter(s => s.memberId !== deletingMemberId);
    localStorage.setItem(subscriptionsDataKey, JSON.stringify(updatedSubscriptions));

    loadData();
    toast({ title: "Membre supprimé", description: "Le membre et ses abonnements ont été supprimés.", variant: "destructive" });
    setIsDeleteDialogOpen(false);
    setDeletingMemberId(null);
  };

  const handleExport = (format) => {
    toast({
      title: 'Exportation en cours...',
      description: `Génération du fichier ${format.toUpperCase()}.`,
    });
    const exportColumns = columns.map(c => ({...c, cell: c.accessorKey === 'sub_status' ? (({row}) => getSubscriptionStatusInfo(row)) : c.cell }));
    exportData(format, filteredMembers, exportColumns, 'members', 'Liste des Membres');
  };

  const filteredMembers = members.filter(member => {
    const subStatusInfo = getSubscriptionStatusInfo(member);
    const memberStatus = member.status || 'active';
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || member.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filterStatus !== 'all') {
      if (['active', 'suspended', 'inactive'].includes(filterStatus)) {
        matchesFilter = memberStatus === filterStatus;
      } else {
         matchesFilter = subStatusInfo.text.toLowerCase().replace(/ /g, '') === filterStatus;
      }
    }
    return matchesSearch && matchesFilter;
  });

  const columns = [
    { accessorKey: 'name', header: 'Nom', cell: ({ row }) => (<div className="font-medium text-foreground">{row.original.name}</div>)},
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'phone', header: 'Téléphone' },
    { accessorKey: 'sub_status', header: 'Abonnement', cell: ({ row }) => {
      const status = getSubscriptionStatusInfo(row.original);
      return <div className={`flex items-center gap-2 font-medium ${status.color}`}><span className={`h-2 w-2 rounded-full ${status.color.replace('text-','bg-')}`}></span>{status.text}</div>;
    }},
    { accessorKey: 'createdAt', header: 'Date d\'inscription', cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString('fr-FR') },
    { accessorKey: 'actions', header: '', cell: ({ row }) => (
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="w-8 h-8"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleOpenEditDialog(row.original)}><Edit className="w-4 h-4 mr-2" />Modifier</DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toast({ title: "Bientôt disponible !" });}}><BarChart className="w-4 h-4 mr-2" />Voir Stats</DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.location.href = `mailto:${row.original.email}`}><Mail className="w-4 h-4 mr-2" />Contacter</DropdownMenuItem>
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
        <input type="text" placeholder="Rechercher par nom ou email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-background/50 border border-border rounded-lg" />
      </div>
      <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full md:w-auto px-4 py-2 bg-background/50 border border-border rounded-lg">
        <option value="all">Tous les statuts</option>
        <optgroup label="Statut Membre">
          <option value="active">Actif</option>
          <option value="suspended">Suspendu</option>
          <option value="inactive">Inactif</option>
        </optgroup>
        <optgroup label="Statut Abonnement">
          <option value="actif">Abon. Actif</option>
          <option value="expirebientôt">Abon. Expire Bientôt</option>
          <option value="expiré">Abon. Expiré</option>
          <option value="sansabo.">Sans Abonnement</option>
        </optgroup>
      </select>
    </div>
  );

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader 
          title="Membres"
          description="Gérez vos membres et leurs abonnements."
          actionButton={
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white">
              <UserPlus className="w-4 h-4" /> Ajouter un Membre
            </Button>
          }
          view={view}
          setView={setView}
          onExport={handleExport}
        />
        
        {view === 'table' ? (
          <DataTable columns={columns} data={filteredMembers} filterComponent={filterComponent} />
        ) : (
          <>
            <div className="pb-4 border-b border-border/50">{filterComponent}</div>
            {filteredMembers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <MemberCard member={member} onDelete={handleOpenDeleteDialog} onEdit={handleOpenEditDialog} getSubscriptionStatusInfo={getSubscriptionStatusInfo} />
                  </motion.div>
                ))}
              </div>
            ) : (
                <div className="text-center py-12 bg-secondary rounded-xl border border-border/50">
                    <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Aucun membre trouvé</h3>
                    <p className="text-muted-foreground">Essayez de modifier vos filtres ou d'ajouter un nouveau membre.</p>
                </div>
            )}
          </>
        )}

        <AddMemberDialog isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} onAdd={handleAddMember} />
        {editingMember && <EditMemberDialog isOpen={isEditDialogOpen} onClose={() => { setIsEditDialogOpen(false); setEditingMember(null); }} onUpdate={handleUpdateMember} member={editingMember} />}
        <ConfirmationDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} onConfirm={handleDeleteMember} title="Supprimer le membre ?" description="Cette action est irréversible et supprimera également tous les abonnements associés. Êtes-vous sûr ?" />
      </div>
    </Layout>
  );
}

export default Members;