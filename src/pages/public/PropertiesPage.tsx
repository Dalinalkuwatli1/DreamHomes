import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Grid3X3, List, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { setFilters, resetFilters, setPage, setProperties } from '../../store/slices/propertySlice';
import PropertyCard from '../../components/properties/PropertyCard';
import PropertyCardSkeleton from '../../components/properties/PropertyCardSkeleton';
import { CITIES, PROPERTY_TYPES } from '../../data/mockData';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api';
import { mapBackendPropertyToFrontend } from '../../utils/propertyMapper';

export default function PropertiesPage() {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { properties, filters, currentPage, itemsPerPage } = useAppSelector(s => s.properties);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const { t, tProp, isRtl, lang } = useLanguage();

  const SORT_OPTIONS = [
    { value: 'newest', label: lang === 'ar' ? 'الأحدث أولاً' : 'Newest First' },
    { value: 'price-asc', label: lang === 'ar' ? 'السعر: من الأقل للأعلى' : 'Price: Low to High' },
    { value: 'price-desc', label: lang === 'ar' ? 'السعر: من الأعلى للأقل' : 'Price: High to Low' },
    { value: 'most-viewed', label: lang === 'ar' ? 'الأكثر مشاهدة' : 'Most Viewed' },
  ];

  // Fetch properties on mount
  useEffect(() => {
    const fetchAllProperties = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/properties');
        const rawList = res.data.data?.properties || res.data.data || [];
        const mapped = rawList.map(mapBackendPropertyToFrontend);
        dispatch(setProperties(mapped));
      } catch (err) {
        console.error('Failed to fetch properties', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllProperties();
  }, [dispatch]);

  // Apply URL params on mount
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const type = (searchParams.get('type') as 'all' | 'sale' | 'rent') || 'all';
    const city = searchParams.get('city') || 'all';
    dispatch(setFilters({ searchQuery: q, listingType: type, city }));
  }, []);

  const filtered = useMemo(() => {
    let result = [...properties];
    if (filters.listingType !== 'all') result = result.filter(p => p.listingType === filters.listingType);
    if (filters.propertyType !== 'all') result = result.filter(p => p.type === filters.propertyType);
    if (filters.city !== 'all') result = result.filter(p => p.city === filters.city);
    if (filters.bedrooms > 0) result = result.filter(p => p.bedrooms >= filters.bedrooms);
    if (filters.bathrooms > 0) result = result.filter(p => p.bathrooms >= filters.bathrooms);
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(p => {
        const titleEn = p.title.toLowerCase();
        const addressEn = p.address.toLowerCase();
        const cityEn = p.city.toLowerCase();
        
        // Match English or translated Arabic title/address/city
        const titleAr = tProp(p, 'title').toLowerCase();
        const addressAr = tProp(p, 'address').toLowerCase();
        const cityAr = tProp(p, 'city').toLowerCase();
        
        return titleEn.includes(q) || addressEn.includes(q) || cityEn.includes(q) ||
               titleAr.includes(q) || addressAr.includes(q) || cityAr.includes(q);
      });
    }
    result = result.filter(p => p.price >= filters.priceMin && p.price <= filters.priceMax);
    switch (filters.sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'most-viewed': result.sort((a, b) => b.views - a.views); break;
      default: result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return result;
  }, [properties, filters, lang]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const activeFilterCount = [
    filters.listingType !== 'all',
    filters.propertyType !== 'all',
    filters.city !== 'all',
    filters.bedrooms > 0,
    filters.bathrooms > 0,
    filters.priceMin > 0 || filters.priceMax < 10000000,
    filters.searchQuery !== '',
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="py-8" style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.06) 0%, rgba(99,102,241,0.06) 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-custom mb-2">{t('prop.title')}</h1>
          <p className="text-muted">{filtered.length} {t('prop.found')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? 'fixed inset-0 z-40 lg:relative lg:inset-auto lg:z-auto' : 'hidden lg:block'} lg:w-72 shrink-0`}>
            {/* Mobile overlay */}
            {showFilters && <div className="fixed inset-0 bg-black/50 lg:hidden" onClick={() => setShowFilters(false)} />}

            <div className={`${showFilters ? `fixed ${isRtl ? 'left-0' : 'right-0'} top-0 bottom-0 w-85 overflow-y-auto z-50 lg:relative lg:w-auto lg:z-auto` : ''} dh-card p-6 flex flex-col gap-5`}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-custom">{t('prop.filters')}</h3>
                <div className="flex gap-2 items-center">
                  {activeFilterCount > 0 && (
                    <button onClick={() => dispatch(resetFilters())} className="text-xs text-sky-500 hover:text-sky-600 font-medium">
                      {t('prop.clearAll')} ({activeFilterCount})
                    </button>
                  )}
                  <button onClick={() => setShowFilters(false)} className="lg:hidden text-muted hover:text-custom">
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Search */}
              <div>
                <label className="label">{t('prop.search')}</label>
                <input
                  type="text"
                  placeholder={t('prop.searchPlaceholder')}
                  value={filters.searchQuery}
                  onChange={e => dispatch(setFilters({ searchQuery: e.target.value }))}
                  className="dh-input"
                />
              </div>

              {/* Listing Type */}
              <div>
                <label className="label">{t('prop.listingType')}</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['all', 'sale', 'rent'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => dispatch(setFilters({ listingType: type }))}
                      className={`py-2 rounded-xl text-sm font-semibold transition-all ${filters.listingType === type ? 'bg-sky-500 text-white' : 'border border-custom text-muted hover:border-sky-400 hover:text-sky-500'}`}
                    >
                      {type === 'all' ? t('hero.all') : type === 'sale' ? t('hero.sale') : t('hero.rent')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="label">{t('prop.propertyType')}</label>
                <select value={filters.propertyType} onChange={e => dispatch(setFilters({ propertyType: e.target.value }))} className="dh-input">
                  <option value="all">{t('prop.allTypes')}</option>
                  {PROPERTY_TYPES.map(type => (
                    <option key={type} value={type}>
                      {tProp({ type, id: 'type-trans' }, 'type')}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="label">{t('prop.city')}</label>
                <select value={filters.city} onChange={e => dispatch(setFilters({ city: e.target.value }))} className="dh-input">
                  <option value="all">{t('hero.allCities')}</option>
                  {CITIES.map(city => (
                    <option key={city} value={city}>
                      {tProp({ city, id: 'city-trans' }, 'city')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="label">{t('prop.minBeds')}</label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => dispatch(setFilters({ bedrooms: n }))}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${filters.bedrooms === n ? 'bg-sky-500 text-white' : 'border border-custom text-muted hover:border-sky-400 hover:text-sky-500'}`}
                    >
                      {n === 0 ? t('prop.any') : `${n}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bathrooms */}
              <div>
                <label className="label">{t('prop.minBaths')}</label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map(n => (
                    <button
                      key={n}
                      onClick={() => dispatch(setFilters({ bathrooms: n }))}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${filters.bathrooms === n ? 'bg-sky-500 text-white' : 'border border-custom text-muted hover:border-sky-400 hover:text-sky-500'}`}
                    >
                      {n === 0 ? t('prop.any') : `${n}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="label">{t('prop.maxPrice')}</label>
                <input
                  type="range"
                  min={0}
                  max={10000000}
                  step={50000}
                  value={filters.priceMax}
                  onChange={e => dispatch(setFilters({ priceMax: Number(e.target.value) }))}
                  className="w-full accent-sky-500"
                />
                <div className="flex justify-between text-xs text-muted mt-1">
                  <span>{lang === 'ar' ? '0 دولار' : '$0'}</span>
                  <span className="font-semibold text-sky-500">
                    {filters.priceMax >= 10000000 
                      ? t('prop.any') 
                      : (lang === 'ar' 
                          ? `${(filters.priceMax / 1000000).toFixed(1)} مليون $` 
                          : `$${(filters.priceMax / 1000000).toFixed(1)}M`)}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(true)}
                  className="btn-secondary lg:hidden py-2.5 px-4 text-sm relative"
                >
                  <SlidersHorizontal size={15} />
                  {t('prop.filters')}
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-sky-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                <p className="text-sm text-muted">
                  {t('prop.showing')} <span className="font-semibold text-custom">{paginated.length}</span> {t('prop.of')} <span className="font-semibold text-custom">{filtered.length}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={filters.sortBy}
                  onChange={e => dispatch(setFilters({ sortBy: e.target.value as typeof filters.sortBy }))}
                  className="dh-input py-2 text-sm w-48"
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <div className="flex rounded-xl border border-custom overflow-hidden">
                  <button onClick={() => setViewMode('grid')} className={`px-3 py-2 transition-colors ${viewMode === 'grid' ? 'bg-sky-500 text-white' : 'text-muted hover:text-custom'}`}>
                    <Grid3X3 size={16} />
                  </button>
                  <button onClick={() => setViewMode('list')} className={`px-3 py-2 transition-colors ${viewMode === 'list' ? 'bg-sky-500 text-white' : 'text-muted hover:text-custom'}`}>
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
              </div>
            ) : paginated.length === 0 ? (
              <div className="dh-card p-16 text-center">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-bold text-custom mb-2">{t('prop.noProperties')}</h3>
                <p className="text-muted mb-6">{t('prop.noPropertiesSub')}</p>
                <button onClick={() => dispatch(resetFilters())} className="btn-primary">{t('prop.clearFilters')}</button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6' : 'flex flex-col gap-4'}>
                {paginated.map(p => <PropertyCard key={p.id} property={p} />)}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10" dir="ltr">
                <button
                  onClick={() => dispatch(setPage(currentPage - 1))}
                  disabled={currentPage === 1}
                  className="btn-secondary px-3 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => dispatch(setPage(i + 1))}
                    className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                      currentPage === i + 1 ? 'bg-sky-500 text-white' : 'btn-secondary !px-0 !py-0 justify-center'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => dispatch(setPage(currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="btn-secondary px-3 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
