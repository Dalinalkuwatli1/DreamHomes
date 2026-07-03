import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppStore';

interface ProtectedRouteProps {
  allowedRoles?: Array<'user' | 'owner' | 'admin'>;
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
