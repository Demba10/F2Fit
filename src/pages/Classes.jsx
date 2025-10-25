
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar as CalendarIcon, MoreVertical, Edit, Trash2, Users, User, Clock, Search } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import ClassCard from '@/components/classes/ClassCard';
import AddClassDialog from '@/components/classes/AddClassDialog';
import { useToast } from '@/components/ui/use-toast';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { exportData } from '@/lib/export';
import { useAuth, getGymDataKey } from '@/contexts/AuthContext';

function Classes() {
  const { user } = useAuth();
  const [view, setView] = useState('card');
  const [classes, setClasses] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingClassId, setDeletingClassId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCoach, setFilterCoach] = useState('all');
  const { toast } = useToast();

  const classesDataKey = user ? getGymDataKey('classes', user.gymId) : null;
  const coachesDataKey = user ? getGymDataKey('coaches', user.gymId) : null;

  useEffect(() => {
    if (user?.gymId) {
      loadData();
    }
  }, [user]);

  const loadData = () => {
    if (!classesDataKey || !coachesDataKey) return;
    const storedClasses = JSON.parse(localStorage.getItem(classesDataKey) || '[]');
    const storedCoaches = JSON.parse(localStorage.getItem(coachesDataKey) || '[]');
    setClasses(storedClasses);
    setCoaches(storedCoaches);
  };

  const getCoachName = (coachId) => {
    const coach = coaches.find(c => c.id === coachId);
    return coach ? coach.name : 'N/A';
  }

  const handleAddClass = (classData) => {
    if (!classesDataKey) return;
    const newClass = { 
      id: `class_${Date.now()}`, 
      ...classData, 
      createdAt: new Date().toISOString(),
      gymId: user.gymId // Associate with current gym
    };
    const updatedClasses = [...classes, newClass];
    localStorage.setItem(classesDataKey, JSON.stringify(updatedClasses));
    setClasses(updatedClasses);
    toast({ title: "Cours ajouté !", description: `${classData.name} a été ajouté avec succès.` });
    setIsAddDialogOpen(false);
  };

  const handleOpenDeleteDialog = (classId) => {
    setDeletingClassId(classId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteClass = () => {
    if (!classesDataKey) return;
    const updatedClasses = classes.filter(c => c.id !== deletingClassId);
    localStorage.setItem(classesDataKey, JSON.stringify(updatedClasses));
    setClasses(updatedClasses);
    toast({ title: "Cours supprimé", description: "Le cours a été supprimé.", variant: "destructive" });
    setIsDeleteDialogOpen(false);
    setDeletingClassId(null);
  };
  
  const handleFutureFeature = (e) => {
    e.preventDefault();
    toast({
        title: "🚧 Bientôt disponible !",
        description: "Cette fonctionnalité est en cours de développement. 🚀",
    });
  }

  const handleExport = (format) => {
    toast({
      title: 'Exportation en cours...',
      description: `Génération du fichier ${format.toUpperCase()}.`,
    });
    const dataToExport = filteredClasses.map(c => ({
        ...c, 
        coachName: getCoachName(c.coachId),
        statusText: c.participants >= c.maxParticipants ? 'Complet' : 'Disponible'
    }));
    const columnsWithPlainText = columns.map(col => {
        if(col.accessorKey === 'status') return {...col, accessorKey: 'statusText'};
        if(col.accessorKey === 'coachId') return { header: 'Coach', accessorKey: 'coachName' };
        return col;
    })
    exportData(format, dataToExport, columnsWithPlainText, 'classes', 'Liste des Cours');
  };

  const filteredClasses = useMemo(() => {
    return classes.filter(c => {
      const searchMatch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
      const typeMatch = filterType === 'all' || c.type === filterType;
      const coachMatch = filterCoach === 'all' || c.coachId === filterCoach;
      return searchMatch && typeMatch && coachMatch;
    });
  }, [classes, searchTerm, filterType, filterCoach]);

  const columns = [
    { accessorKey: 'name', header: 'Nom du Cours', cell: ({ row }) => <div className="font-medium text-foreground">{row.original.name}</div> },
    { accessorKey: 'type', header: 'Type', cell: ({ row }) => (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${row.original.type === 'Collectif' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>{row.original.type}</span>
    )},
    { accessorKey: 'coachId', header: 'Coach', cell: ({row}) => getCoachName(row.original.coachId) },
    { accessorKey: 'date', header: 'Date', cell: ({ row }) => new Date(row.original.date).toLocaleDateString('fr-FR') },
    { accessorKey: 'time', header: 'Heure' },
    { accessorKey: 'participants', header: 'Participants', cell: ({ row }) => `${row.original.participants} / ${row.original.maxParticipants}` },
    { accessorKey: 'status', header: 'Statut', cell: ({ row }) => {
        const isFull = row.original.participants >= row.original.maxParticipants;
        return isFull 
            ? <span className="text-xs font-semibold bg-red-500/10 text-red-400 px-2 py-1 rounded-full">Complet</span>
            : <span className="text-xs font-semibold bg-green-500/10 text-green-400 px-2 py-1 rounded-full">Disponible</span>
    }},
    { accessorKey: 'actions', header: '', cell: ({ row }) => (
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="w-8 h-8"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleFutureFeature}><Edit className="w-4 h-4 mr-2" />Modifier</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOpenDeleteDialog(row.original.id)} className="text-red-500 focus:text-red-500"><Trash2 className="w-4 h-4 mr-2" />Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )},
  ];

  const filterComponent = (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="relative sm:col-span-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <input type="text" placeholder="Rechercher un cours..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-background/50 border border-border rounded-lg" />
      </div>
      <Select value={filterType} onValueChange={setFilterType}>
        <SelectTrigger><SelectValue placeholder="Filtrer par type" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les types</SelectItem>
          <SelectItem value="Collectif">Collectif</SelectItem>
          <SelectItem value="Individuel">Individuel</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filterCoach} onValueChange={setFilterCoach}>
        <SelectTrigger><SelectValue placeholder="Filtrer par coach" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les coachs</SelectItem>
          {coaches.map(coach => <SelectItem key={coach.id} value={coach.id}>{coach.name}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
  
  const enrichedData = useMemo(() => {
    return filteredClasses.map(c => ({
      ...c,
      coachName: getCoachName(c.coachId)
    }))
  }, [filteredClasses, coaches]);


  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader
          title="Cours & Planning"
          description="Gérez vos cours collectifs et individuels."
          actionButton={
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white">
              <Plus className="w-4 h-4" /> Nouveau Cours
            </Button>
          }
          view={view}
          setView={setView}
          onExport={handleExport}
        />

        {view === 'table' ? (
          <DataTable columns={columns} data={enrichedData} filterComponent={filterComponent} />
        ) : (
          <>
            <div className="pb-4 border-b border-border/50">{filterComponent}</div>
            {filteredClasses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredClasses.map((classItem, index) => (
                  <motion.div key={classItem.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                    <ClassCard classItem={{...classItem, coachName: getCoachName(classItem.coachId)}} onDelete={handleOpenDeleteDialog} onEdit={handleFutureFeature} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-secondary rounded-xl border border-border/50">
                <CalendarIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Aucun cours trouvé</h3>
                <p className="text-muted-foreground mb-4">Essayez d'ajuster vos filtres ou d'ajouter un nouveau cours.</p>
              </div>
            )}
          </>
        )}

        <AddClassDialog isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} onAdd={handleAddClass} />
        <ConfirmationDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} onConfirm={handleDeleteClass} title="Supprimer ce cours ?" description="Cette action est irréversible. Êtes-vous sûr de vouloir supprimer ce cours ?" />
      </div>
    </Layout>
  );
}

export default Classes;
