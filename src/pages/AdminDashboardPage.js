// src/pages/AdminDashboardPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getPendingArticles, updateArticleStatus, deleteArticle, getAllUsersArticles } from '../services/articleService';
import { getAllUsers, updateUserRole, deleteUser } from '../services/userService';
import { StatusBadge } from '../components/ArticleCard';

const TABS = ['pending', 'all-articles', 'users'];

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState('pending');
  const [pendingArticles, setPendingArticles] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tab === 'pending') loadPending();
    if (tab === 'all-articles') loadAllArticles();
    if (tab === 'users') loadUsers();
  }, [tab]);

  const loadPending = async () => {
    setLoading(true);
    try { setPendingArticles(await getPendingArticles()); } catch (e) {}
    setLoading(false);
  };

  const loadAllArticles = async () => {
    setLoading(true);
    try { setAllArticles(await getAllUsersArticles()); } catch (e) {}
    setLoading(false);
  };

  const loadUsers = async () => {
    setLoading(true);
    try { setUsers(await getAllUsers()); } catch (e) {}
    setLoading(false);
  };

  const handleApprove = async (id) => {
    await updateArticleStatus(id, 'approved');
    setPendingArticles(prev => prev.filter(a => a.id !== id));
  };

  const handleReject = async (id) => {
    await updateArticleStatus(id, 'rejected');
    setPendingArticles(prev => prev.filter(a => a.id !== id));
  };

  const handleDeleteArticle = async (id, imageUrl) => {
    if (!window.confirm(t('confirmDelete'))) return;
    await deleteArticle(id, imageUrl);
    setAllArticles(prev => prev.filter(a => a.id !== id));
    setPendingArticles(prev => prev.filter(a => a.id !== id));
  };

  const handleRoleChange = async (uid, role) => {
    await updateUserRole(uid, role);
    setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role } : u));
  };

  const handleDeleteUser = async (uid) => {
    if (!window.confirm('Delete user and all their articles?')) return;
    await deleteUser(uid);
    setUsers(prev => prev.filter(u => u.uid !== uid));
  };

  const formatDate = (ts) => {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-1">Control Panel</p>
          <h1 className="font-serif text-3xl font-bold text-navy-800">{t('adminDashboard')}</h1>
          <div className="h-0.5 bg-navy-700 mt-4" />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Pending Review', value: pendingArticles.length, color: 'border-yellow-400', tab: 'pending' },
            { label: 'All Articles', value: allArticles.length, color: 'border-navy-700', tab: 'all-articles' },
            { label: 'Users', value: users.length, color: 'border-green-500', tab: 'users' },
          ].map(s => (
            <button key={s.tab} onClick={() => setTab(s.tab)}
              className={`bg-white border-t-4 ${s.color} p-4 shadow-sm text-left hover:shadow-md transition-shadow ${tab === s.tab ? 'ring-2 ring-navy-300' : ''}`}
            >
              <p className="font-mono text-3xl font-bold text-navy-800">{s.value}</p>
              <p className="text-xs font-sans text-gray-500 uppercase tracking-wide mt-1">{s.label}</p>
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {[
            { key: 'pending', label: `${t('pendingArticles')} (${pendingArticles.length})` },
            { key: 'all-articles', label: t('allArticles') },
            { key: 'users', label: t('manageUsers') },
          ].map(tb => (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              className={`px-5 py-2.5 text-sm font-sans font-medium border-b-2 transition-colors ${tab === tb.key ? 'border-navy-700 text-navy-700' : 'border-transparent text-gray-500 hover:text-navy-700'}`}
            >
              {tb.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-6 h-6 border-2 border-navy-700 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Pending tab */}
            {tab === 'pending' && (
              <div className="bg-white border border-gray-200 shadow-sm">
                {pendingArticles.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="font-serif text-xl text-gray-400">No pending articles 🎉</p>
                    <p className="text-sm text-gray-400 mt-1 font-sans">All caught up!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {pendingArticles.map(a => (
                      <div key={a.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-mono px-2 py-0.5 bg-gray-100 text-gray-600 uppercase">{a.category}</span>
                              <span className="text-xs font-mono text-gray-400 uppercase">{a.language}</span>
                            </div>
                            <h3 className="font-serif font-bold text-navy-800 text-lg mb-1">{a.title}</h3>
                            <p className="text-sm font-sans text-gray-500 line-clamp-2 mb-2">
                              {a.content?.substring(0, 200)}...
                            </p>
                            <div className="flex items-center gap-3 text-xs font-sans text-gray-400">
                              <span>By <span className="font-medium text-gray-600">{a.authorName}</span></span>
                              <span>·</span>
                              <span>{formatDate(a.createdAt)}</span>
                            </div>
                          </div>
                          {a.imageUrl && (
                            <img src={a.imageUrl} alt={a.title} className="w-24 h-20 object-cover flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                          <button
                            onClick={() => handleApprove(a.id)}
                            className="px-4 py-1.5 bg-green-600 text-white text-xs font-sans font-medium hover:bg-green-700 transition-colors"
                          >
                            ✓ {t('approve')}
                          </button>
                          <button
                            onClick={() => handleReject(a.id)}
                            className="px-4 py-1.5 bg-red-500 text-white text-xs font-sans font-medium hover:bg-red-600 transition-colors"
                          >
                            ✗ {t('reject')}
                          </button>
                          <Link
                            to={`/article/${a.id}`}
                            target="_blank"
                            className="px-4 py-1.5 border border-gray-200 text-gray-600 text-xs font-sans hover:border-gray-400 transition-colors"
                          >
                            Preview
                          </Link>
                          <button
                            onClick={() => handleDeleteArticle(a.id, a.imageUrl)}
                            className="ml-auto text-xs font-sans text-red-400 hover:text-red-600 transition-colors"
                          >
                            {t('delete')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* All articles tab */}
            {tab === 'all-articles' && (
              <div className="bg-white border border-gray-200 shadow-sm">
                <div className="divide-y divide-gray-100">
                  {allArticles.map(a => (
                    <div key={a.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                      <StatusBadge status={a.status} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-semibold text-navy-800 text-sm truncate">{a.title}</h4>
                        <div className="flex items-center gap-2 text-xs font-sans text-gray-400 mt-0.5">
                          <span>{a.authorName}</span>
                          <span>·</span>
                          <span className="uppercase">{a.category}</span>
                          <span>·</span>
                          <span className="uppercase">{a.language}</span>
                          <span>·</span>
                          <span>{formatDate(a.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {a.status === 'pending' && (
                          <>
                            <button onClick={() => handleApprove(a.id)} className="text-xs font-sans text-green-600 hover:underline">Approve</button>
                            <button onClick={() => handleReject(a.id)} className="text-xs font-sans text-red-500 hover:underline">Reject</button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteArticle(a.id, a.imageUrl)}
                          className="text-xs font-sans text-red-400 hover:text-red-600 px-2 py-1 transition-colors"
                        >
                          {t('delete')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Users tab */}
            {tab === 'users' && (
              <div className="bg-white border border-gray-200 shadow-sm">
                <div className="divide-y divide-gray-100">
                  {users.map(u => (
                    <div key={u.uid} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                      <div className="w-9 h-9 bg-navy-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-serif font-bold text-sm">{u.name?.[0]?.toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-sans font-medium text-navy-800 text-sm">{u.name}</p>
                        <p className="text-xs font-sans text-gray-400">{u.email}</p>
                        <p className="text-xs font-sans text-gray-400">{formatDate(u.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <select
                          value={u.role}
                          onChange={e => handleRoleChange(u.uid, e.target.value)}
                          className="text-xs font-mono border border-gray-200 px-2 py-1 focus:outline-none focus:border-navy-700"
                        >
                          <option value="user">User</option>
                          <option value="writer">Writer</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          onClick={() => handleDeleteUser(u.uid)}
                          className="text-xs font-sans text-red-400 hover:text-red-600 px-2 py-1 transition-colors"
                        >
                          {t('delete')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
