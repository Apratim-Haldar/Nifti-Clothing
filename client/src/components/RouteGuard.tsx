import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const RouteGuard = ({ 
  children, 
  requireAuth = false, 
  redirectTo = '/products' 
}: RouteGuardProps) => {
  const { user } = useAuth();

  // If route requires authentication and user is not logged in
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // If route is for unauthenticated users (login/register) and user is logged in
  if (!requireAuth && user) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

// Convenience component for login/register pages
export const GuestOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <RouteGuard requireAuth={false} redirectTo="/products">
      {children}
    </RouteGuard>
  );
};

// Convenience component for protected pages
export const ProtectedRoute = ({ 
  children, 
  redirectTo = '/products' 
}: { 
  children: React.ReactNode;
  redirectTo?: string;
}) => {
  return (
    <RouteGuard requireAuth={true} redirectTo={redirectTo}>
      {children}
    </RouteGuard>
  );
};