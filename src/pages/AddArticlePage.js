// src/pages/AddArticlePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { createArticle, updateArticle } from '../services/articleService';
import { uploadToCloudinary } from '../services/cloudinary'; 

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
    podcast: editArticle?.podcast || { url: '', title: '', description: '', imageUrl: '' },
    video: editArticle?.video || { url: '', title: '', description: '', imageUrl: '' },
    mediaPosition: editArticle?.mediaPosition || 'bottom',
  });

  const [coverImage, setCoverImage] = useState(null);
  const [imagePosition, setImagePosition] = useState(editArticle?.imagePosition || 'center');
  
  // States جديدة لاستقبال ملفات الصور المرفوعة للميديا من الجهاز
  const [podcastFile, setPodcastFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePodcastChange = (field, value) => {
    setForm(prev => ({ ...prev, podcast: { ...prev.podcast, [field]: value } }));
  };

  const handleVideoChange = (field, value) => {
    setForm(prev => ({ ...prev, video: { ...prev.video, [field]: value } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let imageUrl = editArticle?.imageUrl || '';
      let podcastImageUrl = form.podcast.imageUrl || '';
      let videoImageUrl = form.video.imageUrl || '';

      // 1. رفع صورة الغلاف الأساسية لو تم اختيارها
      if (coverImage) {
        imageUrl = await uploadToCloudinary(coverImage);
      }

      // 2. رفع صورة البودكاست لو تم اختيارها من الجهاز
      if (podcastFile) {
        podcastImageUrl = await uploadToCloudinary(podcastFile);
      }

      // 3. رفع صورة الفيديو لو تم اختيارها من الجهاز
      if (videoFile) {
        videoImageUrl = await uploadToCloudinary(videoFile);
      }

      const articleData = {
        ...form,
        podcast: { ...form.podcast, imageUrl: podcastImageUrl },
        video: { ...form.video, imageUrl: videoImageUrl },
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
              rows={12}
              dir={form.language === 'ar' ? 'rtl' : 'ltr'}
              className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-navy-700 font-sans text-sm bg-white resize-y"
              placeholder="Write your article content here..."
            />
          </div>

          {/* ==================== قسم إضافة الوسائط التفاعلية (Multimedia Block) ==================== */}
          <div className="border border-navy-200 rounded-sm p-5 bg-white space-y-6">
            <h3 className="font-serif text-lg font-bold text-navy-800 border-b pb-2 border-gray-100">
              {t('multimediaTitle')}
            </h3>

            {/* اختيار مكان الظهور */}
            <div>
              <label className="block text-xs font-mono font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                {t('mediaPositionLabel')}
              </label>
              <select
                value={form.mediaPosition}
                onChange={e => setForm(f => ({ ...f, mediaPosition: e.target.value }))}
                className="w-full sm:w-64 px-3 py-2 border border-gray-200 focus:outline-none focus:border-navy-700 font-sans text-xs bg-white"
              >
                <option value="bottom">{t('positionBottom')}</option>
                <option value="top">{t('positionTop')}</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* فورم البودكاست */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-sm space-y-3">
                <h4 className="text-sm font-sans font-bold text-purple-800">{t('podcastSection')}</h4>
                <input
                  type="text"
                  placeholder={t('podcastUrlPlaceholder')}
                  value={form.podcast.url}
                  onChange={e => handlePodcastChange('url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 text-xs focus:outline-none focus:border-navy-700 bg-white"
                />
                <input
                  type="text"
                  placeholder={t('podcastTitlePlaceholder')}
                  value={form.podcast.title}
                  onChange={e => handlePodcastChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 text-xs focus:outline-none focus:border-navy-700 bg-white"
                />
                
                {/* رفع صورة من الجهاز للبودكاست بدلاً من الرابط */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono font-bold text-gray-500 uppercase">{t('uploadPodcastImg')}</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setPodcastFile(e.target.files[0])}
                    className="w-full text-xs font-sans bg-white border px-2 py-1 file:border-0 file:bg-purple-100 file:text-purple-800 file:px-2 file:py-0.5 file:rounded"
                  />
                  {form.podcast.imageUrl && <p className="text-[10px] text-green-600">{t('imageAlreadyUploaded')}</p>}
                </div>

                <textarea
                  placeholder={t('podcastDescPlaceholder')}
                  rows={2}
                  value={form.podcast.description}
                  onChange={e => handlePodcastChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 text-xs focus:outline-none focus:border-navy-700 bg-white resize-none"
                />
              </div>

              {/* فورم الفيديو */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-sm space-y-3">
                <h4 className="text-sm font-sans font-bold text-red-800">{t('videoSection')}</h4>
                <input
                  type="text"
                  placeholder={t('videoUrlPlaceholder')}
                  value={form.video.url}
                  onChange={e => handleVideoChange('url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 text-xs focus:outline-none focus:border-navy-700 bg-white"
                />
                <input
                  type="text"
                  placeholder={t('videoTitlePlaceholder')}
                  value={form.video.title}
                  onChange={e => handleVideoChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 text-xs focus:outline-none focus:border-navy-700 bg-white"
                />
                
                {/* رفع صورة من الجهاز للفيديو بدلاً من الرابط */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono font-bold text-gray-500 uppercase">{t('uploadVideoImg')}</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setVideoFile(e.target.files[0])}
                    className="w-full text-xs font-sans bg-white border px-2 py-1 file:border-0 file:bg-red-100 file:text-red-800 file:px-2 file:py-0.5 file:rounded"
                  />
                  {form.video.imageUrl && <p className="text-[10px] text-green-600">{t('imageAlreadyUploaded')}</p>}
                </div>

                <textarea
                  placeholder={t('videoDescPlaceholder')}
                  rows={2}
                  value={form.video.description}
                  onChange={e => handleVideoChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 text-xs focus:outline-none focus:border-navy-700 bg-white resize-none"
                />
              </div>
            </div>
          </div>
          {/* ======================================================================================= */}

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