// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const LANGUAGES = [
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'ar', label: 'عر', full: 'العربية' },
  { code: 'tr', label: 'TR', full: 'Türkçe' },
];

const ARTICLE_LANGS = ['en', 'ar', 'tr'];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const { lang } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const currentArticleLang = lang || 'en';

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}&lang=${currentArticleLang}`);
      setSearchTerm('');
    }
  };

  const switchArticleLang = (newLang) => {
    setLangOpen(false);
    navigate(`/${newLang}/explained`);
  };

  const switchUILang = (code) => {
    i18n.changeLanguage(code);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isRTL = i18n.language === 'ar';

  return (
    <nav className="bg-white border-b-2 border-navy-700 sticky top-0 z-50 shadow-sm" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-navy-700 flex items-center justify-center">
              <span className="text-white font-serif font-bold text-sm">S</span>
            </div>
            <span className="font-serif font-bold text-navy-700 text-xl hidden sm:block tracking-tight">
              Scholara
            </span>
          </Link>

          {/* Desktop: Categories */}
          <div className="hidden md:flex items-center gap-1">
            {['explained', 'opinion', 'scientific-research', 'Arts & Culture'].map((cat) => (
              <Link
                key={cat}
                to={`/${currentArticleLang}/${cat}`}
                className="px-3 py-1.5 text-sm font-sans font-medium text-navy-700 hover:text-accent hover:bg-navy-50 rounded transition-colors capitalize"
              >
                {t(cat === 'scientific-research' ? 'scientificResearch' : cat)}
              </Link>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden sm:flex items-center">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-48 lg:w-64 px-4 py-1.5 text-sm border border-gray-200 rounded-none bg-gray-50 focus:outline-none focus:border-navy-700 font-sans"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Article Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 px-2 py-1.5 text-xs font-mono font-bold text-navy-700 border border-navy-200 hover:border-navy-700 transition-colors"
              >
                {currentArticleLang.toUpperCase()}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {langOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-navy-200 shadow-lg z-50 min-w-[120px]">
                  {ARTICLE_LANGS.map(l => (
                    <button
                      key={l}
                      onClick={() => switchArticleLang(l)}
                      className={`w-full text-left px-3 py-2 text-sm font-sans hover:bg-navy-50 ${currentArticleLang === l ? 'font-bold text-accent' : 'text-navy-700'}`}
                    >
                      {LANGUAGES.find(x => x.code === l)?.full}
                    </button>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1 px-3 pb-2">
                    <p className="text-xs text-gray-400 mb-1">UI Language</p>
                    {LANGUAGES.map(l => (
                      <button
                        key={l.code}
                        onClick={() => switchUILang(l.code)}
                        className={`block w-full text-left text-xs py-0.5 hover:text-accent ${i18n.language === l.code ? 'font-bold text-accent' : 'text-gray-500'}`}
                      >
                        {l.full}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Auth */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                {userRole === 'admin' && (
                  <Link to="/admin-dashboard" className="hidden sm:block text-xs font-sans font-medium text-accent hover:underline">
                    {t('adminDashboard')}
                  </Link>
                )}
                {(userRole === 'writer' || userRole === 'admin') && (
                  <Link to="/writer-dashboard" className="hidden sm:block text-xs font-sans font-medium text-navy-600 hover:underline">
                    {t('writerDashboard')}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-sans font-medium text-white bg-navy-700 hover:bg-navy-800 transition-colors"
                >
                  {t('logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Link to="/login" className="px-3 py-1.5 text-xs font-sans font-medium text-navy-700 border border-navy-700 hover:bg-navy-700 hover:text-white transition-colors">
                  {t('login')}
                </Link>
                <Link to="/register" className="px-3 py-1.5 text-xs font-sans font-medium text-white bg-navy-700 hover:bg-navy-800 transition-colors">
                  {t('register')}
                </Link>
              </div>
            )}

            {/* Mobile menu */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-1">
              <svg className="w-5 h-5 text-navy-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="flex-1 px-3 py-1.5 text-sm border border-gray-200 focus:outline-none focus:border-navy-700"
            />
            <button type="submit" className="px-3 py-1.5 bg-navy-700 text-white text-sm">→</button>
          </form>
          {['explained', 'opinion', 'scientific-research'].map(cat => (
            <Link
              key={cat}
              to={`/${currentArticleLang}/${cat}`}
              onClick={() => setMobileOpen(false)}
              className="block py-1 text-sm font-sans font-medium text-navy-700"
            >
              {t(cat === 'scientific-research' ? 'scientificResearch' : cat)}
            </Link>
          ))}
        </div>
      )}

      {/* Category bar */}
      <div className="hidden md:block bg-navy-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-6 h-8">
            <span className="text-navy-200 text-xs font-mono uppercase tracking-widest">
              {new Date().toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : i18n.language === 'tr' ? 'tr-TR' : 'en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
