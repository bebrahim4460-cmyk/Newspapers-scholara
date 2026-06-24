// src/components/ArticleCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// الألوان ثابتة لا تحتاج لترجمة
const CATEGORY_COLORS = {
  explained: 'bg-blue-100 text-blue-800',
  opinion: 'bg-amber-100 text-amber-800',
  'scientific-research': 'bg-green-100 text-green-800',
  culture: 'bg-purple-100 text-purple-800',
};

export function ArticleCard({ article, size = 'normal' }) {
  const { t } = useTranslation();
  const isLarge = size === 'large';
  const isFeatured = size === 'featured';
  
  // ✅ دالة ذكية لجلب الترجمة الصحيحة للقسم بناءً على اللغة الحالية
  const getCategoryLabel = (category) => {
    const labels = {
      'explained': t('explained'),
      'opinion': t('opinion'),
      'scientific-research': t('scientificResearch'),
      'culture': t('culture'),
    };
    return labels[category] || category;
  };

  const hasImage = !!article.imageUrl;

  const formatDate = (ts) => {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    // يمكن هنا أيضاً تعديل تنسيق التاريخ بناءً على اللغة لاحقاً إذا أردتِ
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const isArabic = article.language === 'ar';

  if (isFeatured) {
    return (
      <Link to={`/article/${article.id}`} className="group block bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div className="flex flex-col" dir={isArabic ? 'rtl' : 'ltr'}>
          {hasImage && (
            <div className="w-full h-64 sm:h-72 md:h-96 overflow-hidden bg-gray-50 border-b border-gray-100">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
              />
            </div>
          )}
          <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow">
            <div>
              <span className={`inline-block px-2 py-0.5 text-xs font-mono font-bold uppercase tracking-wider mb-3 ${CATEGORY_COLORS[article.category] || 'bg-gray-100 text-navy-800'}`}>
                {getCategoryLabel(article.category)} {/* ✅ تم التحديث هنا */}
              </span>
              <h2 className="font-serif font-bold text-navy-900 text-2xl md:text-3xl leading-tight mb-3 group-hover:text-accent transition-colors">
                {article.title}
              </h2>
              <p className="text-gray-600 text-sm font-sans line-clamp-3 mb-5 max-w-3xl leading-relaxed">
                {article.content?.replace(/<[^>]*>/g, '').substring(0, 220)}...
              </p>
            </div>
            <div className="flex items-center gap-3 text-gray-400 text-xs font-sans border-t border-gray-50 pt-4">
              <span>{t('by')} <span className="text-navy-800 font-medium">{article.authorName}</span></span>
              <span>·</span>
              <span>{formatDate(article.createdAt)}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (isLarge) {
    return (
      <Link to={`/article/${article.id}`} className="group block border-b border-gray-200 pb-6">
        <div className="flex flex-col gap-3" dir={isArabic ? 'rtl' : 'ltr'}>
          {hasImage && (
            <div className="overflow-hidden bg-gray-50">
              <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          )}
          <span className={`inline-block px-2 py-0.5 text-xs font-mono uppercase tracking-wider w-fit ${CATEGORY_COLORS[article.category] || 'bg-gray-100 text-gray-600'}`}>
            {getCategoryLabel(article.category)} {/* ✅ تم التحديث هنا */}
          </span>
          <h3 className="font-serif font-bold text-navy-800 text-xl leading-tight group-hover:text-accent transition-colors">
            {article.title}
          </h3>
          <p className="text-gray-500 text-sm font-sans line-clamp-2">
            {article.content?.replace(/<[^>]*>/g, '').substring(0, 150)}...
          </p>
          <div className="text-xs text-gray-400 font-sans flex items-center gap-2">
            <span className="font-medium text-gray-600">{article.authorName}</span>
            <span>·</span>
            <span>{formatDate(article.createdAt)}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/article/${article.id}`} className="group block border-b border-gray-100 pb-4">
      <div className={`flex gap-3 ${isArabic ? 'flex-row-reverse' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
        {hasImage && (
          <div className="flex-shrink-0 w-24 h-20 overflow-hidden bg-gray-50">
            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <span className="text-xs font-mono text-accent uppercase tracking-wider">
            {getCategoryLabel(article.category)} {/* ✅ تم التحديث هنا */}
          </span>
          <h4 className="font-serif font-semibold text-navy-800 text-sm leading-snug mt-1 group-hover:text-accent transition-colors line-clamp-2">
            {article.title}
          </h4>
          <div className="text-xs text-gray-400 font-sans mt-1.5 flex items-center gap-1.5">
            <span>{article.authorName}</span>
            <span>·</span>
            <span>{formatDate(article.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function StatusBadge({ status }) {
  const { t } = useTranslation();
  
  // ✅ أضفنا الترجمة للحالات أيضاً لتصبح احترافية بالكامل
  const getStatusLabel = (s) => {
    switch(s) {
      case 'pending': return t('pending') || 'Pending';
      case 'approved': return t('approved') || 'Approved';
      case 'rejected': return t('rejected') || 'Rejected';
      default: return s;
    }
  };

  const colors = {
    pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    approved: 'bg-green-100 text-green-800 border border-green-200',
    rejected: 'bg-red-100 text-red-800 border border-red-200',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-mono font-bold uppercase rounded ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
      {getStatusLabel(status)}
    </span>
  );
}