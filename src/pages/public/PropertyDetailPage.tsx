import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BedDouble, Bath, Maximize2, MapPin, Heart, MessageSquare,
  ChevronLeft, ChevronRight, Eye, Calendar, Share2, CheckCircle2, Phone, Mail,
  Calculator, TrendingUp
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { toggleFavorite } from '../../store/slices/authSlice';
import { startConversation } from '../../store/slices/messagesSlice';
import { addToast } from '../../store/slices/uiSlice';
import type { Property } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import AuthModal from '../../components/auth/AuthModal';
import PropertyCard from '../../components/properties/PropertyCard';

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const properties = useAppSelector(s => s.properties.properties);
  const user = useAppSelector(s => s.auth.user);
  const [currentImage, setCurrentImage] = useState(0);
  const [property, setProperty] = useState<Property | null>(null);
  const [contacted, setContacted] = useState(false);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [loanYears, setLoanYears] = useState(20);
  const [interestRate, setInterestRate] = useState(7);
  const { t, tProp, isRtl, lang } = useLanguage();
  const { requireAuth, modalOpen, modalAction, closeModal } = useAuthGuard();

  useEffect(() => {
    const p = properties.find(p => p.id === id);
    setProperty(p || null);
    setCurrentImage(0);
  }, [id, properties]);

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-32 text-center" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="text-6xl mb-4">🏠</div>
        <h2 className="text-2xl font-bold text-custom mb-2">{t('detail.notFound')}</h2>
        <p className="text-muted mb-6">{t('detail.notFoundSub')}</p>
        <button onClick={() => navigate('/properties')} className="btn-primary">{t('section.viewAllProperties')}</button>
      </div>
    );
  }

  const isFavorite = user?.favoriteIds.includes(property.id) ?? false;

  const handleFavorite = () => {
    if (!requireAuth('favorite')) return;
    dispatch(toggleFavorite(property.id));
    dispatch(addToast({ 
      message: isFavorite ? t('detail.removedFav') : t('detail.addedFav'), 
      type: isFavorite ? 'info' : 'success' 
    }));
  };

  const handleContact = () => {
    if (!requireAuth('message')) return;
    if (!user) return;
    const convId = `conv-${property.id}-${user.id}`;
    dispatch(startConversation({
      id: convId,
      propertyId: property.id,
      propertyTitle: property.title,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      receiverId: property.ownerId,
      receiverName: property.ownerName,
      messages: [],
      lastUpdated: new Date().toISOString(),
      unreadCount: 0,
    }));
    setContacted(true);
    dispatch(addToast({ message: lang === 'ar' ? 'بدأت المحادثة بنجاح! انتقل للرسائل.' : 'Conversation started! Go to Messages.', type: 'success' }));
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    dispatch(addToast({ message: t('detail.linkCopied'), type: 'info' }));
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

  const formattedDate = new Date(property.createdAt).toLocaleDateString(
    lang === 'ar' ? 'ar-EG' : 'en-US', 
    { month: 'short', day: 'numeric' }
  );

  return (
    <>
    <AuthModal isOpen={modalOpen} onClose={closeModal} action={modalAction} />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Back */}
      <button onClick={() => navigate(-1)} className={`flex items-center gap-2 text-muted hover:text-sky-500 transition-colors mb-6 text-sm font-medium`}>
        <ChevronLeft size={16} className={isRtl ? 'rotate-185' : ''} /> {t('detail.back')}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Images + Details */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Image Gallery */}
          <div className="dh-card overflow-hidden">
            <div className="relative h-80 sm:h-[420px]">
              <img
                src={property.images[currentImage]}
                alt={`${tProp(property, 'title')} - image ${currentImage + 1}`}
                className="w-full h-full object-cover transition-all duration-500"
              />
              {/* Badges */}
              <div className={`absolute top-4 flex gap-2 ${isRtl ? 'right-4' : 'left-4'}`}>
                <span className={`dh-badge ${property.listingType === 'sale' ? 'dh-badge-sale' : 'dh-badge-rent'}`}>
                  {property.listingType === 'sale' ? t('card.forSale') : t('card.forRent')}
                </span>
                {property.isNew && <span className="dh-badge dh-badge-new">{t('card.new')}</span>}
              </div>
              {/* Nav arrows */}
              {property.images.length > 1 && (
                <>
                  <button onClick={() => setCurrentImage(i => (i - 1 + property.images.length) % property.images.length)} className={`absolute top-1/2 -translate-y-1/2 w-10 h-10 glass rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all ${isRtl ? 'right-4' : 'left-4'}`}>
                    <ChevronLeft size={18} className={isRtl ? 'rotate-185' : ''} />
                  </button>
                  <button onClick={() => setCurrentImage(i => (i + 1) % property.images.length)} className={`absolute top-1/2 -translate-y-1/2 w-10 h-10 glass rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all ${isRtl ? 'left-4' : 'right-4'}`}>
                    <ChevronRight size={18} className={isRtl ? 'rotate-185' : ''} />
                  </button>
                </>
              )}
              <div className={`absolute bottom-4 glass px-3 py-1.5 rounded-full text-white text-xs flex items-center gap-1.5 ${isRtl ? 'left-4' : 'right-4'}`}>
                <Eye size={12} /> {property.views.toLocaleString()} {t('card.views')}
              </div>
            </div>
            {/* Thumbnails */}
            {property.images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {property.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`shrink-0 w-20 h-16 rounded-xl overflow-hidden transition-all ${i === currentImage ? 'ring-2 ring-sky-500 ring-offset-2' : 'opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`thumb ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details dh-card */}
          <div className="dh-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-custom mb-1">{tProp(property, 'title')}</h1>
                <p className="flex items-center gap-1.5 text-muted text-sm">
                  <MapPin size={14} className="shrink-0 text-sky-400" /> {tProp(property, 'address')}
                </p>
              </div>
              <div className={isRtl ? 'text-left' : 'text-right'}>
                <p className="text-3xl font-bold text-sky-500">{formatPrice(property.price, property.listingType)}</p>
                <p className="text-sm text-muted">{tProp(property, 'type')}</p>
              </div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-y border-custom mb-5">
              {property.bedrooms > 0 && (
                <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(14,165,233,0.06)' }}>
                  <BedDouble size={22} className="text-sky-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-custom">{property.bedrooms}</p>
                  <p className="text-xs text-muted">{property.bedrooms === 1 ? t('card.bed') : t('card.beds')}</p>
                </div>
              )}
              <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(14,165,233,0.06)' }}>
                <Bath size={22} className="text-sky-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-custom">{property.bathrooms}</p>
                <p className="text-xs text-muted">{property.bathrooms === 1 ? t('card.bath') : t('card.baths')}</p>
              </div>
              <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(14,165,233,0.06)' }}>
                <Maximize2 size={22} className="text-sky-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-custom">{property.area.toLocaleString()}</p>
                <p className="text-xs text-muted">{t('card.sqft')}</p>
              </div>
              <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(14,165,233,0.06)' }}>
                <Calendar size={22} className="text-sky-500 mx-auto mb-1" />
                <p className="text-sm font-bold text-custom">{formattedDate}</p>
                <p className="text-xs text-muted">{lang === 'ar' ? 'تاريخ النشر' : 'Listed'}</p>
              </div>
            </div>

            {/* Description */}
            <h3 className="font-bold text-custom mb-2">{t('detail.overview')}</h3>
            <p className="text-sm text-muted leading-relaxed mb-5">{tProp(property, 'description')}</p>

            {/* Features */}
            {property.features.length > 0 && (
              <>
                <h3 className="font-bold text-custom mb-3">{t('detail.features')}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {tProp(property, 'features').map((f: string) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-muted">
                      <CheckCircle2 size={14} className="text-sky-500 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── Mortgage Calculator ── */}
          {property.listingType === 'sale' && (() => {
            const principal = property.price * (1 - downPaymentPct / 100);
            const monthlyRate = interestRate / 100 / 12;
            const numPayments = loanYears * 12;
            const monthly = monthlyRate === 0
              ? principal / numPayments
              : (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
            const totalPaid = monthly * numPayments;
            const totalInterest = totalPaid - principal;
            return (
              <div className="dh-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center">
                    <Calculator size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-custom">{lang === 'ar' ? 'حاسبة التمويل العقاري' : 'Mortgage Calculator'}</h3>
                    <p className="text-xs text-muted">{lang === 'ar' ? 'تقدير تقريبي للدفعات الشهرية' : 'Estimated monthly payment'}</p>
                  </div>
                </div>

                <div className="space-y-5 mb-6">
                  <div>
                    <div className="flex justify-between text-xs text-muted mb-1.5">
                      <span>{lang === 'ar' ? 'نسبة الدفعة الأولى' : 'Down Payment'}</span>
                      <span className="font-bold text-custom">{downPaymentPct}% — ${(property.price * downPaymentPct / 100).toLocaleString()}</span>
                    </div>
                    <input type="range" min={5} max={50} value={downPaymentPct} onChange={e => setDownPaymentPct(+e.target.value)}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ accentColor: '#0ea5e9' }} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-muted mb-1.5">
                      <span>{lang === 'ar' ? 'مدة القرض' : 'Loan Term'}</span>
                      <span className="font-bold text-custom">{loanYears} {lang === 'ar' ? 'سنة' : 'yrs'}</span>
                    </div>
                    <input type="range" min={5} max={30} step={5} value={loanYears} onChange={e => setLoanYears(+e.target.value)}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ accentColor: '#0ea5e9' }} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-muted mb-1.5">
                      <span>{lang === 'ar' ? 'معدل الفائدة' : 'Interest Rate'}</span>
                      <span className="font-bold text-custom">{interestRate}%</span>
                    </div>
                    <input type="range" min={1} max={15} step={0.5} value={interestRate} onChange={e => setInterestRate(+e.target.value)}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ accentColor: '#0ea5e9' }} />
                  </div>
                </div>

                <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(99,102,241,0.08))', border: '1px solid rgba(14,165,233,0.15)' }}>
                  <p className="text-xs text-muted mb-1">{lang === 'ar' ? 'القسط الشهري التقريبي' : 'Est. Monthly Payment'}</p>
                  <p className="text-4xl font-extrabold text-sky-500 mb-3">${Math.round(monthly).toLocaleString()}</p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="text-muted">
                      <span className="block text-custom font-bold">${(property.price * downPaymentPct / 100).toLocaleString()}</span>
                      {lang === 'ar' ? 'دفعة أولى' : 'Down Payment'}
                    </div>
                    <div className="text-muted">
                      <span className="block text-custom font-bold">${Math.round(totalInterest).toLocaleString()}</span>
                      {lang === 'ar' ? 'إجمالي الفوائد' : 'Total Interest'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Right: Agent + Actions */}
        <div className="flex flex-col gap-4">
          {/* Price dh-card */}
          <div className="dh-card p-5">
            <p className="text-3xl font-bold text-sky-500 mb-1">{formatPrice(property.price, property.listingType)}</p>
            <p className="text-sm text-muted mb-4">
              {tProp(property, 'city')} · {tProp(property, 'type')}
            </p>
            <div className="flex gap-2 mb-4">
              <button onClick={handleFavorite} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all ${isFavorite ? 'bg-red-50 dark:bg-red-900/20 border-red-300 text-red-500' : 'border-custom text-muted hover:border-sky-400 hover:text-sky-500'}`}>
                <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                {isFavorite ? (lang === 'ar' ? 'تم الحفظ' : 'Saved') : (lang === 'ar' ? 'حفظ' : 'Save')}
              </button>
              <button onClick={handleShare} aria-label="Share property" className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold border border-custom text-muted hover:text-sky-500 hover:border-sky-400 transition-all">
                <Share2 size={16} />
              </button>
            </div>
            <button
              onClick={() => { handleContact(); navigate('/messages'); }}
              className="btn-primary w-full justify-center"
            >
              <MessageSquare size={16} />
              {contacted ? (lang === 'ar' ? 'فتح المحادثة' : 'Open Chat') : t('detail.contactOwner')}
            </button>
          </div>

          {/* Agent dh-card */}
          <div className="dh-card p-5">
            <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">{lang === 'ar' ? 'معلن العقار' : 'Listed By'}</h4>
            <div className="flex items-center gap-3 mb-4">
              <img src={property.ownerAvatar} alt={property.ownerName} className="w-12 h-12 rounded-full object-cover ring-2 ring-sky-500/30" />
              <div>
                <p className="font-semibold text-custom">{property.ownerName}</p>
                <p className="text-xs text-muted">{lang === 'ar' ? 'وكيل عقاري معتمد' : 'Property Agent'}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <a href={`tel:${property.ownerPhone}`} className="flex items-center gap-2 text-sm text-muted hover:text-sky-500 transition-colors py-2 px-3 rounded-xl hover:bg-sky-500/5">
                <Phone size={14} className="text-sky-400" /> {property.ownerPhone}
              </a>
              <a href={`mailto:${property.ownerEmail}`} className="flex items-center gap-2 text-sm text-muted hover:text-sky-500 transition-colors py-2 px-3 rounded-xl hover:bg-sky-500/5">
                <Mail size={14} className="text-sky-400" /> {property.ownerEmail}
              </a>
            </div>
          </div>

          {/* Location */}
          <div className="dh-card overflow-hidden">
            <div className="px-5 py-4 border-b border-custom">
              <h4 className="text-xs font-semibold text-muted uppercase tracking-wider">{lang === 'ar' ? 'الموقع الجغرافي' : 'Location'}</h4>
            </div>
            <div className="h-48 bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/20 dark:to-indigo-900/20 flex items-center justify-center relative">
              <div className="text-center px-4">
                <MapPin size={32} className="text-sky-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-custom">{tProp(property, 'city')}</p>
                <p className="text-xs text-muted mt-0.5">{tProp(property, 'address')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Similar Properties ── */}
      {(() => {
        // Show properties that are different from current, prefer same type or city
        const sameTypOrCity = properties.filter(p => p.id !== property.id && (p.city === property.city || p.type === property.type));
        const similar = sameTypOrCity.length >= 3
          ? sameTypOrCity.slice(0, 3)
          : properties.filter(p => p.id !== property.id).slice(0, 3);
        if (similar.length === 0) return null;
        return (
          <div className="mt-12 pt-10 border-t border-custom">
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp size={20} className="text-sky-500" />
              <h2 className="text-xl font-extrabold text-custom">
                {lang === 'ar' ? 'عقارات مشابهة' : 'Similar Properties'}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
          </div>
        );
      })()}
    </div>
    </>
  );
}
