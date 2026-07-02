import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Send, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const socialLinks = [
  {
    label: 'Telegram',
    href: 'https://t.me/',
    color: '#0088cc',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/',
    color: '#25D366',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com/',
    color: '#1877F2',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/',
    color: '#E1306C',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/',
    color: '#0A66C2',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const { t, isRtl, lang } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  // ── Link columns ────────────────────────────────────────────────
  const columns = [
    {
      title: lang === 'ar' ? 'العقارات' : 'Properties',
      links: [
        { label: lang === 'ar' ? 'عقارات للبيع' : 'For Sale', to: '/properties/sale' },
        { label: lang === 'ar' ? 'عقارات للإيجار' : 'For Rent', to: '/properties/rent' },
        { label: lang === 'ar' ? 'شقق سكنية' : 'Apartments', to: '/properties/apartments' },
        { label: lang === 'ar' ? 'فلل وقصور' : 'Villas', to: '/properties/villas' },
        { label: lang === 'ar' ? 'عقارات مميزة' : 'Featured', to: '/properties/featured' },
        { label: lang === 'ar' ? 'أحدث العقارات' : 'New Listings', to: '/properties/latest' },
      ],
    },
    {
      title: lang === 'ar' ? 'الحساب' : 'Account',
      links: [
        { label: lang === 'ar' ? 'تسجيل الدخول' : 'Sign In', to: '/login' },
        { label: lang === 'ar' ? 'إنشاء حساب' : 'Register', to: '/register' },
        { label: lang === 'ar' ? 'المفضلة' : 'My Favorites', to: '/favorites' },
        { label: lang === 'ar' ? 'رسائلي' : 'Messages', to: '/messages' },
        { label: lang === 'ar' ? 'ملفي الشخصي' : 'My Profile', to: '/profile' },
        { label: lang === 'ar' ? 'لوحة التحكم' : 'Dashboard', to: '/dashboard' },
      ],
    },
    {
      title: lang === 'ar' ? 'الشركة' : 'Company',
      links: [
        { label: lang === 'ar' ? 'من نحن' : 'About Us', to: '/about' },
        { label: lang === 'ar' ? 'تواصل معنا' : 'Contact', to: '/contact' },
        { label: lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ', to: '/faq' },
        { label: lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy', to: '/privacy' },
        { label: lang === 'ar' ? 'الشروط والأحكام' : 'Terms of Service', to: '/terms' },
        { label: lang === 'ar' ? 'المدونة' : 'Blog', to: '/blog' },
      ],
    },
  ];

  const miniStats = [
    { value: lang === 'ar' ? '+500' : '500+', label: lang === 'ar' ? 'عقار منشور' : 'Properties' },
    { value: lang === 'ar' ? '+1,200' : '1,200+', label: lang === 'ar' ? 'مستخدم نشط' : 'Active Users' },
    { value: lang === 'ar' ? '+300' : '300+', label: lang === 'ar' ? 'صفقة ناجحة' : 'Deals Closed' },
  ];

  return (
    <footer dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ── CTA Banner ───────────────────────────────────────────── */}


      {/* ── Main Footer Body ─────────────────────────────────────── */}
      <div className="border-t border-custom" style={{ background: 'rgb(var(--color-card))' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">

            {/* Brand column — spans 2 */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <img src="/logo.png" alt="DreamHomes" className="h-18 w-auto object-contain" />
              </Link>
              <p className="text-sm text-muted leading-relaxed mb-4 max-w-xs">
                {lang === 'ar'
                  ? 'اعثر على منزل أحلامك للبيع أو للإيجار بكل سهولة ومرونة مع دريم هومز.'
                  : 'Find your dream home for sale or rent with ease and flexibility through DreamHomes.'}
              </p>

              {/* Credit */}
              <p className="text-xs font-semibold mb-5" style={{ color: '#0ea5e9' }}>
                {t('footer.by')}
              </p>

              {/* Mini stats */}
              <div className="flex gap-4 mb-6">
                {miniStats.map(s => (
                  <div key={s.label} className="text-center">
                    <p className="text-base font-bold text-custom">{s.value}</p>
                    <p className="text-[10px] text-muted leading-tight">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Contact info */}
              <div className="flex flex-col gap-2.5 text-sm text-muted">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-sky-400 shrink-0" />
                  <span>{lang === 'ar' ? 'إسطنبول، تركيا' : 'Istanbul, Turkey'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-sky-400 shrink-0" />
                  <span dir="ltr">+90 555 000 0000</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-sky-400 shrink-0" />
                  <span>dreamhomes@gmail.com</span>
                </div>
              </div>
            </div>

            {/* Link columns */}
            {columns.map(col => (
              <div key={col.title}>
                <h4 className="text-sm font-bold text-custom mb-4 uppercase tracking-wider">{col.title}</h4>
                <ul className="flex flex-col gap-2">
                  {col.links.map(link => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-sm text-muted hover:text-sky-500 transition-colors hover:translate-x-0.5 inline-block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ── Bottom bar ─────────────────────────────────────────── */}
          <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-custom ${isRtl ? 'sm:flex-row-reverse' : ''}`}>
            <div className="text-center sm:text-start">
              <p className="text-xs text-muted">
                {lang === 'ar'
                  ? '© 2025 Dream Homes. جميع الحقوق محفوظة.'
                  : '© 2025 Dream Homes. All rights reserved.'}
              </p>
              <p className="text-[10px] text-muted/60 mt-0.5">
                {lang === 'ar' ? 'بواسطة دالين القوتلي' : 'by dalin alkuwatli'}
              </p>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {socialLinks.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 hover:-translate-y-0.5"
                  style={{
                    background: 'rgb(var(--color-bg))',
                    border: '1px solid rgb(var(--color-border))',
                    color: 'rgb(var(--color-muted))',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = s.color;
                    el.style.borderColor = s.color;
                    el.style.boxShadow = `0 4px 15px ${s.color}40`;
                    el.style.background = `${s.color}12`;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = 'rgb(var(--color-muted))';
                    el.style.borderColor = 'rgb(var(--color-border))';
                    el.style.boxShadow = 'none';
                    el.style.background = 'rgb(var(--color-bg))';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
