import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// Get initial values from localStorage if available
const storedUser = localStorage.getItem('authUser');
const storedToken = localStorage.getItem('accessToken');

const parseStoredUser = (): User | null => {
  if (!storedUser) return null;
  try {
    const u = JSON.parse(storedUser);
    return { ...u, favoriteIds: Array.isArray(u.favoriteIds) ? u.favoriteIds : [] };
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: parseStoredUser(),
  isAuthenticated: !!storedUser && !!storedToken,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: User; accessToken: string }>) {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem('authUser', JSON.stringify(action.payload.user));
      localStorage.setItem('accessToken', action.payload.accessToken);
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('authUser');
      localStorage.removeItem('accessToken');
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('authUser', JSON.stringify(state.user));
      }
    },
    toggleFavorite(state, action: PayloadAction<string>) {
      if (state.user) {
        const ids = state.user.favoriteIds ?? [];
        const exists = ids.includes(action.payload);
        state.user.favoriteIds = exists
          ? ids.filter(id => id !== action.payload)
          : [...ids, action.payload];
        localStorage.setItem('authUser', JSON.stringify(state.user));
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { login, logout, updateUser, setLoading, toggleFavorite } = authSlice.actions;
export default authSlice.reducer;
