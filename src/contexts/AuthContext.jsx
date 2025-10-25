import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// This utility function will help isolate data for each gym
const getGymDataKey = (dataType, gymId) => {
    // For Super Admin, we have specific keys for global data
    if (gymId === 'super_admin_gym') {
        if (dataType === 'gyms') return 'f2fit_users'; // Super admin manages all users (gyms)
        if (dataType === 'tariffs') return 'f2fit_default_tariffs'; // Super admin manages global tariffs
        return null; // Super admin should not access other data types
    }
    
    if (!gymId) return null; // Can't get data without a gymId
    return `f2fit_${gymId}_${dataType}`;
};

export { getGymDataKey };

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem('f2fit_auth');
      const storedUser = localStorage.getItem('f2fit_user');
      
      if (storedAuth === 'true' && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.id) {
            setIsAuthenticated(true);
            setUser(parsedUser);
        } else {
            logout();
        }
      }
    } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        logout();
    }
  }, []);

  const login = (email, password) => {
    let foundUser = null;
    
    // 1. Check for Super Admin
    if (email === 'admin@f2fit.sn' && password === 'admin123') {
      foundUser = {
        id: 'super_admin',
        gymId: 'super_admin_gym',
        email: 'admin@f2fit.sn',
        name: 'Administrateur',
        role: 'admin',
        gymName: 'F2Fit SuperAdmin'
      };
    } else {
      // 2. Check for Gym Admins
      const allGymAdmins = JSON.parse(localStorage.getItem('f2fit_users') || '[]');
      foundUser = allGymAdmins.find(u => u.role === 'gym-admin' && u.email === email && u.password === password && u.status !== 'disabled');

      // 3. If not a gym admin, check for clients (members) across all gyms
      if (!foundUser) {
        allGymAdmins.forEach(gymAdmin => {
          if (foundUser) return; // Stop if already found
          const membersKey = getGymDataKey('members', gymAdmin.gymId);
          const members = JSON.parse(localStorage.getItem(membersKey) || '[]');
          const clientUser = members.find(m => m.email === email && m.password === password && m.status === 'active');
          if (clientUser) {
            foundUser = { ...clientUser, role: 'client', gymName: gymAdmin.gymName };
          }
        });
      }
    }
    
    if (foundUser) {
      const userToStore = { ...foundUser };
      delete userToStore.password;
      
      setIsAuthenticated(true);
      setUser(userToStore);
      localStorage.setItem('f2fit_auth', 'true');
      localStorage.setItem('f2fit_user', JSON.stringify(userToStore));
      return userToStore.role;
    }
    
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('f2fit_auth');
    localStorage.removeItem('f2fit_user');
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}