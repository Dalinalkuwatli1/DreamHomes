import { configureStore } from '@reduxjs/toolkit';
import propertyReducer from './slices/propertySlice';
import authReducer from './slices/authSlice';
import messagesReducer from './slices/messagesSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    properties: propertyReducer,
    auth: authReducer,
    messages: messagesReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
