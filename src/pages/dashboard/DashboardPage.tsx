import { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, TrendingUp, Home, DollarSign, Heart, MessageSquare, Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { openDeleteModal } from '../../store/slices/uiSlice';
import { deleteProperty, setProperties } from '../../store/slices/propertySlice';
import { addToast } from '../../store/slices/uiSlice';
import ConfirmDeleteModal from '../../components/ui/ConfirmDeleteModal';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api';
import { mapBackendPropertyToFrontend } from '../../utils/propertyMapper';

export default function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.auth.user);
  const properties = useAppSelector(s => s.properties.properties);
  const conversations = useAppSelector(s => s.messages.conversations);
  const { t, isRtl, lang, tProp } = useLanguage();

  useEffect(() => {
    if (!user?.id) return;
    const fetchMyProperties = async () => {
      try {
        const res = await api.get(`/properties?ownerId=${user.id}`);
        const rawList = res.data.data?.properties || res.data.data || [];
        const mapped = rawList.map(mapBackendPropertyToFrontend);
        dispatch(setProperties(mapped));
      } catch (err) {
        console.error('Failed to fetch properties', err);
      }
    };
    fetchMyProperties();
  }, [user?.id, dispatch]);

  const myProperties = useMemo(
    () => properties.filter(p => p.ownerId === String(user?.id)),
    [properties, user]
  );

  const stats = [
    { label: t('dash.totalListings'), value: myProperties.length, icon: <Building2 size={22} className="text-sky-400" />, color: 'sky' },
    { label: t('dash.activeListings'), value: myProperties.filter(p => p.status === 'active' || p.status === 'pending').length, icon: <TrendingUp size={22} className="text-green-400" />, color: 'green' },
    { label: t('dash.forSale'), value: myProperties.filter(p => p.listingType === 'sale').length, icon: <DollarSign size={22} className="text-purple-400" />, color: 'purple' },
    { label: t('dash.forRent'), value: myProperties.filter(p => p.listingType === 'rent').length, icon: <Home size={22} className="text-orange-400" />, color: 'orange' },
    { label: t('dash.saved'), value: user?.favoriteIds?.length ?? 0, icon: <Heart size={22} className="text-red-400" />, color: 'red' },
    { label: t('dash.messages'), value: conversations.length, icon: <MessageSquare size={22} className="text-indigo-400" />, color: 'indigo' },
  ];

  const handleDeleteConfirm = async (id: string) => {
    try {
      await api.delete(`/properties/${id}`);
      dispatch(deleteProperty(id));
      dispatch(addToast({ message: lang === 'ar' ? 'تم حذف العقار بنجاح' : 'Property deleted successfully', type: 'success' }));
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to delete property';
      dispatch(addToast({ message: msg, type: 'error' }));
    }
  };

  const formatPrice = (price: number, type: string) => {
    const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
    return lang === 'ar'
      ? `${formatted} ${type === 'rent' ? '/شهرياً' : ''}`
      : `${formatted}${type === 'rent' ? '/mo' : ''}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title">{t('nav.dashboard')}</h1>
          <p className="section-subtitle">{t('dash.welcome')}, {user?.name?.split(' ')[0]}! 👋</p>
        </div>
        <button onClick={() => navigate('/dashboard/add-property')} className="btn-primary">
          <Plus size={16} /> {t('dash.addProperty')}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="dh-stat">
            <div className="mb-2">{s.icon}</div>
            <p className="text-2xl font-bold text-custom">{s.value}</p>
            <p className="text-xs text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* My Listings Table */}
      <div className="dh-card overflow-hidden">
        <div className="px-6 py-4 border-b border-custom flex items-center justify-between">
          <h2 className="font-bold text-custom">{t('dash.myProperties')}</h2>
          <button onClick={() => navigate('/dashboard/add-property')} className="text-sm text-sky-500 hover:text-sky-600 font-medium flex items-center gap-1">
            <Plus size={14} /> {t('dash.addNew')}
          </button>
        </div>

        {myProperties.length === 0 ? (
          <div className="p-16 text-center">
            <Building2 size={48} className="text-muted/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-custom mb-2">{t('dash.noProperties')}</h3>
            <p className="text-sm text-muted mb-6">{t('dash.noPropertiesSub')}</p>
            <button onClick={() => navigate('/dashboard/add-property')} className="btn-primary">
              <Plus size={16} /> {lang === 'ar' ? 'أضف عقارك الأول' : 'Add Your First Property'}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-custom" style={{ background: 'rgb(var(--color-bg))' }}>
                  <th className="text-start px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">{lang === 'ar' ? 'العقار' : 'Property'}</th>
                  <th className="text-start px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider hidden sm:table-cell">{lang === 'ar' ? 'النوع' : 'Type'}</th>
                  <th className="text-start px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">{lang === 'ar' ? 'السعر' : 'Price'}</th>
                  <th className="text-start px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider hidden md:table-cell">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th className="text-start px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider hidden lg:table-cell">{lang === 'ar' ? 'المشاهدات' : 'Views'}</th>
                  <th className="text-end px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-custom">
                {myProperties.map(p => (
                  <tr key={p.id} className="hover:bg-bg transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt={p.title} className="w-12 h-10 rounded-lg object-cover shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-custom text-sm truncate max-w-40">{tProp(p, 'title')}</p>
                          <p className="text-xs text-muted truncate">{tProp(p, 'city')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-xs text-muted">{tProp(p, 'type')}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-sky-500">{formatPrice(p.price, p.listingType)}</span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className={`dh-badge ${
                        p.status === 'active' ? 'dh-badge-sale' :
                        p.status === 'pending' ? 'dh-badge-new' :
                        'dh-badge-rent'
                      }`}>
                        {p.status === 'active'
                          ? (lang === 'ar' ? 'نشط' : 'Active')
                          : p.status === 'pending'
                            ? (lang === 'ar' ? 'قيد المراجعة' : 'Pending')
                            : p.status === 'sold'
                              ? (lang === 'ar' ? 'مباع' : 'Sold')
                              : (lang === 'ar' ? 'مؤجّر' : 'Rented')}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-sm text-muted flex items-center gap-1">
                        <Eye size={12} /> {p.views.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/properties/${p.id}`)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-sky-500 hover:bg-sky-500/10 transition-all"
                          title={lang === 'ar' ? 'عرض' : 'View'}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => navigate(`/dashboard/edit-property/${p.id}`)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-green-500 hover:bg-green-500/10 transition-all"
                          title={lang === 'ar' ? 'تعديل' : 'Edit'}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => dispatch(openDeleteModal(p.id))}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-red-500 hover:bg-red-500/10 transition-all"
                          title={lang === 'ar' ? 'حذف' : 'Delete'}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDeleteModal onConfirm={handleDeleteConfirm} />
    </div>
  );
}
