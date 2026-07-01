import { X, LogIn, UserPlus, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  action?: 'favorite' | 'message' | 'addProperty' | 'dashboard' | 'schedule' | 'review' | 'general';
}

export default function AuthModal({ isOpen, onClose, action = 'general' }: AuthModalProps) {
  const { t, isRtl, lang } = useLanguage();

  if (!isOpen) return null;

  const actionContent = {
    favorite: {
      icon: '❤️',
      title: lang === 'ar' ? 'سجّل دخولك لحفظ العقارات' : 'Sign in to Save Properties',
      desc: lang === 'ar'
        ? 'قم بتسجيل الدخول أو إنشاء حساب لحفظ العقارات في المفضلة والوصول إليها من أي جهاز.'
        : 'Log in or create an account to save properties to your favorites and access them from any device.',
    },
    message: {
      icon: '💬',
      title: lang === 'ar' ? 'يلزم إنشاء حساب للتواصل' : 'Account Required to Message',
      desc: lang === 'ar'
        ? 'قم بإنشاء حساب أو تسجيل الدخول لإرسال رسائل والتواصل مع مالكي العقارات.'
        : 'Create an account or log in to send messages and communicate with property owners.',
    },
    addProperty: {
      icon: '🏠',
      title: lang === 'ar' ? 'يلزم حساب مالك عقار' : 'Property Owner Account Required',
      desc: lang === 'ar'
        ? 'قم بإنشاء حساب مالك عقار حتى تتمكن من نشر وإدارة عقاراتك بسهولة.'
        : 'Create a property owner account to publish and manage your listings with ease.',
    },
    dashboard: {
      icon: '📊',
      title: lang === 'ar' ? 'يلزم تسجيل الدخول' : 'Login Required',
      desc: lang === 'ar'
        ? 'سجّل دخولك للوصول إلى لوحة التحكم وإدارة عقاراتك.'
        : 'Log in to access your dashboard and manage your property listings.',
    },
    schedule: {
      icon: '📅',
      title: lang === 'ar' ? 'سجّل دخولك لحجز موعد معاينة' : 'Sign in to Schedule a Visit',
      desc: lang === 'ar'
        ? 'قم بتسجيل الدخول لحجز مواعيد معاينة العقارات والتواصل مع الوكلاء.'
        : 'Log in to schedule property viewings and connect with agents.',
    },
    review: {
      icon: '⭐',
      title: lang === 'ar' ? 'سجّل دخولك لنشر تقييم' : 'Sign in to Post a Review',
      desc: lang === 'ar'
        ? 'قم بتسجيل الدخول لمشاركة تجربتك ومساعدة المشترين الآخرين.'
        : 'Log in to share your experience and help other buyers make informed decisions.',
    },
    general: {
      icon: '🔐',
      title: lang === 'ar' ? 'أنشئ حساباً للمتابعة' : 'Create an Account to Continue',
      desc: lang === 'ar'
        ? 'سجّل الدخول أو أنشئ حساباً للمفضلة، والتواصل مع الملاك، وإدارة العقارات، والوصول للميزات الشخصية.'
        : 'Sign up or log in to save favorites, contact property owners, manage listings, and access personalized features.',
    },
  };

  const content = actionContent[action];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="relative w-full max-w-md dh-card p-8 animate-fade-in"
          style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.4)' }}
          dir={isRtl ? 'rtl' : 'ltr'}
          onClick={e => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} w-8 h-8 rounded-xl flex items-center justify-center text-muted hover:text-custom hover:bg-bg transition-all`}
          >
            <X size={18} />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.15), rgba(99,102,241,0.15))' }}
            >
              {content.icon}
            </div>
          </div>

          {/* Text */}
          <h2 className="text-xl font-bold text-custom text-center mb-3">{content.title}</h2>
          <p className="text-sm text-muted text-center leading-relaxed mb-7">{content.desc}</p>

          {/* Permissions list */}
          <div className="rounded-xl p-4 mb-7 flex flex-col gap-2" style={{ background: 'rgba(14,165,233,0.05)', border: '1px solid rgba(14,165,233,0.15)' }}>
            {[
              lang === 'ar' ? '❤️ حفظ العقارات في المفضلة' : '❤️ Save properties to favorites',
              lang === 'ar' ? '💬 التواصل مع مالكي العقارات' : '💬 Message property owners',
              lang === 'ar' ? '🏠 نشر وإدارة عقاراتك' : '🏠 List and manage your properties',
              lang === 'ar' ? '📊 الوصول إلى لوحة التحكم' : '📊 Access your dashboard',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted">
                <Shield size={12} className="text-sky-500 shrink-0" />
                {item}
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <Link
              to="/login"
              onClick={onClose}
              className="btn-primary w-full justify-center gap-2"
            >
              <LogIn size={16} />
              {lang === 'ar' ? 'تسجيل الدخول' : 'Log In'}
            </Link>
            <Link
              to="/register"
              onClick={onClose}
              className="btn-secondary w-full justify-center gap-2"
            >
              <UserPlus size={16} />
              {lang === 'ar' ? 'إنشاء حساب جديد' : 'Create Free Account'}
            </Link>
          </div>

          <p className="text-center text-xs text-muted mt-4">
            {lang === 'ar' ? 'بالتسجيل تقبل' : 'By signing up you agree to our'}{' '}
            <Link to="#" className="text-sky-500 hover:underline">
              {lang === 'ar' ? 'شروط الاستخدام' : 'Terms of Service'}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
