import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Eye, Share2, X, ArrowRight, ChevronRight, Home,
  Clock, Zap, RefreshCw, BedDouble, Bath, Maximize2, MapPin,
  ChevronDown, TrendingUp, Star, Calendar
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { toggleFavorite } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/uiSlice';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import AuthModal from '../../components/auth/AuthModal';

type SortOption = 'newest' | 'updated' | 'price' | 'area' | 'popular';

export default function LatestPropertiesPage() {
  const dispatch = useAppDispatch();
  const { properties } = useAppSelector(s => s.properties);
  const user = useAppSelector(s => s.auth.user);
  const { tProp, isRtl, lang } = useLanguage();
  const { requireAuth, modalOpen, modalAction, closeModal } = useAuthGuard();

  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [quickViewProp, setQuickViewProp] = useState<any | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = lang === 'ar' ? 'أحدث العقارات | دريم هومز' : 'Latest Properties | DreamHomes';
  }, [lang]);

  const sortedProperties = useMemo(() => {
    const list = [...properties];
    switch (sortBy) {
      case 'newest': return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'updated': return list.sort((a, b) => b.views - a.views); // mock "updated" by views
      case 'price': return list.sort((a, b) => b.price - a.price);
      case 'area': return list.sort((a, b) => b.area - a.area);
      case 'popular': return list.sort((a, b) => b.views - a.views);
      default: return list;
    }
  }, [properties, sortBy]);

  const visibleProperties = sortedProperties.slice(0, visibleCount);
  const hasMore = visibleCount < sortedProperties.length;

  // Infinite scroll
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(c => c + 6);
      setIsLoadingMore(false);
    }, 600);
  }, [isLoadingMore, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) loadMore();
    }, { threshold: 0.1 });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return lang === 'ar' ? 'اليوم' : 'Today';
    if (days === 1) return lang === 'ar' ? 'منذ يوم' : '1 day ago';
    if (days < 7) return lang === 'ar' ? `منذ ${days} أيام` : `${days} days ago`;
    if (days < 30) return lang === 'ar' ? `منذ ${Math.floor(days / 7)} أسبوع` : `${Math.floor(days / 7)}w ago`;
    return lang === 'ar' ? `منذ ${Math.floor(days / 30)} شهر` : `${Math.floor(days / 30)}mo ago`;
  };

  const handleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); e.stopPropagation();
    if (!requireAuth('favorite')) return;
    dispatch(toggleFavorite(id));
    const isFav = user?.favoriteIds.includes(id);
    dispatch(addToast({ message: isFav ? (lang === 'ar' ? 'أزيلت' : 'Removed') : (lang === 'ar' ? 'أضيفت!' : 'Saved!'), type: 'success' }));
  };

  const handleShare = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/properties/${id}`);
    dispatch(addToast({ message: lang === 'ar' ? 'تم نسخ الرابط' : 'Link copied!', type: 'success' }));
  };

  const SORT_OPTIONS: { value: SortOption; label_ar: string; label_en: string; icon: React.ReactNode }[] = [
    { value: 'newest', label_ar: 'الأحدث', label_en: 'Newest', icon: <Clock size={13} /> },
    { value: 'updated', label_ar: 'المحدّثة مؤخراً', label_en: 'Recently Updated', icon: <RefreshCw size={13} /> },
    { value: 'price', label_ar: 'السعر', label_en: 'Price', icon: <TrendingUp size={13} /> },
    { value: 'area', label_ar: 'المساحة', label_en: 'Area', icon: <Maximize2 size={13} /> },
    { value: 'popular', label_ar: 'الشعبية', label_en: 'Popularity', icon: <Star size={13} /> },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors" dir={isRtl ? 'rtl' : 'ltr'}>
      <AuthModal isOpen={modalOpen} onClose={closeModal} action={modalAction} />

      {/* ── Timeline Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-950 via-indigo-950 to-slate-950 pt-24 pb-16">
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #0ea5e9 0%, transparent 50%), radial-gradient(circle at 80% 20%, #818cf8 0%, transparent 40%)' }} />
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-5">
              <Zap size={13} className="animate-pulse" />
              {lang === 'ar' ? 'أحدث الإضافات' : 'FRESHLY LISTED'}
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-5 font-serif leading-tight">
              {lang === 'ar' ? 'أحدث العقارات المتاحة الآن' : 'Just Listed — Today\'s Newest Finds'}
            </h1>
            <p className="text-neutral-400 text-sm max-w-2xl mx-auto leading-relaxed">
              {lang === 'ar' ? 'تصفح أحدث العقارات التي أضيفت للمنصة وكن أول من يكتشفها.' : 'Be the first to explore properties listed in real-time on DreamHomes. Fresh listings, faster decisions.'}
            </p>
          </motion.div>

          {/* Live Count Badge */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
            className="mt-8 inline-flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-white text-sm font-medium">{sortedProperties.length} {lang === 'ar' ? 'عقار متاح الآن' : 'properties live now'}</span>
          </motion.div>
        </div>

        {/* Animated wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full">
            <path d="M0 60L1440 60L1440 0C1200 50 960 60 720 40C480 20 240 50 0 0Z" className="fill-neutral-50 dark:fill-neutral-950" />
          </svg>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400 py-6">
          <Link to="/" className="hover:text-sky-500 flex items-center gap-1 transition-colors"><Home size={12} />{lang === 'ar' ? 'الرئيسية' : 'Home'}</Link>
          <ChevronRight size={10} className={isRtl ? 'rotate-180' : ''} />
          <span className="text-neutral-800 dark:text-white font-semibold">{lang === 'ar' ? 'أحدث العقارات' : 'Latest Properties'}</span>
        </nav>

        {/* ── Sort Toolbar ── */}
        <div className="sticky top-16 z-30 bg-neutral-50/90 dark:bg-neutral-950/90 backdrop-blur-md py-4 border-b border-neutral-200 dark:border-neutral-800 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-xs font-semibold text-neutral-500">
              {lang === 'ar' ? `عرض ${visibleProperties.length} من ${sortedProperties.length} عقار` : `Showing ${visibleProperties.length} of ${sortedProperties.length} properties`}
            </span>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${sortBy === opt.value ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20' : 'border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-sky-400 hover:text-sky-500'}`}
                >
                  {opt.icon}
                  {lang === 'ar' ? opt.label_ar : opt.label_en}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Timeline Layout ── */}
        <div className="relative pb-16">
          {/* Timeline vertical line */}
          <div className={`hidden lg:block absolute top-0 bottom-0 w-px bg-gradient-to-b from-sky-500/50 via-indigo-500/30 to-transparent ${isRtl ? 'right-[calc(50%-0.5px)]' : 'left-[calc(50%-0.5px)]'}`} />

          <div className="space-y-10">
            <AnimatePresence>
              {visibleProperties.map((p, index) => {
                const isFav = user?.favoriteIds.includes(p.id) ?? false;
                const isLeft = index % 2 === 0;
                const timeAgo = getTimeAgo(p.createdAt);
                const isNew = (Date.now() - new Date(p.createdAt).getTime()) < 30 * 86400000;

                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: (index % 6) * 0.07 }}
                    className={`relative flex flex-col ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-6 items-center`}
                  >
                    {/* Timeline dot */}
                    <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white dark:bg-neutral-900 border-2 border-sky-500 items-center justify-center z-10 shadow-lg">
                      <Calendar size={14} className="text-sky-500" />
                    </div>

                    {/* Time Label */}
                    <div className={`hidden lg:flex w-[calc(50%-3rem)] justify-${isLeft ? 'end' : 'start'} items-center`}>
                      <div className={`flex items-center gap-2 text-xs font-semibold ${isNew ? 'text-sky-500' : 'text-neutral-400'}`}>
                        <Clock size={12} />
                        <span>{timeAgo}</span>
                        {isNew && (
                          <span className="bg-sky-500/10 text-sky-500 border border-sky-500/20 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase animate-pulse">
                            {lang === 'ar' ? 'جديد' : 'JUST LISTED'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Property Card */}
                    <div className="w-full lg:w-[calc(50%-3rem)] group">
                      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row">
                        {/* Image */}
                        <div className="sm:w-48 h-44 sm:h-auto relative overflow-hidden shrink-0">
                          <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} flex flex-col gap-1.5`}>
                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold shadow text-white ${p.listingType === 'sale' ? 'bg-emerald-500' : 'bg-sky-500'}`}>
                              {p.listingType === 'sale' ? (lang === 'ar' ? 'للبيع' : 'SALE') : (lang === 'ar' ? 'إيجار' : 'RENT')}
                            </span>
                            {isNew && (
                              <span className="bg-amber-500 text-black px-2.5 py-1 rounded-lg text-[9px] font-extrabold shadow">
                                {lang === 'ar' ? 'جديد!' : 'NEW!'}
                              </span>
                            )}
                          </div>
                          {/* Mobile time label */}
                          <div className="lg:hidden absolute bottom-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
                            <Clock size={10} className="text-sky-300" />
                            <span className="text-white text-[10px] font-medium">{timeAgo}</span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-4 flex flex-col min-w-0">
                          <span className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mb-1">{tProp(p, 'type')}</span>
                          <h3 className="font-bold text-sm text-neutral-900 dark:text-white line-clamp-1 group-hover:text-sky-500 transition-colors mb-1.5">
                            {tProp(p, 'title')}
                          </h3>
                          <div className="flex items-center gap-1 text-[11px] text-neutral-400 mb-3">
                            <MapPin size={11} className="text-sky-500 shrink-0" />
                            <span className="line-clamp-1">{tProp(p, 'address')}</span>
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-neutral-500 mb-4">
                            <span className="flex items-center gap-1"><BedDouble size={12} className="text-sky-400" />{p.bedrooms}</span>
                            <span className="flex items-center gap-1"><Bath size={12} className="text-sky-400" />{p.bathrooms}</span>
                            <span className="flex items-center gap-1"><Maximize2 size={12} className="text-sky-400" />{p.area} {lang === 'ar' ? 'قدم²' : 'sqft'}</span>
                          </div>

                          <div className="flex items-center justify-between mt-auto">
                            <div className="font-extrabold text-sky-500 text-base">${p.price.toLocaleString()}</div>
                            <div className="flex items-center gap-1.5">
                              <button onClick={e => handleFavorite(e, p.id)} className={`p-1.5 rounded-lg border transition-all ${isFav ? 'border-rose-400 text-rose-500 bg-rose-50 dark:bg-rose-900/20' : 'border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:border-sky-400 hover:text-sky-500'}`}>
                                <Heart size={13} fill={isFav ? 'currentColor' : 'none'} />
                              </button>
                              <button onClick={e => handleShare(e, p.id)} className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:border-sky-400 hover:text-sky-500 transition-all">
                                <Share2 size={13} />
                              </button>
                              <button onClick={() => setQuickViewProp(p)} className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:border-sky-400 hover:text-sky-500 transition-all">
                                <Eye size={13} />
                              </button>
                              <Link to={`/properties/${p.id}`} className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-[10px] font-bold transition-all flex items-center gap-1">
                                {lang === 'ar' ? 'عرض' : 'View'} <ArrowRight size={11} className={isRtl ? 'rotate-180' : ''} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* ── Infinite Scroll Loader ── */}
          <div ref={loaderRef} className="mt-12 flex justify-center">
            {isLoadingMore && (
              <div className="flex items-center gap-3 text-sm text-neutral-400">
                <RefreshCw size={16} className="animate-spin text-sky-500" />
                {lang === 'ar' ? 'جاري تحميل المزيد...' : 'Loading more...'}
              </div>
            )}
            {!hasMore && sortedProperties.length > 0 && (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 text-xs text-neutral-400 border border-neutral-200 dark:border-neutral-800 px-5 py-2.5 rounded-full">
                  <span>✓</span>
                  {lang === 'ar' ? 'تم تحميل جميع العقارات المتاحة' : 'All available properties loaded'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── CTA ── */}
        <section className="mb-16 bg-gradient-to-r from-sky-500 to-indigo-600 rounded-3xl p-10 text-center text-white shadow-xl shadow-sky-500/20">
          <h2 className="text-2xl font-bold font-serif mb-3">{lang === 'ar' ? 'أضف عقارك وابدأ في استقبال العروض' : 'List Your Property & Start Receiving Offers'}</h2>
          <p className="text-sky-100 text-xs mb-6 max-w-md mx-auto">{lang === 'ar' ? 'أضف عقارك اليوم وسيظهر فوراً في قائمة أحدث العقارات.' : 'Submit your property today and it will appear instantly in the Latest Properties feed.'}</p>
          <Link to="/dashboard/add-property" className="bg-white text-sky-600 px-6 py-3 rounded-xl text-xs font-bold hover:bg-sky-50 transition-all shadow-md inline-block">
            {lang === 'ar' ? 'أضف عقارك الآن' : 'Submit Property Now'}
          </Link>
        </section>

        {/* ── FAQ ── */}
        <section className="mb-16 max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-center font-serif text-neutral-900 dark:text-white mb-8">
            {lang === 'ar' ? 'أسئلة شائعة حول أحدث العقارات' : 'Latest Listings FAQ'}
          </h3>
          <div className="space-y-3">
            {[
              {
                q: lang === 'ar' ? 'كم مرة تُحدَّث قائمة أحدث العقارات؟' : 'How often is the latest listings feed updated?',
                a: lang === 'ar' ? 'تُحدَّث القائمة فور إضافة أي عقار جديد من قِبل المالكين والوكلاء المرخصين، مما يضمن أن الإدراجات متزامنة مع السوق الحالي.' : 'The feed updates in real-time whenever a new property is submitted by verified owners or licensed agents, ensuring you always see the freshest market listings.',
              },
              {
                q: lang === 'ar' ? 'هل يمكنني تفعيل إشعارات للعقارات الجديدة في منطقة محددة؟' : 'Can I get notifications for new listings in a specific area?',
                a: lang === 'ar' ? 'نعم، يمكنك حفظ بحثك المخصص واستقبال تنبيهات فورية عبر البريد الإلكتروني حين تُضاف عقارات تطابق معاييرك.' : 'Yes, save your search criteria and enable email alerts. You\'ll receive instant notifications when new matching properties are listed.',
              },
            ].map((item, idx) => (
              <div key={idx} className="border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 overflow-hidden">
                <button onClick={() => setFaqOpen(faqOpen === idx ? null : idx)} className="w-full p-5 flex justify-between items-center text-left">
                  <span className="font-semibold text-sm text-neutral-800 dark:text-white">{item.q}</span>
                  <ChevronDown size={16} className={`transition-transform text-neutral-400 ${faqOpen === idx ? 'rotate-180 text-sky-500' : ''}`} />
                </button>
                <AnimatePresence>
                  {faqOpen === idx && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="border-t border-neutral-100 dark:border-neutral-800 px-5 py-4 text-xs text-neutral-500 leading-relaxed">
                      {item.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Quick View Modal ── */}
      <AnimatePresence>
        {quickViewProp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={() => setQuickViewProp(null)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden"
            >
              <div className="relative h-52">
                <img src={quickViewProp.images[0]} alt={quickViewProp.title} className="w-full h-full object-cover" />
                <button onClick={() => setQuickViewProp(null)} className="absolute top-4 right-4 bg-black/50 p-1.5 rounded-full text-white hover:bg-black/70">
                  <X size={16} />
                </button>
                <div className="absolute bottom-4 left-4 bg-sky-500 text-white font-bold px-3 py-1.5 rounded-xl text-sm">
                  ${quickViewProp.price.toLocaleString()}
                </div>
              </div>
              <div className="p-6">
                <span className="text-[10px] font-bold text-sky-500 uppercase tracking-widest">{tProp(quickViewProp, 'type')}</span>
                <h4 className="font-bold text-neutral-900 dark:text-white text-base mt-1 mb-3">{tProp(quickViewProp, 'title')}</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-3 leading-relaxed mb-6">{tProp(quickViewProp, 'description')}</p>
                <Link to={`/properties/${quickViewProp.id}`} onClick={() => setQuickViewProp(null)}
                  className="block w-full bg-sky-500 hover:bg-sky-600 text-white text-center py-3 rounded-xl text-xs font-bold transition-all">
                  {lang === 'ar' ? 'عرض الصفحة الكاملة' : 'View Full Details'}
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
