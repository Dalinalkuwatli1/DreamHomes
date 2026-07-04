import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAppDispatch } from '../../hooks/useAppStore';
import { login } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/uiSlice';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, isRtl, lang } = useLanguage();
  const [showPw, setShowPw] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (location.state?.showLoginMessage) {
      dispatch(addToast({
        message: lang === 'ar' ? 'يجب تسجيل الدخول أو إنشاء حساب أولاً.' : 'Please sign in or register first.',
        type: 'warning'
      }));
      // clear the state so it doesn't pop up on every page render/refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, lang, dispatch, navigate, location.pathname]);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await api.post('/auth/login', data);
      const { user: rawUser, accessToken } = response.data.data;
      // Normalize user so favoriteIds always exists
      const user = { ...rawUser, favoriteIds: rawUser.favoriteIds ?? [] };
      dispatch(login({ user, accessToken }));
      dispatch(addToast({ 
        message: lang === 'ar' ? `مرحباً بعودتك، ${user.name}! 👋` : `Welcome back, ${user.name.split(' ')[0]}!`, 
        type: 'success' 
      }));
      // Redirect owner or admin to dashboard, regular user to home
      const userRole = user.role?.toUpperCase();
      navigate(userRole === 'OWNER' || userRole === 'ADMIN' ? '/dashboard' : '/');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || (lang === 'ar' ? 'فشل تسجيل الدخول. يرجى التحقق من البيانات.' : 'Login failed. Please check your credentials.');
      dispatch(addToast({ message: errorMsg, type: 'error' }));
    }
  };

  const handleDemoLogin = (role: 'owner' | 'user') => {
    const email = role === 'owner' ? 'owner@example.com' : 'user@example.com';
    setValue('email', email);
    setValue('password', 'password123');
    // Trigger submission
    setTimeout(() => {
      handleSubmit(onSubmit)();
    }, 50);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}>
            <Building2 size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-custom font-serif">{t('auth.welcomeBack')}</h1>
          <p className="text-muted mt-1 text-sm">{t('auth.signInToAccount')}</p>
        </div>

        <div className="dh-card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <label className="dh-label flex items-center gap-1.5"><Mail size={12} /> {t('auth.email')}</label>
              <input {...register('email')} type="email" placeholder="your@email.com" className="dh-input text-sm" autoComplete="email" />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="dh-label flex items-center gap-1.5"><Lock size={12} /> {t('auth.password')}</label>
              <div className="relative">
                <input {...register('password')} type={showPw ? 'text' : 'password'} placeholder="••••••••" className={`dh-input text-sm ${isRtl ? 'pl-12 pr-4' : 'pr-12'}`} />
                <button type="button" onClick={() => setShowPw(s => !s)} className={`absolute top-1/2 -translate-y-1/2 text-muted hover:text-custom transition-colors ${isRtl ? 'left-4' : 'right-4'}`}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <label className="flex items-center gap-2 text-muted cursor-pointer">
                <input type="checkbox" className="accent-sky-500" /> {t('auth.rememberMe')}
              </label>
              <a href="#" className="text-sky-500 hover:text-sky-600 font-bold">{t('auth.forgotPassword')}</a>
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary justify-center w-full mt-2">
              {isSubmitting ? t('auth.signingIn') : t('auth.signIn')}
            </button>
          </form>

          {/* Quick Demo Login */}
          <div className="mt-6 pt-5 border-t border-custom">
            <p className="text-center text-xs text-muted mb-3 font-semibold">
              {lang === 'ar' ? 'تسجيل دخول سريع للتجربة (Demo)' : 'Quick Demo Access'}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleDemoLogin('owner')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-sky-500/30 bg-sky-500/5 text-sky-500 hover:bg-sky-500/10 text-xs font-bold transition-all"
              >
                🏢 {lang === 'ar' ? 'دخول كمالك عقار' : 'Login as Owner'}
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('user')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-indigo-500/30 bg-indigo-500/5 text-indigo-500 hover:bg-indigo-500/10 text-xs font-bold transition-all"
              >
                👤 {lang === 'ar' ? 'دخول كمستخدم عادي' : 'Login as User'}
              </button>
            </div>
          </div>

          <p className="text-center text-xs sm:text-sm text-muted mt-6">
            {t('auth.dontHaveAccount')}{' '}
            <Link to="/register" className="text-sky-500 hover:text-sky-600 font-bold">{t('auth.createAccount')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
