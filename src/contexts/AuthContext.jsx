import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock users for demonstration
  const mockUsers = {
    admin: {
      id: 'admin-001',
      email: 'admin@hits.com',
      fullName: 'Admin User',
      role: 'admin',
      avatar: 'A',
              permissions: ['dashboard', 'employee-portal', 'attendance', 'visitor-management', 'cctv-monitoring', 'file-manager', 'settings']
    },
    employee: {
      id: 'emp-001',
      email: 'employee@hits.com',
      fullName: 'Employee User',
      role: 'employee',
      avatar: 'E',
      permissions: ['employee-portal', 'attendance']
    }
  };

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Simple mock authentication
    if (email === 'admin@hits.com' && password === 'admin123') {
      const user = mockUsers.admin;
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return { success: true, user };
    } else if (email === 'employee@hits.com' && password === 'emp123') {
      const user = mockUsers.employee;
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return { success: true, user };
    } else {
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isEmployee = () => {
    return user?.role === 'employee';
  };

  const value = {
    user,
    login,
    logout,
    hasPermission,
    isAdmin,
    isEmployee,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
