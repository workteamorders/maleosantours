# Maleosan Travel - Admin Panel Documentation

## 📋 Overview

Admin Panel untuk mengelola sistem Maleosan Travel. Dibangun dengan Next.js 16, Tailwind CSS, dan berbagai library modern.

## 📁 Project Structure





```
app/admin/
├── (auth)/
│   ├── login/
│   │   └── page.tsx          # Admin login page
│   └── layout.tsx
├── (dashboard)/
│   ├── dashboard/
│   │   └── page.tsx          # Main dashboard
│   ├── hotels/
│   │   ├── page.tsx          # Hotels list
│   │   ├── create/page.tsx   # Create hotel
│   │   └── [id]/edit/page.tsx # Edit hotel
│   ├── transport/
│   │   ├── page.tsx          # Transport list
│   │   ├── create/page.tsx   # Create transport
│   │   └── [id]/edit/page.tsx # Edit transport
│   ├── paket-tour/
│   │   ├── page.tsx          # Tour packages list
│   │   ├── create/page.tsx   # Create package
│   │   └── [id]/edit/page.tsx # Edit package
│   ├── bookings/
│   │   └── page.tsx          # Bookings management
│   ├── media/
│   │   └── page.tsx          # Media library
│   ├── users/
│   │   └── page.tsx          # Users management
│   ├── settings/
│   │   └── page.tsx          # System settings
│   └── layout.tsx            # Dashboard layout dengan sidebar & navbar

components/
├── admin/
│   ├── Sidebar.tsx           # Navigation sidebar
│   ├── Navbar.tsx            # Top navbar dengan profile
│   └── DataTable.tsx         # Reusable data table
└── forms/
    ├── ImageUpload.tsx       # Image uploader component
    ├── HotelForm.tsx         # Hotel form
    ├── TransportForm.tsx     # Transport form
    └── PaketTourForm.tsx     # Package tour form

src/
├── store/
│   ├── authStore.ts          # Auth store dengan Zustand
├── hooks/
│   ├── useAuth.ts            # Auth hooks
├── services/
│   ├── api.ts                # API client dengan Axios
├── types/
│   └── index.ts              # Type definitions
└── context/
    └── (untuk future context API)
```

## 🚀 Features

### Authentication
- Login dengan email & password
- JWT token management
- Protected routes
- Role-based access control
- Auto logout on token expiry

### Dashboard
- Overview statistics (Hotels, Transport, Tours, Bookings)
- Revenue charts
- Booking trends
- Recent bookings
- Performance metrics

### Hotel Management
- ✅ List hotels dengan pagination
- ✅ Create hotel dengan image upload
- ✅ Edit hotel details
- ✅ Delete hotel
- ✅ Search & filter

### Transport Management
- ✅ List transportation dengan status
- ✅ Create transport vehicle
- ✅ Edit vehicle info & driver details
- ✅ Delete transport
- ✅ Image upload untuk vehicle

### Paket Tour Management
- ✅ List tour packages
- ✅ Create package dengan itinerary
- ✅ Edit package details
- ✅ Delete package
- ✅ Multi-image support

### Booking Management
- ✅ List all bookings dengan filter
- ✅ Filter by status (pending, confirmed, completed, cancelled)
- ✅ Export bookings (stub)
- ✅ Payment status tracking

### Media Library
- ✅ Upload images dengan drag & drop
- ✅ Grid/List view toggle
- ✅ Copy image URL
- ✅ Delete images
- ✅ Image preview

### User Management
- ✅ List admin users
- ✅ Role-based display (Super Admin, Admin, Editor)
- ✅ User creation (stub)
- ✅ User deletion

### Settings
- ✅ Company information
- ✅ Default currency
- ✅ Timezone
- ✅ Notification preferences

## 🛠 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Buat file `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Run Development Server
```bash
npm run dev
```

Akses di `http://localhost:3000/admin/login`

### 4. Login Credentials (Demo)
- Email: `admin@maleosan.com`
- Password: `password123`

## 📦 Dependencies

### Frontend
- **next**: 16.1.6 - React framework
- **react**: 19.2.4 - UI library
- **tailwindcss**: 4.1.18 - Styling
- **react-hook-form**: 7.52.2 - Form management
- **zod**: 3.23.8 - Validation
- **zustand**: 4.5.5 - State management
- **axios**: 1.7.7 - HTTP client
- **recharts**: 2.12.7 - Charts
- **react-hot-toast**: 2.4.1 - Notifications
- **lucide-react**: 0.563.0 - Icons
- **framer-motion**: 12.34.0 - Animations

### Dev Dependencies
- **typescript**: 5.9.3
- **eslint**: 9.39.2
- **@tailwindcss/postcss**: 4.1.18

## 🔐 Authentication Flow

1. User login di `/admin/login`
2. API authenticate credentials
3. Server return JWT token + user data
4. Token disimpan di localStorage
5. Token attached ke semua API requests
6. Protected routes check auth state

## 📊 API Integration

Semua API endpoints sudah ter-setup di `src/services/api.ts`:

```typescript
// Examples
apiClient.login(credentials)
apiClient.getHotels(page, limit, search)
apiClient.createHotel(data)
apiClient.updateHotel(id, data)
apiClient.deleteHotel(id)
apiClient.uploadMedia(file, folder)
// ... dan banyak lagi
```

## 🎨 UI Components

### DataTable
Reusable table component dengan:
- Customizable columns
- Pagination
- Loading states
- Action buttons

### ImageUpload
Image uploader dengan:
- Drag & drop support
- File validation
- Preview
- Size limit

### Forms
Form management dengan:
- React Hook Form
- Zod validation
- Error handling
- Loading states

## 📝 Next Steps

1. **Backend Setup**
   - Setup Node.js + Express server
   - Setup database (MongoDB/PostgreSQL)
   - Implement authentication endpoints
   - Implement CRUD endpoints

2. **Integration**
   - Update API_URL di .env.local
   - Configure CORS
   - Setup JWT middleware

3. **Features to Complete**
   - Itinerary editor untuk paket tour
   - Advanced booking management
   - Report generation
   - Email notifications
   - SMS integration

4. **Production**
   - Deploy frontend (Vercel/Netlify)
   - Deploy backend (Railway/Heroku)
   - Setup SSL certificates
   - Configure CDN

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### Dependencies conflict
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build errors
```bash
npm run build
```

## 📞 Support

Untuk pertanyaan atau issues, silakan hubungi tim development.

---

**Last Updated**: February 16, 2026
**Version**: 1.0.0
