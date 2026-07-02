import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, MapPin, BedDouble, Bath, Maximize2,
  Heart, Share2, Eye, RefreshCw, X, Check, Save, ArrowRight,
  Info, ChevronDown, HelpCircle, ChevronRight, Home, ListFilter, Map
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { toggleFavorite } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/uiSlice';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import AuthModal from '../../components/auth/AuthModal';

export default function PropertiesSalePage() {
  const dispatch = useAppDispatch();
  const { properties } = useAppSelector(s => s.properties);
  const user = useAppSelector(s => s.auth.user);
  const { t, tProp, isRtl, lang } = useLanguage();
  const { requireAuth, modalOpen, modalAction, closeModal } = useAuthGuard();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState('all');
  const [district, setDistrict] = useState('all');
  const [propertyType, setPropertyType] = useState('all');
  const [priceMax, setPriceMax] = useState(6000000);
  const [minBeds, setMinBeds] = useState(0);
  const [minBaths, setMinBaths] = useState(0);
  const [minArea, setMinArea] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('all');
  const [constructionStatus, setConstructionStatus] = useState('all');

  // Page Controls
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(false);

  // Compare & Quick View States
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [quickViewProperty, setQuickViewProperty] = useState<any | null>(null);
  const [isSavedSearch, setIsSavedSearch] = useState(false);

  // FAQ Accordion State
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // SEO & Document Title
  useEffect(() => {
    document.title = lang === 'ar' 
      ? 'عقارات فاخرة للبيع | دريم هومز' 
      : 'Luxury Properties for Sale | DreamHomes';
  }, [lang]);

  // Handle Loading Simulation
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [searchQuery, city, district, propertyType, priceMax, minBeds, minBaths, minArea, paymentMethod, constructionStatus, sortBy]);

  // Districts based on City selection
  const districtsByCity: Record<string, string[]> = {
    'Istanbul': ['Bebek', 'Sarıyer', 'Kadıköy', 'Karaköy', 'Tarabya'],
    'Bodrum': ['Yalıkavak', 'Göltürkbükü', 'Bitez'],
    'Antalya': ['Lara', 'Konyaaltı', 'Kemer'],
  };

  const currentDistricts = useMemo(() => {
    if (city === 'all') return [];
    return districtsByCity[city] || [];
  }, [city]);

  // Reset district if city changes
  useEffect(() => {
    setDistrict('all');
  }, [city]);

  // Filter properties
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      if (p.listingType !== 'sale') return false;
      if (city !== 'all' && p.city.toLowerCase() !== city.toLowerCase()) return false;
      
      // Match mock district
      if (district !== 'all') {
        const districtStr = district.toLowerCase();
        if (!p.address.toLowerCase().includes(districtStr)) return false;
      }

      if (propertyType !== 'all' && p.type.toLowerCase() !== propertyType.toLowerCase()) return false;
      if (p.price > priceMax) return false;
      if (p.bedrooms < minBeds) return false;
      if (p.bathrooms < minBaths) return false;
      if (p.area < minArea) return false;

      // Mock payment method
      if (paymentMethod !== 'all') {
        const isCash = p.price < 3000000; // Simulated criteria
        if (paymentMethod === 'cash' && !isCash) return false;
        if (paymentMethod === 'installment' && isCash) return false;
      }

      // Mock construction status
      if (constructionStatus !== 'all') {
        const isReady = p.id !== '3' && p.id !== '5'; // Simulated criteria
        if (constructionStatus === 'ready' && !isReady) return false;
        if (constructionStatus === 'under-construction' && isReady) return false;
      }

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const titleMatch = tProp(p, 'title').toLowerCase().includes(q) || p.title.toLowerCase().includes(q);
        const addressMatch = tProp(p, 'address').toLowerCase().includes(q) || p.address.toLowerCase().includes(q);
        return titleMatch || addressMatch;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'area-desc') return b.area - a.area;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [properties, searchQuery, city, district, propertyType, priceMax, minBeds, minBaths, minArea, paymentMethod, constructionStatus, sortBy, lang]);

  // Featured Properties for Sale (top viewed or specifically tagged)
  const featuredProperties = useMemo(() => {
    return properties.filter(p => p.listingType === 'sale' && p.isFeatured).slice(0, 3);
  }, [properties]);

  // Paginated results
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProperties.slice(start, start + itemsPerPage);
  }, [filteredProperties, currentPage]);

  const handleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireAuth('favorite')) return;
    dispatch(toggleFavorite(id));
    const isFav = user?.favoriteIds.includes(id);
    dispatch(addToast({
      message: isFav
        ? (lang === 'ar' ? 'تمت الإزالة من المفضلة' : 'Removed from favorites')
        : (lang === 'ar' ? 'تمت الإضافة للمفضلة!' : 'Added to favorites!'),
      type: isFav ? 'info' : 'success'
    }));
  };

  const handleShare = (e: React.MouseEvent, p: any) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/properties/${p.id}`;
    navigator.clipboard.writeText(shareUrl);
    dispatch(addToast({
      message: lang === 'ar' ? 'تم نسخ رابط العقار بنجاح!' : 'Property link copied to clipboard!',
      type: 'success'
    }));
  };

  const handleToggleCompare = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (compareList.includes(id)) {
      setCompareList(prev => prev.filter(item => item !== id));
      dispatch(addToast({
        message: lang === 'ar' ? 'تمت إزالة العقار من المقارنة' : 'Property removed from comparison',
        type: 'info'
      }));
    } else {
      if (compareList.length >= 3) {
        dispatch(addToast({
          message: lang === 'ar' ? 'يمكنك مقارنة 3 عقارات كحد أقصى' : 'You can compare up to 3 properties maximum',
          type: 'warning'
        }));
        return;
      }
      setCompareList(prev => [...prev, id]);
      dispatch(addToast({
        message: lang === 'ar' ? 'تمت إضافة العقار للمقارنة!' : 'Property added to comparison!',
        type: 'success'
      }));
    }
  };

  const handleSaveSearch = () => {
    setIsSavedSearch(!isSavedSearch);
    dispatch(addToast({
      message: isSavedSearch
        ? (lang === 'ar' ? 'تم إلغاء حفظ البحث' : 'Search unsaved')
        : (lang === 'ar' ? 'تم حفظ معايير البحث بنجاح!' : 'Search criteria saved successfully!'),
      type: 'success'
    }));
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setCity('all');
    setDistrict('all');
    setPropertyType('all');
    setPriceMax(6000000);
    setMinBeds(0);
    setMinBaths(0);
    setMinArea(0);
    setPaymentMethod('all');
    setConstructionStatus('all');
  };

  // Structured Data (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": lang === 'ar' ? 'عقارات للبيع في تركيا' : 'Properties for Sale in Turkey',
    "description": lang === 'ar' ? 'تصفح أفضل الفلل والشقق الفاخرة للبيع' : 'Browse elite villas and apartments for sale',
    "itemListElement": filteredProperties.slice(0, 6).map((p, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "url": `${window.location.origin}/properties/${p.id}`,
      "name": p.title,
      "image": p.images[0]
    }))
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Dynamic SEO JSON-LD */}
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      <AuthModal isOpen={modalOpen} onClose={closeModal} action={modalAction} />

      {/* ── Luxury Hero Section ── */}
      <section className="relative h-[480px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80"
            alt="Luxury Homes for Sale"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-neutral-50 dark:to-neutral-950" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center mt-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
              {lang === 'ar' ? 'عقارات تمليك فاخرة' : 'PREMIUM HOMEOWNERSHIP'}
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight font-serif"
          >
            {lang === 'ar' ? 'استثمر في مستقبل الرفاهية' : 'Invest in Your Future Address'}
          </motion.h1>

          {/* Floating Glassmorphic Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="p-2 sm:p-3 rounded-2xl bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl max-w-3xl mx-auto flex flex-col sm:flex-row gap-2"
          >
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search className="text-amber-400 shrink-0" size={18} />
              <input
                type="text"
                placeholder={lang === 'ar' ? 'ابحث بالمدينة، الحي أو اسم العقار...' : 'Search by city, neighborhood, keyword...'}
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full bg-transparent border-none text-white placeholder-white/60 focus:outline-none text-sm"
              />
            </div>
            <div className="flex gap-2 sm:w-auto">
              <button
                onClick={handleSaveSearch}
                className={`px-4 py-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                  isSavedSearch 
                    ? 'bg-amber-500 border-amber-500 text-white shadow-lg' 
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
              >
                <Save size={14} />
                <span className="hidden sm:inline">{isSavedSearch ? (lang === 'ar' ? 'تم الحفظ' : 'Saved') : (lang === 'ar' ? 'حفظ البحث' : 'Save Search')}</span>
              </button>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
                className="px-4 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
              >
                {viewMode === 'grid' ? <Map size={14} /> : <Home size={14} />}
                <span>{viewMode === 'grid' ? (lang === 'ar' ? 'عرض الخريطة' : 'Map View') : (lang === 'ar' ? 'عرض الشبكة' : 'Grid View')}</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Breadcrumbs ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <Link to="/" className="hover:text-amber-500 transition-colors flex items-center gap-1">
            <Home size={12} />
            <span>{lang === 'ar' ? 'الرئيسية' : 'Home'}</span>
          </Link>
          <ChevronRight size={10} className={isRtl ? 'rotate-180' : ''} />
          <Link to="/properties" className="hover:text-amber-500 transition-colors">
            {lang === 'ar' ? 'العقارات' : 'Properties'}
          </Link>
          <ChevronRight size={10} className={isRtl ? 'rotate-180' : ''} />
          <span className="text-neutral-900 dark:text-white font-medium">
            {lang === 'ar' ? 'عقارات للبيع' : 'Properties for Sale'}
          </span>
        </nav>
      </div>

      {/* ── Main Content Grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* ── Sidebar Filters ── */}
          <aside className="dh-card p-6 self-start bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-5">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="text-amber-500" size={16} />
                <h3 className="font-bold text-neutral-900 dark:text-white text-sm">{lang === 'ar' ? 'فلاتر متقدمة' : 'Advanced Filters'}</h3>
              </div>
              <button
                onClick={resetAllFilters}
                className="text-xs text-amber-500 hover:text-amber-600 font-semibold flex items-center gap-1 transition-colors"
              >
                <RefreshCw size={12} />
                {lang === 'ar' ? 'مسح الكل' : 'Clear All'}
              </button>
            </div>

            <div className="space-y-5">
              {/* City */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">{lang === 'ar' ? 'المدينة' : 'City'}</label>
                <select
                  value={city}
                  onChange={e => { setCity(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="all">{lang === 'ar' ? 'جميع المدن' : 'All Cities'}</option>
                  <option value="Istanbul">{lang === 'ar' ? 'إسطنبول' : 'Istanbul'}</option>
                  <option value="Bodrum">{lang === 'ar' ? 'بودروم' : 'Bodrum'}</option>
                  <option value="Antalya">{lang === 'ar' ? 'أنطاليا' : 'Antalya'}</option>
                </select>
              </div>

              {/* District (conditional) */}
              {city !== 'all' && currentDistricts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">{lang === 'ar' ? 'المنطقة / الحي' : 'District'}</label>
                  <select
                    value={district}
                    onChange={e => { setDistrict(e.target.value); setCurrentPage(1); }}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="all">{lang === 'ar' ? 'جميع المناطق' : 'All Districts'}</option>
                    {currentDistricts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </motion.div>
              )}

              {/* Property Type */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">{lang === 'ar' ? 'نوع العقار' : 'Property Type'}</label>
                <select
                  value={propertyType}
                  onChange={e => { setPropertyType(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="all">{lang === 'ar' ? 'جميع الأنواع' : 'All Types'}</option>
                  <option value="Villa">{lang === 'ar' ? 'فيلا' : 'Villa'}</option>
                  <option value="Apartment">{lang === 'ar' ? 'شقة' : 'Apartment'}</option>
                  <option value="Penthouse">{lang === 'ar' ? 'بنتهاوس' : 'Penthouse'}</option>
                  <option value="House">{lang === 'ar' ? 'منزل' : 'House'}</option>
                </select>
              </div>

              {/* Price Range Slider Slider mock */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  <span>{lang === 'ar' ? 'الحد الأقصى للسعر' : 'Max Price'}</span>
                  <span className="text-amber-500">${(priceMax / 1000000).toFixed(1)}M</span>
                </div>
                <input
                  type="range"
                  min="500000"
                  max="10000000"
                  step="250000"
                  value={priceMax}
                  onChange={e => { setPriceMax(Number(e.target.value)); setCurrentPage(1); }}
                  className="w-full accent-amber-500 h-1 bg-neutral-200 dark:bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Bedrooms & Bathrooms */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">{lang === 'ar' ? 'غرف النوم' : 'Beds'}</label>
                  <select
                    value={minBeds}
                    onChange={e => { setMinBeds(Number(e.target.value)); setCurrentPage(1); }}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="0">{lang === 'ar' ? 'أي عدد' : 'Any'}</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">{lang === 'ar' ? 'الحمامات' : 'Baths'}</label>
                  <select
                    value={minBaths}
                    onChange={e => { setMinBaths(Number(e.target.value)); setCurrentPage(1); }}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="0">{lang === 'ar' ? 'أي عدد' : 'Any'}</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>
              </div>

              {/* Min Area */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">{lang === 'ar' ? 'الحد الأدنى للمساحة (قدم²)' : 'Min Area (sqft)'}</label>
                <select
                  value={minArea}
                  onChange={e => { setMinArea(Number(e.target.value)); setCurrentPage(1); }}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="0">{lang === 'ar' ? 'أي مساحة' : 'Any Area'}</option>
                  <option value="1500">1,500+</option>
                  <option value="2500">2,500+</option>
                  <option value="3500">3,500+</option>
                  <option value="5000">5,000+</option>
                </select>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">{lang === 'ar' ? 'طريقة الدفع' : 'Payment Method'}</label>
                <select
                  value={paymentMethod}
                  onChange={e => { setPaymentMethod(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="all">{lang === 'ar' ? 'الكل' : 'All Methods'}</option>
                  <option value="cash">{lang === 'ar' ? 'كاش فقط' : 'Cash Only'}</option>
                  <option value="installment">{lang === 'ar' ? 'تقسيط متاح' : 'Installments Available'}</option>
                </select>
              </div>

              {/* Ready / Under Construction */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">{lang === 'ar' ? 'حالة الإنشاء' : 'Construction Status'}</label>
                <select
                  value={constructionStatus}
                  onChange={e => { setConstructionStatus(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="all">{lang === 'ar' ? 'الكل' : 'All States'}</option>
                  <option value="ready">{lang === 'ar' ? 'جاهز للتسليم' : 'Ready to Move'}</option>
                  <option value="under-construction">{lang === 'ar' ? 'قيد الإنشاء' : 'Under Construction'}</option>
                </select>
              </div>
            </div>
          </aside>

          {/* ── Main Properties List Area ── */}
          <div className="lg:col-span-3 space-y-8">
            {/* Sort & Stats Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm">
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                {lang === 'ar' 
                  ? `تم العثور على ${filteredProperties.length} عقاراً`
                  : `Found ${filteredProperties.length} properties for sale`}
              </span>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium whitespace-nowrap">{lang === 'ar' ? 'ترتيب حسب' : 'Sort By'}</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-semibold focus:outline-none"
                >
                  <option value="newest">{lang === 'ar' ? 'الأحدث أولاً' : 'Newest'}</option>
                  <option value="price-asc">{lang === 'ar' ? 'السعر: من الأقل' : 'Price: Low to High'}</option>
                  <option value="price-desc">{lang === 'ar' ? 'السعر: من الأعلى' : 'Price: High to Low'}</option>
                  <option value="area-desc">{lang === 'ar' ? 'المساحة الأكبر' : 'Largest Area'}</option>
                </select>
              </div>
            </div>

            {/* View Mode Switching Content */}
            {viewMode === 'grid' ? (
              /* Grid Layout */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {isLoading ? (
                    Array.from({ length: 4 }).map((_, idx) => (
                      <div key={idx} className="dh-card p-4 h-[380px] animate-pulse bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl flex flex-col gap-4">
                        <div className="bg-neutral-200 dark:bg-neutral-800 w-full h-48 rounded-xl" />
                        <div className="bg-neutral-200 dark:bg-neutral-800 h-6 w-3/4 rounded" />
                        <div className="bg-neutral-200 dark:bg-neutral-800 h-4 w-1/2 rounded" />
                        <div className="flex gap-2 mt-auto">
                          <div className="bg-neutral-200 dark:bg-neutral-800 h-6 w-12 rounded" />
                          <div className="bg-neutral-200 dark:bg-neutral-800 h-6 w-12 rounded" />
                          <div className="bg-neutral-200 dark:bg-neutral-800 h-6 w-12 rounded" />
                        </div>
                      </div>
                    ))
                  ) : paginatedProperties.length === 0 ? (
                    /* Empty State */
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="col-span-full py-16 text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center mx-auto mb-4 border border-neutral-200 dark:border-neutral-800">
                        <Info className="text-amber-500" size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">{lang === 'ar' ? 'لم نجد أي عقارات تطابق بحثك' : 'No properties match your filters'}</h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6 max-w-sm mx-auto">{lang === 'ar' ? 'جرب تغيير شروط البحث، أو مسح الفلاتر للبدء من جديد.' : 'Try adjusting the price range, location or reset filters to explore other options.'}</p>
                      <button onClick={resetAllFilters} className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-amber-500/20">{lang === 'ar' ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}</button>
                    </motion.div>
                  ) : (
                    paginatedProperties.map(p => {
                      const isFav = user?.favoriteIds.includes(p.id) ?? false;
                      const isCompared = compareList.includes(p.id);
                      return (
                        <motion.div
                          layout
                          key={p.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 15 }}
                          transition={{ duration: 0.3 }}
                          className="group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-[400px]"
                        >
                          {/* Image container */}
                          <div className="relative h-48 overflow-hidden shrink-0">
                            <img
                              src={p.images[0]}
                              alt={p.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                            
                            {/* Tags */}
                            <div className={`absolute top-3 flex gap-2 ${isRtl ? 'right-3' : 'left-3'}`}>
                              <span className="bg-amber-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md">
                                {lang === 'ar' ? 'بيع' : 'FOR SALE'}
                              </span>
                              {p.isFeatured && (
                                <span className="bg-neutral-900/90 backdrop-blur-sm text-amber-400 px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md border border-amber-500/20">
                                  {lang === 'ar' ? 'مميز' : 'FEATURED'}
                                </span>
                              )}
                            </div>

                            {/* Wishlist Button */}
                            <button
                              onClick={(e) => handleFavorite(e, p.id)}
                              className={`absolute top-3 p-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition-all ${isRtl ? 'left-3' : 'right-3'} ${isFav ? 'text-rose-500' : 'hover:scale-105'}`}
                            >
                              <Heart size={14} fill={isFav ? "currentColor" : "none"} />
                            </button>

                            {/* Compare & Share overlay */}
                            <div className={`absolute bottom-3 flex gap-2 ${isRtl ? 'right-3' : 'left-3'}`}>
                              <button
                                onClick={(e) => handleToggleCompare(e, p.id)}
                                className={`p-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition-all text-xs font-medium flex items-center gap-1.5 ${isCompared ? 'bg-amber-500 text-black border border-amber-400' : ''}`}
                                title={lang === 'ar' ? 'قارن العقار' : 'Compare property'}
                              >
                                <RefreshCw size={12} className={isCompared ? 'animate-spin' : ''} />
                                <span className="text-[10px]">{isCompared ? (lang === 'ar' ? 'مضاف' : 'Added') : (lang === 'ar' ? 'مقارنة' : 'Compare')}</span>
                              </button>
                            </div>

                            {/* Price Badge */}
                            <div className={`absolute bottom-3 ${isRtl ? 'left-3' : 'right-3'} bg-neutral-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-xs font-extrabold`}>
                              ${p.price.toLocaleString()}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-5 flex flex-col flex-1">
                            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1.5">{tProp(p, 'type')}</span>
                            <h4 className="font-extrabold text-neutral-900 dark:text-white group-hover:text-amber-500 transition-colors text-sm line-clamp-1 mb-2">
                              {tProp(p, 'title')}
                            </h4>
                            <div className="flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400 mb-4">
                              <MapPin size={12} className="text-amber-500 shrink-0" />
                              <span className="line-clamp-1">{tProp(p, 'address')}</span>
                            </div>

                            {/* Features row */}
                            <div className="grid grid-cols-3 gap-2 border-t border-neutral-100 dark:border-neutral-800 pt-4 mt-auto">
                              <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 font-semibold">
                                <BedDouble size={14} className="text-neutral-400" />
                                <span>{p.bedrooms} {lang === 'ar' ? 'غرف' : 'Beds'}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 font-semibold">
                                <Bath size={14} className="text-neutral-400" />
                                <span>{p.bathrooms} {lang === 'ar' ? 'حمام' : 'Baths'}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 font-semibold">
                                <Maximize2 size={14} className="text-neutral-400" />
                                <span>{p.area} {lang === 'ar' ? 'قدم²' : 'sqft'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Interactive Card Action Footer */}
                          <div className="px-5 py-3 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center shrink-0">
                            <button
                              onClick={() => setQuickViewProperty(p)}
                              className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400 hover:text-amber-500 flex items-center gap-1 transition-colors"
                            >
                              <Eye size={12} />
                              {lang === 'ar' ? 'نظرة سريعة' : 'Quick View'}
                            </button>
                            <Link
                              to={`/properties/${p.id}`}
                              className="text-[11px] font-bold text-amber-500 hover:text-amber-600 flex items-center gap-1.5 transition-all group/btn"
                            >
                              <span>{lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}</span>
                              <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Map Preview Layout - SVG Interactive Plot Plan style for premium aesthetics */
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden h-[600px] relative shadow-sm">
                <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-lg max-w-xs">
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white mb-1">{lang === 'ar' ? 'معاينة خريطة الاستثمار' : 'Investment Map Preview'}</h4>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400">{lang === 'ar' ? 'اضغط على دبابيس الموقع لعرض ملخص العقارات والتفاصيل السعرية.' : 'Click coordinate pins to explore interactive property matrices.'}</p>
                </div>

                {/* SVG interactive layout showing pins over a styled custom stylized vector land map of Turkey */}
                <div className="w-full h-full bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center relative overflow-hidden">
                  <svg className="w-4/5 h-4/5 opacity-20 dark:opacity-10 text-neutral-800 dark:text-white" viewBox="0 0 800 400" fill="none" stroke="currentColor" strokeWidth="2">
                    {/* Simulated coastline grid */}
                    <path d="M 50 150 Q 150 120 250 180 T 450 140 T 650 200 T 750 120" />
                    <path d="M 80 200 Q 180 180 280 220 T 480 190 T 680 240 T 780 180" />
                    <circle cx="200" cy="180" r="10" strokeDasharray="2 2" />
                    <circle cx="500" cy="150" r="25" strokeDasharray="3 3" />
                  </svg>

                  {/* Interactive pins */}
                  {filteredProperties.map((p, idx) => {
                    // Spread pins out across map based on ID/index
                    const left = 20 + (idx * 14) % 65;
                    const top = 30 + (idx * 9) % 55;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setQuickViewProperty(p)}
                        className="absolute p-1 bg-amber-500 text-white rounded-full shadow-lg border-2 border-white dark:border-neutral-900 hover:scale-125 hover:bg-neutral-900 hover:text-amber-500 transition-all flex items-center gap-1 group z-10"
                        style={{ left: `${left}%`, top: `${top}%` }}
                      >
                        <MapPin size={14} />
                        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-[10px] font-bold px-1 whitespace-nowrap">
                          ${(p.price / 1000000).toFixed(2)}M
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-6">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 disabled:opacity-40 hover:bg-white dark:hover:bg-neutral-900 transition-all"
                >
                  <ChevronRight size={14} className={isRtl ? '' : 'rotate-180'} />
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${currentPage === idx + 1 ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'border border-neutral-200 dark:border-neutral-800 hover:bg-white dark:hover:bg-neutral-900'}`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 disabled:opacity-40 hover:bg-white dark:hover:bg-neutral-900 transition-all"
                >
                  <ChevronRight size={14} className={isRtl ? 'rotate-180' : ''} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Featured Properties Slider ── */}
      <section className="bg-neutral-100 dark:bg-neutral-900/50 border-t border-b border-neutral-200 dark:border-neutral-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-amber-500 tracking-wider uppercase">{lang === 'ar' ? 'صفوة العقارات' : 'Handpicked Gems'}</span>
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mt-1 font-serif">{lang === 'ar' ? 'العقارات الفاخرة المميزة للبيع' : 'Featured Properties'}</h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">{lang === 'ar' ? 'مجموعة منتقاة بعناية من أفضل المنازل المتاحة في السوق.' : 'Vetted listings representing investment value & luxury architecture.'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProperties.map(p => (
              <div key={`featured-${p.id}`} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm flex flex-col">
                <div className="h-48 relative overflow-hidden">
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/35" />
                  <div className="absolute top-4 left-4 bg-amber-500 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-md">
                    {lang === 'ar' ? 'نخبة العقارات' : 'ELITE CHOICE'}
                  </div>
                  <div className="absolute bottom-4 right-4 text-white font-extrabold text-sm">${p.price.toLocaleString()}</div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h4 className="font-bold text-neutral-900 dark:text-white text-xs line-clamp-1 mb-2">{tProp(p, 'title')}</h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-4">{tProp(p, 'description')}</p>
                  <Link to={`/properties/${p.id}`} className="mt-auto text-amber-500 font-bold text-[11px] flex items-center gap-1 hover:underline">
                    {lang === 'ar' ? 'استعرض العقار' : 'Explore Listing'} <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="bg-amber-500 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-200 via-amber-300 to-amber-700 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold mb-4 font-serif">{lang === 'ar' ? 'هل تود بيع عقارك الخاص بأعلى سعر؟' : 'Ready to Sell Your Luxury Property?'}</h2>
          <p className="text-sm text-amber-50 mb-8 max-w-xl mx-auto">{lang === 'ar' ? 'اتصل بخبراء دريم هومز للحصول على تقييم مجاني وتسويق عالمي فريد لعقاراتك.' : 'Partner with DreamHomes to showcase your residence to active luxury buyers worldwide.'}</p>
          <div className="flex justify-center gap-4">
            <Link to="/contact" className="bg-white hover:bg-neutral-100 text-amber-600 px-6 py-3 rounded-xl font-bold text-xs shadow-lg transition-all">{lang === 'ar' ? 'تواصل معنا الآن' : 'Get in Touch'}</Link>
            <Link to="/dashboard/add-property" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-lg border border-amber-400/30 transition-all">{lang === 'ar' ? 'أضف عقارك مجاناً' : 'Submit Property'}</Link>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white text-center mb-8 font-serif">{lang === 'ar' ? 'الأسئلة الشائعة حول شراء العقارات' : 'Home Buying Frequently Asked Questions'}</h2>
        <div className="space-y-4">
          {[
            {
              q: lang === 'ar' ? 'ما هي الرسوم الإضافية عند شراء عقار في تركيا؟' : 'What additional fees apply when purchasing property in Turkey?',
              a: lang === 'ar' ? 'تشمل الرسوم ضريبة نقل الملكية (الطابو) بنسبة 4%، ورسوم كاتب العدل، وتكلفة مترجم محلف ورسوم تقرير التقييم العقاري.' : 'Additional costs typically include the property transfer tax (Tapu) of 4%, notary public fees, legal translation costs, and official valuation report charges.'
            },
            {
              q: lang === 'ar' ? 'هل يحق للأجانب الحصول على الجنسية التركية عن طريق الاستثمار؟' : 'Are foreigners eligible for Turkish citizenship by real estate investment?',
              a: lang === 'ar' ? 'نعم، يمكن للمستثمر الأجنبي التقديم للحصول على الجنسية عند شراء عقار بقيمة لا تقل عن 400,000 دولار أمريكي مع الالتزام بعدم بيعه لمدة 3 سنوات.' : 'Yes, purchasing property worth at least $400,000 USD and keeping it for minimum 3 years qualifies investors to apply for Turkish Citizenship.'
            },
            {
              q: lang === 'ar' ? 'كيف تتم عملية توثيق العقود والدفع بشكل آمن؟' : 'How is transaction security handled during contracts and payments?',
              a: lang === 'ar' ? 'يتم الدفع عبر حسابات مصرفية موثقة وتسجيل العقود رسمياً لدى كاتب العدل لضمان الأمان والالتزام بكافة الشروط القانونية.' : 'All payments are conducted via secure bank transfers and contracts are registered officially with the notary public to safeguard funds and title rights.'
            }
          ].map((item, idx) => (
            <div key={idx} className="border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 overflow-hidden">
              <button
                onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                className="w-full px-5 py-4 text-left font-bold text-xs sm:text-sm text-neutral-900 dark:text-white flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
              >
                <span>{item.q}</span>
                <ChevronDown size={16} className={`transition-transform duration-300 ${faqOpen === idx ? 'rotate-180 text-amber-500' : ''}`} />
              </button>
              <AnimatePresence>
                {faqOpen === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-5 pb-4 text-xs text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800 pt-3 leading-relaxed"
                  >
                    {item.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* ── Compare Floating Drawer ── */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 shadow-2xl py-4 px-6 flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto rounded-t-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                <RefreshCw size={14} className="animate-spin" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900 dark:text-white">{lang === 'ar' ? 'قارن العقارات المحددة' : 'Compare Selected Properties'}</p>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400">{compareList.length} / 3 {lang === 'ar' ? 'تم اختيارها' : 'selected'}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCompareList([])}
                className="px-4 py-2 text-xs font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              >
                {lang === 'ar' ? 'إلغاء الكل' : 'Clear All'}
              </button>
              <button
                onClick={() => setIsCompareOpen(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
              >
                {lang === 'ar' ? 'بدء المقارنة الآن' : 'Compare Now'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Compare Dialog Modal ── */}
      <AnimatePresence>
        {isCompareOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-y-auto p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setIsCompareOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              >
                <X size={18} />
              </button>

              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6 border-b border-neutral-100 dark:border-neutral-800 pb-3">{lang === 'ar' ? 'جدول مقارنة العقارات الفاخرة' : 'Luxury Property Comparison Matrix'}</h3>

              <div className="grid grid-cols-4 gap-4 text-center">
                {/* Headers */}
                <div className="text-left font-bold text-xs text-neutral-500 self-center py-2">{lang === 'ar' ? 'المعيار' : 'Attribute'}</div>
                {compareList.map(id => {
                  const item = properties.find(p => p.id === id);
                  return (
                    <div key={`comp-h-${id}`} className="font-bold text-xs text-neutral-900 dark:text-white">
                      <img src={item?.images[0]} alt={item?.title} className="w-full h-24 object-cover rounded-xl mb-2" />
                      <p className="truncate">{tProp(item, 'title')}</p>
                    </div>
                  );
                })}

                {/* Price Row */}
                <div className="bg-neutral-50 dark:bg-neutral-800/40 text-left font-semibold text-xs py-3 px-2 border-b border-neutral-100 dark:border-neutral-800">{lang === 'ar' ? 'السعر' : 'Price'}</div>
                {compareList.map(id => (
                  <div key={`comp-p-${id}`} className="bg-neutral-50 dark:bg-neutral-800/40 text-xs py-3 font-extrabold text-amber-500 border-b border-neutral-100 dark:border-neutral-800">
                    ${properties.find(p => p.id === id)?.price.toLocaleString()}
                  </div>
                ))}

                {/* Bedrooms Row */}
                <div className="text-left font-semibold text-xs py-3 px-2 border-b border-neutral-100 dark:border-neutral-800">{lang === 'ar' ? 'غرف النوم' : 'Bedrooms'}</div>
                {compareList.map(id => (
                  <div key={`comp-b-${id}`} className="text-xs py-3 border-b border-neutral-100 dark:border-neutral-800">
                    {properties.find(p => p.id === id)?.bedrooms}
                  </div>
                ))}

                {/* Bathrooms Row */}
                <div className="bg-neutral-50 dark:bg-neutral-800/40 text-left font-semibold text-xs py-3 px-2 border-b border-neutral-100 dark:border-neutral-800">{lang === 'ar' ? 'الحمامات' : 'Bathrooms'}</div>
                {compareList.map(id => (
                  <div key={`comp-ba-${id}`} className="bg-neutral-50 dark:bg-neutral-800/40 text-xs py-3 border-b border-neutral-100 dark:border-neutral-800">
                    {properties.find(p => p.id === id)?.bathrooms}
                  </div>
                ))}

                {/* Area Row */}
                <div className="text-left font-semibold text-xs py-3 px-2 border-b border-neutral-100 dark:border-neutral-800">{lang === 'ar' ? 'المساحة' : 'Area'}</div>
                {compareList.map(id => (
                  <div key={`comp-a-${id}`} className="text-xs py-3 border-b border-neutral-100 dark:border-neutral-800">
                    {properties.find(p => p.id === id)?.area} sqft
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Quick View Modal ── */}
      <AnimatePresence>
        {quickViewProperty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative flex flex-col md:flex-row gap-6"
            >
              <button
                onClick={() => setQuickViewProperty(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white z-10"
              >
                <X size={18} />
              </button>

              <div className="flex-1 md:max-w-[50%]">
                <img src={quickViewProperty.images[0]} alt={quickViewProperty.title} className="w-full h-64 object-cover rounded-2xl" />
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {quickViewProperty.images.slice(1, 3).map((img: string, idx: number) => (
                    <img key={idx} src={img} alt="Gallery item" className="w-full h-20 object-cover rounded-xl" />
                  ))}
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">{tProp(quickViewProperty, 'type')}</span>
                <h4 className="font-extrabold text-neutral-900 dark:text-white text-base mb-2">{tProp(quickViewProperty, 'title')}</h4>
                <div className="text-amber-500 font-extrabold text-lg mb-4">${quickViewProperty.price.toLocaleString()}</div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-4 leading-relaxed mb-6">{tProp(quickViewProperty, 'description')}</p>

                <div className="flex gap-2 mt-auto">
                  <Link
                    to={`/properties/${quickViewProperty.id}`}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-center py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
                  >
                    {lang === 'ar' ? 'عرض الصفحة كاملة' : 'View Full Details'}
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
