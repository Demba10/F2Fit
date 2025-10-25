

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';

// Public Pages
import LandingPage from '@/pages/public/LandingPage';
import RegisterPage from '@/pages/public/RegisterPage';
import Login from '@/pages/Login';

// App Pages (Gym Admin)
import Dashboard from '@/pages/Dashboard';
import Members from '@/pages/Members';
import Coaches from '@/pages/Coaches';
import Subscriptions from '@/pages/Subscriptions';
import SubscriptionPlans from '@/pages/SubscriptionPlans';
import Classes from '@/pages/Classes';
import Equipment from '@/pages/Equipment';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import Messaging from '@/pages/Messaging';

// Super Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import Gyms from '@/pages/Gyms';
import AdminReports from '@/pages/admin/AdminReports';
import DefaultPlans from '@/pages/admin/DefaultPlans';

// Client Pages
import ClientDashboard from '@/pages/client/ClientDashboard';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';

function PrivateRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user?.role)) {
    // Redirect based on role if not allowed
    if (user?.role === 'admin') return <Navigate to="/admin/dashboard" />;
    if (user?.role === 'gym-admin') return <Navigate to="/dashboard" />;
    if (user?.role === 'client') return <Navigate to="/client/dashboard" />;
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Helmet>
        <title>F2FitManager - Gestion de Salle de Sport</title>
        <meta name="description" content="Solution complète de gestion pour salles de sport au Sénégal - Membres, Coachs, Abonnements et Cours" />
      </Helmet>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<Login />} />

          {/* App (Private) Routes for Gym Admins */}
          <Route path="/dashboard" element={<PrivateRoute allowedRoles={['gym-admin']}><Dashboard /></PrivateRoute>} />
          <Route path="/members" element={<PrivateRoute allowedRoles={['gym-admin']}><Members /></PrivateRoute>} />
          <Route path="/coaches" element={<PrivateRoute allowedRoles={['gym-admin']}><Coaches /></PrivateRoute>} />
          <Route path="/subscriptions" element={<PrivateRoute allowedRoles={['gym-admin']}><Subscriptions /></PrivateRoute>} />
          <Route path="/subscription-plans" element={<PrivateRoute allowedRoles={['gym-admin']}><SubscriptionPlans /></PrivateRoute>} />
          <Route path="/classes" element={<PrivateRoute allowedRoles={['gym-admin']}><Classes /></PrivateRoute>} />
          <Route path="/equipment" element={<PrivateRoute allowedRoles={['gym-admin']}><Equipment /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute allowedRoles={['gym-admin']}><Reports /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute allowedRoles={['gym-admin']}><Settings /></PrivateRoute>} />
          <Route path="/messaging" element={<PrivateRoute allowedRoles={['gym-admin']}><Messaging /></PrivateRoute>} />
          <Route path="/messaging/:contactId" element={<PrivateRoute allowedRoles={['gym-admin']}><Messaging /></PrivateRoute>} />
          
          {/* Super Admin Routes */}
          <Route path="/admin/dashboard" element={<PrivateRoute allowedRoles={['admin']}><AdminDashboard /></PrivateRoute>} />
          <Route path="/gyms" element={<PrivateRoute allowedRoles={['admin']}><Gyms /></PrivateRoute>} />
          <Route path="/admin/reports" element={<PrivateRoute allowedRoles={['admin']}><AdminReports /></PrivateRoute>} />
          <Route path="/admin/tariffs" element={<PrivateRoute allowedRoles={['admin']}><DefaultPlans /></PrivateRoute>} />
          
          {/* Client Routes */}
          <Route path="/client/dashboard" element={<PrivateRoute allowedRoles={['client']}><ClientDashboard /></PrivateRoute>} />

          {/* Redirect any other path */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;

