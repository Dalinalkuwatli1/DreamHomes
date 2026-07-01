import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, User, Phone, Mail, FileText, Save, Shield } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { updateUser } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/uiSlice';
import { format } from 'date-fns';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  bio: z.string().max(300, 'Bio must be under 300 characters').optional(),
});

type ProfileFormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.auth.user);
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<ProfileFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    setIsSaving(true);
    setTimeout(() => {
      dispatch(updateUser(data));
      dispatch(addToast({ message: 'Profile updated successfully!', type: 'success' }));
      setIsSaving(false);
    }, 800);
  };

  if (!user) return null;

  const stats = [
    { label: 'Favorites', value: user.favoriteIds.length },
    { label: 'Messages', value: 2 },
    { label: 'Member Since', value: format(new Date(user.joinedAt), 'MMM yyyy') },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Header dh-card */}
      <div className="dh-card p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative group">
            <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-2xl object-cover ring-4 ring-sky-500/20" />
            <button className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <Camera size={18} />
            </button>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-custom">{user.name}</h1>
            <p className="text-sm text-muted capitalize">
              {user.role === 'owner' ? 'Property Owner / Advertiser' : 'Home Seeker'}
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
          { key: 'profile', label: 'Profile Info', icon: <User size={15} /> },
          { key: 'security', label: 'Security', icon: <Shield size={15} /> },
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
          <h2 className="font-bold text-custom mb-6">Personal Information</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="label flex items-center gap-1.5"><User size={12} /> Full Name</label>
                <input {...register('name')} className="dh-input" placeholder="Your full name" />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="label flex items-center gap-1.5"><Phone size={12} /> Phone</label>
                <input {...register('phone')} className="dh-input" placeholder="+1 555-000-0000" />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
              </div>
            </div>
            <div>
              <label className="label flex items-center gap-1.5"><Mail size={12} /> Email</label>
              <input {...register('email')} className="dh-input" placeholder="your@email.com" />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label flex items-center gap-1.5"><FileText size={12} /> Bio</label>
              <textarea {...register('bio')} rows={3} className="dh-input resize-none" placeholder="Tell us a bit about yourself..." />
              {errors.bio && <p className="text-xs text-red-500 mt-1">{errors.bio.message}</p>}
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={!isDirty || isSaving} className="btn-primary disabled:opacity-50">
                <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="dh-card p-6">
          <h2 className="font-bold text-custom mb-6">Security Settings</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="label">Current Password</label>
              <input type="password" className="dh-input" placeholder="••••••••" />
            </div>
            <div>
              <label className="label">New Password</label>
              <input type="password" className="dh-input" placeholder="••••••••" />
            </div>
            <div>
              <label className="label">Confirm New Password</label>
              <input type="password" className="dh-input" placeholder="••••••••" />
            </div>
            <div className="flex justify-end pt-2">
              <button className="btn-primary">Update Password</button>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-custom">
            <h3 className="font-semibold text-custom mb-2">Danger Zone</h3>
            <p className="text-sm text-muted mb-4">Permanently delete your account and all data.</p>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-red-500 border border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
