import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './useAppStore';
import { addToast } from '../store/slices/uiSlice';
import { useLanguage } from '../contexts/LanguageContext';

export type ProtectedAction = 'favorite' | 'message' | 'addProperty' | 'dashboard' | 'schedule' | 'review' | 'general';

export function useAuthGuard() {
  const user = useAppSelector(s => s.auth.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { lang } = useLanguage();

  /**
   * Returns true if user is authenticated and can proceed.
   * Otherwise, shows a toast warning and redirects to /login.
   */
  const requireAuth = (action: ProtectedAction = 'general'): boolean => {
    if (user) return true;

    dispatch(addToast({
      message: lang === 'ar' ? 'يجب تسجيل الدخول أو إنشاء حساب أولاً.' : 'Please sign in or register first.',
      type: 'warning'
    }));

    navigate('/login', { state: { showLoginMessage: true } });
    return false;
  };

  return {
    requireAuth,
    modalOpen: false,
    modalAction: 'general' as ProtectedAction,
    closeModal: () => {},
    isAuthenticated: !!user
  };
}
