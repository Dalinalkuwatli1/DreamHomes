import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

// Public Pages
import HomePage from '../pages/public/HomePage';
import PropertiesPage from '../pages/public/PropertiesPage';
import PropertyDetailPage from '../pages/public/PropertyDetailPage';
import AboutPage from '../pages/public/AboutPage';
import ContactPage from '../pages/public/ContactPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// User Pages
import FavoritesPage from '../pages/user/FavoritesPage';
import MessagesPage from '../pages/user/MessagesPage';
import ProfilePage from '../pages/user/ProfilePage';
import SettingsPage from '../pages/user/SettingsPage';

// Dashboard Pages
import DashboardPage from '../pages/dashboard/DashboardPage';
import PropertyFormPage from '../pages/dashboard/PropertyFormPage';
import AnalyticsPage from '../pages/dashboard/AnalyticsPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Public */}
          <Route index element={<HomePage />} />
          <Route path="properties" element={<PropertiesPage />} />
          <Route path="properties/:id" element={<PropertyDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />

          {/* Auth */}
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          {/* User */}
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />

          {/* Dashboard */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="dashboard/add-property" element={<PropertyFormPage />} />
          <Route path="dashboard/edit-property/:id" element={<PropertyFormPage />} />
          <Route path="dashboard/analytics" element={<AnalyticsPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
