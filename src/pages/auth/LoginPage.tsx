import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAppDispatch } from '../../hooks/useAppStore';
import { login } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/uiSlice';
import { mockUsers } from '../../data/mockData';
import type { User } from '../../types';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await new Promise(r => setTimeout(r, 800));
    const user = mockUsers.find(u => u.email === data.email) || mockUsers[0];
    dispatch(login(user as User));
    dispatch(addToast({ message: `Welcome back, ${user.name.split(' ')[0]}!`, type: 'success' }));
    navigate('/');
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}>
            <Building2 size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-custom">Welcome Back</h1>
          <p className="text-muted mt-1">Sign in to your DreamHomes account</p>
        </div>

        <div className="dh-card p-8">
          {/* Demo hint */}
          <div className="p-3 rounded-xl mb-5 text-sm" style={{ background: 'rgba(14,165,233,0.08)' }}>
            <p className="text-sky-600 dark:text-sky-400 font-medium">Demo: Use any email/password to sign in</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <label className="dh-label flex items-center gap-1.5"><Mail size={12} /> Email</label>
              <input {...register('email')} type="email" placeholder="your@email.com" className="dh-input" autoComplete="email" />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="dh-label flex items-center gap-1.5"><Lock size={12} /> Password</label>
              <div className="relative">
                <input {...register('password')} type={showPw ? 'text' : 'password'} placeholder="••••••••" className="dh-input pr-12" />
                <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-custom transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted cursor-pointer">
                <input type="checkbox" className="accent-sky-500" /> Remember me
              </label>
              <a href="#" className="text-sky-500 hover:text-sky-600 font-medium">Forgot password?</a>
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary justify-center w-full mt-2">
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-sky-500 hover:text-sky-600 font-medium">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
