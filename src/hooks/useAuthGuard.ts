import { useState } from 'react';
import { useAppSelector } from '../hooks/useAppStore';

export type ProtectedAction = 'favorite' | 'message' | 'addProperty' | 'dashboard' | 'schedule' | 'review' | 'general';

export function useAuthGuard() {
  const user = useAppSelector(s => s.auth.user);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<ProtectedAction>('general');

  /**
   * Returns true if user is authenticated and can proceed.
   * Returns false and opens auth modal if guest.
   */
  const requireAuth = (action: ProtectedAction = 'general'): boolean => {
    if (user) return true;
    setModalAction(action);
    setModalOpen(true);
    return false;
  };

  const closeModal = () => setModalOpen(false);

  return { requireAuth, modalOpen, modalAction, closeModal, isAuthenticated: !!user };
}
