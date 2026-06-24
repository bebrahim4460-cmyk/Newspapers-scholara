// src/services/userService.js
import { db } from '../firebase/config';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { deleteArticle, getWriterArticles } from './articleService';

export const getAllUsers = async () => {
  const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const updateUserRole = async (uid, role) => {
  await updateDoc(doc(db, 'users', uid), { role });
};

export const deleteUser = async (uid) => {
  try {
    const articles = await getWriterArticles(uid);
    for (const a of articles) await deleteArticle(a.id);
  } catch (e) { /* ignore */ }
  await deleteDoc(doc(db, 'users', uid));
};