// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute, WriterRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import WriterDashboardPage from './pages/WriterDashboardPage';
import AddArticlePage from './pages/AddArticlePage';
import EditArticlePage from './pages/EditArticlePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SearchPage from './pages/SearchPage';

import './i18n';

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 1. المسارات الثابتة والمحددة (توضع دائماً في الأعلى) */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          
          {/* مسار تفاصيل المقال الصريح - محمي ومرفوع للأعلى لكي لا يختلط بالـ Category */}
          <Route path="/article/:id" element={<Layout><ArticleDetailPage /></Layout>} />
          
          <Route path="/search" element={<Layout><SearchPage /></Layout>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 2. مسارات الكاتب (Writer Routes) */}
          <Route path="/writer-dashboard" element={
            <WriterRoute><Layout><WriterDashboardPage /></Layout></WriterRoute>
          } />
          <Route path="/add-article" element={
            <WriterRoute><Layout><AddArticlePage /></Layout></WriterRoute>
          } />
          <Route path="/edit-article/:id" element={
            <WriterRoute><Layout><EditArticlePage /></Layout></WriterRoute>
          } />

          {/* 3. مسارات المسؤول (Admin Routes) */}
          <Route path="/admin-dashboard" element={
            <AdminRoute><Layout><AdminDashboardPage /></Layout></AdminRoute>
          } />

          {/* 4. المسار الديناميكي العام (يجبببب أن يكون في الأسفل تماماً لأنه يلتهم أي رابط بكلمتين) */}
          <Route path="/:lang/:category" element={<Layout><CategoryPage /></Layout>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}