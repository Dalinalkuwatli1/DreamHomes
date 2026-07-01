import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types';
import { mockUsers } from '../../data/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: mockUsers[0] as User,
  isAuthenticated: true,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
    switchRole(state, action: PayloadAction<'user' | 'owner'>) {
      if (state.user) {
        const nextUser = mockUsers.find(u => u.role === action.payload);
        if (nextUser) state.user = nextUser as User;
      }
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) state.user = { ...state.user, ...action.payload };
    },
    toggleFavorite(state, action: PayloadAction<string>) {
      if (!state.user) return;
      const idx = state.user.favoriteIds.indexOf(action.payload);
      if (idx === -1) {
        state.user.favoriteIds.push(action.payload);
      } else {
        state.user.favoriteIds.splice(idx, 1);
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { login, logout, switchRole, updateUser, toggleFavorite, setLoading } = authSlice.actions;
export default authSlice.reducer;
