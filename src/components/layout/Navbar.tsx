import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Heart, MessageSquare, User, Sun, Moon,
  Menu, X, Building2, LayoutDashboard, ChevronDown, LogOut, Languages,
  Home, Settings, Check
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { toggleDarkMode, closeMobileMenu, toggleMobileMenu } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { lang, setLang, t, isRtl } = useLanguage();
  const darkMode = useAppSelector(s => s.ui.darkMode);
  const mobileMenuOpen = useAppSelector(s => s.ui.mobileMenuOpen);
  const user = useAppSelector(s => s.auth.user);
  const unreadCount = useAppSelector(s =>
    s.messages.conversations.reduce((acc, c) => acc + c.unreadCount, 0)
  );
  const favCount = user?.favoriteIds?.length ?? 0;
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/properties', label: t('nav.properties') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ];

  const handleLogout = async () => {
    try {
      await api.post('/users/logout');
    } catch (e) {
      console.error('Failed to call logout endpoint', e);
    }
    dispatch(logout());
    setUserMenuOpen(false);
    dispatch(closeMobileMenu());
    navigate('/');
  };

  const handleRoleSwitch = async (role: 'user' | 'owner') => {
    try {
      const response = await api.patch('/users/me', { role: role.toUpperCase() });
      const updatedUser = response.data.data;
      // Since it's stored in Redux/localStorage, update the local representation
      dispatch(logout()); // Log out and log back in, or just update the user state directly
      window.location.reload();
    } catch (err) {
      console.error('Failed to switch role', err);
    }
  };

  // Role badge color
  const roleBadge = user?.role === 'owner'
    ? { bg: 'rgba(14,165,233,0.15)', color: '#0ea5e9', label: lang === 'ar' ? 'مالك عقار' : 'Property Owner' }
    : { bg: 'rgba(99,102,241,0.15)', color: '#818cf8', label: lang === 'ar' ? 'مستخدم عادي' : 'Regular User' };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out ${
        scrolled
          ? 'bg-dh-card/75 backdrop-blur-lg shadow-lg border-b border-custom'
          : 'bg-transparent'
      }`} dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-500 ease-in-out ${
            scrolled ? 'h-16' : 'h-20'
          }`}>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group" onClick={() => dispatch(closeMobileMenu())}>
              <img
                src="/logo.png"
                alt="DreamHomes"
                className={`w-auto object-contain transition-all duration-500 ease-in-out ${
                  scrolled ? 'h-10' : 'h-14'
                }`}
                style={{
                  filter: darkMode
                    ? 'brightness(1.3) drop-shadow(0 0 8px rgba(255,255,255,0.3))'
                    : 'drop-shadow(0 2px 8px rgba(0,0,0,0.25))'
                }}
              />
            </Link>

            {/* Desktop Nav */}
            <div className={`hidden md:flex items-center gap-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Actions */}
            <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
              {/* Language Toggle */}
              <button
                onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold border border-custom text-muted hover:text-sky-500 hover:border-sky-400 transition-all"
                title="Toggle Language"
              >
                <Languages size={14} />
                {lang === 'en' ? 'AR' : 'EN'}
              </button>

              {/* Dark Mode */}
              <button
                onClick={() => dispatch(toggleDarkMode())}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:text-custom hover:bg-dh-card transition-all"
                title="Toggle dark mode"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {user && (
                <>
                  {/* Favorites */}
                  <Link
                    to="/favorites"
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:text-red-500 hover:bg-dh-card transition-all relative"
                    title={t('nav.favorites')}
                  >
                    <Heart size={18} />
                    {favCount > 0 && (
                      <span className={`absolute -top-0.5 ${isRtl ? '-left-0.5' : '-right-0.5'} w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center`}>
                        {favCount}
                      </span>
                    )}
                  </Link>

                  {/* Messages */}
                  <Link
                    to="/messages"
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:text-sky-500 hover:bg-dh-card transition-all relative"
                    title={t('nav.messages')}
                  >
                    <MessageSquare size={18} />
                    {unreadCount > 0 && (
                      <span className={`absolute -top-0.5 ${isRtl ? '-left-0.5' : '-right-0.5'} w-4 h-4 bg-sky-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center`}>
                        {unreadCount}
                      </span>
                    )}
                  </Link>

                  {/* User Menu */}
                  <div className="relative hidden md:block">
                    <button
                      onClick={() => setUserMenuOpen(o => !o)}
                      className="relative block rounded-full focus:outline-none"
                    >
                      <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-custom hover:scale-105 transition-transform" />
                    </button>

                    {userMenuOpen && (
                      <div
                        className={`absolute ${isRtl ? 'left-0' : 'right-0'} top-full mt-2 w-64 dh-card shadow-2xl py-2 animate-fade-in`}
                        style={{ border: '1px solid rgb(var(--color-border))' }}
                        onClick={e => e.stopPropagation()}
                      >
                        {/* Header: name + role badge */}
                        <div className="px-4 py-3 border-b border-custom">
                          <div className="flex items-center gap-3 mb-2">
                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-500/30" />
                            <div>
                              <p className="text-sm font-bold text-custom leading-tight">{user.name}</p>
                              <p className="text-xs text-muted">{user.email}</p>
                            </div>
                          </div>
                          {/* Role badge */}
                          <span
                            className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: roleBadge.bg, color: roleBadge.color }}
                          >
                            {user.role === 'owner' ? <Building2 size={10} /> : <User size={10} />}
                            {roleBadge.label}
                          </span>
                        </div>

                        {/* Main links */}
                        <div className="py-1">
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:text-custom hover:bg-bg transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <User size={15} className="text-sky-400 shrink-0" />
                            {t('nav.profile')}
                          </Link>
                          <Link
                            to="/properties"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:text-custom hover:bg-bg transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Home size={15} className="text-emerald-400 shrink-0" />
                            {lang === 'ar' ? 'عقاراتي' : 'My Properties'}
                          </Link>
                          <Link
                            to="/favorites"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:text-custom hover:bg-bg transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Heart size={15} className="text-red-400 shrink-0" />
                            <span className="flex-1">{t('footer.favorites')}</span>
                            {favCount > 0 && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-500">{favCount}</span>
                            )}
                          </Link>
                          <Link
                            to="/messages"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:text-custom hover:bg-bg transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <MessageSquare size={15} className="text-sky-400 shrink-0" />
                            <span className="flex-1">{lang === 'ar' ? 'الرسائل' : 'Messages'}</span>
                            {unreadCount > 0 && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-sky-500/15 text-sky-500">{unreadCount}</span>
                            )}
                          </Link>
                          {/* Dashboard: only for owners */}
                          {user.role === 'owner' && (
                            <Link
                              to="/dashboard"
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:text-custom hover:bg-bg transition-colors"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <LayoutDashboard size={15} className="text-purple-400 shrink-0" />
                              {t('nav.dashboard')}
                            </Link>
                          )}
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:text-custom hover:bg-bg transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Settings size={15} className="text-amber-400 shrink-0" />
                            {lang === 'ar' ? 'الإعدادات' : 'Settings'}
                          </Link>
                        </div>

                        {/* Role switch */}
                        <div className="border-t border-custom pt-1">
                          <p className="px-4 py-1.5 text-[11px] text-muted font-semibold uppercase tracking-wider">
                            {lang === 'ar' ? 'تبديل الحساب' : 'Switch Account'}
                          </p>
                          <button
                            onClick={() => handleRoleSwitch('user')}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                              user.role === 'user'
                                ? 'text-indigo-500 bg-indigo-500/5'
                                : 'text-muted hover:text-custom hover:bg-bg'
                            }`}
                          >
                            <User size={14} className="shrink-0" />
                            <span className="flex-1 text-start">{lang === 'ar' ? 'مستخدم عادي' : 'Regular User'}</span>
                            {user.role === 'user' && <Check size={14} className="text-indigo-500" />}
                          </button>
                          <button
                            onClick={() => handleRoleSwitch('owner')}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                              user.role === 'owner'
                                ? 'text-sky-500 bg-sky-500/5'
                                : 'text-muted hover:text-custom hover:bg-bg'
                            }`}
                          >
                            <Building2 size={14} className="shrink-0" />
                            <span className="flex-1 text-start">{lang === 'ar' ? 'مالك عقار' : 'Property Owner'}</span>
                            {user.role === 'owner' && <Check size={14} className="text-sky-500" />}
                          </button>
                        </div>

                        {/* Sign out */}
                        <div className="border-t border-custom pt-1 mt-1">
                          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            <LogOut size={15} />
                            {t('nav.signout')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => dispatch(toggleMobileMenu())}
                className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:text-custom hover:bg-dh-card transition-all"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-custom bg-dh-card animate-fade-in">
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => dispatch(closeMobileMenu())}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? 'bg-sky-500/10 text-sky-500' : 'text-muted hover:text-custom hover:bg-bg'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="border-t border-custom my-2" />
              {user && (
                <>
                  {/* Mobile role badge */}
                  <div className="flex items-center gap-3 px-4 py-2">
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-custom">{user.name}</p>
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: roleBadge.bg, color: roleBadge.color }}
                      >
                        {roleBadge.label}
                      </span>
                    </div>
                  </div>
                  <NavLink to="/profile" onClick={() => dispatch(closeMobileMenu())} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-sky-500/10 text-sky-500' : 'text-muted hover:text-custom hover:bg-bg'}`}>
                    <User size={16} /> {t('nav.profile')}
                  </NavLink>
                  <NavLink to="/favorites" onClick={() => dispatch(closeMobileMenu())} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-sky-500/10 text-sky-500' : 'text-muted hover:text-custom hover:bg-bg'}`}>
                    <Heart size={16} /> {t('footer.favorites')}
                    {favCount > 0 && <span className="ms-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-500">{favCount}</span>}
                  </NavLink>
                  <NavLink to="/messages" onClick={() => dispatch(closeMobileMenu())} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-sky-500/10 text-sky-500' : 'text-muted hover:text-custom hover:bg-bg'}`}>
                    <MessageSquare size={16} /> {lang === 'ar' ? 'الرسائل' : 'Messages'}
                    {unreadCount > 0 && <span className="ms-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-sky-500/15 text-sky-500">{unreadCount}</span>}
                  </NavLink>
                  {user.role === 'owner' && (
                    <NavLink to="/dashboard" onClick={() => dispatch(closeMobileMenu())} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-sky-500/10 text-sky-500' : 'text-muted hover:text-custom hover:bg-bg'}`}>
                      <LayoutDashboard size={16} /> {t('nav.dashboard')}
                    </NavLink>
                  )}
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <LogOut size={16} /> {t('nav.signout')}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
      {/* Overlay for user menu */}
      {userMenuOpen && <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />}
    </>
  );
}
