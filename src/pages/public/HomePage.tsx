import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ChevronRight, Star, TrendingUp, ArrowRight, Users, CheckCircle2, ChevronDown } from 'lucide-react';
import { useAppSelector } from '../../hooks/useAppStore';
import PropertyCard from '../../components/properties/PropertyCard';
import { CITIES } from '../../data/mockData';
import { useLanguage } from '../../contexts/LanguageContext';

/* ── Animated counter hook ── */
function useCounter(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, start]);
  return count;
}

/* ── Stat item ── */
function StatItem({ value, suffix, label, icon, started }: { value: number; suffix: string; label: string; icon: React.ReactNode; started: boolean }) {
  const count = useCounter(value, 2000, started);
  return (
    <div className="text-center group">
      <div className="flex justify-center mb-2 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <p className="text-3xl font-bold text-white tabular-nums">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-sm text-white/60 mt-0.5">{label}</p>
    </div>
  );
}

/* Premium SVG icons for Why Us section */
const VerifiedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12l2 2 4-4" />
    <path d="M12 2L3.5 7v5c0 4.5 3.6 8.7 8.5 9.5C16.9 20.7 20.5 16.5 20.5 12V7L12 2z" />
  </svg>
);

const TransparentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
    <path d="M11 8v3l2 2" />
  </svg>
);

const ExpertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M12 14c-5 0-8 2-8 3v1h16v-1c0-1-3-3-8-3z" />
    <path d="M15 8l1.5-1.5 1 1L16 9" />
    <path d="M9 8L7.5 6.5l-1 1L8 9" />
  </svg>
);

const FastIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const whyUsConfig = [
  {
    key: 'verified',
    icon: <VerifiedIcon />,
    color: 'from-emerald-400 to-teal-500',
    glow: 'rgba(16,185,129,0.25)',
    titleKey: 'why.verified',
    descKey: 'why.verified.desc',
    extra: { en: 'We double-check with independent structural & legal firms on every single listing.', ar: 'نتحقق مزدوجاً مع شركات هندسية وقانونية مستقلة لكل عقار مدرج.' },
  },
  {
    key: 'transparent',
    icon: <TransparentIcon />,
    color: 'from-sky-400 to-blue-500',
    glow: 'rgba(14,165,233,0.25)',
    titleKey: 'why.transparent',
    descKey: 'why.transparent.desc',
    extra: { en: 'Every contract is translated & verified by licensed attorneys in your language.', ar: 'كل عقد يُترجم ويُوثق بواسطة محامين مرخصين بلغتك الخاصة.' },
  },
  {
    key: 'expert',
    icon: <ExpertIcon />,
    color: 'from-amber-400 to-orange-500',
    glow: 'rgba(245,158,11,0.25)',
    titleKey: 'why.expert',
    descKey: 'why.expert.desc',
    extra: { en: 'Our advisors average 8+ years in luxury real estate with proven track records.', ar: 'مستشارونا لديهم خبرة 8+ سنوات في العقارات الفاخرة مع سجل إنجازات مثبت.' },
  },
  {
    key: 'fast',
    icon: <FastIcon />,
    color: 'from-violet-400 to-purple-600',
    glow: 'rgba(139,92,246,0.25)',
    titleKey: 'why.fast',
    descKey: 'why.fast.desc',
    extra: { en: 'Close deals within days with our dedicated digital transactional support team.', ar: 'أغلق صفقتك خلال أيام مع فريق الدعم الرقمي المتخصص الخاص بنا.' },
  },
];



