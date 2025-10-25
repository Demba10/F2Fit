
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CreditCard,
  Calendar,
  Dumbbell,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  MessageSquare,
  Building,
  Package,
  ChevronsLeft,
  ChevronsRight,
  Tags,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const gymAdminNav = [
  { icon: LayoutDashboard, label: 'Tableau de Bord', path: '/dashboard' },
  { icon: Users, label: 'Membres', path: '/members' },
  { icon: UserCheck, label: 'Coachs', path: '/coaches' },
  { icon: CreditCard, label: 'Abonnements', path: '/subscriptions' },
  { icon: Package, label: 'Plans', path: '/subscription-plans' },
  { icon: Calendar, label: 'Cours', path: '/classes' },
  { icon: Dumbbell, label: 'Équipements', path: '/equipment' },
  { icon: BarChart3, label: 'Rapports', path: '/reports' },
];

const superAdminNav = [
  { icon: LayoutDashboard, label: 'Tableau de Bord', path: '/admin/dashboard' },
  { icon: Building, label: 'Salles', path: '/gyms' },
  { icon: Tags, label: 'Tarifs Globaux', path: '/admin/tariffs' },
  { icon: BarChart3, label: 'Rapports Anciens', path: '/admin/reports' },
];

const bottomNav = [
  { icon: MessageSquare, label: 'Messagerie', path: '/messaging' },
  { icon: Sparkles, label: 'Suggestions IA', path: '#' },
  { icon: Settings, label: 'Paramètres', path: '/settings' },
];

function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleFutureFeatureClick = (e, path) => {
    if (path === '#') {
      e.preventDefault();
      toast({
        title: "🚧 Bientôt disponible !",
        description: "Cette fonctionnalité est en cours de développement. Revenez bientôt ! 🚀",
      });
    }
  };

  const renderMenuItems = (items) => {
    return items.map((item) => {
      const Icon = item.icon;
      const isActive = location.pathname.startsWith(item.path);
      
      return (
        <Link
          key={item.path || item.label}
          to={item.path}
          onClick={(e) => {
              setIsMobileMenuOpen(false);
              handleFutureFeatureClick(e, item.path);
          }}
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
            'group',
            isActive 
              ? 'bg-primary/10 text-primary font-semibold' 
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
            isSidebarCollapsed && 'justify-center'
          )}
        >
          <Icon className="w-5 h-5 flex-shrink-0" />
          <span className={cn('transition-opacity duration-200', isSidebarCollapsed && 'lg:hidden')}>{item.label}</span>
        </Link>
      );
    });
  };
  
  const SidebarContent = () => {
    const mainNavItems = user?.role === 'admin' ? superAdminNav : gymAdminNav;

    return (
    <>
       <div className="relative">
          <div className={cn( "p-4 md:p-6 border-b border-border text-center flex items-center gap-2", isSidebarCollapsed ? 'justify-center' : 'justify-between' )}>
              <div className={cn('flex items-center gap-2', isSidebarCollapsed && 'lg:hidden')}>
                <h1 className="text-xl md:text-2xl font-bold text-gradient bg-gradient-to-r from-red-500 to-orange-500">{user?.gymName || 'F2Fit'}</h1>
              </div>
              <Button variant="ghost" size="icon" className="hidden lg:flex" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
                  {isSidebarCollapsed ? <ChevronsRight className="w-5 h-5"/> : <ChevronsLeft className="w-5 h-5"/>}
              </Button>
            </div>
            <AnimatePresence>
              {isLoading && (
                <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" initial={{ width: 0 }} animate={{ width: "100%" }} exit={{ width: "100%", opacity: 0 }} transition={{ duration: 0.5, ease: "easeInOut" }} />
              )}
            </AnimatePresence>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {renderMenuItems(mainNavItems)}
        </nav>
        
        <div className={cn("p-4 border-t border-border")}>
          {user?.role === 'gym-admin' && (
             <nav className="space-y-1 mb-4">
                 {renderMenuItems(bottomNav)}
            </nav>
          )}
        
          <div className={cn("flex items-center gap-3 mb-3 px-2", isSidebarCollapsed && 'lg:justify-center')}>
            <div className="w-10 h-10 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center"> <span className="text-primary font-semibold">{user?.name?.charAt(0).toUpperCase() || 'A'}</span></div>
            <div className={cn("flex-1 min-w-0", isSidebarCollapsed && "lg:hidden")}>
              <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="secondary" className="w-full gap-2">
            <LogOut className={cn("w-4 h-4 flex-shrink-0")} />
            <span className={cn(isSidebarCollapsed && "lg:hidden")}>Déconnexion</span>
          </Button>
        </div>
    </>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-b border-border z-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gradient bg-gradient-to-r from-red-500 to-orange-500">{user?.gymName || 'F2FitManager'}</h1>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-lg hover:bg-secondary">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      
      <aside className={cn(`fixed top-0 left-0 h-full bg-background border-r border-border z-40 flex flex-col transition-transform duration-300 ease-in-out w-64 lg:hidden`, isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full')}>
          <SidebarContent />
      </aside>

      <aside className={cn( "hidden lg:fixed lg:top-0 lg:left-0 lg:h-full lg:bg-background lg:border-r lg:border-border z-40", "lg:flex flex-col transition-all duration-300 ease-in-out", isSidebarCollapsed ? "w-20" : "w-64" )}>
        <SidebarContent />
      </aside>

      <main className={cn( "pt-20 lg:pt-0 min-h-screen transition-all duration-300 ease-in-out", isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64" )}>
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {isMobileMenuOpen && ( <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} /> )}
    </div>
  );
}

export default Layout;
