import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface UIState {
  darkMode: boolean;
  toasts: Toast[];
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  deleteModalOpen: boolean;
  deleteTargetId: string | null;
}

const initialState: UIState = {
  darkMode: false,
  toasts: [],
  sidebarOpen: true,
  mobileMenuOpen: false,
  deleteModalOpen: false,
  deleteTargetId: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
      if (state.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    addToast(state, action: PayloadAction<{ message: string; type: ToastType }>) {
      const id = Date.now().toString();
      state.toasts.push({ id, ...action.payload });
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleMobileMenu(state) {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    closeMobileMenu(state) {
      state.mobileMenuOpen = false;
    },
    openDeleteModal(state, action: PayloadAction<string>) {
      state.deleteModalOpen = true;
      state.deleteTargetId = action.payload;
    },
    closeDeleteModal(state) {
      state.deleteModalOpen = false;
      state.deleteTargetId = null;
    },
  },
});

export const {
  toggleDarkMode, addToast, removeToast,
  toggleSidebar, toggleMobileMenu, closeMobileMenu,
  openDeleteModal, closeDeleteModal,
} = uiSlice.actions;
export default uiSlice.reducer;
