import { BedDouble, Bath, Maximize2, MapPin, Heart, Eye, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Property } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { toggleFavorite } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/uiSlice';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import AuthModal from '../auth/AuthModal';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.auth.user);
  const { t, tProp, lang, isRtl } = useLanguage();
  const { requireAuth, modalOpen, modalAction, closeModal } = useAuthGuard();
  const isFavorite = user?.favoriteIds.includes(property.id) ?? false;

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Guard: require auth
    if (!requireAuth('favorite')) return;

    dispatch(toggleFavorite(property.id));
    dispatch(addToast({
      message: isFavorite
        ? (lang === 'ar' ? 'تمت الإزالة من المفضلة' : 'Removed from favorites')
        : (lang === 'ar' ? 'تمت الإضافة للمفضلة!' : 'Added to favorites!'),
      type: isFavorite ? 'info' : 'success',
    }));
  };

  const getPublishTimeStr = (createdAt: string) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - createdDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) {
      return lang === 'ar' ? 'اليوم' : 'Today';
    } else if (diffDays === 1) {
      return lang === 'ar' ? 'منذ يوم' : '1 day ago';
    } else if (diffDays === 2) {
      return lang === 'ar' ? 'منذ يومين' : '2 days ago';
    } else {
      return lang === 'ar' ? `منذ ${diffDays} أيام` : `${diffDays} days ago`;
    }
  };

  const formatPrice = (price: number, type: 'sale' | 'rent') => {
    const formatted = new Intl.NumberFormat(lang === 'ar' ? 'ar-US' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);

    if (lang === 'ar') {
      return type === 'rent' ? `${formatted} / شهرياً` : formatted;
    }
    return type === 'rent' ? `${formatted}/mo` : formatted;
  };

  return (
    <>
      <AuthModal isOpen={modalOpen} onClose={closeModal} action={modalAction} />
      <Link to={`/properties/${property.id}`} className="group block h-full" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="dh-card overflow-hidden h-full flex flex-col transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 ease-out border border-custom">
          {/* Image */}
          <div className="relative overflow-hidden h-64">
            <img
              src={property.images[0]}
              alt={tProp(property, 'title')}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            {/* Dark gradient shadow inside image bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            
            {/* Listing Type & Featured Badges */}
            <div className={`absolute top-3.5 flex gap-2 ${isRtl ? 'right-3.5' : 'left-3.5'}`}>
              <span className={`px-3 py-1 rounded-xl text-xs font-bold text-white shadow-md ${
                property.listingType === 'sale' ? 'bg-emerald-500' : 'bg-sky-500'
              }`}>
                {property.listingType === 'sale' ? t('card.forSale') : t('card.forRent')}
              </span>
              {property.isNew && (
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-500 text-white shadow-md">
                  {t('card.new')}
                </span>
              )}
              {property.isFeatured && (
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md">
                  {t('card.featured')}
                </span>
              )}
            </div>
            
            {/* Favorite button */}
            <button
              onClick={handleFavorite}
              className={`absolute top-3.5 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-black/60 ${isFavorite ? 'text-rose-500' : 'text-white'} ${isRtl ? 'left-3.5' : 'right-3.5'}`}
              title={lang === 'ar' ? 'حفظ في المفضلة' : 'Save to favorites'}
            >
              <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} className="transition-transform duration-300 active:scale-90" />
            </button>
            
            {/* Views and Publish Date overlay */}
            <div className={`absolute bottom-3.5 flex items-center gap-3 ${isRtl ? 'left-3.5 flex-row-reverse' : 'right-3.5'}`}>
              <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-xl text-white text-xs">
                <Clock size={12} className="text-sky-300" />
                <span>{getPublishTimeStr(property.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-xl text-white text-xs">
                <Eye size={12} className="text-sky-300" />
                <span>{property.views.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <h3 className="font-extrabold text-base text-custom leading-snug line-clamp-2 group-hover:text-sky-500 transition-colors">
                {tProp(property, 'title')}
              </h3>
              <span className="text-sky-500 font-extrabold text-base shrink-0">
                {formatPrice(property.price, property.listingType)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-muted text-xs mb-4">
              <MapPin size={13} className="shrink-0 text-sky-400" />
              <span className="line-clamp-1">{tProp(property, 'address')}</span>
            </div>

            {/* Specs row */}
            <div className="flex items-center gap-4 text-xs text-muted mb-4 pb-4 border-b border-custom">
              {property.bedrooms > 0 && (
                <span className="flex items-center gap-1.5 font-semibold">
                  <BedDouble size={14} className="text-sky-400" />
                  {property.bedrooms} {property.bedrooms === 1 ? t('card.bed') : t('card.beds')}
                </span>
              )}
              <span className="flex items-center gap-1.5 font-semibold">
                <Bath size={14} className="text-sky-400" />
                {property.bathrooms} {property.bathrooms === 1 ? t('card.bath') : t('card.baths')}
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <Maximize2 size={14} className="text-sky-400" />
                {property.area.toLocaleString()} {t('card.sqft')}
              </span>
            </div>

            {/* Agent / Owner & Category Row */}
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2">
                <img 
                  src={property.ownerAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"} 
                  alt={property.ownerName}
                  className="w-8 h-8 rounded-full object-cover border border-custom"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-custom leading-tight">{property.ownerName}</span>
                  <span className="text-[10px] text-muted leading-none">{lang === 'ar' ? 'وكيل مرخص' : 'Licensed Agent'}</span>
                </div>
              </div>
              
              <span className="text-xs px-2.5 py-1 rounded-xl font-bold bg-sky-500/10 text-sky-500">
                {tProp(property, 'type')}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}
