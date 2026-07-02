import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, MapPin, BedDouble, Bath, Maximize2,
  Heart, Share2, Eye, RefreshCw, X, Save, ArrowRight,
  Info, ChevronDown, Check, HelpCircle, Star, Sparkles, Key,
  Home, ChevronRight
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { toggleFavorite } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/uiSlice';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import AuthModal from '../../components/auth/AuthModal';

export default function PropertiesRentPage() {
  const dispatch = useAppDispatch();
  const { properties } = useAppSelector(s => s.properties);
  const user = useAppSelector(s => s.auth.user);
  const { t, tProp, isRtl, lang } = useLanguage();
  const { requireAuth, modalOpen, modalAction, closeModal } = useAuthGuard();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState('all');
  const [rentMax, setRentMax] = useState(25000);
  const [minBeds, setMinBeds] = useState(0);
  const [minBaths, setMinBaths] = useState(0);
  
  // Rental specific filters
  const [isFurnished, setIsFurnished] = useState<'all' | 'furnished' | 'unfurnished'>('all');
  const [billsIncluded, setBillsIncluded] = useState(false);
  const [allowShortTerm, setAllowShortTerm] = useState(false);
  const [allowLongTerm, setAllowLongTerm] = useState(false);
  const [allowPets, setAllowPets] = useState(false);
  const [needsParking, setNeedsParking] = useState(false);
  const [needsBalcony, setNeedsBalcony] = useState(false);

  // Pagination & Loading
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('trending');

  // Compare & Quick View
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [quickViewProperty, setQuickViewProperty] = useState<any | null>(null);
  const [isSavedSearch, setIsSavedSearch] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // SEO Title
  useEffect(() => {
    document.title = lang === 'ar' 
      ? 'شقق وفلل للإيجار | دريم هومز' 
      : 'Premium Rentals & Apartments | DreamHomes';
  }, [lang]);

  // Simulate loading on filter changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [searchQuery, city, rentMax, minBeds, minBaths, isFurnished, billsIncluded, allowShortTerm, allowLongTerm, allowPets, needsParking, needsBalcony, sortBy]);

  // Filter rentals
  const filteredRentals = useMemo(() => {
    return properties.filter(p => {
      if (p.listingType !== 'rent') return false;
      if (city !== 'all' && p.city.toLowerCase() !== city.toLowerCase()) return false;
      
      // Calculate rental price based on mock data (we divide sale price or use a direct mapping)
      const monthlyRent = p.price > 100000 ? Math.floor(p.price / 300) : p.price; 
      if (monthlyRent > rentMax) return false;

      if (p.bedrooms < minBeds) return false;
      if (p.bathrooms < minBaths) return false;

      // Simulated feature checks
      if (isFurnished === 'furnished' && !p.features.includes('Garden')) return false; // Mocking furnished status
      if (isFurnished === 'unfurnished' && p.features.includes('Garden')) return false;

      if (billsIncluded && !p.features.includes('Solar Panels')) return false; // Simulated
      if (allowShortTerm && p.price > 1500000) return false; // Simulated
      if (allowLongTerm && p.price < 500000) return false; // Simulated
      if (allowPets && !p.features.includes('Pet Friendly')) return false;
      if (needsParking && !p.features.includes('Parking')) return false;
      if (needsBalcony && !p.features.includes('Balcony')) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return tProp(p, 'title').toLowerCase().includes(q) || p.title.toLowerCase().includes(q);
      }

      return true;
    }).sort((a, b) => {
      const rentA = a.price > 100000 ? Math.floor(a.price / 300) : a.price;
      const rentB = b.price > 100000 ? Math.floor(b.price / 300) : b.price;
      if (sortBy === 'price-asc') return rentA - rentB;
      if (sortBy === 'price-desc') return rentB - rentA;
      return b.views - a.views; // default is trending (highest views)
    });
  }, [properties, searchQuery, city, rentMax, minBeds, minBaths, isFurnished, billsIncluded, allowShortTerm, allowLongTerm, allowPets, needsParking, needsBalcony, sortBy, lang]);

  const trendingRentals = useMemo(() => {
    return properties.filter(p => p.listingType === 'rent').sort((a, b) => b.views - a.views).slice(0, 3);
  }, [properties]);

  const handleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireAuth('favorite')) return;
    dispatch(toggleFavorite(id));
    const isFav = user?.favoriteIds.includes(id);
    dispatch(addToast({
      message: isFav ? (lang === 'ar' ? 'تمت الإزالة من المفضلة' : 'Removed') : (lang === 'ar' ? 'تمت الإضافة للمفضلة!' : 'Added!'),
      type: isFav ? 'info' : 'success'
    }));
  };

  const handleShare = (e: React.MouseEvent, p: any) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/properties/${p.id}`);
    dispatch(addToast({
      message: lang === 'ar' ? 'تم نسخ الرابط!' : 'Link copied!',
      type: 'success'
    }));
  };

  const handleToggleCompare = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (compareList.includes(id)) {
      setCompareList(prev => prev.filter(item => item !== id));
    } else {
      if (compareList.length >= 3) {
        dispatch(addToast({ message: lang === 'ar' ? 'أقصى حد 3 عقارات' : 'Max 3 properties', type: 'warning' }));
        return;
      }
      setCompareList(prev => [...prev, id]);
    }
  };

  const handleSaveSearch = () => {
    setIsSavedSearch(!isSavedSearch);
    dispatch(addToast({
      message: isSavedSearch ? (lang === 'ar' ? 'تم إلغاء الحفظ' : 'Search unsaved') : (lang === 'ar' ? 'تم حفظ البحث!' : 'Search saved!'),
      type: 'success'
    }));
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setCity('all');
    setRentMax(25000);
    setMinBeds(0);
    setMinBaths(0);
    setIsFurnished('all');
    setBillsIncluded(false);
    setAllowShortTerm(false);
    setAllowLongTerm(false);
    setAllowPets(false);
    setNeedsParking(false);
    setNeedsBalcony(false);
  };

  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 6);
      setIsLoading(false);
    }, 400);
  };

  // Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": lang === 'ar' ? 'عقارات للإيجار الفاخر' : 'Premium Luxury Rentals',
    "description": lang === 'ar' ? 'استأجر أرقى المنازل والشقق بأفضل الأسعار.' : 'Find high-end long & short term rentals.'
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300" dir={isRtl ? 'rtl' : 'ltr'}>
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      <AuthModal isOpen={modalOpen} onClose={closeModal} action={modalAction} />

      {/* ── Rent Hero Section ── */}
      <section className="relative h-[420px] flex items-center justify-center overflow-hidden bg-gradient-to-r from-sky-900 to-indigo-950">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80"
            alt="Rent Luxury"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-neutral-900/60 mix-blend-multiply" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-sky-400 bg-sky-500/10 border border-sky-400/20 mb-4 uppercase tracking-wider">
            <Key size={12} />
            {lang === 'ar' ? 'عقارات للإيجار الممتاز' : 'PREMIUM LEASING HUB'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
            {lang === 'ar' ? 'استأجر منزلك المثالي اليوم' : 'Discover Your Next Sanctuary'}
          </h1>

          {/* Quick Search Box */}
          <div className="max-w-2xl mx-auto p-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-2 border border-slate-100 dark:border-slate-800">
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search className="text-sky-500 shrink-0" size={16} />
              <input
                type="text"
                placeholder={lang === 'ar' ? 'أدخل اسم المدينة أو المجمع السكني...' : 'Enter community, city or building...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-neutral-800 dark:text-white placeholder-neutral-400 focus:outline-none text-xs"
              />
            </div>
            <button
              onClick={handleSaveSearch}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 shrink-0"
            >
              <Save size={12} className={isSavedSearch ? 'text-sky-500 fill-current' : ''} />
              <span>{lang === 'ar' ? 'حفظ البحث' : 'Save'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Breadcrumbs ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-sky-500 flex items-center gap-1">
            <Home size={12} />
            <span>{lang === 'ar' ? 'الرئيسية' : 'Home'}</span>
          </Link>
          <ChevronRight size={10} className={isRtl ? 'rotate-180' : ''} />
          <span className="text-slate-900 dark:text-white font-medium">{lang === 'ar' ? 'عقارات للإيجار' : 'Properties for Rent'}</span>
        </nav>
      </div>

      {/* ── Filter Sidebar & Listing Layout ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* ── Sidebar Filters ── */}
          <aside className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm self-start space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <SlidersHorizontal size={14} className="text-sky-500" />
                {lang === 'ar' ? 'فلاتر الإيجار' : 'Rental Filters'}
              </span>
              <button onClick={resetAllFilters} className="text-xs text-sky-500 font-semibold hover:underline">
                {lang === 'ar' ? 'مسح' : 'Clear'}
              </button>
            </div>

            <div className="space-y-4">
              {/* City */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">{lang === 'ar' ? 'المدينة' : 'City'}</label>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none"
                >
                  <option value="all">{lang === 'ar' ? 'جميع المدن' : 'All Cities'}</option>
                  <option value="Istanbul">{lang === 'ar' ? 'إسطنبول' : 'Istanbul'}</option>
                  <option value="Bodrum">{lang === 'ar' ? 'بودروم' : 'Bodrum'}</option>
                  <option value="Antalya">{lang === 'ar' ? 'أنطاليا' : 'Antalya'}</option>
                </select>
              </div>

              {/* Monthly Rent Slider */}
              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                  <span>{lang === 'ar' ? 'الإيجار الأقصى' : 'Max Rent'}</span>
                  <span className="text-sky-500">${rentMax.toLocaleString()}/mo</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="40000"
                  step="1000"
                  value={rentMax}
                  onChange={e => setRentMax(Number(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>

              {/* Furnished Options */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">{lang === 'ar' ? 'حالة التأثيث' : 'Furnished Status'}</label>
                <div className="grid grid-cols-3 gap-1 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl">
                  {['all', 'furnished', 'unfurnished'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setIsFurnished(opt as any)}
                      className={`py-1.5 rounded-lg text-[10px] font-bold transition-all ${isFurnished === opt ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                      {opt === 'all' ? (lang === 'ar' ? 'الكل' : 'All') : opt === 'furnished' ? (lang === 'ar' ? 'مفروش' : 'Furnished') : (lang === 'ar' ? 'غير مفروش' : 'Unfurnished')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkboxes for rental details */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input type="checkbox" checked={billsIncluded} onChange={e => setBillsIncluded(e.target.checked)} className="rounded text-sky-500 accent-sky-500" />
                  <span>{lang === 'ar' ? 'الفواتير مشمولة' : 'Bills Included'}</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input type="checkbox" checked={allowShortTerm} onChange={e => setAllowShortTerm(e.target.checked)} className="rounded text-sky-500 accent-sky-500" />
                  <span>{lang === 'ar' ? 'إيجار قصير المدى' : 'Short Term'}</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input type="checkbox" checked={allowLongTerm} onChange={e => setAllowLongTerm(e.target.checked)} className="rounded text-sky-500 accent-sky-500" />
                  <span>{lang === 'ar' ? 'إيجار طويل المدى' : 'Long Term'}</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input type="checkbox" checked={allowPets} onChange={e => setAllowPets(e.target.checked)} className="rounded text-sky-500 accent-sky-500" />
                  <span>{lang === 'ar' ? 'مسموح بالحيوانات الأليفة' : 'Pets Allowed'}</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input type="checkbox" checked={needsParking} onChange={e => setNeedsParking(e.target.checked)} className="rounded text-sky-500 accent-sky-500" />
                  <span>{lang === 'ar' ? 'موقف سيارات متوفر' : 'Parking Space'}</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input type="checkbox" checked={needsBalcony} onChange={e => setNeedsBalcony(e.target.checked)} className="rounded text-sky-500 accent-sky-500" />
                  <span>{lang === 'ar' ? 'شرفة متوفرة' : 'With Balcony'}</span>
                </label>
              </div>
            </div>
          </aside>

          {/* ── Property List Grid ── */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
              <span className="text-xs font-semibold text-slate-500">{filteredRentals.length} {lang === 'ar' ? 'عقار للإيجار متاح' : 'rentals available'}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy('trending')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${sortBy === 'trending' ? 'bg-sky-500 text-white' : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  {lang === 'ar' ? 'شائع' : 'Trending'}
                </button>
                <button
                  onClick={() => setSortBy('price-asc')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${sortBy === 'price-asc' ? 'bg-sky-500 text-white' : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  {lang === 'ar' ? 'الأقل سعراً' : 'Price: Low'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 h-80 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse p-4 flex flex-col gap-4">
                      <div className="bg-slate-200 dark:bg-slate-800 h-40 rounded-xl" />
                      <div className="bg-slate-200 dark:bg-slate-800 h-6 w-3/4 rounded" />
                      <div className="bg-slate-200 dark:bg-slate-800 h-4 w-1/2 rounded" />
                    </div>
                  ))
                ) : filteredRentals.length === 0 ? (
                  <div className="col-span-full py-16 text-center">
                    <Info className="text-slate-300 mx-auto mb-4" size={32} />
                    <h3 className="font-bold text-slate-800 dark:text-white mb-2">{lang === 'ar' ? 'لا نتائج مطابقة' : 'No properties found'}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">{lang === 'ar' ? 'جرب استخدام قيم أو فلاتر بحث أقل تقييداً.' : 'Try widening your search values to discover options.'}</p>
                    <button onClick={resetAllFilters} className="bg-sky-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold">{lang === 'ar' ? 'إعادة تعيين الفلاتر' : 'Reset Filters'}</button>
                  </div>
                ) : (
                  filteredRentals.slice(0, visibleCount).map(p => {
                    const isFav = user?.favoriteIds.includes(p.id) ?? false;
                    const isCompared = compareList.includes(p.id);
                    const monthlyRent = p.price > 100000 ? Math.floor(p.price / 300) : p.price;
                    return (
                      <motion.div
                        layout
                        key={p.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col"
                      >
                        <div className="h-44 relative overflow-hidden shrink-0">
                          <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute top-3 left-3 bg-sky-500 text-white px-2 py-0.5 rounded text-[9px] font-bold">
                            {lang === 'ar' ? 'إيجار' : 'RENTAL'}
                          </div>
                          
                          {/* Favorite button */}
                          <button
                            onClick={e => handleFavorite(e, p.id)}
                            className={`absolute top-3 p-1.5 rounded-lg bg-black/40 backdrop-blur-sm text-white ${isRtl ? 'left-3' : 'right-3'} ${isFav ? 'text-rose-500' : ''}`}
                          >
                            <Heart size={14} fill={isFav ? 'currentColor' : 'none'} />
                          </button>

                          {/* Price Tag */}
                          <div className="absolute bottom-3 right-3 bg-neutral-900/80 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                            ${monthlyRent.toLocaleString()} {lang === 'ar' ? 'ج/ش' : '/mo'}
                          </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-white text-xs line-clamp-1 mb-1">{tProp(p, 'title')}</h4>
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-3">
                              <MapPin size={10} className="text-sky-500" />
                              <span>{tProp(p, 'address')}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 mt-4">
                            <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                              <BedDouble size={12} /> {p.bedrooms} {lang === 'ar' ? 'غرف' : 'Beds'}
                            </span>
                            <button
                              onClick={() => setQuickViewProperty(p)}
                              className="text-[10px] font-bold text-sky-500 hover:underline flex items-center gap-1"
                            >
                              <Eye size={12} /> {lang === 'ar' ? 'عرض سريع' : 'Quick View'}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>

            {/* Load More Button */}
            {filteredRentals.length > visibleCount && (
              <div className="text-center pt-6">
                <button
                  onClick={loadMore}
                  className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 mx-auto"
                >
                  <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                  {lang === 'ar' ? 'تحميل المزيد من العقارات' : 'Load More Properties'}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Trending Slider ── */}
      <section className="bg-slate-100 dark:bg-slate-900 border-t border-b border-slate-200 dark:border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-xs font-bold text-sky-500 uppercase tracking-widest">{lang === 'ar' ? 'شقق مطلوبة للغاية' : 'High Demand Listings'}</span>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{lang === 'ar' ? 'عقارات للإيجار الأكثر رواجاً' : 'Trending Rentals'}</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingRentals.map(p => {
              const rent = p.price > 100000 ? Math.floor(p.price / 300) : p.price;
              return (
                <div key={`trend-${p.id}`} className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
                  <img src={p.images[0]} alt={p.title} className="h-40 w-full object-cover" />
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-xs line-clamp-1 mb-1">{tProp(p, 'title')}</h4>
                      <p className="text-[10px] text-sky-500 font-extrabold">${rent}/mo</p>
                    </div>
                    <Link to={`/properties/${p.id}`} className="text-[10px] font-bold text-neutral-400 hover:text-sky-500 flex items-center gap-1.5 mt-4">
                      {lang === 'ar' ? 'احجز موعد للمشاهدة' : 'Schedule viewing'} <ArrowRight size={10} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-8">{lang === 'ar' ? 'الأسئلة الشائعة للمستأجرين' : 'Rental Inquiries FAQ'}</h2>
        <div className="space-y-3">
          {[
            {
              q: lang === 'ar' ? 'ما هي الأوراق المطلوبة لتوقيع عقد إيجار في تركيا؟' : 'What documents are required to sign a rental agreement?',
              a: lang === 'ar' ? 'يتطلب توقيع العقد جواز سفر ساري المفعول، ورقم هوية تركية (إن وجد)، بالإضافة إلى دفع تأمين يعادل إيجار شهر أو شهرين كحد أقصى.' : 'You typically need a valid passport/ID copy, deposit (usually 1 or 2 months rent), and proof of employment or local residency address.'
            },
            {
              q: lang === 'ar' ? 'هل تشمل أسعار الإيجار فواتير الخدمات والعائدات الشهرية؟' : 'Are monthly utility bills included in the rent price?',
              a: lang === 'ar' ? 'في الغالب لا تشمل فواتير الماء والكهرباء والإنترنت، إلا إذا تم الإشارة إلى ذلك صراحة في تفاصيل العقار باسم (Bills Included).' : 'No, utilities and building maintenance fees (Aidat) are usually paid separately unless labeled specifically as bills included.'
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                className="w-full p-4 flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800 dark:text-white text-left"
              >
                <span>{item.q}</span>
                <ChevronDown size={14} className={faqOpen === idx ? 'rotate-180 text-sky-500' : ''} />
              </button>
              {faqOpen === idx && (
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Compare Bottom shelf ── */}
      {compareList.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-2xl p-4 rounded-2xl max-w-lg mx-auto flex items-center justify-between border border-slate-200 dark:border-slate-800">
          <div className="text-xs font-bold text-slate-800 dark:text-white">
            {lang === 'ar' ? 'مقارنة الإيجار المختار' : 'Compare selected rentals'} ({compareList.length}/3)
          </div>
          <div className="flex gap-2">
            <button onClick={() => setCompareList([])} className="text-xs text-neutral-400 font-semibold">{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
            <button onClick={() => setIsCompareOpen(true)} className="bg-sky-500 text-white px-4 py-2 rounded-xl text-xs font-bold">{lang === 'ar' ? 'عرض المقارنة' : 'View Matrix'}</button>
          </div>
        </div>
      )}

      {/* ── Compare Dialog Modal ── */}
      {isCompareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl p-6 shadow-2xl relative">
            <button onClick={() => setIsCompareOpen(false)} className="absolute top-4 right-4 text-slate-500"><X size={16} /></button>
            <h3 className="font-bold text-sm text-slate-950 dark:text-white mb-6 border-b pb-2">{lang === 'ar' ? 'جدول مقارنة عقارات الإيجار' : 'Leasing Comparison Matrix'}</h3>
            <div className="grid grid-cols-4 gap-4 text-center text-xs">
              <div className="text-left font-bold text-neutral-400">{lang === 'ar' ? 'العقار' : 'Rental'}</div>
              {compareList.map(id => {
                const item = properties.find(p => p.id === id);
                return <div key={id} className="font-bold truncate">{tProp(item, 'title')}</div>;
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Quick View Modal ── */}
      {quickViewProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
            <button onClick={() => setQuickViewProperty(null)} className="absolute top-4 right-4 text-slate-500"><X size={16} /></button>
            <img src={quickViewProperty.images[0]} alt={quickViewProperty.title} className="w-full h-44 object-cover rounded-xl mb-4" />
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mb-1">{tProp(quickViewProperty, 'title')}</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-6">{tProp(quickViewProperty, 'description')}</p>
            <Link to={`/properties/${quickViewProperty.id}`} className="block bg-sky-500 text-white text-center py-2.5 rounded-xl text-xs font-bold">{lang === 'ar' ? 'صفحة العقار الكاملة' : 'View Full Details'}</Link>
          </div>
        </div>
      )}
    </div>
  );
}
