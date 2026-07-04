import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppStore';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ showLoginMessage: true }} replace />;
  }

  // Compare case-insensitively — backend returns OWNER/USER/ADMIN uppercase
  if (allowedRoles && !allowedRoles.map(r => r.toUpperCase()).includes(user.role?.toUpperCase())) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
