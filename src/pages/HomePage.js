// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getArticles } from '../services/articleService';
import { ArticleCard } from '../components/ArticleCard';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLang, setActiveLang] = useState('en');

  useEffect(() => {
    loadArticles();
  }, [activeLang]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await getArticles({ lang: activeLang, limitCount: 12 });
      setArticles(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const featured = articles[0];
  const secondary = articles.slice(1, 4);
  const rest = articles.slice(4);

  const LANGS = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
    { code: 'tr', label: 'Türkçe' },
  ];

  const CATS = [
    { slug: 'explained', label: t('explained') },
    { slug: 'opinion', label: t('opinion') },
    { slug: 'scientific-research', label: t('scientificResearch') },
  ];

  return (
    <div className="min-h-screen bg-cream">
      {/* Masthead */}
      <div className="bg-white border-b-4 border-navy-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 text-center">
          <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-1">The Student Publication</p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-navy-800 tracking-tight leading-none">
            Scholara
          </h1>
          <div className="flex items-center justify-center gap-4 mt-3">
            <div className="h-px bg-navy-200 flex-1 max-w-32" />
            <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">
              Multilingual · Academic · Independent
            </p>
            <div className="h-px bg-navy-200 flex-1 max-w-32" />
          </div>
        </div>

        {/* Category nav */}
        <div className="border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex">
                {CATS.map(cat => (
                  <Link
                    key={cat.slug}
                    to={`/${activeLang}/${cat.slug}`}
                    className="px-4 py-2.5 text-xs font-sans font-bold text-navy-700 hover:text-accent border-r border-gray-100 hover:bg-gray-50 transition-colors uppercase tracking-wide"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
              <div className="flex gap-1 py-1">
                {LANGS.map(l => (
                  <button
                    key={l.code}
                    onClick={() => setActiveLang(l.code)}
                    className={`px-3 py-1 text-xs font-mono font-bold transition-colors ${activeLang === l.code ? 'bg-navy-700 text-white' : 'text-navy-500 hover:text-navy-700'}`}
                  >
                    {l.code.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-2 border-navy-700 border-t-transparent rounded-full animate-spin" />
            <p className="mt-3 text-sm font-sans text-gray-500">{t('loading')}</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-2xl text-gray-400">{t('noArticles')}</p>
            <p className="mt-2 text-sm font-sans text-gray-400">Try switching to a different language</p>
            <div className="flex justify-center gap-2 mt-4">
              {LANGS.filter(l => l.code !== activeLang).map(l => (
                <button key={l.code} onClick={() => setActiveLang(l.code)}
                  className="px-4 py-2 text-sm font-sans border border-navy-700 text-navy-700 hover:bg-navy-700 hover:text-white transition-colors">
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Main layout: featured + secondary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
              {/* Featured */}
              <div className="lg:col-span-2">
                {featured && <ArticleCard article={featured} size="featured" />}
              </div>

              {/* Secondary column */}
              <div className="space-y-4 border-l border-gray-200 pl-6">
                <h2 className="font-mono text-xs font-bold text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-200">
                  {t('latestArticles')}
                </h2>
                {secondary.map(a => (
                  <ArticleCard key={a.id} article={a} size="large" />
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-0.5 bg-navy-700 flex-1" />
              <span className="font-mono text-xs font-bold text-navy-700 uppercase tracking-widest">More Stories</span>
              <div className="h-0.5 bg-navy-700 flex-1" />
            </div>

            {/* Grid of remaining articles */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                {rest.map(a => (
                  <ArticleCard key={a.id} article={a} size="normal" />
                ))}
              </div>
            )}

            {/* Category quick links */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-0 border border-navy-700 divide-x divide-navy-700">
              {CATS.map((cat, i) => (
                <Link
                  key={cat.slug}
                  to={`/${activeLang}/${cat.slug}`}
                  className="group p-6 hover:bg-navy-700 transition-colors"
                >
                  <span className="text-xs font-mono font-bold text-gray-400 group-hover:text-navy-200 uppercase tracking-widest">Explore</span>
                  <h3 className="font-serif text-xl font-bold text-navy-800 group-hover:text-white mt-1 mb-2">{cat.label}</h3>
                  <span className="text-xs font-sans text-navy-500 group-hover:text-navy-200">Browse all articles →</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