export default function HomePage() {
  const navigate = useNavigate();
  const { t, lang, isRtl } = useLanguage();
  const properties = useAppSelector(s => s.properties.properties);
  const featured = properties.filter(p => p.isFeatured).slice(0, 3);
  const newest = [...properties].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);

  const [searchQuery, setSearchQuery] = useState('');
  const [listingType, setListingType] = useState<'all' | 'sale' | 'rent'>('all');
  const [city, setCity] = useState('all');
  const [statsStarted, setStatsStarted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);

  // Parallax scroll tracking
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Stats intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsStarted(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (listingType !== 'all') params.set('type', listingType);
    if (city !== 'all') params.set('city', city);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=90"
            alt="Hero"
            className="w-full h-full object-cover scale-110"
            style={{ transform: `scale(1.1) translateY(${scrollY * 0.3}px)`, willChange: 'transform' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.8) 100%)' }} />
          {/* Animated gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-25 blur-3xl animate-pulse" style={{ background: 'radial-gradient(circle, #0ea5e9, transparent)' }} />
          <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full opacity-20 blur-3xl animate-pulse" style={{ background: 'radial-gradient(circle, #6366f1, transparent)', animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center w-full">


          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {t('hero.title1')}
            <span className="block" style={{ background: 'linear-gradient(90deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {t('hero.title2')}
            </span>
          </h1>

          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {t('hero.subtitle')}
          </p>

          {/* Dual CTA */}
          <div className="flex gap-3 justify-center flex-wrap mb-10 animate-slide-up" style={{ animationDelay: '0.25s' }}>
            <button
              onClick={handleSearch}
              className="btn-primary py-3.5 px-7 text-base shadow-2xl"
            >
              <Search size={18} />
              {lang === 'ar' ? 'ابحث الآن' : 'Search Now'}
            </button>
            <button
              onClick={() => navigate('/properties')}
              className="py-3.5 px-7 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(255,255,255,0.25)' }}
            >
              {lang === 'ar' ? 'استكشف العقارات' : 'Explore Properties'}
              <ArrowRight size={16} className={`inline ${isRtl ? 'mr-2 rotate-180' : 'ml-2'}`} />
            </button>
          </div>

          {/* ── Floating Glass Search Card ── */}
          <div
            className="rounded-2xl p-4 sm:p-6 max-w-4xl mx-auto animate-slide-up"
            style={{
              animationDelay: '0.35s',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(28px) saturate(2)',
              WebkitBackdropFilter: 'blur(28px) saturate(2)',
              border: '1px solid rgba(255,255,255,0.22)',
              boxShadow: '0 32px 64px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
          >
            {/* Type tabs */}
            <div className="flex gap-2 mb-4">
              {(['all', 'sale', 'rent'] as const).map(tp => (
                <button
                  key={tp}
                  onClick={() => setListingType(tp)}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    listingType === tp
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tp === 'all' ? t('hero.all') : tp === 'sale' ? t('hero.sale') : t('hero.rent')}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative sm:col-span-1">
                <Search size={16} className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-muted`} />
                <input
                  type="text"
                  placeholder={t('hero.searchPlaceholder')}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  className={`dh-input ${isRtl ? 'pr-10 text-right' : 'pl-10'}`}
                />
              </div>
              <div className="relative">
                <MapPin size={16} className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-muted pointer-events-none`} />
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className={`dh-input ${isRtl ? 'pr-10' : 'pl-10'} appearance-none cursor-pointer`}
                >
                  <option value="all">{t('hero.allCities')}</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button onClick={handleSearch} className="btn-primary justify-center w-full">
                <Search size={16} /> {t('hero.search')}
              </button>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="mt-10 flex justify-center animate-bounce opacity-60">
            <ChevronDown size={24} className="text-white" />
          </div>
        </div>

        {/* Animated Stats Bar */}
        <div ref={statsRef} className="absolute bottom-0 left-0 right-0 py-6 hidden lg:block" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}>
          <div className="max-w-4xl mx-auto px-8 grid grid-cols-4 gap-8">
            <StatItem value={12000} suffix="+" label={t('stats.properties')} icon={<TrendingUp size={24} className="text-sky-400" />} started={statsStarted} />
            <StatItem value={8500} suffix="+" label={t('stats.clients')} icon={<Star size={24} className="text-amber-400" fill="currentColor" />} started={statsStarted} />
            <StatItem value={98} suffix="%" label={t('stats.satisfaction')} icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-emerald-400">
                <path d="M9 12l2 2 4-4" /><path d="M12 2L3.5 7v5c0 4.5 3.6 8.7 8.5 9.5C16.9 20.7 20.5 16.5 20.5 12V7L12 2z" />
              </svg>
            } started={statsStarted} />
            <StatItem value={24} suffix="/7" label={t('stats.support')} icon={<Users size={24} className="text-violet-400" />} started={statsStarted} />
          </div>
        </div>
      </section>

      {/* ── Featured Properties ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className={`flex items-center justify-between mb-12 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div>
            <h2 className="section-title">{t('section.featured')}</h2>
            <p className="section-subtitle">{t('section.featured.sub')}</p>
          </div>
          <button onClick={() => navigate('/properties?featured=true')} className="btn-secondary hidden sm:flex">
            {t('section.viewAll')} <ChevronRight size={16} className={isRtl ? 'rotate-180' : ''} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {featured.map(p => <PropertyCard key={p.id} property={p} />)}
        </div>
      </section>

      {/* ── Why DreamHomes ── */}
      <section className="py-24" style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.04) 0%, rgba(99,102,241,0.06) 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">{t('why.title')}</h2>
            <p className="section-subtitle">{t('why.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUsConfig.map((item, i) => (
              <div
                key={item.key}
                className="dh-card p-7 text-center group cursor-default relative overflow-hidden pb-14"
                style={{ animationDelay: `${i * 0.1}s`, transition: 'box-shadow 0.3s ease, transform 0.3s ease' }}
              >
                {/* Glow bg on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${item.glow}, transparent 70%)` }}
                />
                {/* Gradient Icon */}
                <div className={`relative w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${item.color} shadow-lg group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-custom mb-2 text-base relative">{t(item.titleKey)}</h3>
                <p className="text-sm text-muted leading-relaxed relative transition-opacity duration-300 group-hover:opacity-50">
                  {t(item.descKey)}
                </p>
                {/* Hover reveal extra description */}
                <div className="absolute bottom-5 left-4 right-4 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out pointer-events-none">
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-sky-500 shrink-0 mt-0.5" />
                    <p className="text-xs font-semibold text-sky-500 leading-snug text-start">
                      {lang === 'ar' ? item.extra.ar : item.extra.en}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Latest Listings ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className={`flex items-center justify-between mb-12 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div>
            <h2 className="section-title">{t('section.latest')}</h2>
            <p className="section-subtitle">{t('section.latest.sub')}</p>
          </div>
          <button onClick={() => navigate('/properties')} className="btn-secondary hidden sm:flex">
            {t('section.browseAll')} <ArrowRight size={16} className={isRtl ? 'rotate-180' : ''} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {newest.map(p => <PropertyCard key={p.id} property={p} />)}
        </div>
        <div className="text-center mt-12">
          <button onClick={() => navigate('/properties')} className="btn-primary text-base py-3.5 px-8">
            {t('section.viewAllProperties')} <ArrowRight size={18} className={isRtl ? 'rotate-180 mr-1' : 'ml-1'} />
          </button>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="rounded-3xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)' }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 20%, white 0%, transparent 40%)' }} />
          <div className="absolute top-6 left-10 w-2 h-2 rounded-full bg-white/30 animate-ping" style={{ animationDelay: '0s' }} />
          <div className="absolute top-12 right-20 w-3 h-3 rounded-full bg-white/20 animate-ping" style={{ animationDelay: '0.7s' }} />
          <div className="absolute bottom-8 left-1/3 w-2 h-2 rounded-full bg-white/25 animate-ping" style={{ animationDelay: '1.4s' }} />
          <div className="relative px-8 py-16 text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t('cta.title')}</h2>
            <p className="text-white/80 mb-8 max-w-lg mx-auto">{t('cta.sub')}</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button onClick={() => navigate('/dashboard/add-property')} className="px-8 py-3.5 bg-white text-sky-600 rounded-xl font-bold hover:shadow-2xl hover:-translate-y-1 transition-all duration-200">
                {t('cta.list')}
              </button>
              <button onClick={() => navigate('/contact')} className="px-8 py-3.5 border-2 border-white/40 text-white rounded-xl font-bold hover:bg-white/15 transition-all duration-200">
                {t('cta.agent')}
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
