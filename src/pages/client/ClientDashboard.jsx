
import React, { useState, useEffect } from 'react';
import { useAuth, getGymDataKey } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOut, CreditCard, Calendar, Dumbbell, ShieldCheck, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ChangePasswordDialog from '@/components/client/ChangePasswordDialog';

const getStatusInfo = (sub) => {
    if (!sub) return { text: 'Aucun Abonnement', color: 'bg-gray-500', textColor: 'text-gray-400' };
    const today = new Date("2025-10-24");
    const endDate = new Date(sub.endDate);
    const diffDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: 'Expiré', color: 'bg-red-500', textColor: 'text-red-400' };
    if (diffDays <= 7) return { text: 'Expire bientôt', color: 'bg-orange-500', textColor: 'text-orange-400' };
    return { text: 'Actif', color: 'bg-green-500', textColor: 'text-green-400' };
};

function ClientDashboard() {
    const { user, logout, login } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [subscription, setSubscription] = useState(null);
    const [plan, setPlan] = useState(null);
    const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);

    const subscriptionsDataKey = user ? getGymDataKey('subscriptions', user.gymId) : null;
    const plansDataKey = user ? getGymDataKey('subscription_plans', user.gymId) : null;
    const membersDataKey = user ? getGymDataKey('members', user.gymId) : null;
    
    useEffect(() => {
        if (user?.mustChangePassword) {
            setIsPasswordChangeOpen(true);
        }
    }, [user]);

    useEffect(() => {
        if (user && subscriptionsDataKey && plansDataKey) {
            const allSubscriptions = JSON.parse(localStorage.getItem(subscriptionsDataKey) || '[]');
            const userSubscriptions = allSubscriptions.filter(s => s.memberId === user.id);
            const latestSub = userSubscriptions.sort((a, b) => new Date(b.endDate) - new Date(a.endDate))[0];
            setSubscription(latestSub);

            if (latestSub) {
                const allPlans = JSON.parse(localStorage.getItem(plansDataKey) || '[]');
                const currentPlan = allPlans.find(p => p.id === latestSub.planId);
                setPlan(currentPlan);
            }
        }
    }, [user, subscriptionsDataKey, plansDataKey]);

    const handleLogout = () => {
        logout();
        navigate('/login');
        toast({ title: "Déconnexion réussie." });
    };
    
    const handlePasswordSave = (newPassword) => {
        if (!user || !membersDataKey) return;
        
        const members = JSON.parse(localStorage.getItem(membersDataKey) || '[]');
        const updatedMembers = members.map(member => {
            if (member.id === user.id) {
                return { ...member, password: newPassword, mustChangePassword: false };
            }
            return member;
        });
        localStorage.setItem(membersDataKey, JSON.stringify(updatedMembers));
        
        // Re-login to update the user object in AuthContext
        login(user.email, newPassword);

        setIsPasswordChangeOpen(false);
        toast({ title: "Mot de passe mis à jour !", description: "Votre compte est maintenant sécurisé." });
    };

    const handleRenew = () => {
        toast({
            title: "🚧 Simulation de Paiement",
            description: "Redirection vers la page de paiement (Wave/Orange Money)...",
        });

        setTimeout(() => {
            if (subscription && plan && subscriptionsDataKey) {
                const newStartDate = new Date("2025-10-24");
                const newEndDate = new Date(newStartDate);
                newEndDate.setDate(newStartDate.getDate() + plan.duration);

                const newSub = {
                    ...subscription,
                    id: `sub_${Date.now()}`,
                    startDate: newStartDate.toISOString().split('T')[0],
                    endDate: newEndDate.toISOString().split('T')[0],
                    status: 'active',
                };

                const allSubscriptions = JSON.parse(localStorage.getItem(subscriptionsDataKey) || '[]');
                const updatedSubscriptions = [...allSubscriptions, newSub];
                localStorage.setItem(subscriptionsDataKey, JSON.stringify(updatedSubscriptions));
                
                setSubscription(newSub);

                toast({
                    title: "✅ Paiement Réussi !",
                    description: `Votre abonnement '${plan.name}' a été renouvelé.`,
                });
            } else {
                 toast({
                    title: "❌ Erreur",
                    description: "Impossible de renouveler. Aucun plan actif trouvé.",
                    variant: "destructive"
                });
            }
        }, 2000);
    };

    const statusInfo = getStatusInfo(subscription);

    return (
        <>
            <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    <header className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <Dumbbell className="w-8 h-8 text-primary" />
                            <h1 className="text-2xl font-bold text-foreground">{user?.gymName || 'Mon Espace'}</h1>
                        </div>
                        <Button variant="ghost" onClick={handleLogout} className="gap-2">
                            <LogOut className="w-4 h-4" />
                            Déconnexion
                        </Button>
                    </header>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Card className="bg-secondary border-border/50 shadow-lg">
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-2xl text-gradient bg-gradient-to-r from-red-500 to-orange-500">
                                            Bienvenue, {user?.name} !
                                        </CardTitle>
                                        <CardDescription className="mt-1">Voici le récapitulatif de votre abonnement.</CardDescription>
                                    </div>
                                    <Badge className={`text-sm ${statusInfo.textColor} ${statusInfo.color}/20 border-none`}>{statusInfo.text}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {subscription ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                        <div className="bg-background/50 p-4 rounded-lg flex items-center gap-4">
                                            <ShieldCheck className="w-6 h-6 text-primary flex-shrink-0" />
                                            <div>
                                                <p className="text-muted-foreground">Plan Actuel</p>
                                                <p className="font-semibold text-lg">{subscription.planName}</p>
                                            </div>
                                        </div>
                                        <div className="bg-background/50 p-4 rounded-lg flex items-center gap-4">
                                            <CreditCard className="w-6 h-6 text-primary flex-shrink-0" />
                                            <div>
                                                <p className="text-muted-foreground">Montant</p>
                                                <p className="font-semibold text-lg">{subscription.price.toLocaleString()} FCFA</p>
                                            </div>
                                        </div>
                                        <div className="bg-background/50 p-4 rounded-lg flex items-center gap-4">
                                            <Calendar className="w-6 h-6 text-green-500 flex-shrink-0" />
                                            <div>
                                                <p className="text-muted-foreground">Date de début</p>
                                                <p className="font-semibold">{new Date(subscription.startDate).toLocaleDateString('fr-FR')}</p>
                                            </div>
                                        </div>
                                        <div className="bg-background/50 p-4 rounded-lg flex items-center gap-4">
                                            <Calendar className="w-6 h-6 text-red-500 flex-shrink-0" />
                                            <div>
                                                <p className="text-muted-foreground">Date de fin</p>
                                                <p className="font-semibold">{new Date(subscription.endDate).toLocaleDateString('fr-FR')}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-background/50 rounded-lg">
                                        <p className="text-muted-foreground">Vous n'avez aucun abonnement actif.</p>
                                        <p className="text-sm mt-2">Veuillez contacter votre salle pour souscrire à un plan.</p>
                                    </div>
                                )}

                                {subscription && (
                                    <div className="pt-6 border-t border-border/50">
                                        <Button onClick={handleRenew} size="lg" className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg">
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                            Renouveler mon Abonnement
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
            <ChangePasswordDialog 
                isOpen={isPasswordChangeOpen} 
                onSave={handlePasswordSave}
                isFirstLogin={true} 
            />
        </>
    );
}

export default ClientDashboard;
