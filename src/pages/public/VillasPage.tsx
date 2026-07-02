import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, MapPin, BedDouble, Bath, Maximize2,
  Heart, Play, Eye, X, ChevronRight, Home, Waves, Leaf, Car,
  ShieldCheck, Mountain, Sunset, Check
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { toggleFavorite } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/uiSlice';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import AuthModal from '../../components/auth/AuthModal';

export default function VillasPage() {
  const dispatch = useAppDispatch();
  const { properties } = useAppSelector(s => s.properties);
  const user = useAppSelector(s => s.auth.user);
  const { t, tProp, isRtl, lang } = useLanguage();
  const { requireAuth, modalOpen, modalAction, closeModal } = useAuthGuard();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState(1000000);
  const [maxPrice, setMaxPrice] = useState(20000000);
  const [minPlotSize, setMinPlotSize] = useState(0);
  const [floors, setFloors] = useState('all');

  // Luxury Features
  const [hasPool, setHasPool] = useState(false);
  const [hasGarden, setHasGarden] = useState(false);
  const [hasSmartHome, setHasSmartHome] = useState(false);
  const [hasPrivateParking, setHasPrivateParking] = useState(false);
  const [hasSeaView, setHasSeaView] = useState(false);
  const [hasMountainView, setHasMountainView] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState('');
  const [quickViewProperty, setQuickViewProperty] = useState<any | null>(null);

  useEffect(() => {
    document.title = lang === 'ar' 
      ? 'فلل وقصور فاخرة | دريم هومز' 
      : 'Villas & Mansions | DreamHomes';
  }, [lang]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [searchQuery, minPrice, maxPrice, minPlotSize, floors, hasPool, hasGarden, hasSmartHome, hasPrivateParking, hasSeaView, hasMountainView]);

  const filteredVillas = useMemo(() => {
    return properties.filter(p => {
      if (!['villa', 'house'].includes(p.type.toLowerCase())) return false;
      if (p.price < minPrice || p.price > maxPrice) return false;

      // Mock feature checks
      if (hasPool && !p.features.includes('Swimming Pool')) return false;
      if (hasGarden && !p.features.includes('Garden')) return false;
      if (hasSmartHome && !p.features.includes('Smart Home')) return false;
      if (hasPrivateParking && !p.features.includes('Parking')) return false;
      if (hasSeaView && !p.description.toLowerCase().includes('sea') && !p.description.toLowerCase().includes('ocean') && !p.description.toLowerCase().includes('bosphorus')) return false;
      if (hasMountainView && !p.description.toLowerCase().includes('mountain')) return false;

      // Mock plot size & floors based on area/price
      if (minPlotSize > 0 && p.area < minPlotSize) return false;
      if (floors !== 'all') {
        const estFloors: number = p.area > 5000 ? 3 : (p.area > 2500 ? 2 : 1);
        if (floors === '1' && estFloors !== 1) return false;
        if (floors === '2' && estFloors !== 2) return false;
        if (floors === '3+' && estFloors < 3) return false;
      }

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return tProp(p, 'title').toLowerCase().includes(q) || tProp(p, 'address').toLowerCase().includes(q);
      }
      return true;
    }).sort((a, b) => b.price - a.price); // Sort by price desc by default for luxury
  }, [properties, searchQuery, minPrice, maxPrice, minPlotSize, floors, hasPool, hasGarden, hasSmartHome, hasPrivateParking, hasSeaView, hasMountainView, lang]);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredVillas.length / itemsPerPage);
  const paginatedVillas = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredVillas.slice(start, start + itemsPerPage);
  }, [filteredVillas, currentPage]);

  const handleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireAuth('favorite')) return;
    dispatch(toggleFavorite(id));
  };

  const openVideoTour = (e: React.MouseEvent, url: string = 'https://www.youtube.com/embed/dQw4w9WgXcQ') => {
    e.preventDefault();
    e.stopPropagation();
    setActiveVideoUrl(url);
    setIsVideoModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 transition-colors duration-300" dir={isRtl ? 'rtl' : 'ltr'}>
      <AuthModal isOpen={modalOpen} onClose={closeModal} action={modalAction} />

      {/* ── Luxury Dark Hero ── */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80" alt="Luxury Villa" className="w-full h-full object-cover scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#0a0a0a]" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-amber-500 font-serif tracking-[0.2em] text-xs uppercase mb-4 block">
              {lang === 'ar' ? 'مجموعة القصور الخاصة' : 'The Private Estate Collection'}
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-light text-white font-serif mb-6 leading-tight">
              {lang === 'ar' ? 'فلل وقصور استثنائية' : 'Extraordinary Villas & Mansions'}
            </h1>
            <p className="text-neutral-400 text-sm md:text-base max-w-2xl mx-auto font-light leading-relaxed">
              {lang === 'ar' ? 'اكتشف أرقى العقارات ذات المساحات الواسعة والتصاميم الفريدة المصممة لأصحاب الذوق الرفيع.' : 'Discover architectural masterpieces, sprawling estates, and ultra-luxury homes curated for the world\'s most discerning buyers.'}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Dark Mode Floating Search */}
        <div className="bg-[#111] border border-neutral-800 p-3 rounded-full flex items-center gap-4 max-w-3xl mx-auto shadow-2xl shadow-black">
          <div className="flex-1 flex items-center gap-3 px-4">
            <Search className="text-amber-500" size={18} />
            <input
              type="text"
              placeholder={lang === 'ar' ? 'ابحث عن قصر أحلامك...' : 'Search for your dream estate...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none text-white placeholder-neutral-600 focus:outline-none text-sm font-light"
            />
          </div>
          <button className="bg-amber-600 hover:bg-amber-500 text-black px-6 py-3 rounded-full text-xs font-bold transition-all uppercase tracking-wider">
            {lang === 'ar' ? 'بحث' : 'Discover'}
          </button>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* ── Dark Minimal Filters Sidebar ── */}
          <aside className="w-full lg:w-72 shrink-0 space-y-8">
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-4">
              <SlidersHorizontal className="text-amber-500" size={16} />
              <h3 className="font-serif text-lg text-white">{lang === 'ar' ? 'مواصفات القصر' : 'Estate Specifications'}</h3>
            </div>

            <div className="space-y-6">
              {/* Price Range */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-500 mb-3">{lang === 'ar' ? 'نطاق السعر' : 'Price Range'}</label>
                <div className="flex items-center gap-2 mb-2 text-xs font-light">
                  <span className="text-white">${(minPrice / 1000000).toFixed(1)}M</span>
                  <span className="text-neutral-600">-</span>
                  <span className="text-white">${(maxPrice / 1000000).toFixed(1)}M</span>
                </div>
                <input type="range" min="1000000" max="50000000" step="500000" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="w-full accent-amber-500" />
              </div>

              {/* Min Plot Size */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-500 mb-3">{lang === 'ar' ? 'الحد الأدنى لمساحة الأرض' : 'Min Plot Size'}</label>
                <select value={minPlotSize} onChange={e => setMinPlotSize(Number(e.target.value))} className="w-full bg-[#111] border border-neutral-800 text-white rounded-lg px-3 py-2.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none">
                  <option value="0">{lang === 'ar' ? 'الكل' : 'Any Size'}</option>
                  <option value="5000">5,000+ sqft</option>
                  <option value="10000">10,000+ sqft</option>
                  <option value="20000">1/2+ Acre (20k+ sqft)</option>
                </select>
              </div>

              {/* Number of Floors */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-500 mb-3">{lang === 'ar' ? 'عدد الطوابق' : 'Number of Floors'}</label>
                <div className="grid grid-cols-4 gap-2">
                  {['all', '1', '2', '3+'].map(f => (
                    <button key={f} onClick={() => setFloors(f)} className={`py-2 text-[10px] rounded-lg border ${floors === f ? 'border-amber-500 text-amber-500 bg-amber-500/10' : 'border-neutral-800 text-neutral-400 hover:border-neutral-600'} transition-all`}>
                      {f === 'all' ? (lang === 'ar' ? 'الكل' : 'All') : f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Luxury Amenities */}
              <div className="space-y-4 pt-4 border-t border-neutral-800">
                <span className="block text-[10px] uppercase tracking-widest text-neutral-500 mb-4">{lang === 'ar' ? 'مرافق فاخرة' : 'Luxury Amenities'}</span>
                {[
                  { label: lang === 'ar' ? 'مسبح إنفينيتي' : 'Infinity Pool', icon: <Waves size={14} />, state: hasPool, setter: setHasPool },
                  { label: lang === 'ar' ? 'حديقة استوائية' : 'Landscaped Garden', icon: <Leaf size={14} />, state: hasGarden, setter: setHasGarden },
                  { label: lang === 'ar' ? 'نظام ذكي متكامل' : 'Smart Home', icon: <ShieldCheck size={14} />, state: hasSmartHome, setter: setHasSmartHome },
                  { label: lang === 'ar' ? 'موقف سيارات خاص' : 'Private Garage', icon: <Car size={14} />, state: hasPrivateParking, setter: setHasPrivateParking },
                  { label: lang === 'ar' ? 'إطلالة بحرية' : 'Sea View', icon: <Sunset size={14} />, state: hasSeaView, setter: setHasSeaView },
                  { label: lang === 'ar' ? 'إطلالة جبلية' : 'Mountain View', icon: <Mountain size={14} />, state: hasMountainView, setter: setHasMountainView },
                ].map((item, idx) => (
                  <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${item.state ? 'bg-amber-500 border-amber-500' : 'border-neutral-700 group-hover:border-neutral-500'}`}>
                      {item.state && <Check size={12} className="text-black" />}
                    </div>
                    <span className={`text-xs font-light flex items-center gap-2 ${item.state ? 'text-amber-500' : 'text-neutral-400'}`}>
                      {item.icon} {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Large Property Cards (2 Columns) ── */}
          <div className="flex-1 space-y-10">
            <div className="flex justify-between items-end border-b border-neutral-800 pb-4">
              <h2 className="text-2xl font-serif text-white">{lang === 'ar' ? 'نتائج القصور المتاحة' : 'Available Estates'}</h2>
              <span className="text-xs text-neutral-500 font-light">{filteredVillas.length} {lang === 'ar' ? 'عقار فاخر' : 'Luxury Properties'}</span>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="bg-[#111] border border-neutral-800 rounded-2xl h-[500px] animate-pulse p-4">
                      <div className="h-64 bg-neutral-900 rounded-xl mb-6" />
                      <div className="h-6 w-1/2 bg-neutral-900 mb-4" />
                      <div className="h-4 w-1/3 bg-neutral-900 mb-8" />
                      <div className="h-10 bg-neutral-900 rounded-lg" />
                    </div>
                  ))
                ) : filteredVillas.length === 0 ? (
                  <div className="col-span-full py-20 text-center text-neutral-500">
                    <p className="font-serif text-xl">{lang === 'ar' ? 'لا يوجد قصور تطابق المعايير' : 'No estates match the refined criteria'}</p>
                  </div>
                ) : (
                  paginatedVillas.map(p => {
                    const isFav = user?.favoriteIds.includes(p.id);
                    return (
                      <motion.div
                        layout
                        key={p.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="group bg-[#111] border border-neutral-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-500"
                      >
                        <div className="relative h-72 overflow-hidden">
                          <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-80" />
                          
                          {/* Video Tour Overlay Button */}
                          <button
                            onClick={e => openVideoTour(e)}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-black/40 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-amber-500 hover:text-black hover:border-amber-500 hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100"
                          >
                            <Play size={20} fill="currentColor" className="ml-1" />
                          </button>

                          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-amber-500 px-3 py-1 text-[10px] uppercase tracking-widest font-bold border border-amber-500/30">
                            {tProp(p, 'type')}
                          </div>
                          <button
                            onClick={e => handleFavorite(e, p.id)}
                            className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md border ${isFav ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-black/40 border-white/20 text-white hover:bg-black/60'} transition-all`}
                          >
                            <Heart size={16} fill={isFav ? "currentColor" : "none"} />
                          </button>
                        </div>

                        <div className="p-6 relative">
                          <div className="absolute -top-6 right-6 bg-amber-600 text-black font-serif px-4 py-2 text-sm font-bold shadow-xl">
                            ${(p.price / 1000000).toFixed(2)}M
                          </div>
                          
                          <h3 className="font-serif text-xl text-white mb-2 line-clamp-1 group-hover:text-amber-500 transition-colors">{tProp(p, 'title')}</h3>
                          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-6 font-light">
                            <MapPin size={12} className="text-amber-500" />
                            <span className="line-clamp-1">{tProp(p, 'address')}</span>
                          </div>

                          <div className="grid grid-cols-3 gap-4 border-t border-b border-neutral-800 py-4 mb-6">
                            <div className="text-center">
                              <span className="block text-white font-serif text-lg">{p.bedrooms}</span>
                              <span className="text-[10px] text-neutral-500 uppercase tracking-wider">{lang === 'ar' ? 'غرف نوم' : 'Beds'}</span>
                            </div>
                            <div className="text-center border-l border-r border-neutral-800">
                              <span className="block text-white font-serif text-lg">{p.bathrooms}</span>
                              <span className="text-[10px] text-neutral-500 uppercase tracking-wider">{lang === 'ar' ? 'حمامات' : 'Baths'}</span>
                            </div>
                            <div className="text-center">
                              <span className="block text-white font-serif text-lg">{p.area}</span>
                              <span className="text-[10px] text-neutral-500 uppercase tracking-wider">{lang === 'ar' ? 'قدم²' : 'Sq.Ft.'}</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <button
                              onClick={() => setQuickViewProperty(p)}
                              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors"
                            >
                              <Eye size={14} /> {lang === 'ar' ? 'استعراض المعرض' : 'Premium Gallery'}
                            </button>
                            <Link to={`/properties/${p.id}`} className="text-xs text-amber-500 hover:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-2 group/link">
                              {lang === 'ar' ? 'التفاصيل' : 'View Estate'}
                              <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                            </Link>
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
              <div className="flex justify-center items-center gap-2 pt-8">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-10 h-10 flex items-center justify-center font-serif text-sm transition-all ${currentPage === idx + 1 ? 'border-b-2 border-amber-500 text-amber-500' : 'text-neutral-500 hover:text-white'}`}
                  >
                    0{idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Video Modal ── */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm">
            <button onClick={() => setIsVideoModalOpen(false)} className="absolute top-6 right-6 text-white/50 hover:text-white"><X size={24} /></button>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-5xl aspect-video bg-black border border-neutral-800 shadow-2xl relative">
              <iframe
                src={activeVideoUrl}
                title="Property Video Tour"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Premium Gallery Modal (Quick View) ── */}
      <AnimatePresence>
        {quickViewProperty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8 backdrop-blur-sm">
            <button onClick={() => setQuickViewProperty(null)} className="absolute top-6 right-6 text-white/50 hover:text-white z-50"><X size={24} /></button>
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="w-full max-w-6xl h-[80vh] flex flex-col md:flex-row bg-[#111] border border-neutral-800 shadow-2xl overflow-hidden">
              <div className="w-full md:w-2/3 h-64 md:h-full relative">
                <img src={quickViewProperty.images[0]} className="w-full h-full object-cover" alt="Main" />
              </div>
              <div className="w-full md:w-1/3 p-8 flex flex-col overflow-y-auto">
                <span className="text-amber-500 font-serif tracking-[0.2em] text-[10px] uppercase mb-2">{tProp(quickViewProperty, 'city')}</span>
                <h3 className="font-serif text-2xl text-white mb-2">{tProp(quickViewProperty, 'title')}</h3>
                <p className="text-amber-500 font-serif text-xl mb-6">${(quickViewProperty.price / 1000000).toFixed(2)}M</p>
                
                <div className="grid grid-cols-2 gap-2 mb-8">
                  {quickViewProperty.images.slice(1, 5).map((img: string, i: number) => (
                    <img key={i} src={img} className="w-full h-24 object-cover border border-neutral-800" alt={`Gallery ${i}`} />
                  ))}
                </div>

                <Link to={`/properties/${quickViewProperty.id}`} className="mt-auto w-full py-4 bg-amber-600 hover:bg-amber-500 text-black text-center text-xs font-bold uppercase tracking-widest transition-colors">
                  {lang === 'ar' ? 'المعرض الكامل والتفاصيل' : 'View Full Estate Profile'}
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
