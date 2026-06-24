// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-navy-800 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent flex items-center justify-center">
                <span className="text-white font-serif font-bold text-sm">S</span>
              </div>
              <span className="font-serif font-bold text-xl">Scholara</span>
            </div>
            <p className="text-navy-200 text-sm font-sans leading-relaxed">
              A multilingual student newspaper platform for academic voices across cultures.
            </p>
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm uppercase tracking-widest text-navy-300 mb-4">Categories</h4>
            <ul className="space-y-2">
              {[
                { key: 'en', path: '/en/explained', label: 'Explained' },
                { key: 'en', path: '/en/opinion', label: 'Opinion' },
                { key: 'en', path: '/en/scientific-research', label: 'Scientific Research' },
              ].map(item => (
                <li key={item.path}>
                  <Link to={item.path} className="text-navy-300 hover:text-white text-sm font-sans transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm uppercase tracking-widest text-navy-300 mb-4">Languages</h4>
            <ul className="space-y-2">
              {[
                { code: 'en', label: 'English' },
                { code: 'ar', label: 'العربية' },
                { code: 'tr', label: 'Türkçe' },
              ].map(l => (
                <li key={l.code}>
                  <Link to={`/${l.code}/explained`} className="text-navy-300 hover:text-white text-sm font-sans transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-navy-600 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-navy-400 text-xs font-sans">© {new Date().getFullYear()} Scholara. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/login" className="text-navy-400 hover:text-white text-xs font-sans transition-colors">{t('login')}</Link>
            <Link to="/register" className="text-navy-400 hover:text-white text-xs font-sans transition-colors">{t('register')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
