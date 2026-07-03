import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import { useAppDispatch } from '../../hooks/useAppStore';
import { login } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/uiSlice';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  role: z.enum(['user', 'owner']),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t, isRtl, lang } = useLanguage();
  const [showPw, setShowPw] = useState(false);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'user' },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: FormData) => {
    try {
      const response = await api.post('/users/register', {
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role.toUpperCase(), // Match backend roles: USER / OWNER / ADMIN
        password: data.password,
      });

      const { user, accessToken } = response.data.data;
      dispatch(login({ user, accessToken }));
      dispatch(addToast({ 
        message: lang === 'ar' ? `مرحباً بك في DreamHomes، ${user.name}! 🎉` : `Welcome to DreamHomes, ${user.name.split(' ')[0]}!`, 
        type: 'success' 
      }));
      navigate(user.role === 'OWNER' ? '/dashboard' : '/');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || (lang === 'ar' ? 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.' : 'Registration failed. Please try again.');
      dispatch(addToast({ message: errorMsg, type: 'error' }));
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}>
            <Building2 size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-custom font-serif">{t('nav.register')}</h1>
          <p className="text-muted mt-1 text-sm">{t('auth.joinThousands')}</p>
        </div>

        <div className="dh-card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Role */}
            <div>
              <label className="dh-label">{t('auth.iWantTo')}</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'user', label: t('auth.findHome'), emoji: '🔍' },
                  { value: 'owner', label: t('auth.listProperty'), emoji: '🏠' },
                ].map(r => (
                  <label
                    key={r.value}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedRole === r.value ? 'border-sky-500 bg-sky-500/5' : 'border-custom hover:border-sky-300'
                    }`}
                  >
                    <input type="radio" value={r.value} {...register('role')} className="sr-only" />
                    <span className="text-lg">{r.emoji}</span>
                    <span className="text-sm font-semibold text-custom">{r.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="dh-label flex items-center gap-1.5"><User size={12} /> {t('auth.fullName')}</label>
              <input {...register('name')} placeholder={t('auth.fullNamePlaceholder')} className="dh-input text-sm" />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="dh-label flex items-center gap-1.5"><Mail size={12} /> {t('auth.email')}</label>
                <input {...register('email')} type="email" placeholder="your@email.com" className="dh-input text-sm" />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="dh-label flex items-center gap-1.5"><Phone size={12} /> {t('auth.phone')}</label>
                <input {...register('phone')} placeholder="+1 555-000-0000" className="dh-input text-sm" />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            <div>
              <label className="dh-label flex items-center gap-1.5"><Lock size={12} /> {t('auth.password')}</label>
              <div className="relative">
                <input {...register('password')} type={showPw ? 'text' : 'password'} placeholder={t('auth.passwordMin')} className={`dh-input text-sm ${isRtl ? 'pl-12 pr-4' : 'pr-12'}`} />
                <button type="button" onClick={() => setShowPw(s => !s)} className={`absolute top-1/2 -translate-y-1/2 text-muted hover:text-custom transition-colors ${isRtl ? 'left-4' : 'right-4'}`}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="dh-label flex items-center gap-1.5"><Lock size={12} /> {t('auth.confirmPassword')}</label>
              <input {...register('confirmPassword')} type="password" placeholder={t('auth.repeatPassword')} className="dh-input text-sm" />
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <label className="flex items-start gap-3 text-xs sm:text-sm text-muted cursor-pointer mt-1">
              <input type="checkbox" required className="mt-0.5 accent-sky-500" />
              <span>{isRtl ? 'أوافق على الشروط والأحكام وسياسة الخصوصية' : 'I agree to the Terms of Service and Privacy Policy'}</span>
            </label>

            <button type="submit" disabled={isSubmitting} className="btn-primary justify-center w-full mt-2">
              {isSubmitting ? t('auth.registering') : t('auth.createAccount')}
            </button>
          </form>

          <p className="text-center text-xs sm:text-sm text-muted mt-6">
            {t('auth.haveAccount')}{' '}
            <Link to="/login" className="text-sky-500 hover:text-sky-600 font-bold">{t('auth.login')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
