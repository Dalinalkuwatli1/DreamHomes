import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Eye, Share2, X, ArrowRight, ChevronRight, Home,
  Star, TrendingUp, Award, Crown, Sparkles, MapPin, BedDouble, Bath, Maximize2
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { toggleFavorite } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/uiSlice';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import AuthModal from '../../components/auth/AuthModal';

const BADGES = [
  { key: 'luxury', icon: <Crown size={12} />, label_ar: 'شارة الفخامة', label_en: 'Luxury Badge', color: 'from-amber-500 to-yellow-400', text: 'text-black' },
  { key: 'editor', icon: <Award size={12} />, label_ar: 'اختيار المحررين', label_en: "Editor's Choice", color: 'from-violet-600 to-purple-500', text: 'text-white' },
  { key: 'investment', icon: <TrendingUp size={12} />, label_ar: 'أفضل استثمار', label_en: 'Top Investment', color: 'from-emerald-500 to-teal-400', text: 'text-white' },
  { key: 'roi', icon: <Star size={12} />, label_ar: 'أعلى عائد', label_en: 'Highest ROI', color: 'from-sky-500 to-blue-500', text: 'text-white' },
  { key: 'new', icon: <Sparkles size={12} />, label_ar: 'أحدث الفاخرة', label_en: 'Newest Luxury', color: 'from-rose-500 to-pink-500', text: 'text-white' },
];

