import React, { useState, useEffect } from 'react';
import PublicLayout from '@/components/public/PublicLayout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, CreditCard, Award, Dumbbell, Star, BarChart, Zap, Check, HelpCircle, Mail, ShieldCheck } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const testimonials = [
  { name: 'Moussa Diop', gym: 'Dakar Fitness Club', text: "F2FitManager a transformé la gestion de ma salle. Je gagne un temps fou et mes membres adorent l'application !", rating: 5 },
  { name: 'Aïcha Fall', gym: 'Senegal Body-Art', text: "L'outil le plus complet du marché sénégalais. Le suivi des abonnements est devenu un jeu d'enfant.", rating: 5 },
  { name: 'Ibrahima Sow', gym: 'Power House Gym', text: "Une interface claire, un support réactif. Je ne pourrais plus m'en passer.", rating: 5 },
];

const featureList = [
  { icon: Users, title: 'Gestion des Membres', description: 'Suivez vos membres, leurs progrès et leur présence en un seul endroit.' },
  { icon: CreditCard, title: 'Abonnements Simplifiés', description: 'Gérez facilement les plans d’abonnement, les paiements et les renouvellements.' },
  { icon: Dumbbell, title: 'Programmes & Cours', description: 'Créez et gérez des programmes personnalisés et des cours collectifs.' },
  { icon: Award, title: 'Suivi des Coachs', description: 'Assignez des coachs, suivez leurs performances et facilitez la communication.' },
  { icon: BarChart, title: 'Rapports Intelligents', description: 'Obtenez des analyses détaillées sur vos revenus, votre croissance et plus encore.' },
  { icon: Zap, title: 'Interface Rapide', description: 'Une expérience utilisateur fluide et intuitive pour une gestion sans effort.' },
];

const faqs = [
    { q: "Comment ajouter un nouveau membre ?", a: "Dans votre tableau de bord, allez dans la section 'Membres' et cliquez sur le bouton 'Ajouter un membre'. Remplissez les informations et enregistrez." },
    { q: "Puis-je changer de plan d'abonnement ?", a: "Oui, vous pouvez changer de plan à tout moment depuis la section 'Mon Abonnement' de vos paramètres." },
    { q: "Les paiements sont-ils sécurisés ?", a: "Absolument. Nous intégrons les solutions de paiement mobile locales (Wave, Orange Money) et les cartes bancaires de manière sécurisée." },
    { q: "Comment contacter le support ?", a: "Vous pouvez utiliser le formulaire de contact sur cette page, nous envoyer un email, ou utiliser le chat en direct pour une assistance immédiate." },
];

const TARIFFS_STORAGE_KEY = 'f2fit_default_tariffs';

const defaultPlansData = [
  { id: 'starter', name: 'Starter', price: '10000', benefits: 'Idéal pour démarrer. Jusqu\'à 50 membres.', isPopular: false, features: ['1 Salle', '50 membres max', 'Support email'] },
  { id: 'pro', name: 'Pro', price: '25000', benefits: 'Pour les salles en croissance. Jusqu\'à 300 membres.', isPopular: true, features: ['3 Salles', '300 membres max', 'Rapports avancés', 'Support prioritaire'] },
  { id: 'premium', name: 'Premium', price: '50000', benefits: 'La solution complète. Membres illimités.', isPopular: false, features: ['Salles illimitées', 'Membres illimités', 'Accès API', 'Support dédié 24/7'] },
];

