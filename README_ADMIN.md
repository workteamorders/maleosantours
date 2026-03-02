# Maleosan Travel - Website & Admin Panel

Sistem lengkap untuk **Maleosan Travel** - Travel & Tour Operator di Manado.

## 📚 Project Overview

Proyek ini terdiri dari dua bagian utama:




1. **Public Website** (`/app/[locale]/`)
   - Landing page dengan hero section
   - Halaman hotels, transport, paket tour
   - Multilingual support (ID, EN, ZH, ZH-CN)
   - Booking form

2. **Admin Panel** (`/app/admin/`)
   - Dashboard dengan analytics
   - CRUD management untuk hotels, transport, paket tour
   - Booking management
   - Media library
   - User & system settings

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm atau yarn

### Installation

```bash
# Clone repository
git clone <repo-url>

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Run development server
npm run dev
```

### Access URLs
- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login

### Demo Login
```
Email: admin@maleosan.com
Password: password123
```

## 📁 Project Structure

```
maleosan-travel/
├── app/
│   ├── [locale]/                    # Public website (multilingual)
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Homepage
│   │   ├── hotels/
│   │   ├── transport/
│   │   ├── paket-tour/
│   │   ├── info-travel/
│   │   ├── testimoni/
│   │   └── kontak/
│   ├── admin/                       # Admin panel
│   │   ├── (auth)/login/            # Login page
│   │   └── (dashboard)/             # Admin pages
│   ├── globals.css
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Root homepage redirect
├── components/
│   ├── admin/                       # Admin components
│   ├── forms/                       # Reusable forms
│   └── (public components)          # Website components
├── src/
│   ├── store/                       # Zustand stores
│   ├── hooks/                       # Custom hooks
│   ├── services/                    # API client
│   ├── types/                       # TypeScript types
│   └── context/                     # React context
├── i18n/                            # i18n configuration
├── messages/                        # Translation files
├── public/                          # Static files
├── .env.local                       # Environment variables
├── package.json
└── tsconfig.json

```

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React, Framer Motion
- **Animation**: GSAP, Lenis
- **Forms**: React Hook Form + Zod
- **State**: Zustand
- **HTTP**: Axios
- **Charts**: Recharts
- **Internationalization**: next-intl

### Development
- **Build Tool**: Next.js
- **Package Manager**: npm
- **Linter**: ESLint
- **PostCSS**: Tailwind CSS

## 📋 Features

### Public Website
- ✅ Responsive design (mobile-first)
- ✅ Multilingual support
- ✅ Hero animations
- ✅ Smooth scrolling
- ✅ Hotel listings
- ✅ Transport options
- ✅ Tour packages
- ✅ Testimonials
- ✅ Contact form

### Admin Panel
- ✅ Authentication (JWT)
- ✅ Dashboard with charts
- ✅ Hotel CRUD
- ✅ Transport CRUD
- ✅ Tour packages CRUD
- ✅ Booking management
- ✅ Media library (image upload)
- ✅ User management
- ✅ System settings
- ✅ Data export

## 🔐 Security Features

- JWT-based authentication
- Protected API routes
- Role-based access control
- Secure token storage
- CORS configuration
- Input validation with Zod

## 📱 Responsive Design

Website fully responsive untuk:
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)
- Large screens (1280px+)

## 🌍 Multilingual Support

Supported languages:
- 🇮🇩 Indonesian (id)
- 🇬🇧 English (en)
- 🇨🇳 Chinese Simplified (zh)
- 🇹🇼 Chinese Traditional (zh-CN)

## 📊 Admin Dashboard

Dashboard menampilkan:
- Total hotels, transport, tours
- Total bookings dan revenue
- Revenue trend chart
- Booking analytics
- Recent bookings list
- Performance metrics

## 🎯 Getting Started with Admin

1. Go to `/admin/login`
2. Login with demo credentials
3. Navigate using sidebar menu
4. Manage content

### Admin Flow
```
Login → Dashboard → Select Module → View/Create/Edit/Delete → Save
```

## 🔄 API Integration

Admin panel siap terintegrasi dengan backend API:

```javascript
// API endpoint configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Available API methods di `src/services/api.ts`:
- Authentication
- Hotels CRUD
- Transport CRUD
- Paket Tours CRUD
- Bookings management
- Media upload

## 📦 Build & Deploy

### Build untuk production
```bash
npm run build
npm start
```

### Build output optimization
```bash
npm run build -- --debug
```

## 🚨 Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Production
# NEXT_PUBLIC_API_URL=https://api.maleosan.com/api
```

## 📝 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow Tailwind CSS naming conventions
- Use React hooks patterns
- Implement error boundaries

### Component Structure
```typescript
'use client'; // For client components

import { useState } from 'react';

export default function ComponentName() {
  const [state, setState] = useState('');
  
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

### Form Handling
```typescript
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

## 🐛 Common Issues

### CORS Errors
- Ensure backend CORS is configured
- Check API_URL in .env.local

### Authentication Issues
- Clear localStorage
- Re-login
- Check token validity

### Build Errors
```bash
# Clear build cache
rm -rf .next
npm run build
```

## 📚 Documentation

- [Admin Panel Docs](./ADMIN_DOCUMENTATION.md)
- [API Documentation](./API.md) - (to be created)
- [Deployment Guide](./DEPLOYMENT.md) - (to be created)

## 👥 Team

- **Design**: UI/UX Team
- **Frontend**: Web Development Team
- **Backend**: API Development Team

## 📞 Support & Contact

- Email: dev@maleosan.com
- Issues: GitHub Issues
- Status: [Status Page](https://status.maleosan.com)

## 📄 License

All rights reserved © 2026 Maleosan Travel

## 🎉 Acknowledgments

Built with ❤️ using modern web technologies.

---

**Last Updated**: February 16, 2026  
**Current Version**: 1.0.0  
**Status**: ✅ Admin Panel Complete
