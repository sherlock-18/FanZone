import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return null; // This will redirect to login via App.tsx logic
  }

  return <>{children}</>;
};

export default ProtectedRoute;