export default function FeaturedPropertiesPage() {
  const dispatch = useAppDispatch();
  const { properties } = useAppSelector(s => s.properties);
  const user = useAppSelector(s => s.auth.user);
  const { tProp, isRtl, lang } = useLanguage();
  const { requireAuth, modalOpen, modalAction, closeModal } = useAuthGuard();

  const [activeBadge, setActiveBadge] = useState('all');
  const [quickViewProperty, setQuickViewProperty] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  useEffect(() => {
    document.title = lang === 'ar' ? 'العقارات المميزة | دريم هومز' : 'Featured Properties | DreamHomes';
  }, [lang]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [activeBadge]);

  // Assign a badge to each property deterministically
  const badgeMap: Record<string, string> = useMemo(() => {
    const result: Record<string, string> = {};
    const featureds = properties.filter(p => p.isFeatured);
    featureds.forEach((p, i) => {
      result[p.id] = BADGES[i % BADGES.length].key;
    });
    return result;
  }, [properties]);

  const featuredProperties = useMemo(() => {
    const base = properties.filter(p => p.isFeatured);
    if (activeBadge === 'all') return base;
    return base.filter(p => badgeMap[p.id] === activeBadge);
  }, [properties, activeBadge, badgeMap]);

  // Hero featured (top viewed)
  const heroProperty = useMemo(() => {
    return properties.filter(p => p.isFeatured).sort((a, b) => b.views - a.views)[0] || null;
  }, [properties]);

  const handleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireAuth('favorite')) return;
    dispatch(toggleFavorite(id));
    const isFav = user?.favoriteIds.includes(id);
    dispatch(addToast({
      message: isFav ? (lang === 'ar' ? 'تمت الإزالة' : 'Removed') : (lang === 'ar' ? 'أضيفت للمفضلة' : 'Added to favorites'),
      type: isFav ? 'info' : 'success',
    }));
  };

  const handleShare = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/properties/${id}`);
    dispatch(addToast({ message: lang === 'ar' ? 'تم نسخ الرابط' : 'Link copied!', type: 'success' }));
  };

  const getBadge = (id: string) => BADGES.find(b => b.key === badgeMap[id]) || BADGES[0];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors" dir={isRtl ? 'rtl' : 'ltr'}>
      <AuthModal isOpen={modalOpen} onClose={closeModal} action={modalAction} />

      {/* ── Magazine-Style Hero ── */}
      {heroProperty && (
        <section className="relative h-[70vh] min-h-[540px] overflow-hidden">
          <img
            src={heroProperty.images[0]}
            alt={heroProperty.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-neutral-950 via-transparent to-transparent" />

          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full">
              <div className="max-w-xl">
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Crown size={16} className="text-amber-400" />
                    <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
                      {lang === 'ar' ? 'أبرز عقار مميز' : 'Featured Estate'}
                    </span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4 font-serif">
                    {tProp(heroProperty, 'title')}
                  </h1>
                  <p className="text-neutral-300 text-sm leading-relaxed mb-6 line-clamp-3">
                    {tProp(heroProperty, 'description')}
                  </p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="text-2xl font-bold text-white">${heroProperty.price.toLocaleString()}</div>
                    <Link
                      to={`/properties/${heroProperty.id}`}
                      className="bg-amber-500 hover:bg-amber-600 text-black px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2"
                    >
                      {lang === 'ar' ? 'استعرض العقار' : 'Explore Estate'}
                      <ArrowRight size={14} className={isRtl ? 'rotate-180' : ''} />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Breadcrumbs ── */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400 py-6 border-b border-neutral-100 dark:border-neutral-800">
          <Link to="/" className="hover:text-amber-500 flex items-center gap-1 transition-colors"><Home size={12} />{lang === 'ar' ? 'الرئيسية' : 'Home'}</Link>
          <ChevronRight size={10} className={isRtl ? 'rotate-180' : ''} />
          <span className="text-neutral-900 dark:text-white font-semibold">{lang === 'ar' ? 'العقارات المميزة' : 'Featured Properties'}</span>
        </nav>

        {/* ── Section Header ── */}
        <div className="py-12 text-center">
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">{lang === 'ar' ? 'تجميعة مختارة بعناية' : 'Handpicked Excellence'}</span>
          <h2 className="text-4xl font-bold text-neutral-900 dark:text-white mt-2 mb-4 font-serif">
            {lang === 'ar' ? 'العقارات المميزة والفاخرة' : 'Featured & Premium Properties'}
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
            {lang === 'ar' ? 'مجموعة منتقاة من أرقى العقارات بمزايا استثنائية وقيمة فريدة لا تتكرر.' : 'Our editors curate only the finest residences representing outstanding investment value and world-class architecture.'}
          </p>
        </div>

        {/* ── Badge Filter Tabs ── */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          <button
            onClick={() => setActiveBadge('all')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold border transition-all ${activeBadge === 'all' ? 'bg-neutral-900 dark:bg-white text-white dark:text-black border-transparent' : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-400'}`}
          >
            {lang === 'ar' ? 'عرض الكل' : 'All Featured'}
          </button>
          {BADGES.map(badge => (
            <button
              key={badge.key}
              onClick={() => setActiveBadge(badge.key)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 ${activeBadge === badge.key ? `bg-gradient-to-r ${badge.color} ${badge.text} border-transparent shadow-md` : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-400'}`}
            >
              {badge.icon}
              {lang === 'ar' ? badge.label_ar : badge.label_en}
            </button>
          ))}
        </div>

        {/* ── Magazine Grid ── */}
        <div className="pb-16">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-neutral-100 dark:bg-neutral-900 rounded-2xl h-96 animate-pulse" />
                ))}
              </div>
            ) : featuredProperties.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-24 text-center"
              >
                <Crown className="text-amber-400 mx-auto mb-4" size={40} />
                <h3 className="text-xl font-serif font-bold text-neutral-800 dark:text-white mb-2">
                  {lang === 'ar' ? 'لا يوجد عقارات بهذه الشارة حالياً' : 'No properties with this badge yet'}
                </h3>
                <button onClick={() => setActiveBadge('all')} className="mt-4 bg-amber-500 text-black px-6 py-3 rounded-xl text-xs font-bold">
                  {lang === 'ar' ? 'عرض الكل' : 'Show All Featured'}
                </button>
              </motion.div>
            ) : (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProperties.map((p, index) => {
                  const isFav = user?.favoriteIds.includes(p.id) ?? false;
                  const badge = getBadge(p.id);
                  // First card is large (spans 2 cols on large screens)
                  const isHero = index === 0;

                  return (
                    <motion.div
                      layout
                      key={p.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.35, delay: index * 0.05 }}
                      className={`group relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300 bg-white dark:bg-neutral-900 flex flex-col ${isHero ? 'sm:col-span-2 lg:col-span-2' : ''}`}
                    >
                      {/* Image */}
                      <div className={`relative overflow-hidden ${isHero ? 'h-72' : 'h-52'}`}>
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Badge */}
                        <div className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} bg-gradient-to-r ${badge.color} ${badge.text} px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 shadow-lg`}>
                          {badge.icon}
                          {lang === 'ar' ? badge.label_ar : badge.label_en}
                        </div>

                        {/* Action Buttons */}
                        <div className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} flex flex-col gap-2`}>
                          <button
                            onClick={e => handleFavorite(e, p.id)}
                            className={`p-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white hover:scale-110 transition-all ${isFav ? 'text-rose-400' : ''}`}
                          >
                            <Heart size={14} fill={isFav ? 'currentColor' : 'none'} />
                          </button>
                          <button
                            onClick={e => handleShare(e, p.id)}
                            className="p-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white hover:scale-110 transition-all"
                          >
                            <Share2 size={14} />
                          </button>
                        </div>

                        {/* Price on image */}
                        <div className={`absolute bottom-3 ${isRtl ? 'right-3' : 'left-3'} bg-black/60 backdrop-blur-sm text-white font-bold text-sm px-3 py-1.5 rounded-xl`}>
                          ${p.price.toLocaleString()}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-1">
                        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1.5">{tProp(p, 'type')} — {tProp(p, 'city')}</span>
                        <h3 className="font-bold text-neutral-900 dark:text-white text-sm line-clamp-2 group-hover:text-amber-500 transition-colors mb-2 leading-snug">
                          {tProp(p, 'title')}
                        </h3>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                          {tProp(p, 'description')}
                        </p>

                        <div className="flex items-center gap-4 text-[11px] text-neutral-500 dark:text-neutral-400 mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800">
                          <span className="flex items-center gap-1"><BedDouble size={12} className="text-amber-500" />{p.bedrooms} {lang === 'ar' ? 'غرف' : 'Beds'}</span>
                          <span className="flex items-center gap-1"><Bath size={12} className="text-amber-500" />{p.bathrooms} {lang === 'ar' ? 'حمام' : 'Baths'}</span>
                          <span className="flex items-center gap-1"><Maximize2 size={12} className="text-amber-500" />{p.area} {lang === 'ar' ? 'قدم²' : 'sqft'}</span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="px-5 py-3.5 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex justify-between items-center">
                        <button
                          onClick={() => setQuickViewProperty(p)}
                          className="text-[11px] text-neutral-500 hover:text-amber-500 flex items-center gap-1.5 transition-colors font-semibold"
                        >
                          <Eye size={13} />{lang === 'ar' ? 'نظرة سريعة' : 'Quick View'}
                        </button>
                        <Link
                          to={`/properties/${p.id}`}
                          className="text-[11px] font-bold text-amber-500 hover:text-amber-600 flex items-center gap-1 transition-colors group/link"
                        >
                          {lang === 'ar' ? 'التفاصيل' : 'View Details'}
                          <ArrowRight size={12} className={`${isRtl ? 'rotate-180' : ''} group-hover/link:translate-x-1 transition-transform`} />
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── CTA ── */}
        <section className="mb-16 rounded-3xl overflow-hidden relative bg-gradient-to-br from-amber-500 via-amber-600 to-orange-700 text-black p-12 text-center shadow-2xl shadow-amber-500/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_0%,transparent_70%)] pointer-events-none" />
          <h2 className="text-3xl font-bold font-serif mb-3 relative z-10">
            {lang === 'ar' ? 'هل عقارك مؤهل ليكون في قائمة المميزين؟' : 'Could Your Property Earn the Featured Badge?'}
          </h2>
          <p className="text-sm text-black/70 mb-8 max-w-lg mx-auto relative z-10">
            {lang === 'ar' ? 'تواصل معنا لتقييم عقارك ومعرفة ما إذا كان يحقق معايير الإدراج المميز.' : "Contact our editorial team to assess your property's eligibility for our featured listings program."}
          </p>
          <Link to="/contact" className="bg-black text-amber-500 px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-900 transition-all shadow-xl relative z-10 inline-block">
            {lang === 'ar' ? 'تواصل مع فريقنا الآن' : 'Contact Editorial Team'}
          </Link>
        </section>

        {/* ── FAQ ── */}
        <section className="mb-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center font-serif text-neutral-900 dark:text-white mb-8">
            {lang === 'ar' ? 'الأسئلة المتعلقة بالعقارات المميزة' : 'Featured Listings FAQ'}
          </h3>
          <div className="space-y-3">
            {[
              {
                q: lang === 'ar' ? 'ما معايير اختيار العقار المميز؟' : 'What criteria qualifies a property as "Featured"?',
                a: lang === 'ar' ? 'نقيّم كل عقار بناءً على جودة الصور، الموقع، السعر مقارنة بالسوق، مدى اكتمال البيانات، ومدى الإقبال عليه من الزوار.' : 'We evaluate each property based on photography quality, prime location, market-competitive pricing, data completeness, and platform engagement metrics.',
              },
              {
                q: lang === 'ar' ? 'هل يمكن إضافة عقار بشكل مباشر لقائمة المميزين؟' : 'Can I directly add my property to the Featured collection?',
                a: lang === 'ar' ? 'لا، يتم اختيار العقارات من قِبل فريق دريم هومز بشكل دوري وبناءً على المعايير الداخلية. يمكنك التواصل معنا لترشيح عقارك لمراجعتنا.' : 'No, the DreamHomes editorial team periodically selects properties based on internal criteria. You can contact us to nominate your property for our review process.',
              },
            ].map((item, idx) => (
              <div key={idx} className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-white dark:bg-neutral-900">
                <button
                  onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                  className="w-full p-5 flex justify-between items-center text-left"
                >
                  <span className="font-semibold text-sm text-neutral-800 dark:text-white">{item.q}</span>
                  <span className={`text-amber-500 transition-transform ${faqOpen === idx ? 'rotate-45' : ''}`}>+</span>
                </button>
                <AnimatePresence>
                  {faqOpen === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-neutral-100 dark:border-neutral-800 px-5 py-4 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed"
                    >
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
        {quickViewProperty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={() => setQuickViewProperty(null)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              <div className="md:w-1/2 relative">
                <img src={quickViewProperty.images[0]} alt={quickViewProperty.title} className="w-full h-64 md:h-full object-cover" />
                <button onClick={() => setQuickViewProperty(null)} className="absolute top-4 right-4 bg-black/50 p-1.5 rounded-full text-white hover:bg-black/70">
                  <X size={16} />
                </button>
              </div>
              <div className="md:w-1/2 p-6 flex flex-col">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">{tProp(quickViewProperty, 'type')}</span>
                <h4 className="font-bold text-lg text-neutral-900 dark:text-white mb-1 font-serif">{tProp(quickViewProperty, 'title')}</h4>
                <div className="text-amber-500 font-bold text-xl mb-4">${quickViewProperty.price.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-xs text-neutral-400 mb-4">
                  <MapPin size={12} className="text-amber-500" />
                  {tProp(quickViewProperty, 'address')}
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-4 mb-6">
                  {tProp(quickViewProperty, 'description')}
                </p>
                <div className="mt-auto flex gap-3">
                  <Link to={`/properties/${quickViewProperty.id}`} className="flex-1 bg-amber-500 hover:bg-amber-600 text-black text-center py-3 rounded-xl text-xs font-bold transition-all">
                    {lang === 'ar' ? 'عرض التفاصيل الكاملة' : 'View Full Details'}
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
