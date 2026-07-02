import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, MapPin, BedDouble, Bath, Maximize2,
  Heart, Eye, RefreshCw, X, Save, ArrowRight,
  Info, ChevronDown, Check, GraduationCap, Truck, Activity, ShieldAlert,
  Building, Map, Home, Star
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { toggleFavorite } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/uiSlice';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import AuthModal from '../../components/auth/AuthModal';

export default function ApartmentsPage() {
  const dispatch = useAppDispatch();
  const { properties } = useAppSelector(s => s.properties);
  const user = useAppSelector(s => s.auth.user);
  const { t, tProp, isRtl, lang } = useLanguage();
  const { requireAuth, modalOpen, modalAction, closeModal } = useAuthGuard();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState('all');
  const [priceMax, setPriceMax] = useState(3000000);
  
  // Apartment Amenities
  const [hasElevator, setHasElevator] = useState(false);
  const [hasGym, setHasGym] = useState(false);
  const [hasPool, setHasPool] = useState(false);
  const [hasSecurity, setHasSecurity] = useState(false);
  const [hasSmartHome, setHasSmartHome] = useState(false);
  const [hasParking, setHasParking] = useState(false);
  const [hasBalcony, setHasBalcony] = useState(false);

  // Layout & UI
  const [selectedApartment, setSelectedApartment] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSavedSearch, setIsSavedSearch] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Document Title for SEO
  useEffect(() => {
    document.title = lang === 'ar' 
      ? 'شقق سكنية فاخرة | دريم هومز' 
      : 'Modern Luxury Apartments | DreamHomes';
  }, [lang]);

  // Loading Simulation
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Auto select first apartment for neighborhood stats details on load
      if (filteredApartments.length > 0) {
        setSelectedApartment(filteredApartments[0]);
      } else {
        setSelectedApartment(null);
      }
    }, 450);
    return () => clearTimeout(timer);
  }, [searchQuery, city, priceMax, hasElevator, hasGym, hasPool, hasSecurity, hasSmartHome, hasParking, hasBalcony]);

  // Filter apartments
  const filteredApartments = useMemo(() => {
    return properties.filter(p => {
      // Must be Apartment or Penthouse or Condo
      const isApartmentType = ['apartment', 'penthouse', 'condo', 'studio'].includes(p.type.toLowerCase());
      if (!isApartmentType) return false;

      if (city !== 'all' && p.city.toLowerCase() !== city.toLowerCase()) return false;
      if (p.price > priceMax) return false;

      // Amenities filter checks
      if (hasElevator && !p.features.includes('Elevator')) return false;
      if (hasGym && !p.features.includes('Gym')) return false;
      if (hasPool && !p.features.includes('Swimming Pool')) return false;
      if (hasSecurity && !p.features.includes('Security System')) return false;
      if (hasSmartHome && !p.features.includes('Smart Home')) return false;
      if (hasParking && !p.features.includes('Parking')) return false;
      if (hasBalcony && !p.features.includes('Balcony')) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return tProp(p, 'title').toLowerCase().includes(q) || p.title.toLowerCase().includes(q);
      }

      return true;
    });
  }, [properties, searchQuery, city, priceMax, hasElevator, hasGym, hasPool, hasSecurity, hasSmartHome, hasParking, hasBalcony]);

  // Pagination
  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredApartments.length / itemsPerPage);
  const paginatedApartments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredApartments.slice(start, start + itemsPerPage);
  }, [filteredApartments, currentPage]);

  const handleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireAuth('favorite')) return;
    dispatch(toggleFavorite(id));
    const isFav = user?.favoriteIds.includes(id);
    dispatch(addToast({
      message: isFav ? (lang === 'ar' ? 'أزيلت من المفضلة' : 'Removed') : (lang === 'ar' ? 'أضيفت للمفضلة' : 'Saved'),
      type: 'success'
    }));
  };

  const handleSaveSearch = () => {
    setIsSavedSearch(!isSavedSearch);
    dispatch(addToast({
      message: lang === 'ar' ? 'تم تحديث حالة البحث المحفوظ' : 'Saved search status updated',
      type: 'success'
    }));
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setCity('all');
    setPriceMax(3000000);
    setHasElevator(false);
    setHasGym(false);
    setHasPool(false);
    setHasSecurity(false);
    setHasSmartHome(false);
    setHasParking(false);
    setHasBalcony(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 transition-colors duration-300" dir={isRtl ? 'rtl' : 'ltr'}>
      <AuthModal isOpen={modalOpen} onClose={closeModal} action={modalAction} />

      {/* ── Apartments Hero ── */}
      <section className="relative h-[320px] bg-slate-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80" alt="Apartments" className="w-full h-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-zinc-950 to-transparent" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-400/20 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider mb-3 inline-block">
            {lang === 'ar' ? 'شقق حضرية فاخرة' : 'URBAN LIVING EXCELLENCE'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-serif mb-4">
            {lang === 'ar' ? 'شقق سكنية متطورة تلائم أسلوب حياتك' : 'Elevate Your Sky-High Lifestyle'}
          </h1>
        </div>
      </section>

      {/* ── Breadcrumbs ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="flex items-center gap-2 text-xs text-neutral-500">
          <Link to="/" className="hover:underline flex items-center gap-1"><Home size={12} /> {lang === 'ar' ? 'الرئيسية' : 'Home'}</Link>
          <span>/</span>
          <span className="font-semibold text-slate-900 dark:text-white">{lang === 'ar' ? 'الشقق الفاخرة' : 'Apartments'}</span>
        </nav>
      </div>

      {/* ── 3-Column Lifestyle Split Grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 1. Filters Sidebar (col-span-3) */}
          <aside className="lg:col-span-3 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm self-start space-y-6">
            <div>
              <div className="flex justify-between items-center pb-3 border-b mb-4">
                <span className="font-bold text-xs flex items-center gap-1">
                  <SlidersHorizontal size={14} className="text-indigo-500" />
                  {lang === 'ar' ? 'فلاتر شقق' : 'Apartment Filters'}
                </span>
                <button onClick={resetAllFilters} className="text-[10px] text-indigo-500 font-bold uppercase hover:underline">{lang === 'ar' ? 'مسح' : 'Reset'}</button>
              </div>

              {/* City */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">{lang === 'ar' ? 'المدينة' : 'City'}</label>
                  <select value={city} onChange={e => setCity(e.target.value)} className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 focus:outline-none">
                    <option value="all">{lang === 'ar' ? 'جميع المدن' : 'All Cities'}</option>
                    <option value="Istanbul">{lang === 'ar' ? 'إسطنبول' : 'Istanbul'}</option>
                    <option value="New York">{lang === 'ar' ? 'نيويورك' : 'New York'}</option>
                    <option value="Chicago">{lang === 'ar' ? 'شيكاغو' : 'Chicago'}</option>
                  </select>
                </div>

                {/* Price Slider */}
                <div>
                  <div className="flex justify-between text-[10px] font-extrabold text-slate-400 uppercase mb-1">
                    <span>{lang === 'ar' ? 'السعر الأقصى' : 'Max Price'}</span>
                    <span className="text-indigo-500">${(priceMax / 1000000).toFixed(1)}M</span>
                  </div>
                  <input type="range" min="300000" max="5000000" step="100000" value={priceMax} onChange={e => setPriceMax(Number(e.target.value))} className="w-full accent-indigo-500" />
                </div>
              </div>
            </div>

            {/* Amenities Checklist */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
              <span className="block text-[10px] font-extrabold text-slate-400 uppercase mb-2">{lang === 'ar' ? 'مرافق المبنى' : 'Building Amenities'}</span>
              {[
                { label: lang === 'ar' ? 'مصعد' : 'Elevator', val: hasElevator, set: setHasElevator },
                { label: lang === 'ar' ? 'صالة ألعاب رياضية' : 'Gym', val: hasGym, set: setHasGym },
                { label: lang === 'ar' ? 'مسبح' : 'Swimming Pool', val: hasPool, set: setHasPool },
                { label: lang === 'ar' ? 'حراسة 24 ساعة' : 'Security System', val: hasSecurity, set: setHasSecurity },
                { label: lang === 'ar' ? 'منزل ذكي' : 'Smart Home', val: hasSmartHome, set: setHasSmartHome },
                { label: lang === 'ar' ? 'موقف سيارات مغطى' : 'Parking', val: hasParking, set: setHasParking },
                { label: lang === 'ar' ? 'شرفة / بلكون' : 'Balcony', val: hasBalcony, set: setHasBalcony }
              ].map((amenity, idx) => (
                <label key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-zinc-300 cursor-pointer">
                  <input type="checkbox" checked={amenity.val} onChange={e => amenity.set(e.target.checked)} className="rounded text-indigo-500 accent-indigo-500" />
                  <span>{amenity.label}</span>
                </label>
              ))}
            </div>

            <button onClick={handleSaveSearch} className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5">
              <Save size={12} /> {lang === 'ar' ? 'حفظ معايير البحث' : 'Save Search Criteria'}
            </button>
          </aside>

          {/* 2. Main Apartment List (col-span-5) */}
          <section className="lg:col-span-5 space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
              <span className="text-xs font-bold text-slate-500">{filteredApartments.length} {lang === 'ar' ? 'شقة متاحة' : 'apartments found'}</span>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-4 rounded-xl h-32 animate-pulse flex gap-3">
                      <div className="w-24 bg-slate-200 dark:bg-zinc-800 rounded-lg h-full" />
                      <div className="flex-1 space-y-2">
                        <div className="bg-slate-200 dark:bg-zinc-800 h-5 w-3/4 rounded" />
                        <div className="bg-slate-200 dark:bg-zinc-800 h-4 w-1/2 rounded" />
                      </div>
                    </div>
                  ))
                ) : filteredApartments.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800">
                    <Building className="mx-auto text-slate-300 mb-4" size={32} />
                    <h4 className="font-bold text-xs">{lang === 'ar' ? 'لم نجد أي شقة مطابقة' : 'No apartments match selected criteria'}</h4>
                  </div>
                ) : (
                  paginatedApartments.map(p => {
                    const isSelected = selectedApartment?.id === p.id;
                    const isFav = user?.favoriteIds.includes(p.id) ?? false;
                    return (
                      <motion.div
                        layout
                        key={p.id}
                        onClick={() => setSelectedApartment(p)}
                        className={`bg-white dark:bg-zinc-900 border rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-all flex gap-4 items-center ${isSelected ? 'ring-2 ring-indigo-500 border-transparent' : 'border-slate-200 dark:border-zinc-800'}`}
                      >
                        <img src={p.images[0]} alt={p.title} className="w-24 h-24 object-cover rounded-xl shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-xs text-slate-800 dark:text-zinc-100 truncate">{tProp(p, 'title')}</h4>
                            <button onClick={e => handleFavorite(e, p.id)} className={`text-slate-400 hover:text-rose-500 shrink-0 ${isFav ? 'text-rose-500' : ''}`}>
                              <Heart size={14} fill={isFav ? 'currentColor' : 'none'} />
                            </button>
                          </div>
                          <p className="text-[10px] text-slate-400 truncate mb-2">{tProp(p, 'address')}</p>
                          <div className="text-xs font-extrabold text-indigo-500">${p.price.toLocaleString()}</div>
                          
                          <div className="flex gap-2.5 text-[9px] text-slate-400 font-bold mt-2">
                            <span>{p.bedrooms} Beds</span>
                            <span>•</span>
                            <span>{p.bathrooms} Baths</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 pt-4">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-7 h-7 rounded-lg text-[10px] font-bold ${currentPage === idx + 1 ? 'bg-indigo-500 text-white shadow-sm' : 'border border-slate-200 dark:border-zinc-800 hover:bg-white'}`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* 3. Lifestyle & Neighborhood Stats drawer (col-span-4) */}
          <aside className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm self-start">
            {selectedApartment ? (
              <div className="space-y-6">
                <div>
                  <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-wider">{lang === 'ar' ? 'نقاط الحي ونمط المعيشة' : 'NEIGHBORHOOD LIFESTYLE INDEX'}</span>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1 line-clamp-1">{tProp(selectedApartment, 'title')}</h3>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1"><MapPin size={10} /> {selectedApartment.city}, Turkey</p>
                </div>

                {/* Score Indicators */}
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-zinc-300">
                      <span>{lang === 'ar' ? 'مؤشر المشي والوصول' : 'Walkability Index'}</span>
                      <span className="text-indigo-500">89/100</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: '89%' }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-zinc-300">
                      <span>{lang === 'ar' ? 'مؤشر الهدوء وخفض الضوضاء' : 'Noise & Silence Index'}</span>
                      <span className="text-emerald-500">92/100</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-zinc-300">
                      <span>{lang === 'ar' ? 'شبكة المواصلات العامة' : 'Transit Access Score'}</span>
                      <span className="text-amber-500">76/100</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '76%' }} />
                    </div>
                  </div>
                </div>

                {/* Nearby Locations List */}
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">{lang === 'ar' ? 'الخدمات القريبة من المجمع' : 'Nearby Utilities'}</span>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 shrink-0">
                      <GraduationCap size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">{lang === 'ar' ? 'مدارس وجامعات دولية' : 'Schools & Universities'}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{lang === 'ar' ? 'مدرسة بيبك الدولية - 0.4 كم' : 'Bebek International Academy - 0.4 km'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-500 shrink-0">
                      <Activity size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">{lang === 'ar' ? 'مستشفيات ومراكز طبية' : 'Medical Centers & Clinics'}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{lang === 'ar' ? 'مستشفى إسطنبول التخصصي - 1.2 كم' : 'Istanbul Central Hospital - 1.2 km'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-500 shrink-0">
                      <Truck size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">{lang === 'ar' ? 'خطوط النقل السريع' : 'Transit & Bus Lines'}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{lang === 'ar' ? 'محطة مترو بيبك الكبرى - 0.2 كم' : 'Bebek Metro Terminal - 0.2 km'}</p>
                    </div>
                  </div>
                </div>

                {/* View Details Link */}
                <Link
                  to={`/properties/${selectedApartment.id}`}
                  className="block w-full py-3 bg-slate-900 dark:bg-zinc-800 text-white text-center rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-md"
                >
                  {lang === 'ar' ? 'استعراض صفحة الشقة كاملة' : 'View Full Apartment Profile'}
                </Link>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <p className="text-xs">{lang === 'ar' ? 'حدد شقة من القائمة لعرض مؤشرات الحي والتفاصيل المحيطة.' : 'Select an apartment list item to check neighborhood lifestyle index.'}</p>
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h3 className="text-lg font-bold text-center mb-8">{lang === 'ar' ? 'أسئلة شائعة عن شققنا السكنية' : 'Apartment Inquiries & Policies FAQ'}</h3>
        <div className="space-y-3">
          {[
            {
              q: lang === 'ar' ? 'هل تشمل المجمعات السكنية مواقف سيارات خاصة بالزوار؟' : 'Is visitor parking available at the building complex?',
              a: lang === 'ar' ? 'نعم، تضم مجمعاتنا السكنية الفاخرة مواقف سيارات تحت الأرض مخصصة للملاك ومواقف خارجية إضافية للزوار.' : 'Yes, our premium complexes provide designated underground parking for residents and separate guest parking areas.'
            },
            {
              q: lang === 'ar' ? 'ما هي مصاريف العائدات الشهرية (الأيدات) للمجمعات؟' : 'What is the monthly maintenance fee (Aidat) for apartments?',
              a: lang === 'ar' ? 'تختلف قيمة الأيدات بحسب مساحة الشقة والخدمات المشتركة المقدمة في المجمع (حراسة، تنظيف، نوادي رياضية، مسابح) وتدفع بشكل شهري لإدارة المبنى.' : 'Aidat varies by building service scopes and apartment sizes. It covers pools, building security, elevator upkeep, and generic landscaping costs.'
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                className="w-full p-4 flex justify-between items-center text-xs font-bold text-slate-800 dark:text-zinc-100"
              >
                <span>{item.q}</span>
                <ChevronDown size={14} className={faqOpen === idx ? 'rotate-180 text-indigo-500' : ''} />
              </button>
              {faqOpen === idx && (
                <div className="p-4 border-t border-slate-100 dark:border-zinc-800 text-xs text-slate-500 leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
