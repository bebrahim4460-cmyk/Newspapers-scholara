// src/pages/ArticleDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getArticleById } from '../services/articleService';

export default function ArticleDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const data = await getArticleById(id);
        if (data) {
          setArticle(data);
          // 📊 رادار المراقبة للتأكد من قيمة الرابط المخزن في الفايربيس
          console.log("رابط الصورة القادم من الفايربيس لهذا المقال هو:", data.imageUrl || data.image || "❌ لا يوجد رابط (قيمة فارغة)");
        } else {
          setError('Article not found');
        }
      } catch (err) {
        setError(err.message || 'Error fetching article');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-navy-800 font-sans text-lg animate-pulse">{t('loading')}...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
        <p className="font-serif text-2xl text-red-600 mb-4">{error || 'Article not found'}</p>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-navy-700 text-white font-sans text-sm hover:bg-navy-800 transition-colors"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  const isArabic = article.language === 'ar';

  // ✅ تحديد كلاسات تموضع الصورة بناءً على الاختيار (مع ضبط الهوامش للتفاف النص)
  let imageContainerClass = "w-full mb-6"; 
  if (article.imagePosition === 'right') {
    imageContainerClass = "w-full md:w-1/2 md:float-right md:ml-6 md:mb-4 mb-6";
  } else if (article.imagePosition === 'left') {
    imageContainerClass = "w-full md:w-1/2 md:float-left md:mr-6 md:mb-4 mb-6";
  }

  // التحقق من الرابط بكل الأشكال الممكنة لضمان ألا تضيع الصورة
  const finalImageUrl = article.imageUrl || article.image;

  return (
    <div className="min-h-screen bg-cream py-10">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 bg-white p-6 sm:p-10 shadow-sm border border-gray-100" dir={isArabic ? 'rtl' : 'ltr'}>
        
        {/* اسم القسم / التصنيف */}
        <div className="mb-4">
          <span className="inline-block px-2 py-0.5 text-xs font-mono font-bold uppercase tracking-wider bg-navy-100 text-navy-800">
            {article.category}
          </span>
        </div>

        {/* عنوان المقال */}
        <h1 className="font-serif font-bold text-navy-900 text-3xl sm:text-4xl leading-tight mb-4">
          {article.title}
        </h1>

        {/* بيانات الكاتب والتاريخ */}
        <div className="flex items-center gap-3 text-gray-500 text-xs font-sans mb-8 border-b border-gray-100 pb-4">
          <div>
            {t('by')} <span className="font-medium text-navy-800">{article.authorName}</span>
          </div>
          <span>·</span>
          <div>
            {article.createdAt?.toDate 
              ? article.createdAt.toDate().toLocaleDateString(isArabic ? 'ar-EG' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
              : new Date(article.createdAt).toLocaleDateString(isArabic ? 'ar-EG' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
            }
          </div>
        </div>

        {/* نظام عرض الصورة المحمي والذكي */}
        {finalImageUrl && (
          <div className={imageContainerClass}>
            <img 
              src={finalImageUrl} 
              alt={article.title} 
              className="w-full h-auto max-h-[500px] object-cover border border-gray-200 shadow-sm rounded bg-gray-50"
              onError={(e) => {
                console.error("❌ الرابط تالف أو غير قادر على التحميل الفعلي من السيرفر:", finalImageUrl);
                e.target.style.display = 'none'; 
              }}
            />
          </div>
        )}

        {/* ✅ محتوى المقال - تمت إزالة clear-both من هنا ليلتف النص بحرية */}
        <div className="font-sans text-gray-800 text-base leading-relaxed whitespace-pre-line">
          {article.content}
        </div>

        {/* ✅ تنظيف الـ float في النهاية لضمان عدم خروج العناصر عن إطار الخلفية البيضاء */}
        <div className="clear-both" />

      </article>
    </div>
  );
}