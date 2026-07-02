import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

// Public Pages
import HomePage from '../pages/public/HomePage';
import PropertiesPage from '../pages/public/PropertiesPage';
import PropertyDetailPage from '../pages/public/PropertyDetailPage';
import AboutPage from '../pages/public/AboutPage';
import ContactPage from '../pages/public/ContactPage';

// New Listing Pages
import PropertiesSalePage from '../pages/public/PropertiesSalePage';
import PropertiesRentPage from '../pages/public/PropertiesRentPage';
import ApartmentsPage from '../pages/public/ApartmentsPage';
import VillasPage from '../pages/public/VillasPage';
import FeaturedPropertiesPage from '../pages/public/FeaturedPropertiesPage';
import LatestPropertiesPage from '../pages/public/LatestPropertiesPage';

// Additional Content Pages
import FaqPage from '../pages/public/FaqPage';
import PrivacyPage from '../pages/public/PrivacyPage';
import TermsPage from '../pages/public/TermsPage';
import BlogPage from '../pages/public/BlogPage';

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

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          {/* Public */}
          <Route index element={<HomePage />} />
          <Route path="properties" element={<PropertiesPage />} />
          <Route path="properties/sale" element={<PropertiesSalePage />} />
          <Route path="properties/rent" element={<PropertiesRentPage />} />
          <Route path="properties/apartments" element={<ApartmentsPage />} />
          <Route path="properties/villas" element={<VillasPage />} />
          <Route path="properties/featured" element={<FeaturedPropertiesPage />} />
          <Route path="properties/latest" element={<LatestPropertiesPage />} />
          <Route path="properties/:id" element={<PropertyDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="blog" element={<BlogPage />} />

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

