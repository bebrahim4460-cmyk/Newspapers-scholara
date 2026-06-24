// src/pages/WriterDashboardPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { getWriterArticles, deleteArticle } from '../services/articleService';
import { StatusBadge } from '../components/ArticleCard';

const CATEGORY_LABELS = {
  explained: 'Explained',
  opinion: 'Opinion',
  'scientific-research': 'Scientific Research',
};

export default function WriterDashboardPage() {
  const { t } = useTranslation();
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await getWriterArticles(currentUser.uid);
      setArticles(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleDelete = async (id, imageUrl) => {
    if (!window.confirm(t('confirmDelete'))) return;
    try {
      await deleteArticle(id, imageUrl);
      setArticles(prev => prev.filter(a => a.id !== id));
    } catch (e) {
      alert('Failed to delete');
    }
  };

  const stats = {
    total: articles.length,
    pending: articles.filter(a => a.status === 'pending').length,
    approved: articles.filter(a => a.status === 'approved').length,
    rejected: articles.filter(a => a.status === 'rejected').length,
  };

  const formatDate = (ts) => {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-1">Dashboard</p>
            <h1 className="font-serif text-3xl font-bold text-navy-800">{t('writerDashboard')}</h1>
            <p className="text-sm font-sans text-gray-500 mt-1">Welcome back, <span className="font-medium text-navy-700">{userData?.name}</span></p>
          </div>
          <Link
            to="/add-article"
            className="px-5 py-2.5 bg-navy-700 text-white font-sans font-medium text-sm hover:bg-navy-800 transition-colors flex items-center gap-2"
          >
            <span>+</span> {t('createArticle')}
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'border-navy-700' },
            { label: 'Pending', value: stats.pending, color: 'border-yellow-400' },
            { label: 'Approved', value: stats.approved, color: 'border-green-500' },
            { label: 'Rejected', value: stats.rejected, color: 'border-red-400' },
          ].map(s => (
            <div key={s.label} className={`bg-white border-t-4 ${s.color} p-4 shadow-sm`}>
              <p className="font-mono text-3xl font-bold text-navy-800">{s.value}</p>
              <p className="text-xs font-sans text-gray-500 uppercase tracking-wide mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Articles */}
        <div className="bg-white border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="font-mono text-sm font-bold text-navy-700 uppercase tracking-wider">{t('myArticles')}</h2>
            <span className="text-xs font-sans text-gray-400">{articles.length} articles</span>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-6 h-6 border-2 border-navy-700 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-serif text-xl text-gray-400 mb-2">No articles yet</p>
              <Link to="/add-article" className="text-sm font-sans text-accent hover:underline">Write your first article →</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {articles.map(a => (
                <div key={a.id} className="px-6 py-4 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={a.status} />
                      <span className="text-xs font-mono text-gray-400">{CATEGORY_LABELS[a.category]}</span>
                      <span className="text-xs font-mono text-gray-300">·</span>
                      <span className="text-xs font-mono text-gray-400 uppercase">{a.language}</span>
                    </div>
                    <h3 className="font-serif font-semibold text-navy-800 text-sm leading-snug mb-1">{a.title}</h3>
                    <p className="text-xs font-sans text-gray-400">{formatDate(a.createdAt)}</p>
                    {a.status === 'rejected' && (
                      <p className="text-xs font-sans text-red-500 mt-1">
                        You can edit and resubmit this article.
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {a.status === 'approved' && (
                      <Link
                        to={`/article/${a.id}`}
                        className="text-xs font-sans font-medium text-navy-700 hover:underline px-2 py-1"
                      >
                        View
                      </Link>
                    )}
                    {(a.status === 'pending' || a.status === 'rejected') && (
                      <button
                        onClick={() => navigate(`/edit-article/${a.id}`)}
                        className="text-xs font-sans font-medium text-navy-700 border border-navy-200 hover:border-navy-700 px-3 py-1 transition-colors"
                      >
                        {t('edit')}
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(a.id, a.imageUrl)}
                      className="text-xs font-sans font-medium text-red-500 hover:text-red-700 px-2 py-1 transition-colors"
                    >
                      {t('delete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
