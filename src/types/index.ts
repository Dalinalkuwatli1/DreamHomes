export interface Property {
  id: string;
  title: string;
  type: string;
  listingType: 'sale' | 'rent';
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  city: string;
  address: string;
  description: string;
  images: string[];
  features: string[];
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  ownerPhone: string;
  ownerEmail: string;
  status: 'active' | 'sold' | 'rented' | 'draft';
  isNew: boolean;
  isFeatured: boolean;
  createdAt: string;
  views: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  role: 'user' | 'owner' | 'admin';
  favoriteIds: string[];
  joinedAt: string;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  propertyId: string;
  propertyTitle: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  receiverName: string;
  messages: Message[];
  lastUpdated: string;
  unreadCount: number;
}

export interface PropertyFilters {
  listingType: 'all' | 'sale' | 'rent';
  priceMin: number;
  priceMax: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  city: string;
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'most-viewed';
  searchQuery: string;
}
