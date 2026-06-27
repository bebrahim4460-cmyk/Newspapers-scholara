// src/components/FeaturedSlider.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function FeaturedSlider({ articles, currentLang }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (articles.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [articles]);

  if (!articles || articles.length === 0) return null;

  return (
    <div className="relative w-full h-[350px] md:h-[450px] bg-navy-900 overflow-hidden border-b-4 border-navy-700">
      {articles.map((article, index) => (
        <div
          key={article.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* جعل السلايدر بالكامل عبارة عن رابط قابل للضغط يودي للمقال */}
         <Link to={`/article/${article.id}`} className="block w-full h-full relative group">
            {/* صورة المقال */}
            <img
              src={article.imageUrl || 'https://via.placeholder.com/1200x600'}
              alt={article.title}
              className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-700"
            />

            {/* تدرج أسود خلف النص */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-black/20" />

            {/* محتوى المقال في الجزء السفلي فوق الصورة */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white z-20">
              <div className="max-w-3xl">
                <span className="inline-block px-2 py-0.5 bg-accent text-white text-[10px] font-mono uppercase tracking-widest mb-2 rounded-sm">
                  {article.category}
                </span>
                <h2 className="font-serif text-xl md:text-3xl font-bold mb-2 leading-tight group-hover:underline">
                  {article.title}
                </h2>
                <p className="text-xs md:text-sm text-gray-200 font-sans line-clamp-2 max-w-2xl">
                  {article.excerpt || article.content?.replace(/<[^>]*>/g, '')}
                </p>
              </div>
            </div>
          </Link>
        </div>
      ))}

      {/* نقاط التنقل */}
      {articles.length > 1 && (
        <div className="absolute bottom-4 right-6 flex gap-1.5 z-30">
          {articles.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex ? 'bg-accent w-4' : 'bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}