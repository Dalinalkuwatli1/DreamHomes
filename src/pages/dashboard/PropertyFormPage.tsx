import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Home } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { addProperty, updateProperty } from '../../store/slices/propertySlice';
import { addToast } from '../../store/slices/uiSlice';
import { CITIES, PROPERTY_TYPES, FEATURES } from '../../data/mockData';
import type { Property } from '../../types';

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  type: z.string().min(1, 'Select a property type'),
  listingType: z.enum(['sale', 'rent']),
  price: z.coerce.number().positive('Price must be positive'),
  area: z.coerce.number().positive('Area must be positive'),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(1, 'At least 1 bathroom required'),
  city: z.string().min(1, 'Select a city'),
  address: z.string().min(5, 'Enter a valid address'),
  features: z.array(z.string()).optional(),
  imageUrl: z.string().url('Enter a valid image URL').optional().or(z.literal('')),
});

type PropertyFormData = z.infer<typeof schema>;

export default function PropertyFormPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.auth.user);
  const properties = useAppSelector(s => s.properties.properties);
  const isEdit = !!id;
  const existing = isEdit ? properties.find(p => p.id === id) : null;

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<PropertyFormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title: existing?.title || '',
      description: existing?.description || '',
      type: existing?.type || '',
      listingType: existing?.listingType || 'sale',
      price: existing?.price || undefined,
      area: existing?.area || undefined,
      bedrooms: existing?.bedrooms ?? 2,
      bathrooms: existing?.bathrooms ?? 1,
      city: existing?.city || '',
      address: existing?.address || '',
      features: existing?.features || [],
      imageUrl: existing?.images[0] || '',
    },
  });

  const selectedFeatures = watch('features') || [];

  const toggleFeature = (f: string) => {
    const current = watch('features') || [];
    setValue('features', current.includes(f) ? current.filter(x => x !== f) : [...current, f]);
  };

  const onSubmit = async (data: PropertyFormData) => {
    await new Promise(r => setTimeout(r, 800));
    if (isEdit && existing) {
      const updated: Property = {
        ...existing,
        ...data,
        images: data.imageUrl ? [data.imageUrl, ...existing.images.slice(1)] : existing.images,
        features: data.features || [],
      };
      dispatch(updateProperty(updated));
      dispatch(addToast({ message: 'Property updated successfully!', type: 'success' }));
    } else {
      const newProp: Property = {
        id: Date.now().toString(),
        ...data,
        images: data.imageUrl ? [data.imageUrl] : ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80'],
        features: data.features || [],
        ownerId: user?.id || 'owner1',
        ownerName: user?.name || 'Agent',
        ownerAvatar: user?.avatar || 'https://i.pravatar.cc/80?img=12',
        ownerPhone: user?.phone || '',
        ownerEmail: user?.email || '',
        status: 'active',
        isNew: true,
        isFeatured: false,
        createdAt: new Date().toISOString(),
        views: 0,
      };
      dispatch(addProperty(newProp));
      dispatch(addToast({ message: 'Property listed successfully!', type: 'success' }));
    }
    navigate('/dashboard');
  };

  const listingType = watch('listingType');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/dashboard')} className="w-10 h-10 rounded-xl flex items-center justify-center border border-custom text-muted hover:text-custom hover:border-sky-400 transition-all">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="section-title flex items-center gap-2">
            <Home size={24} className="text-sky-500" />
            {isEdit ? 'Edit Property' : 'Add New Property'}
          </h1>
          <p className="section-subtitle">{isEdit ? 'Update your listing information' : 'Fill in the details to create your listing'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Listing Type */}
        <div className="dh-card p-6">
          <h3 className="font-bold text-custom mb-4">Listing Type</h3>
          <div className="grid grid-cols-2 gap-3">
            {(['sale', 'rent'] as const).map(t => (
              <label
                key={t}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  listingType === t ? 'border-sky-500 bg-sky-500/5' : 'border-custom hover:border-sky-300'
                }`}
              >
                <input type="radio" value={t} {...register('listingType')} className="sr-only" />
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${listingType === t ? 'border-sky-500' : 'border-muted'}`}>
                  {listingType === t && <div className="w-2 h-2 rounded-full bg-sky-500" />}
                </div>
                <div>
                  <p className="font-semibold text-custom text-sm capitalize">For {t === 'sale' ? 'Sale' : 'Rent'}</p>
                  <p className="text-xs text-muted">{t === 'sale' ? 'Sell your property' : 'Rent it out monthly'}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Basic Info */}
        <div className="dh-card p-6">
          <h3 className="font-bold text-custom mb-4">Basic Information</h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className="dh-label">Property Title *</label>
              <input {...register('title')} className="dh-input" placeholder="e.g. Modern Downtown Penthouse" />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <label className="dh-label">Description *</label>
              <textarea {...register('description')} rows={4} className="dh-input resize-none" placeholder="Describe your property in detail..." />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="dh-label">Property Type *</label>
                <select {...register('type')} className="dh-input">
                  <option value="">Select type...</option>
                  {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type.message}</p>}
              </div>
              <div>
                <label className="dh-label">City *</label>
                <select {...register('city')} className="dh-input">
                  <option value="">Select city...</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
              </div>
            </div>
            <div>
              <label className="dh-label">Full Address *</label>
              <input {...register('address')} className="dh-input" placeholder="123 Main St, City, State ZIP" />
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>}
            </div>
          </div>
        </div>

        {/* Pricing & Size */}
        <div className="dh-card p-6">
          <h3 className="font-bold text-custom mb-4">Pricing & Size</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="dh-label">Price ({listingType === 'rent' ? '$/mo' : '$'}) *</label>
              <input type="number" {...register('price', { valueAsNumber: true })} className="dh-input" placeholder="0" min={0} />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="dh-label">Area (sq ft) *</label>
              <input type="number" {...register('area', { valueAsNumber: true })} className="dh-input" placeholder="0" min={0} />
              {errors.area && <p className="text-xs text-red-500 mt-1">{errors.area.message}</p>}
            </div>
            <div>
              <label className="dh-label">Bedrooms</label>
              <select {...register('bedrooms', { valueAsNumber: true })} className="dh-input">
                {[0, 1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n === 0 ? 'Studio' : n}</option>)}
              </select>
            </div>
            <div>
              <label className="dh-label">Bathrooms *</label>
              <select {...register('bathrooms', { valueAsNumber: true })} className="dh-input">
                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              {errors.bathrooms && <p className="text-xs text-red-500 mt-1">{errors.bathrooms.message}</p>}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="dh-card p-6">
          <h3 className="font-bold text-custom mb-4">Features & Amenities</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {FEATURES.map(f => (
              <button
                key={f}
                type="button"
                onClick={() => toggleFeature(f)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
                  selectedFeatures.includes(f)
                    ? 'bg-sky-500/10 border border-sky-400 text-sky-600 dark:text-sky-400'
                    : 'border border-custom text-muted hover:border-sky-300 hover:text-custom'
                }`}
              >
                <span className={`w-3 h-3 rounded-sm border ${selectedFeatures.includes(f) ? 'bg-sky-500 border-sky-500' : 'border-muted'}`} />
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Image */}
        <div className="dh-card p-6">
          <h3 className="font-bold text-custom mb-4">Property Image</h3>
          <div>
            <label className="dh-label">Image URL</label>
            <input {...register('imageUrl')} className="dh-input" placeholder="https://example.com/image.jpg" />
            {errors.imageUrl && <p className="text-xs text-red-500 mt-1">{errors.imageUrl.message}</p>}
            <p className="text-xs text-muted mt-1.5">Enter a URL for the main property image.</p>
          </div>
          {watch('imageUrl') && (
            <div className="mt-4 h-48 rounded-xl overflow-hidden">
              <img src={watch('imageUrl')} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            <Save size={16} />
            {isSubmitting ? 'Saving...' : isEdit ? 'Update Property' : 'Publish Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}
