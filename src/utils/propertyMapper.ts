import type { Property } from '../types';

export function mapBackendPropertyToFrontend(p: any): Property {
  return {
    id: String(p.id),
    title: p.title,
    // type in backend is SALE/RENT, but frontend expects 'Apartment', 'Villa' etc. which is stored in propertyType
    type: p.propertyType || 'Apartment', 
    // listingType in backend is type (SALE/RENT)
    listingType: p.type?.toLowerCase() === 'rent' ? 'rent' : 'sale',
    price: Number(p.price),
    area: Number(p.area),
    bedrooms: Number(p.bedrooms),
    bathrooms: Number(p.bathrooms),
    city: p.city,
    address: p.address || '',
    description: p.description || '',
    // images in backend is { url }[], frontend expects string[]
    images: Array.isArray(p.images) ? p.images.map((img: any) => img.url) : [],
    // features in backend is JSON, frontend expects string[]
    features: Array.isArray(p.features) ? p.features : (typeof p.features === 'string' ? JSON.parse(p.features) : []),
    ownerId: String(p.ownerId),
    ownerName: p.owner?.name || '',
    ownerAvatar: p.owner?.avatar || '',
    ownerPhone: p.owner?.phone || '',
    ownerEmail: p.owner?.email || '',
    status: (() => { const s = p.status?.toUpperCase(); return s === 'ACTIVE' ? 'active' : s === 'PENDING' ? 'pending' : s === 'SOLD' ? 'sold' : s === 'RENTED' ? 'rented' : 'draft'; })(),
    isNew: true,
    isFeatured: false,
    createdAt: p.createdAt,
    views: Number(p.views || 0),
  };
}
