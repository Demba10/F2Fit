
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const role = login(email, password);

    if (role) {
      toast({
        title: "Connexion réussie !",
        description: "Bienvenue sur votre espace. 🔥",
      });
      // Redirect based on role
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'gym-admin') {
        navigate('/dashboard');
      } else if (role === 'client') {
        navigate('/client/dashboard');
      } else {
        navigate('/dashboard'); // Fallback
      }
    } else {
      toast({
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-background to-purple-500/10"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-secondary rounded-2xl shadow-2xl shadow-primary/10 p-8 border border-border/50">
          <div className="flex flex-col items-center mb-8">
             <Link to="/" className="flex flex-col items-center gap-4">
                <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="bg-gradient-to-br from-red-500 to-orange-500 p-4 rounded-full mb-4"
                >
                <Dumbbell className="w-8 h-8 text-white" />
                </motion.div>
                <h1 className="text-3xl font-bold text-gradient bg-gradient-to-r from-red-500 to-orange-500">F2FitManager</h1>
            </Link>
            <p className="text-muted-foreground mt-2">Connectez-vous à votre espace personnel.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground"
                  placeholder="Votre email"
                  required
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full py-6 text-lg bg-gradient-to-r from-red-500 to-orange-500 hover:opacity-90 transition-opacity">
              Se connecter
            </Button>
            
            <p className="text-center text-sm text-muted-foreground">
                Propriétaire de salle ?{' '}
                <Link to="/register" className="font-semibold text-primary hover:underline">
                    Inscrivez votre salle
                </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
