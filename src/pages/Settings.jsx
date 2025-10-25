import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Building2, Palette, Mail, Phone, MapPin, Image } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

function Settings() {
  const { gymSettings, updateGymSettings } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState(gymSettings || {});

  const handleSubmit = (e) => {
    e.preventDefault();
    updateGymSettings(formData);
    toast({
      title: "Paramètres sauvegardés !",
      description: "Les personnalisations de votre salle ont été mises à jour.",
    });
  };

  const handleFeatureClick = () => {
    toast({
      title: "🚧 Bientôt disponible !",
      description: "Cette fonctionnalité est en cours de développement. Revenez bientôt ! 🚀",
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Layout>
      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-red-500 to-orange-500">Paramètres</h1>
          <p className="text-muted-foreground mt-2">Personnalisez l'apparence et les informations de votre salle.</p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-secondary rounded-xl shadow-lg border border-border/50 p-8 space-y-8"
        >
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Informations de la Salle
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Nom de la Salle</label>
                    <input type="text" value={formData.gymName || ''} onChange={(e) => handleChange('gymName', e.target.value)} className="w-full bg-background/50 px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"/>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Lien Unique</label>
                    <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-background text-sm text-muted-foreground">f2fitc.sn/</span>
                        <input type="text" defaultValue={formData.gymName?.toLowerCase().replace(/\s+/g, '-') || ''} className="w-full bg-background/50 px-4 py-2 border border-border rounded-r-lg focus:ring-2 focus:ring-primary focus:border-transparent" readOnly/>
                    </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
                  <input type="email" value={formData.email || ''} onChange={(e) => handleChange('email', e.target.value)} className="w-full bg-background/50 px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Téléphone</label>
                  <input type="tel" value={formData.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} className="w-full bg-background/50 px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Adresse</label>
                <input type="text" value={formData.address || ''} onChange={(e) => handleChange('address', e.target.value)} className="w-full bg-background/50 px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"/>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Personnalisation
            </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Logo</label>
                    <div onClick={handleFeatureClick} className="w-full h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                        <Image className="w-8 h-8 text-muted-foreground mb-2"/>
                        <span className="text-sm text-muted-foreground">Cliquez pour uploader</span>
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Couleur Principale</label>
                        <input type="color" value={formData.primaryColor || '#ef4444'} onChange={(e) => handleChange('primaryColor', e.target.value)} className="w-full h-12 p-1 rounded-lg border border-border bg-background cursor-pointer"/>
                    </div>
                </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border/50">
            <Button type="submit" className="gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white">
              <Save className="w-4 h-4" />
              Sauvegarder les Modifications
            </Button>
          </div>
        </motion.form>
      </div>
    </Layout>
  );
}

export default Settings;