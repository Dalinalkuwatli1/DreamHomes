import { useAppSelector, useAppDispatch } from '../../hooks/useAppStore';
import { toggleFavorite } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/uiSlice';
import PropertyCard from '../../components/properties/PropertyCard';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.auth.user);
  const properties = useAppSelector(s => s.properties.properties);
  const favorites = properties.filter(p => user?.favoriteIds.includes(p.id));

  const handleClearAll = () => {
    user?.favoriteIds.forEach(id => dispatch(toggleFavorite(id)));
    dispatch(addToast({ message: 'All favorites cleared', type: 'info' }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title flex items-center gap-3">
            <Heart size={28} className="text-red-500" fill="currentColor" /> My Favorites
          </h1>
          <p className="section-subtitle mt-1">{favorites.length} saved {favorites.length === 1 ? 'property' : 'properties'}</p>
        </div>
        {favorites.length > 0 && (
          <button onClick={handleClearAll} className="btn-secondary text-sm text-red-500 border-red-200 hover:border-red-400 hover:text-red-600">
            Clear All
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="dh-card p-20 text-center">
          <Heart size={48} className="text-red-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-custom mb-2">No Saved Properties</h3>
          <p className="text-muted mb-6">Start browsing and save properties you love to see them here.</p>
          <button onClick={() => navigate('/properties')} className="btn-primary">Browse Properties</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(p => <PropertyCard key={p.id} property={p} />)}
        </div>
      )}
    </div>
  );
}
