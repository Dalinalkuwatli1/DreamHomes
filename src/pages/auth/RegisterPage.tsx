import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import { useAppDispatch } from '../../hooks/useAppStore';
import { login } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/uiSlice';
import type { User as UserType } from '../../types';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  role: z.enum(['user', 'owner']),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'user' },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: FormData) => {
    await new Promise(r => setTimeout(r, 900));
    const newUser: UserType = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      avatar: `https://i.pravatar.cc/150?u=${data.email}`,
      bio: '',
      role: data.role,
      favoriteIds: [],
      joinedAt: new Date().toISOString(),
    };
    dispatch(login(newUser));
    dispatch(addToast({ message: `Welcome to DreamHomes, ${data.name.split(' ')[0]}!`, type: 'success' }));
    navigate(data.role === 'owner' ? '/dashboard' : '/');
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}>
            <Building2 size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-custom">Create Account</h1>
          <p className="text-muted mt-1">Join thousands of home seekers & sellers</p>
        </div>

        <div className="dh-card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Role */}
            <div>
              <label className="dh-label">I want to...</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'user', label: 'Find a Home', emoji: '🔍' },
                  { value: 'owner', label: 'List Property', emoji: '🏠' },
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
              <label className="dh-label flex items-center gap-1.5"><User size={12} /> Full Name</label>
              <input {...register('name')} placeholder="John Doe" className="dh-input" />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="dh-label flex items-center gap-1.5"><Mail size={12} /> Email</label>
                <input {...register('email')} type="email" placeholder="your@email.com" className="dh-input" />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="dh-label flex items-center gap-1.5"><Phone size={12} /> Phone</label>
                <input {...register('phone')} placeholder="+1 555-000-0000" className="dh-input" />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            <div>
              <label className="dh-label flex items-center gap-1.5"><Lock size={12} /> Password</label>
              <div className="relative">
                <input {...register('password')} type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters" className="dh-input pr-12" />
                <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-custom transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="dh-label flex items-center gap-1.5"><Lock size={12} /> Confirm Password</label>
              <input {...register('confirmPassword')} type="password" placeholder="Repeat password" className="dh-input" />
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <label className="flex items-start gap-3 text-sm text-muted cursor-pointer mt-1">
              <input type="checkbox" required className="mt-0.5 accent-sky-500" />
              <span>I agree to the <a href="#" className="text-sky-500 hover:underline">Terms of Service</a> and <a href="#" className="text-sky-500 hover:underline">Privacy Policy</a></span>
            </label>

            <button type="submit" disabled={isSubmitting} className="btn-primary justify-center w-full mt-2">
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-sky-500 hover:text-sky-600 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
