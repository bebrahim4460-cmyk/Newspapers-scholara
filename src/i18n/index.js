// src/i18n/index.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Nav
      home: 'Home',
      categories: 'Categories',
      search: 'Search',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      dashboard: 'Dashboard',
      adminDashboard: 'Admin Dashboard',
      writerDashboard: 'Writer Dashboard',

      // Categories
      explained: 'Explained',
      opinion: 'Opinion',
      scientificResearch: 'Scientific Research',

      // Auth
      email: 'Email',
      password: 'Password',
      name: 'Full Name',
      role: 'Role',
      loginTitle: 'Welcome Back',
      loginSubtitle: 'Sign in to your account',
      registerTitle: 'Create Account',
      registerSubtitle: 'Join our community of writers',
      noAccount: "Don't have an account?",
      haveAccount: 'Already have an account?',
      signUp: 'Sign Up',
      signIn: 'Sign In',

      // Articles
      readMore: 'Read More',
      publishedOn: 'Published on',
      by: 'by',
      latestArticles: 'Latest Articles',
      featuredArticle: 'Featured Article',
      noArticles: 'No articles found',
      searchPlaceholder: 'Search articles...',
      searchResults: 'Search Results',

      // Writer
      createArticle: 'Create Article',
      myArticles: 'My Articles',
      articleTitle: 'Article Title',
      articleContent: 'Article Content',
      articleLanguage: 'Language',
      articleCategory: 'Category',
      uploadImage: 'Upload Image',
      submit: 'Submit for Review',
      status: 'Status',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      edit: 'Edit',

      // Admin
      pendingArticles: 'Pending Articles',
      approve: 'Approve',
      reject: 'Reject',
      delete: 'Delete',
      manageUsers: 'Manage Users',
      allArticles: 'All Articles',
      confirmDelete: 'Are you sure you want to delete this?',

      // Roles
      user: 'Reader',
      writer: 'Writer',
      admin: 'Admin',
      guest: 'Guest',

      // Language names
      arabic: 'Arabic',
      english: 'English',
      turkish: 'Turkish',

      // Misc
      loading: 'Loading...',
      error: 'Something went wrong',
      save: 'Save',
      cancel: 'Cancel',
      back: 'Back',
      next: 'Next',
    }
  },
  ar: {
    translation: {
      home: 'الرئيسية',
      categories: 'التصنيفات',
      search: 'بحث',
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      logout: 'تسجيل الخروج',
      dashboard: 'لوحة التحكم',
      adminDashboard: 'لوحة الإدارة',
      writerDashboard: 'لوحة الكاتب',

      explained: 'شرح وتحليل',
      opinion: 'رأي',
      scientificResearch: 'بحث علمي',
      culture: 'ثقافة وفنون',

      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      name: 'الاسم الكامل',
      role: 'الدور',
      loginTitle: 'مرحباً بعودتك',
      loginSubtitle: 'سجل دخولك إلى حسابك',
      registerTitle: 'إنشاء حساب',
      registerSubtitle: 'انضم إلى مجتمع الكتّاب',
      noAccount: 'ليس لديك حساب؟',
      haveAccount: 'لديك حساب بالفعل؟',
      signUp: 'إنشاء حساب',
      signIn: 'تسجيل الدخول',

      readMore: 'اقرأ المزيد',
      publishedOn: 'نُشر في',
      by: 'بقلم',
      latestArticles: 'أحدث المقالات',
      featuredArticle: 'المقالة المميزة',
      noArticles: 'لا توجد مقالات',
      searchPlaceholder: 'ابحث في المقالات...',
      searchResults: 'نتائج البحث',

      createArticle: 'كتابة مقال',
      myArticles: 'مقالاتي',
      articleTitle: 'عنوان المقال',
      articleContent: 'محتوى المقال',
      articleLanguage: 'اللغة',
      articleCategory: 'التصنيف',
      uploadImage: 'رفع صورة',
      submit: 'إرسال للمراجعة',
      status: 'الحالة',
      pending: 'قيد المراجعة',
      approved: 'موافق عليه',
      rejected: 'مرفوض',
      edit: 'تعديل',

      pendingArticles: 'المقالات المعلقة',
      approve: 'قبول',
      reject: 'رفض',
      delete: 'حذف',
      manageUsers: 'إدارة المستخدمين',
      allArticles: 'جميع المقالات',
      confirmDelete: 'هل أنت متأكد من الحذف؟',

      user: 'قارئ',
      writer: 'كاتب',
      admin: 'مدير',
      guest: 'زائر',

      arabic: 'العربية',
      english: 'الإنجليزية',
      turkish: 'التركية',

      loading: 'جارٍ التحميل...',
      error: 'حدث خطأ ما',
      save: 'حفظ',
      cancel: 'إلغاء',
      back: 'رجوع',
      next: 'التالي',
    }
  },
  tr: {
    translation: {
      home: 'Ana Sayfa',
      categories: 'Kategoriler',
      search: 'Ara',
      login: 'Giriş Yap',
      register: 'Kayıt Ol',
      logout: 'Çıkış Yap',
      dashboard: 'Panel',
      adminDashboard: 'Yönetici Paneli',
      writerDashboard: 'Yazar Paneli',

      explained: 'Açıklama',
      opinion: 'Görüş',
      scientificResearch: 'Bilimsel Araştırma',
      culture: 'Kültür ve Sanat',

      email: 'E-posta',
      password: 'Şifre',
      name: 'Ad Soyad',
      role: 'Rol',
      loginTitle: 'Tekrar Hoşgeldiniz',
      loginSubtitle: 'Hesabınıza giriş yapın',
      registerTitle: 'Hesap Oluştur',
      registerSubtitle: 'Yazar topluluğumuza katılın',
      noAccount: 'Hesabınız yok mu?',
      haveAccount: 'Zaten hesabınız var mı?',
      signUp: 'Kayıt Ol',
      signIn: 'Giriş Yap',

      readMore: 'Devamını Oku',
      publishedOn: 'Yayın tarihi:',
      by: 'Yazan:',
      latestArticles: 'Son Makaleler',
      featuredArticle: 'Öne Çıkan Makale',
      noArticles: 'Makale bulunamadı',
      searchPlaceholder: 'Makalelerde ara...',
      searchResults: 'Arama Sonuçları',

      createArticle: 'Makale Yaz',
      myArticles: 'Makalelerim',
      articleTitle: 'Makale Başlığı',
      articleContent: 'Makale İçeriği',
      articleLanguage: 'Dil',
      articleCategory: 'Kategori',
      uploadImage: 'Resim Yükle',
      submit: 'İncelemeye Gönder',
      status: 'Durum',
      pending: 'Beklemede',
      approved: 'Onaylandı',
      rejected: 'Reddedildi',
      edit: 'Düzenle',

      pendingArticles: 'Bekleyen Makaleler',
      approve: 'Onayla',
      reject: 'Reddet',
      delete: 'Sil',
      manageUsers: 'Kullanıcı Yönetimi',
      allArticles: 'Tüm Makaleler',
      confirmDelete: 'Silmek istediğinizden emin misiniz?',

      user: 'Okuyucu',
      writer: 'Yazar',
      admin: 'Yönetici',
      guest: 'Misafir',

      arabic: 'Arapça',
      english: 'İngilizce',
      turkish: 'Türkçe',

      loading: 'Yükleniyor...',
      error: 'Bir şeyler yanlış gitti',
      save: 'Kaydet',
      cancel: 'İptal',
      back: 'Geri',
      next: 'İleri',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
