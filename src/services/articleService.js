// src/services/articleService.js
import { db } from '../firebase/config';
import {
  collection, addDoc, getDocs, getDoc, doc,
  updateDoc, deleteDoc, query, where, orderBy,
  serverTimestamp, limit
} from 'firebase/firestore';

const ARTICLES = 'articles';

// ✅ تم تعديل الدالة هنا لتستقبل وتخزن الـ imageUrl القادم من كلوديناري دون مسحه
export const createArticle = async (articleData) => {
  const doc_ = await addDoc(collection(db, ARTICLES), {
    ...articleData, // يحتوي تلقائياً على imageUrl و imagePosition القادمين من الصفحة
    status: 'pending',
    createdAt: serverTimestamp()
  });
  return doc_.id;
};

export const getArticles = async ({ lang, category, status = 'approved', limitCount = 20 } = {}) => {
  const conditions = [where('status', '==', status)];
  if (lang) conditions.push(where('language', '==', lang));
  if (category) conditions.push(where('category', '==', category));
  const q = query(collection(db, ARTICLES), ...conditions, orderBy('createdAt', 'desc'), limit(limitCount));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getArticleById = async (id) => {
  const snap = await getDoc(doc(db, ARTICLES, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};

export const getWriterArticles = async (authorId) => {
  const q = query(
    collection(db, ARTICLES),
    where('authorId', '==', authorId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getPendingArticles = async () => {
  const q = query(
    collection(db, ARTICLES),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const updateArticleStatus = async (id, status) => {
  await updateDoc(doc(db, ARTICLES, id), { status, updatedAt: serverTimestamp() });
};

export const deleteArticle = async (id) => {
  await deleteDoc(doc(db, ARTICLES, id));
};

export const updateArticle = async (id, data) => {
  await updateDoc(doc(db, ARTICLES, id), { ...data, updatedAt: serverTimestamp() });
};

export const searchArticles = async (searchTerm, lang) => {
  const conditions = [where('status', '==', 'approved')];
  if (lang) conditions.push(where('language', '==', lang));
  const q = query(collection(db, ARTICLES), ...conditions, orderBy('createdAt', 'desc'), limit(100));
  const snap = await getDocs(q);
  const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  const term = searchTerm.toLowerCase();
  return all.filter(a =>
    a.title?.toLowerCase().includes(term) ||
    a.category?.toLowerCase().includes(term) ||
    a.content?.toLowerCase().includes(term)
  );
};

export const getAllUsersArticles = async () => {
  const q = query(collection(db, ARTICLES), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};