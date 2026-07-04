import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Home, Upload, X, ImagePlus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { addProperty, updateProperty } from '../../store/slices/propertySlice';
import { addToast } from '../../store/slices/uiSlice';
import { CITIES, PROPERTY_TYPES, FEATURES } from '../../data/mockData';
import { useLanguage, cityTranslations, typeTranslations, featureTranslations } from '../../contexts/LanguageContext';
import api from '../../services/api';
import { mapBackendPropertyToFrontend } from '../../utils/propertyMapper';


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
  const { t, isRtl, lang } = useLanguage();
  const isEdit = !!id;
  const existing = isEdit ? properties.find(p => p.id === id) : null;
  const [imagePreview, setImagePreview] = useState<string>(
    existing?.images && existing.images.length > 0 
      ? (typeof existing.images[0] === 'string' ? existing.images[0] : (existing.images[0] as any).url) 
      : ''
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<PropertyFormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title: existing?.title || '',
      description: existing?.description || '',
      type: (existing as any)?.propertyType || existing?.type || '',
      listingType: existing?.listingType || (existing?.type?.toLowerCase() === 'rent' ? 'rent' : 'sale'),
      price: existing?.price ? Number(existing.price) : undefined,
      area: existing?.area || undefined,
      bedrooms: existing?.bedrooms ?? 2,
      bathrooms: existing?.bathrooms ?? 1,
      city: existing?.city || '',
      address: existing?.address || '',
      features: existing?.features || [],
      imageUrl: '',
    },
  });

  const selectedFeatures = watch('features') || [];

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      setValue('imageUrl', result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const toggleFeature = (f: string) => {
    const current = watch('features') || [];
    setValue('features', current.includes(f) ? current.filter(x => x !== f) : [...current, f]);
  };

  const onSubmit = async (data: PropertyFormData) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('type', data.listingType.toUpperCase()); // SALE / RENT
      formData.append('propertyType', data.type); // e.g. Apartment, Villa
      formData.append('price', String(data.price));
      formData.append('area', String(data.area));
      formData.append('bedrooms', String(data.bedrooms));
      formData.append('bathrooms', String(data.bathrooms));
      formData.append('city', data.city);
      formData.append('address', data.address);
      
      if (data.features && data.features.length > 0) {
        data.features.forEach(f => formData.append('features[]', f));
      }

      if (imageFile) {
        // File upload — goes through Cloudinary via uploadPropertyImages middleware
        formData.append('images', imageFile);
      } else if (imageMode === 'url' && imagePreview) {
        // URL mode — send as plain string so backend can store it directly
        formData.append('imageUrl', imagePreview);
      }

      if (isEdit && existing) {
        const res = await api.put(`/properties/${existing.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        dispatch(updateProperty(mapBackendPropertyToFrontend(res.data.data)));
        dispatch(addToast({ message: lang === 'ar' ? 'تم تحديث العقار بنجاح!' : 'Property updated successfully!', type: 'success' }));
      } else {
        const res = await api.post('/properties', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        dispatch(addProperty(mapBackendPropertyToFrontend(res.data.data)));
        dispatch(addToast({ message: lang === 'ar' ? 'تم إدراج العقار بنجاح!' : 'Property listed successfully!', type: 'success' }));
      }
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save property listing';
      dispatch(addToast({ message: msg, type: 'error' }));
    }
  };

  const listingType = watch('listingType');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/dashboard')} className="w-10 h-10 rounded-xl flex items-center justify-center border border-custom text-muted hover:text-custom hover:border-sky-400 transition-all">
          <ArrowLeft size={18} className={isRtl ? 'rotate-180' : ''} />
        </button>
        <div>
          <h1 className="section-title flex items-center gap-2">
            <Home size={24} className="text-sky-500" />
            {isEdit ? (lang === 'ar' ? 'تعديل العقار' : 'Edit Property') : (lang === 'ar' ? 'إضافة عقار جديد' : 'Add New Property')}
          </h1>
          <p className="section-subtitle">{isEdit ? (lang === 'ar' ? 'قم بتحديث معلومات عقارك المدرج' : 'Update your listing information') : (lang === 'ar' ? 'املأ التفاصيل لإنشاء إعلان العقار الخاص بك' : 'Fill in the details to create your listing')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 text-sm">
        {/* Listing Type */}
        <div className="dh-card p-6">
          <h3 className="font-bold text-custom mb-4">{lang === 'ar' ? 'نوع الإدراج' : 'Listing Type'}</h3>
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
                  <p className="font-semibold text-custom text-sm capitalize">{t === 'sale' ? (lang === 'ar' ? 'للبيع' : 'For Sale') : (lang === 'ar' ? 'للإيجار' : 'For Rent')}</p>
                  <p className="text-xs text-muted">{t === 'sale' ? (lang === 'ar' ? 'بيع العقار الخاص بك' : 'Sell your property') : (lang === 'ar' ? 'تأجير العقار شهرياً' : 'Rent it out monthly')}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Basic Info */}
        <div className="dh-card p-6">
          <h3 className="font-bold text-custom mb-4">{lang === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}</h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className="dh-label">{lang === 'ar' ? 'عنوان العقار *' : 'Property Title *'}</label>
              <input {...register('title')} className="dh-input text-sm" placeholder={lang === 'ar' ? 'مثال: بنتهاوس حديث في وسط المدينة' : 'e.g. Modern Downtown Penthouse'} />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <label className="dh-label">{lang === 'ar' ? 'الوصف *' : 'Description *'}</label>
              <textarea {...register('description')} rows={4} className="dh-input resize-none text-sm" placeholder={lang === 'ar' ? 'صف عقارك بالتفصيل...' : 'Describe your property in detail...'} />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="dh-label">{lang === 'ar' ? 'نوع العقار *' : 'Property Type *'}</label>
                <select {...register('type')} className="dh-input text-sm">
                  <option value="">{lang === 'ar' ? 'اختر النوع...' : 'Select type...'}</option>
                  {PROPERTY_TYPES.map(t => <option key={t} value={t}>{lang === 'ar' ? (typeTranslations[t] ?? t) : t}</option>)}
                </select>
                {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type.message}</p>}
              </div>
              <div>
                <label className="dh-label">{lang === 'ar' ? 'المدينة *' : 'City *'}</label>
                <select {...register('city')} className="dh-input text-sm">
                  <option value="">{lang === 'ar' ? 'اختر المدينة...' : 'Select city...'}</option>
                  {CITIES.map(c => <option key={c} value={c}>{lang === 'ar' ? (cityTranslations[c] ?? c) : c}</option>)}
                </select>
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
              </div>
            </div>
            <div>
              <label className="dh-label">{lang === 'ar' ? 'العنوان الكامل *' : 'Full Address *'}</label>
              <input {...register('address')} className="dh-input text-sm" placeholder={lang === 'ar' ? 'شارع الاستقلال، إسطنبول' : '123 Main St, City, State ZIP'} />
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>}
            </div>
          </div>
        </div>

        {/* Pricing & Size */}
        <div className="dh-card p-6">
          <h3 className="font-bold text-custom mb-4">{lang === 'ar' ? 'السعر والمساحة' : 'Pricing & Size'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="dh-label">{lang === 'ar' ? `السعر (${listingType === 'rent' ? '$/شهرياً' : '$'}) *` : `Price (${listingType === 'rent' ? '$/mo' : '$'}) *`}</label>
              <input type="number" {...register('price', { valueAsNumber: true })} className="dh-input text-sm" placeholder="0" min={0} />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="dh-label">{lang === 'ar' ? 'المساحة (قدم مربع) *' : 'Area (sq ft) *'}</label>
              <input type="number" {...register('area', { valueAsNumber: true })} className="dh-input text-sm" placeholder="0" min={0} />
              {errors.area && <p className="text-xs text-red-500 mt-1">{errors.area.message}</p>}
            </div>
            <div>
              <label className="dh-label">{lang === 'ar' ? 'غرف النوم' : 'Bedrooms'}</label>
              <select {...register('bedrooms', { valueAsNumber: true })} className="dh-input text-sm">
                {[0, 1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n === 0 ? (lang === 'ar' ? 'استوديو' : 'Studio') : n}</option>)}
              </select>
            </div>
            <div>
              <label className="dh-label">{lang === 'ar' ? 'الحمامات *' : 'Bathrooms *'}</label>
              <select {...register('bathrooms', { valueAsNumber: true })} className="dh-input text-sm">
                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              {errors.bathrooms && <p className="text-xs text-red-500 mt-1">{errors.bathrooms.message}</p>}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="dh-card p-6">
          <h3 className="font-bold text-custom mb-4">{lang === 'ar' ? 'الميزات والمرافق' : 'Features & Amenities'}</h3>
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
                {lang === 'ar' ? (featureTranslations[f] ?? f) : f}
              </button>
            ))}
          </div>
        </div>

        {/* ── Image Upload ─────────────────────────────────────── */}
        <div className="dh-card p-6">
          <h3 className="font-bold text-custom mb-1">
            {lang === 'ar' ? 'صورة العقار' : 'Property Image'}
          </h3>
          <p className="text-xs text-muted mb-4">
            {lang === 'ar' ? 'ارفع صورة من جهازك أو أدخل رابطاً مباشراً' : 'Upload from your device or paste a direct image URL'}
          </p>

          {/* Hidden file input — triggered by the visible button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageFile(file);
              e.target.value = '';
            }}
          />

          {/* Tabs */}
          <div className="flex gap-2 mb-5">
            <button
              type="button"
              onClick={() => setImageMode('upload')}
              style={{
                padding: '8px 20px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                border: '2px solid',
                cursor: 'pointer',
                transition: 'all .2s',
                background: imageMode === 'upload' ? '#0ea5e9' : 'transparent',
                borderColor: imageMode === 'upload' ? '#0ea5e9' : 'rgba(14,165,233,0.3)',
                color: imageMode === 'upload' ? '#fff' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Upload size={14} />
              {lang === 'ar' ? 'رفع ملف' : 'Upload File'}
            </button>
            <button
              type="button"
              onClick={() => setImageMode('url')}
              style={{
                padding: '8px 20px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                border: '2px solid',
                cursor: 'pointer',
                transition: 'all .2s',
                background: imageMode === 'url' ? '#0ea5e9' : 'transparent',
                borderColor: imageMode === 'url' ? '#0ea5e9' : 'rgba(14,165,233,0.3)',
                color: imageMode === 'url' ? '#fff' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <ImagePlus size={14} />
              {lang === 'ar' ? 'رابط صورة' : 'Image URL'}
            </button>
          </div>

          {/* ── Upload Mode ── */}
          {imageMode === 'upload' && (
            imagePreview && imageFile ? (
              /* Preview */
              <div className="relative h-56 rounded-2xl overflow-hidden group">
                <img src={imagePreview} alt="Property preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-gray-800 rounded-xl text-sm font-semibold hover:bg-gray-100 transition"
                  >
                    <Upload size={15} />
                    {lang === 'ar' ? 'تغيير' : 'Change'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setImagePreview(''); setImageFile(null); setValue('imageUrl', ''); }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition"
                  >
                    <X size={15} />
                    {lang === 'ar' ? 'إزالة' : 'Remove'}
                  </button>
                </div>
                <span className="absolute bottom-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-lg">
                  ✓ {lang === 'ar' ? 'جاهزة للرفع' : 'Ready to upload'}
                </span>
              </div>
            ) : (
              /* Drop Zone + Upload Button */
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                style={{
                  border: '2px dashed #38bdf8',
                  borderRadius: '16px',
                  background: 'rgba(14,165,233,0.04)',
                  padding: '40px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(14,165,233,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ImagePlus size={30} color="#0ea5e9" />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                    {lang === 'ar' ? 'اسحب الصورة هنا أو اضغط الزر أدناه' : 'Drag & drop an image here, or click the button below'}
                  </p>
                  <p style={{ fontSize: 12, color: '#94a3b8' }}>
                    PNG, JPG, WEBP — {lang === 'ar' ? 'حتى 10 ميغابايت' : 'up to 10 MB'}
                  </p>
                </div>
                {/* THE PRIMARY UPLOAD BUTTON — always visible */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 28px',
                    background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(14,165,233,0.35)',
                    transition: 'opacity .2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  <Upload size={16} />
                  {lang === 'ar' ? 'اختر صورة من جهازك' : 'Browse Files'}
                </button>
              </div>
            )
          )}

          {/* ── URL Mode ── */}
          {imageMode === 'url' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="url"
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="dh-input text-sm flex-1"
                />
                <button
                  type="button"
                  disabled={!urlInput.trim()}
                  onClick={() => {
                    if (!urlInput.trim()) return;
                    setImagePreview(urlInput.trim());
                    setValue('imageUrl', urlInput.trim());
                  }}
                  style={{
                    padding: '10px 20px',
                    background: urlInput.trim() ? '#0ea5e9' : '#94a3b8',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: urlInput.trim() ? 'pointer' : 'not-allowed',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  {lang === 'ar' ? 'معاينة' : 'Preview'}
                </button>
              </div>
              {imagePreview && !imageFile && (
                <div className="relative h-52 rounded-2xl overflow-hidden group">
                  <img
                    src={imagePreview}
                    alt="URL preview"
                    className="w-full h-full object-cover"
                    onError={() => {
                      setImagePreview('');
                      setUrlInput('');
                      dispatch(addToast({ message: lang === 'ar' ? 'رابط الصورة غير صالح' : 'Invalid image URL', type: 'error' }));
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => { setImagePreview(''); setUrlInput(''); setValue('imageUrl', ''); }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold"
                    >
                      <X size={15} /> {lang === 'ar' ? 'إزالة' : 'Remove'}
                    </button>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-lg">
                    ✓ {lang === 'ar' ? 'رابط صالح' : 'Valid URL'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className={`flex gap-3 ${isRtl ? 'justify-start' : 'justify-end'}`}>
          <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary">
            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            <Save size={16} />
            {isSubmitting ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : isEdit ? (lang === 'ar' ? 'تعديل العقار' : 'Update Property') : (lang === 'ar' ? 'نشر الإعلان' : 'Publish Listing')}
          </button>
        </div>
      </form>
    </div>
  );
}
