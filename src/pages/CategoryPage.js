// src/pages/CategoryPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getArticles } from '../services/articleService';
import { ArticleCard } from '../components/ArticleCard';

const CATEGORY_MAP = {
  'explained': 'explained',
  'opinion': 'opinion',
  'scientific-research': 'scientific-research',
};

const CATEGORY_DESCRIPTIONS = {
  explained: 'Deep dives and explainers on complex topics',
  opinion: 'Perspectives and viewpoints from student writers',
  'scientific-research': 'Academic research and scientific findings',
};

export default function CategoryPage() {
  const { lang, category } = useParams();
  const { t } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getArticles({ lang, category });
        setArticles(data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    load();
  }, [lang, category]);

  const catLabel = category === 'scientific-research' ? t('scientificResearch') : t(category);
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="min-h-screen bg-cream">
      {/* Category header */}
      <div className="bg-white border-b-2 border-navy-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-3 mb-1">
            <Link to="/" className="text-xs font-mono text-gray-400 hover:text-navy-700 transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="text-xs font-mono text-gray-400 uppercase">{lang}</span>
            <span className="text-gray-300">/</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy-800">{catLabel}</h1>
          <p className="text-gray-500 font-sans text-sm mt-2">{CATEGORY_DESCRIPTIONS[category]}</p>
          <div className="flex gap-3 mt-4">
            {['en', 'ar', 'tr'].map(l => (
              <Link
                key={l}
                to={`/${l}/${category}`}
                className={`text-xs font-mono px-3 py-1 border ${lang === l ? 'bg-navy-700 text-white border-navy-700' : 'border-gray-300 text-gray-500 hover:border-navy-700 hover:text-navy-700'} transition-colors`}
              >
                {l.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-2 border-navy-700 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-2xl text-gray-400">{t('noArticles')}</p>
            <p className="mt-2 text-sm text-gray-400">No {catLabel} articles in this language yet.</p>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured && (
              <div className="mb-10">
                <ArticleCard article={featured} size="featured" />
              </div>
            )}

            {/* Grid */}
            {rest.length > 0 && (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-0.5 bg-navy-700 w-8" />
                  <span className="font-mono text-xs font-bold text-navy-700 uppercase tracking-widest">All Articles</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map(a => (
                    <ArticleCard key={a.id} article={a} size="large" />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
