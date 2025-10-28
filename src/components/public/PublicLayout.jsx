import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { id: 'features', label: 'Fonctionnalités' },
  { id: 'pricing', label: 'Tarifs' },
  { id: 'contact', label: 'Support' },
];

const PublicLayout = ({ children }) => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Dumbbell className="w-8 h-8 text-primary" />
            <span className="hidden md:inline text-2xl font-bold text-gradient bg-gradient-to-r from-red-500 to-orange-500">
              F2FitManager
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
             <Button variant="ghost" asChild>
                <Link to="/login">Se Connecter</Link>
             </Button>
            <Button asChild className="bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg">
                <button onClick={() => scrollToSection('pricing')}>S'abonner</button>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-20">
        {children}
      </main>

      <footer className="bg-secondary border-t border-border/50">
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">F2FitManager</h3>
                    <p className="text-muted-foreground text-sm">La solution tout-en-un pour la gestion de votre salle de sport au Sénégal.</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Liens Rapides</h3>
                    <ul className="space-y-2">
                        <li><button onClick={() => scrollToSection('pricing')} className="text-sm text-muted-foreground hover:text-primary">Tarifs</button></li>
                        <li><button onClick={() => scrollToSection('contact')} className="text-sm text-muted-foreground hover:text-primary">Support</button></li>
                        <li><Link to="/login" className="text-sm text-muted-foreground hover:text-primary">Connexion</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Contact</h3>
                     <p className="text-sm text-muted-foreground">Dakar, Sénégal</p>
                     <p className="text-sm text-muted-foreground">contact@f2fit.sn</p>
                </div>
            </div>
            <div className="mt-8 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
                <p>&copy; 2025 F2FitManager. Tous droits réservés.</p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;