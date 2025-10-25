import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PublicLayout from '@/components/public/PublicLayout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';
import { useToast } from '@/components/ui/use-toast';
import { User, Mail, Lock, Building } from 'lucide-react';
import { getGymDataKey } from '@/contexts/AuthContext';

const plans = {
  starter: { name: 'Starter', price: '10 000 FCFA/mois' },
  pro: { name: 'Pro', price: '25 000 FCFA/mois' },
  premium: { name: 'Premium', price: '50 000 FCFA/mois' },
};

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedPlanKey, setSelectedPlanKey] = useState('pro');
  const [formData, setFormData] = useState({
      gymName: '',
      adminName: '',
      email: '',
      password: ''
  });

  useEffect(() => {
    const plan = searchParams.get('plan');
    if (plan && plans[plan]) {
      setSelectedPlanKey(plan);
    }
  }, [searchParams]);

  const selectedPlan = plans[selectedPlanKey];

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
        title: "Inscription presque terminée !",
        description: "Vous allez être redirigé vers notre partenaire de paiement. Cette partie est en cours de développement.",
    });

    setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('f2fit_users') || '[]');
        const newUserId = `user_${Date.now()}`;
        const newGymId = `gym_${Date.now()}`;
        
        const newUser = {
            id: newUserId,
            gymId: newGymId,
            name: formData.adminName,
            email: formData.email,
            password: formData.password,
            role: 'gym-admin',
            gymName: formData.gymName,
            plan: selectedPlanKey,
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        localStorage.setItem('f2fit_users', JSON.stringify(users));
        
        const defaultPlans = JSON.parse(localStorage.getItem('f2fit_default_plans') || '[]');
        const plansDataKey = getGymDataKey('subscription_plans', newGymId);
        const initialPlans = defaultPlans.map(p => ({ ...p, gymId: newGymId }));
        localStorage.setItem(plansDataKey, JSON.stringify(initialPlans));

        toast({
            title: "🎉 Bienvenue chez F2FitManager !",
            description: `Votre compte pour ${formData.gymName} a été créé. Veuillez vous connecter.`,
        });

        navigate('/login');
    }, 2000);
  };

  return (
    <PublicLayout>
      <Helmet>
        <title>F2FitManager | Inscription - Rejoignez-nous</title>
        <meta name="description" content="Créez votre compte F2FitManager et commencez à gérer votre salle de sport en quelques minutes." />
      </Helmet>
      <div className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <div className="order-2 md:order-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Créez votre compte</h1>
              <p className="text-muted-foreground mb-8">Rejoignez F2FitManager et commencez à optimiser la gestion de votre salle dès aujourd'hui.</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input type="text" name="gymName" placeholder="Nom de votre salle" onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg" />
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input type="text" name="adminName" placeholder="Votre nom complet" onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg" />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input type="email" name="email" placeholder="Votre adresse email" onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input type="password" name="password" placeholder="Créez un mot de passe" onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg" />
                </div>
                <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg">
                  S'inscrire et Payer
                </Button>
              </form>
            </div>
            
            <div className="bg-background rounded-2xl p-8 border border-border/50 order-1 md:order-2">
              <h2 className="text-2xl font-bold text-primary mb-2">Résumé de la commande</h2>
              <p className="text-muted-foreground mb-6">Vous êtes sur le point de souscrire au plan :</p>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Plan {selectedPlan.name}</span>
                  <span className="font-bold text-lg">{selectedPlan.price}</span>
                </div>
                <div className="border-t border-border/50 pt-4">
                  <p className="text-sm text-muted-foreground">Le paiement se fera via Wave, Orange Money, Free Money ou Carte Bancaire. Un compte administrateur pour votre salle sera créé automatiquement après le paiement.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default RegisterPage;