const LandingPage = () => {
  const [plans, setPlans] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedPlans = JSON.parse(localStorage.getItem(TARIFFS_STORAGE_KEY));
    const activePlans = storedPlans ? storedPlans.filter(p => p.status === 'active') : defaultPlansData.filter(p => p.status === 'active');
    
    // Simple logic to mark one as popular for display
    if (activePlans.length > 0) {
        const proPlan = activePlans.find(p => p.id === 'pro');
        if (proPlan) proPlan.isPopular = true;
        else activePlans[Math.floor(activePlans.length / 2)].isPopular = true;
    }

    setPlans(activePlans);
  }, []);

  const handleContactSubmit = (e) => {
      e.preventDefault();
      toast({
          title: "Message envoyé !",
          description: "Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais.",
      });
      e.target.reset();
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <PublicLayout>
      <Helmet>
        <title>F2FitManager | Votre Partenaire de Gestion Sportive au Sénégal</title>
        <meta name="description" content="Découvrez F2FitManager, la plateforme SaaS leader pour la gestion des salles de sport au Sénégal. Gérez membres, abonnements, et coachs facilement." />
      </Helmet>
      
      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-24 text-center text-white bg-secondary">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-transparent to-purple-500/20"></div>
        <div className="container mx-auto px-4 z-10 relative">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight"
          >
            La <span className="text-gradient bg-gradient-to-r from-red-400 to-orange-400">Gestion</span> de votre Salle de Sport,
            <br/>
            <span className="text-primary">Simplifiée.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground"
          >
            F2FitManager est la solution tout-en-un conçue pour les salles de sport au Sénégal. Gagnez du temps, fidélisez vos membres et boostez vos revenus.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <Button size="xl" onClick={() => scrollToSection('pricing')} className="bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg transform hover:scale-105 transition-transform">
              Commencer Maintenant
            </Button>
            <Button size="xl" variant="outline" onClick={() => scrollToSection('features')}>
                Découvrir les fonctionnalités
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Une Plateforme, <span className="text-primary">Tout Gérer</span></h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Toutes les fonctionnalités dont vous avez besoin pour propulser votre salle de sport vers le succès.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureList.map((feature, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="bg-secondary p-8 rounded-2xl border border-border/50 hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-6"><feature.icon className="h-6 w-6 text-primary" /></div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Ils Nous Font <span className="text-primary">Confiance</span></h2>
             <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Découvrez ce que les gérants de salles de sport pensent de F2FitManager.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="bg-background p-8 rounded-2xl border border-border/50 flex flex-col">
                <div className="flex mb-4">{[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}</div>
                <p className="text-muted-foreground flex-grow mb-6">"{testimonial.text}"</p>
                <div><p className="font-semibold text-foreground">{testimonial.name}</p><p className="text-sm text-primary">{testimonial.gym}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Des Tarifs <span className="text-primary">Flexibles</span> Pour Votre Succès</h2>
            <p className="mt-6 text-lg text-muted-foreground">Choisissez le plan qui correspond à la taille et aux ambitions de votre salle de sport.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className={cn('bg-secondary rounded-2xl p-8 border flex flex-col', plan.isPopular ? 'border-primary shadow-2xl shadow-primary/20' : 'border-border/50')}>
                {plan.isPopular && <div className="text-center mb-4"><span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">LE PLUS POPULAIRE</span></div>}
                 <div className="flex items-center gap-3 mb-4 justify-center">
                    <ShieldCheck className="w-8 h-8 text-primary"/>
                    <h3 className="text-2xl font-bold text-center">{plan.name}</h3>
                </div>
                <p className="text-muted-foreground text-center mt-2 h-10">{plan.benefits}</p>
                <div className="text-center my-8"><span className="text-5xl font-extrabold">{Number(plan.price).toLocaleString()}</span><span className="text-lg text-muted-foreground"> FCFA / mois</span></div>
                <ul className="space-y-4 flex-grow mb-8">
                    {(plan.features || []).map((feature, i) => (<li key={i} className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500 flex-shrink-0" /><span className="text-muted-foreground">{feature}</span></li>))}
                </ul>
                <Button asChild size="lg" className={cn('w-full mt-auto', plan.isPopular ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg' : 'bg-primary/10 text-primary hover:bg-primary/20')}>
                  <Link to={`/register?plan=${plan.id}`}>S'abonner</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact/Support Section */}
      <section id="contact" className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Besoin d'un coup de main ?</h2>
            <p className="mt-6 text-lg text-muted-foreground">Notre équipe est là pour vous aider. Consultez notre FAQ ou contactez-nous directement.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><HelpCircle className="text-primary"/>Questions Fréquentes</h3>
              <div className="space-y-4">{faqs.map((faq, index) => (<details key={index} className="bg-background p-4 rounded-lg border border-border/50"><summary className="font-semibold cursor-pointer">{faq.q}</summary><p className="mt-2 text-muted-foreground">{faq.a}</p></details>))}</div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><Mail className="text-primary"/>Contactez-nous</h3>
              <form onSubmit={handleContactSubmit} className="bg-background p-8 rounded-2xl border border-border/50 space-y-4">
                 <input type="text" placeholder="Votre Nom" required className="w-full pl-4 pr-4 py-3 bg-secondary border border-border rounded-lg"/>
                 <input type="email" placeholder="Votre Email" required className="w-full pl-4 pr-4 py-3 bg-secondary border border-border rounded-lg"/>
                 <textarea placeholder="Votre Message" required rows="5" className="w-full pl-4 pr-4 py-3 bg-secondary border border-border rounded-lg min-h-[120px]"></textarea>
                 <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white">Envoyer le Message</Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default LandingPage;