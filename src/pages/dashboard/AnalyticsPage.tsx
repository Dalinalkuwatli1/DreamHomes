import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, TrendingUp, Heart, MessageSquare, ArrowLeft, BarChart3 } from 'lucide-react';
import { useAppSelector } from '../../hooks/useAppStore';

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgb(var(--color-border))' }}>
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const user = useAppSelector(s => s.auth.user);
  const properties = useAppSelector(s => s.properties.properties);
  const conversations = useAppSelector(s => s.messages.conversations);

  const myProps = useMemo(() => properties.filter(p => p.ownerId === user?.id), [properties, user]);
  const totalViews = myProps.reduce((acc, p) => acc + p.views, 0);
  const maxViews = Math.max(...myProps.map(p => p.views), 1);

  const metrics = [
    { label: 'Total Views', value: totalViews.toLocaleString(), change: '+18%', icon: <Eye size={20} className="text-sky-400" />, color: 'sky' },
    { label: 'Active Listings', value: myProps.filter(p => p.status === 'active').length, change: '+2', icon: <TrendingUp size={20} className="text-green-400" />, color: 'green' },
    { label: 'Favorites Received', value: properties.filter(p => p.ownerId === user?.id && user?.favoriteIds.includes(p.id)).length, change: '+5', icon: <Heart size={20} className="text-red-400" />, color: 'red' },
    { label: 'Inquiries', value: conversations.length, change: '+3', icon: <MessageSquare size={20} className="text-purple-400" />, color: 'purple' },
  ];

  const cityBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    myProps.forEach(p => map.set(p.city, (map.get(p.city) || 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [myProps]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/dashboard')} className="w-10 h-10 rounded-xl flex items-center justify-center border border-custom text-muted hover:text-custom transition-all">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="section-title flex items-center gap-2">
            <BarChart3 size={24} className="text-sky-500" /> Analytics
          </h1>
          <p className="section-subtitle">Performance overview for your listings</p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map(m => (
          <div key={m.label} className="dh-stat">
            <div className="flex items-center justify-between mb-2">
              {m.icon}
              <span className="text-xs font-semibold text-green-500 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">{m.change}</span>
            </div>
            <p className="text-2xl font-bold text-custom">{m.value}</p>
            <p className="text-xs text-muted">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Properties by Views */}
        <div className="dh-card p-6">
          <h2 className="font-bold text-custom mb-5">Top Properties by Views</h2>
          {myProps.length === 0 ? (
            <div className="text-center py-10 text-muted text-sm">No listings yet.</div>
          ) : (
            <div className="flex flex-col gap-5">
              {[...myProps].sort((a, b) => b.views - a.views).map(p => (
                <div key={p.id} className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate(`/properties/${p.id}`)}>
                  <img src={p.images[0]} alt={p.title} className="w-12 h-10 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-custom truncate group-hover:text-sky-500 transition-colors">{p.title}</p>
                    <MiniBar value={p.views} max={maxViews} color="#0ea5e9" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted shrink-0">
                    <Eye size={11} /> {p.views.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* City Distribution */}
        <div className="dh-card p-6">
          <h2 className="font-bold text-custom mb-5">Listings by City</h2>
          {cityBreakdown.length === 0 ? (
            <div className="text-center py-10 text-muted text-sm">No city data yet.</div>
          ) : (
            <div className="flex flex-col gap-4">
              {cityBreakdown.map(([city, count]) => {
                const pct = Math.round((count / myProps.length) * 100);
                return (
                  <div key={city} className="flex items-center gap-4">
                    <span className="text-sm font-medium text-custom w-28 shrink-0">{city}</span>
                    <div className="flex-1">
                      <MiniBar value={count} max={myProps.length} color="#6366f1" />
                    </div>
                    <span className="text-xs text-muted w-10 text-right shrink-0">{pct}%</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Listing Type Split */}
        <div className="dh-card p-6">
          <h2 className="font-bold text-custom mb-5">Listing Type Breakdown</h2>
          <div className="flex gap-4">
            {[
              { label: 'For Sale', count: myProps.filter(p => p.listingType === 'sale').length, color: '#0ea5e9' },
              { label: 'For Rent', count: myProps.filter(p => p.listingType === 'rent').length, color: '#f97316' },
            ].map(item => {
              const pct = myProps.length > 0 ? Math.round((item.count / myProps.length) * 100) : 0;
              return (
                <div key={item.label} className="flex-1 dh-card p-5 text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: `${item.color}18` }}>
                    <span className="text-2xl font-bold" style={{ color: item.color }}>{pct}%</span>
                  </div>
                  <p className="font-semibold text-custom">{item.count} listings</p>
                  <p className="text-xs text-muted mt-1">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dh-card p-6">
          <h2 className="font-bold text-custom mb-5">Recent Inquiries</h2>
          {conversations.length === 0 ? (
            <div className="text-center py-10 text-muted text-sm">No inquiries yet.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {conversations.map(conv => (
                <div key={conv.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-bg transition-colors cursor-pointer" onClick={() => navigate('/messages')}>
                  <img src={conv.senderAvatar} alt={conv.senderName} className="w-9 h-9 rounded-full object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-custom">{conv.senderName}</p>
                    <p className="text-xs text-muted truncate">{conv.propertyTitle}</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 bg-sky-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
