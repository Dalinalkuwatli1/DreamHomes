import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, TrendingUp, Home, DollarSign, Heart, MessageSquare, Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { openDeleteModal } from '../../store/slices/uiSlice';
import { deleteProperty } from '../../store/slices/propertySlice';
import { addToast } from '../../store/slices/uiSlice';
import ConfirmDeleteModal from '../../components/ui/ConfirmDeleteModal';

export default function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.auth.user);
  const properties = useAppSelector(s => s.properties.properties);
  const conversations = useAppSelector(s => s.messages.conversations);

  const myProperties = useMemo(
    () => properties.filter(p => p.ownerId === user?.id),
    [properties, user]
  );

  const stats = [
    { label: 'Total Listings', value: myProperties.length, icon: <Building2 size={22} className="text-sky-400" />, color: 'sky' },
    { label: 'Active Listings', value: myProperties.filter(p => p.status === 'active').length, icon: <TrendingUp size={22} className="text-green-400" />, color: 'green' },
    { label: 'For Sale', value: myProperties.filter(p => p.listingType === 'sale').length, icon: <DollarSign size={22} className="text-purple-400" />, color: 'purple' },
    { label: 'For Rent', value: myProperties.filter(p => p.listingType === 'rent').length, icon: <Home size={22} className="text-orange-400" />, color: 'orange' },
    { label: 'Saved', value: user?.favoriteIds.length || 0, icon: <Heart size={22} className="text-red-400" />, color: 'red' },
    { label: 'Messages', value: conversations.length, icon: <MessageSquare size={22} className="text-indigo-400" />, color: 'indigo' },
  ];

  const handleDeleteConfirm = (id: string) => {
    dispatch(deleteProperty(id));
    dispatch(addToast({ message: 'Property deleted successfully', type: 'success' }));
  };

  const formatPrice = (price: number, type: string) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price) + (type === 'rent' ? '/mo' : '');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title">Dashboard</h1>
          <p className="section-subtitle">Welcome back, {user?.name?.split(' ')[0]}! 👋</p>
        </div>
        <button onClick={() => navigate('/dashboard/add-property')} className="btn-primary">
          <Plus size={16} /> Add Property
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
          <h2 className="font-bold text-custom">My Properties</h2>
          <button onClick={() => navigate('/dashboard/add-property')} className="text-sm text-sky-500 hover:text-sky-600 font-medium flex items-center gap-1">
            <Plus size={14} /> Add New
          </button>
        </div>

        {myProperties.length === 0 ? (
          <div className="p-16 text-center">
            <Building2 size={48} className="text-muted/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-custom mb-2">No Properties Yet</h3>
            <p className="text-sm text-muted mb-6">Start listing your first property today.</p>
            <button onClick={() => navigate('/dashboard/add-property')} className="btn-primary">
              <Plus size={16} /> Add Your First Property
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-custom" style={{ background: 'rgb(var(--color-bg))' }}>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Property</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider hidden sm:table-cell">Type</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Price</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider hidden md:table-cell">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider hidden lg:table-cell">Views</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-custom">
                {myProperties.map(p => (
                  <tr key={p.id} className="hover:bg-bg transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt={p.title} className="w-12 h-10 rounded-lg object-cover shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-custom text-sm truncate max-w-40">{p.title}</p>
                          <p className="text-xs text-muted truncate">{p.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-xs text-muted">{p.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-sky-500">{formatPrice(p.price, p.listingType)}</span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className={`dh-badge ${p.status === 'active' ? 'dh-dh-badge-new' : 'dh-dh-badge-sold'}`}>
                        {p.status}
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
                          title="View"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => navigate(`/dashboard/edit-property/${p.id}`)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-green-500 hover:bg-green-500/10 transition-all"
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => dispatch(openDeleteModal(p.id))}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-red-500 hover:bg-red-500/10 transition-all"
                          title="Delete"
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
