// src/pages/EditArticlePage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArticleById } from '../services/articleService';
import { useAuth } from '../context/AuthContext';
import AddArticlePage from './AddArticlePage';

export default function EditArticlePage() {
  const { id } = useParams();
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const a = await getArticleById(id);
      if (!a) { navigate('/writer-dashboard'); return; }
      if (a.authorId !== currentUser?.uid && userRole !== 'admin') {
        navigate('/writer-dashboard');
        return;
      }
      setArticle(a);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-navy-700 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return <AddArticlePage editArticle={article} />;
}
