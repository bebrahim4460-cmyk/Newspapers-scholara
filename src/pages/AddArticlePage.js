// src/pages/AddArticlePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { createArticle, updateArticle } from '../services/articleService';
import { uploadToCloudinary } from '../services/cloudinary'; // الـ Import الصحيح من الخدمة الجديدة

const CATEGORIES = ['explained', 'opinion', 'scientific-research', 'culture'];

export default function AddArticlePage({ editArticle = null }) {
  const { t } = useTranslation();
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: editArticle?.title || '',
    content: editArticle?.content || '',
    language: editArticle?.language || 'en',
    category: editArticle?.category || 'explained',
  });

  const [coverImage, setCoverImage] = useState(null);
  const [imagePosition, setImagePosition] = useState(editArticle?.imagePosition || 'center');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let imageUrl = editArticle?.imageUrl || '';

      // رفع الصورة عبر دالة الخدمة الخارجية المربوطة بـ Cloudinary
      if (coverImage) {
        imageUrl = await uploadToCloudinary(coverImage);
      }

      const articleData = {
        ...form,
        authorId: currentUser.uid,
        authorName: userData?.name || currentUser.email,
        imageUrl: imageUrl,
        imagePosition: imagePosition, 
      };

      if (editArticle) {
        await updateArticle(editArticle.id, articleData);
        setSuccess('Article updated and resubmitted for review!');
      } else {
        await createArticle(articleData, null);
        setSuccess('Article submitted for review!');
      }
      setTimeout(() => navigate('/writer-dashboard'), 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit article');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-navy-800">
            {editArticle ? 'Edit Article' : t('createArticle')}
          </h1>
          <p className="text-sm font-sans text-gray-500 mt-1">
            Your article will be reviewed before publishing.
          </p>
          <div className="h-0.5 bg-navy-700 mt-4" />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-sans px-4 py-3 mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm font-sans px-4 py-3 mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Language & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                {t('articleLanguage')}
              </label>
              <select
                value={form.language}
                onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-navy-700 font-sans text-sm bg-white"
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
                <option value="tr">Türkçe</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                {t('articleCategory')}
              </label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-navy-700 font-sans text-sm bg-white"
              >
                <option value="explained">{t('explained')}</option>
                <option value="opinion">{t('opinion')}</option>
                <option value="scientific-research">{t('scientificResearch')}</option>
                <option value="culture">{t('culture')}</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-mono font-bold text-gray-600 uppercase tracking-wider mb-1.5">
              {t('articleTitle')}
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              required
              dir={form.language === 'ar' ? 'rtl' : 'ltr'}
              className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-navy-700 font-serif text-lg bg-white"
              placeholder="Enter article title..."
            />
          </div>

          {/* Cover Image Upload */}
          <div className="flex flex-col gap-2 border-2 border-dashed border-gray-300 p-4 bg-white shadow-sm">
            <label className="block text-xs font-mono font-bold text-gray-600 uppercase tracking-wider">
              صورة غلاف المقال (Cover Image)
            </label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setCoverImage(e.target.files[0])}
              className="text-sm font-sans file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-navy-700 file:text-white hover:file:bg-navy-800 cursor-pointer"
            />
            {editArticle?.imageUrl && !coverImage && (
              <p className="text-xs text-gray-400 mt-1">توجد صورة مرفوعة مسبقاً، اختر ملفاً جديداً لاستبدالها فقط.</p>
            )}

            {(coverImage || editArticle?.imageUrl) && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-3 border-gray-100">
                <div>
                  <label className="block text-xs font-mono font-bold text-gray-500 uppercase tracking-wider mb-1">
                    تموضع الصورة داخل المقال:
                  </label>
                  <select 
                    value={imagePosition} 
                    onChange={(e) => setImagePosition(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-200 focus:outline-none text-xs bg-white"
                  >
                    <option value="center">في المنتصف (فوق نص المقال)</option>
                    <option value="right">على اليمين (النص يلتف حولها)</option>
                    <option value="left">على اليسار (النص يلتف حولها)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-mono font-bold text-gray-600 uppercase tracking-wider mb-1.5">
              {t('articleContent')}
            </label>
            <textarea
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              required
              rows={16}
              dir={form.language === 'ar' ? 'rtl' : 'ltr'}
              className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-navy-700 font-sans text-sm bg-white resize-y"
              placeholder="Write your article content here..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-navy-700 text-white font-sans font-medium text-sm hover:bg-navy-800 transition-colors disabled:opacity-50"
            >
              {loading ? t('loading') : t('submit')}
            </button>
            <button
              type="button"
              onClick={() => navigate('/writer-dashboard')}
              className="px-6 py-3 border border-gray-200 text-gray-600 font-sans text-sm hover:border-gray-400 transition-colors"
            >
              {t('cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}