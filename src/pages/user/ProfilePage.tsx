import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, User, Phone, Mail, FileText, Save, Shield } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { updateUser } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/uiSlice';
import { format } from 'date-fns';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  bio: z.string().max(300, 'Bio must be under 300 characters').optional().or(z.literal('')),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.auth.user);
  const { t, isRtl, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const { register: regProfile, handleSubmit: handleProfileSubmit, reset: resetProfile, formState: { errors: profileErrors, isDirty: isProfileDirty } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
    },
  });

  const { register: regPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, formState: { errors: passwordErrors } } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // Sync profile details on mount from database
  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await api.get('/users/me');
        const userData = res.data.data;
        dispatch(updateUser(userData));
        resetProfile({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          bio: userData.bio || '',
        });
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    }
    fetchMe();
  }, [dispatch, resetProfile]);

  const onProfileSave = async (data: ProfileFormData) => {
    setIsSaving(true);
    try {
      const res = await api.patch('/users/me', data);
      dispatch(updateUser(res.data.data));
      dispatch(addToast({ message: lang === 'ar' ? 'تم تحديث الملف الشخصي بنجاح!' : 'Profile updated successfully!', type: 'success' }));
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      dispatch(addToast({ message: msg, type: 'error' }));
    } finally {
      setIsSaving(false);
    }
  };

  const onPasswordSave = async (data: PasswordFormData) => {
    setIsSaving(true);
    try {
      await api.patch('/users/me/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      dispatch(addToast({ message: lang === 'ar' ? 'تم تحديث كلمة المرور بنجاح!' : 'Password updated successfully!', type: 'success' }));
      resetPassword({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update password';
      dispatch(addToast({ message: msg, type: 'error' }));
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await api.patch('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      dispatch(updateUser({ avatar: res.data.data.avatar }));
      dispatch(addToast({ message: lang === 'ar' ? 'تم تحديث الصورة الشخصية بنجاح!' : 'Avatar updated successfully!', type: 'success' }));
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to upload avatar';
      dispatch(addToast({ message: msg, type: 'error' }));
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) return null;

  const stats = [
    { label: t('dash.saved'), value: user.favoriteIds?.length || 0 },
    { label: t('dash.messages'), value: 2 },
    { label: t('profile.memberSince'), value: user.joinedAt ? (lang === 'ar' ? format(new Date(user.joinedAt), 'yyyy/MM') : format(new Date(user.joinedAt), 'MMM yyyy')) : '2024/01' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header dh-card */}
      <div className="dh-card p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
            <img src={user.avatar || 'https://i.pravatar.cc/150?img=12'} alt={user.name} className="w-20 h-20 rounded-2xl object-cover ring-4 ring-sky-500/20" />
            <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <Camera size={18} />
            </div>
            {isUploading && (
              <div className="absolute inset-0 rounded-2xl bg-black/60 flex items-center justify-center text-white text-xs font-semibold">
                ...
              </div>
            )}
          </div>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-custom">{user.name}</h1>
            <p className="text-sm text-muted capitalize">
              {user.role?.toLowerCase() === 'owner' ? (lang === 'ar' ? 'مالك عقار / معلن' : 'Property Owner / Advertiser') : (lang === 'ar' ? 'باحث عن منزل' : 'Home Seeker')}
            </p>
            <div className="flex gap-6 mt-3">
              {stats.map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-lg font-bold text-custom">{s.value}</p>
                  <p className="text-xs text-muted">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background: 'rgb(var(--color-card))' }}>
        {[
          { key: 'profile', label: t('profile.info'), icon: <User size={15} /> },
          { key: 'security', label: t('profile.security'), icon: <Shield size={15} /> },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'profile' | 'security')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
              activeTab === tab.key ? 'bg-sky-500 text-white shadow-md' : 'text-muted hover:text-custom'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' ? (
        <div className="dh-card p-6">
          <h2 className="font-bold text-custom mb-6">{t('profile.personalInfo')}</h2>
          <form onSubmit={handleProfileSubmit(onProfileSave)} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="dh-label flex items-center gap-1.5"><User size={12} /> {t('profile.fullName')}</label>
                <input {...regProfile('name')} className="dh-input text-sm" placeholder={t('auth.fullNamePlaceholder')} />
                {profileErrors.name && <p className="text-xs text-red-500 mt-1">{profileErrors.name.message}</p>}
              </div>
              <div>
                <label className="dh-label flex items-center gap-1.5"><Phone size={12} /> {t('profile.phone')}</label>
                <input {...regProfile('phone')} className="dh-input text-sm" placeholder="+1 555-000-0000" />
                {profileErrors.phone && <p className="text-xs text-red-500 mt-1">{profileErrors.phone.message}</p>}
              </div>
            </div>
            <div>
              <label className="dh-label flex items-center gap-1.5"><Mail size={12} /> {t('profile.email')}</label>
              <input {...regProfile('email')} className="dh-input text-sm" placeholder="your@email.com" disabled />
              {profileErrors.email && <p className="text-xs text-red-500 mt-1">{profileErrors.email.message}</p>}
            </div>
            <div>
              <label className="dh-label flex items-center gap-1.5"><FileText size={12} /> {t('profile.bio')}</label>
              <textarea {...regProfile('bio')} rows={3} className="dh-input resize-none text-sm" placeholder={t('profile.bioPlaceholder')} />
              {profileErrors.bio && <p className="text-xs text-red-500 mt-1">{profileErrors.bio.message}</p>}
            </div>
            <div className={`flex ${isRtl ? 'justify-start' : 'justify-end'}`}>
              <button type="submit" disabled={!isProfileDirty || isSaving} className="btn-primary disabled:opacity-50">
                <Save size={16} /> {isSaving ? t('profile.saving') : t('profile.saveChanges')}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="dh-card p-6">
          <h2 className="font-bold text-custom mb-6">{lang === 'ar' ? 'إعدادات الأمان' : 'Security Settings'}</h2>
          <form onSubmit={handlePasswordSubmit(onPasswordSave)} className="flex flex-col gap-4">
            <div>
              <label className="dh-label">{lang === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'}</label>
              <input type="password" {...regPassword('currentPassword')} className="dh-input text-sm" placeholder="••••••••" />
              {passwordErrors.currentPassword && <p className="text-xs text-red-500 mt-1">{passwordErrors.currentPassword.message}</p>}
            </div>
            <div>
              <label className="dh-label">{lang === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}</label>
              <input type="password" {...regPassword('newPassword')} className="dh-input text-sm" placeholder="••••••••" />
              {passwordErrors.newPassword && <p className="text-xs text-red-500 mt-1">{passwordErrors.newPassword.message}</p>}
            </div>
            <div>
              <label className="dh-label">{lang === 'ar' ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}</label>
              <input type="password" {...regPassword('confirmPassword')} className="dh-input text-sm" placeholder="••••••••" />
              {passwordErrors.confirmPassword && <p className="text-xs text-red-500 mt-1">{passwordErrors.confirmPassword.message}</p>}
            </div>
            <div className={`flex pt-2 ${isRtl ? 'justify-start' : 'justify-end'}`}>
              <button type="submit" disabled={isSaving} className="btn-primary">
                {isSaving ? (lang === 'ar' ? 'جاري التحديث...' : 'Updating...') : (lang === 'ar' ? 'تحديث كلمة المرور' : 'Update Password')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
    </div>
  );
}
