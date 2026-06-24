// src/pages/SearchPage.js
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { searchArticles } from '../services/articleService';
import { ArticleCard } from '../components/ArticleCard';

export default function SearchPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const lang = searchParams.get('lang') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await searchArticles(q, lang || undefined);
        setResults(data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    load();
  }, [q, lang]);

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-white border-b-2 border-navy-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-1">{t('searchResults')}</p>
          <h1 className="font-serif text-3xl font-bold text-navy-800">
            Results for <span className="text-accent">"{q}"</span>
          </h1>
          <p className="text-sm font-sans text-gray-500 mt-1">
            {loading ? 'Searching...' : `${results.length} articles found`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-2 border-navy-700 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-2xl text-gray-400">{t('noArticles')}</p>
            <p className="text-sm font-sans text-gray-400 mt-2">Try different keywords</p>
            <Link to="/" className="mt-4 inline-block text-sm font-sans text-navy-700 hover:underline">← Back to home</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map(a => <ArticleCard key={a.id} article={a} size="large" />)}
          </div>
        )}
      </div>
    </div>
  );
}
