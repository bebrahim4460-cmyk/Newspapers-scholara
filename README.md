# ScholarPress — Multilingual Student Newspaper

A production-ready multilingual student newspaper web application built with React.js, Tailwind CSS, and Firebase.

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable these services:
   - **Authentication** → Email/Password
   - **Firestore Database** → Start in production mode
   - **Storage** → Start in production mode
4. Copy your config from Project Settings → General → Your apps

### 3. Configure Firebase

Edit `src/firebase/config.js` and replace with your actual Firebase config:

```js
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 4. Deploy Firebase Rules & Indexes

```bash
npm install -g firebase-tools
firebase login
firebase init  # Select Firestore, Storage, Hosting
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
firebase deploy --only storage
```

### 5. Start Development

```bash
npm start
```

### 6. Build & Deploy

```bash
npm run build
firebase deploy --only hosting
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.js          # Sticky navbar with search, language switcher
│   ├── Footer.js          # Site footer
│   ├── ArticleCard.js     # Featured/large/normal card variants
│   └── ProtectedRoute.js  # Auth guards (Admin, Writer, User)
├── context/
│   └── AuthContext.js     # Firebase auth + user role state
├── firebase/
│   └── config.js          # Firebase initialization
├── i18n/
│   └── index.js           # i18next config (EN/AR/TR)
├── pages/
│   ├── HomePage.js        # Editorial newspaper homepage
│   ├── CategoryPage.js    # Articles by category + language
│   ├── ArticleDetailPage.js
│   ├── AuthPages.js       # Login + Register
│   ├── WriterDashboardPage.js
│   ├── AddArticlePage.js  # Create/edit articles
│   ├── EditArticlePage.js
│   ├── AdminDashboardPage.js
│   └── SearchPage.js
├── services/
│   ├── articleService.js  # Firestore CRUD for articles
│   └── userService.js     # User management
└── styles/
    └── index.css          # Tailwind + Google Fonts
```

---

## 🔐 Roles & Permissions

| Feature | Guest | User | Writer | Admin |
|---------|-------|------|--------|-------|
| Browse articles | ✅ | ✅ | ✅ | ✅ |
| Search | ✅ | ✅ | ✅ | ✅ |
| Switch languages | ✅ | ✅ | ✅ | ✅ |
| Create articles | ❌ | ❌ | ✅ | ✅ |
| Edit own articles | ❌ | ❌ | ✅ | ✅ |
| Approve/reject | ❌ | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ❌ | ✅ |
| Delete any article | ❌ | ❌ | ❌ | ✅ |

### Creating Your First Admin

1. Register normally through the app
2. In Firebase Console → Firestore → users collection
3. Find your user document
4. Change `role` from `"user"` to `"admin"`
5. Refresh the app — Admin Dashboard link will appear

---

## 📰 Article Categories

| Category | Image Required | Languages |
|----------|---------------|-----------|
| Explained | ✅ Yes | EN / AR / TR |
| Opinion | ✅ Yes | EN / AR / TR |
| Scientific Research | ❌ No | EN / AR / TR |

---

## 🌐 URL Structure

```
/                          → Home (shows EN articles by default)
/:lang/:category           → Category page
  /en/explained
  /ar/opinion
  /tr/scientific-research
/article/:id               → Article detail
/search?q=term&lang=en     → Search results
/login                     → Login
/register                  → Register
/writer-dashboard          → Writer panel
/add-article               → Create article
/edit-article/:id          → Edit article
/admin-dashboard           → Admin panel
```

---

## 🌍 Language System

Two separate language systems:

1. **UI Language** (i18next) — Controls navbar, buttons, labels
   - Set via language switcher in navbar
   - Persisted in localStorage

2. **Article Language** (Firestore field) — The language the article is written in
   - `en` | `ar` | `tr`
   - Articles are NOT translations — each language has unique content
   - Switch via the `EN/AR/TR` buttons in navbar or language tabs on homepage

---

## 🗄️ Firestore Schema

### `users` collection
```json
{
  "uid": "firebase-auth-uid",
  "name": "Ahmed Yilmaz",
  "email": "ahmed@example.com",
  "role": "writer",       // user | writer | admin
  "createdAt": "timestamp"
}
```

### `articles` collection
```json
{
  "title": "Article Title",
  "content": "Full article text...",
  "language": "ar",                    // en | ar | tr
  "category": "explained",             // explained | opinion | scientific-research
  "status": "pending",                 // pending | approved | rejected
  "authorId": "firebase-auth-uid",
  "authorName": "Ahmed Yilmaz",
  "imageUrl": "https://storage.url/...",  // empty for scientific-research
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

---

## 🔒 Security Rules Summary

- **Firestore**: Public read for `approved` articles; writers create as `pending`; admins can approve/reject/delete
- **Storage**: Writers/admins upload images ≤5MB; public read; admin-only delete

---

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.22.0",
  "firebase": "^10.8.0",
  "i18next": "^23.10.0",
  "react-i18next": "^14.1.0",
  "i18next-browser-languagedetector": "^7.2.0",
  "tailwindcss": "^3.x"
}
```

---

## 🎨 Design System

- **Font**: Playfair Display (serif) + DM Sans (body) + JetBrains Mono (labels)
- **Primary color**: Navy blue (#1a2f5e)
- **Accent**: Red (#e63946)
- **Background**: Cream (#faf8f4)
- **Style**: Editorial newspaper, clean & minimal

---

## 📝 Notes

- Firestore doesn't support full-text search — the search feature loads up to 100 recent articles and filters client-side. For production, consider Algolia or Typesense.
- Deploy Firestore indexes before going live (`firebase deploy --only firestore:indexes`)
- Set CORS on Firebase Storage if images don't load
