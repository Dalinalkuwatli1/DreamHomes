import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Property, PropertyFilters } from '../../types';
import { mockProperties } from '../../data/mockData';

interface PropertyState {
  properties: Property[];
  filters: PropertyFilters;
  currentPage: number;
  itemsPerPage: number;
  loading: boolean;
  selectedProperty: Property | null;
}

const initialFilters: PropertyFilters = {
  listingType: 'all',
  priceMin: 0,
  priceMax: 10000000,
  propertyType: 'all',
  bedrooms: 0,
  bathrooms: 0,
  city: 'all',
  sortBy: 'newest',
  searchQuery: '',
};

const initialState: PropertyState = {
  properties: mockProperties as Property[],
  filters: initialFilters,
  currentPage: 1,
  itemsPerPage: 9,
  loading: false,
  selectedProperty: null,
};

const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setProperties(state, action: PayloadAction<Property[]>) {
      state.properties = action.payload;
    },
    setFilters(state, action: PayloadAction<Partial<PropertyFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1;
    },
    resetFilters(state) {
      state.filters = initialFilters;
      state.currentPage = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setSelectedProperty(state, action: PayloadAction<Property | null>) {
      state.selectedProperty = action.payload;
    },
    addProperty(state, action: PayloadAction<Property>) {
      state.properties.unshift(action.payload);
    },
    updateProperty(state, action: PayloadAction<Property>) {
      const idx = state.properties.findIndex(p => p.id === action.payload.id);
      if (idx !== -1) state.properties[idx] = action.payload;
    },
    deleteProperty(state, action: PayloadAction<string>) {
      state.properties = state.properties.filter(p => p.id !== action.payload);
    },
    updateOwnerDetails(state, action: PayloadAction<{ ownerId: string; name?: string; avatar?: string; phone?: string; email?: string }>) {
      state.properties.forEach(p => {
        if (p.ownerId === action.payload.ownerId) {
          if (action.payload.name !== undefined) p.ownerName = action.payload.name;
          if (action.payload.avatar !== undefined) p.ownerAvatar = action.payload.avatar;
          if (action.payload.phone !== undefined) p.ownerPhone = action.payload.phone;
          if (action.payload.email !== undefined) p.ownerEmail = action.payload.email;
        }
      });
      if (state.selectedProperty && state.selectedProperty.ownerId === action.payload.ownerId) {
        if (action.payload.name !== undefined) state.selectedProperty.ownerName = action.payload.name;
        if (action.payload.avatar !== undefined) state.selectedProperty.ownerAvatar = action.payload.avatar;
        if (action.payload.phone !== undefined) state.selectedProperty.ownerPhone = action.payload.phone;
        if (action.payload.email !== undefined) state.selectedProperty.ownerEmail = action.payload.email;
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const {
  setProperties, setFilters, resetFilters, setPage, setSelectedProperty,
  addProperty, updateProperty, deleteProperty, updateOwnerDetails, setLoading,
} = propertySlice.actions;

export default propertySlice.reducer;
