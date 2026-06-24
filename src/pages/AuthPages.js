// src/pages/LoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="font-serif text-4xl font-bold text-navy-800">Scholar<span className="text-accent">Press</span></h1>
          </Link>
          <div className="h-0.5 bg-navy-700 mt-3 mb-4" />
          <p className="text-sm font-sans text-gray-500">{t('loginSubtitle')}</p>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm p-8">
          <h2 className="font-serif text-2xl font-bold text-navy-800 mb-6">{t('loginTitle')}</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-sans px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-gray-600 uppercase tracking-wider mb-1.5">{t('email')}</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-navy-700 font-sans text-sm bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-gray-600 uppercase tracking-wider mb-1.5">{t('password')}</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
                className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-navy-700 font-sans text-sm bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-navy-700 text-white font-sans font-medium text-sm hover:bg-navy-800 transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? t('loading') : t('signIn')}
            </button>
          </form>

          <p className="text-center text-sm font-sans text-gray-500 mt-6">
            {t('noAccount')}{' '}
            <Link to="/register" className="text-accent hover:underline font-medium">{t('signUp')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// ============ Register Page ============

export function RegisterPage() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form.email, form.password, form.name, form.role);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="font-serif text-4xl font-bold text-navy-800">Scholar<span className="text-accent">Press</span></h1>
          </Link>
          <div className="h-0.5 bg-navy-700 mt-3 mb-4" />
          <p className="text-sm font-sans text-gray-500">{t('registerSubtitle')}</p>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm p-8">
          <h2 className="font-serif text-2xl font-bold text-navy-800 mb-6">{t('registerTitle')}</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-sans px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-gray-600 uppercase tracking-wider mb-1.5">{t('name')}</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
                className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-navy-700 font-sans text-sm bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-gray-600 uppercase tracking-wider mb-1.5">{t('email')}</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-navy-700 font-sans text-sm bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-gray-600 uppercase tracking-wider mb-1.5">{t('password')}</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
                className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-navy-700 font-sans text-sm bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-gray-600 uppercase tracking-wider mb-1.5">{t('role')}</label>
              <select
                value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-navy-700 font-sans text-sm bg-gray-50 focus:bg-white transition-colors"
              >
                <option value="user">{t('user')} — Reader</option>
                <option value="writer">{t('writer')} — Can write articles</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-navy-700 text-white font-sans font-medium text-sm hover:bg-navy-800 transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? t('loading') : t('signUp')}
            </button>
          </form>

          <p className="text-center text-sm font-sans text-gray-500 mt-6">
            {t('haveAccount')}{' '}
            <Link to="/login" className="text-accent hover:underline font-medium">{t('signIn')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
