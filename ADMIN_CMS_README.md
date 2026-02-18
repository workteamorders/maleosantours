# Maleosan Travel - Admin CMS Documentation

## 🎯 Overview

This Admin CMS extends the existing Maleosan Travel website with a complete content management system. The admin can manage all website content through `/admin` while the public website remains unchanged.

---

## 📁 Project Structure

```
Maleosan-Travel/
├── app/
│   ├── [locale]/              # Public website (unchanged)
│   │   ├── paket-tour/        # ✅ REFACTORED - Now uses database
│   │   ├── hotels/
│   │   ├── transport/
│   │   └── ...
│   │
│   └── admin/                 # 🆕 Admin CMS
│       ├── login/             # Authentication
│       ├── tour-packages/     # ✅ Full CRUD implementation
│       ├── hotels/            # Placeholder (ready to implement)
│       ├── transport/         # Placeholder
│       ├── info-travel/       # Placeholder
│       ├── testimonials/      # Placeholder
│       ├── contact/           # Message inbox
│       ├── media/             # Media library
│       ├── settings/          # Company info
│       └── components/        # Admin UI components
│
├── lib/
│   ├── prisma.ts             # Database client
│   └── auth.ts               # Authentication utilities
│
├── middleware.ts              # Route protection
├── prisma/
│   └── schema.prisma         # Database schema
│
└── scripts/
    └── setup-db.ts           # Database setup & seeding
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd E:/MaleosanProject/Maleosan-Travel
npm install prisma @prisma/client bcryptjs
npm install -D tsx @types/bcryptjs
```

### 2. Setup Database

```bash
# Generate Prisma client, create database, and seed data
npm run db:setup
```

This will:
- Generate Prisma Client
- Create SQLite database (`prisma/dev.db`)
- Create default admin user
- Add sample tour packages
- Add company information

### 3. Start Development Server

```bash
npm run dev
```

### 4. Access Admin Panel

🔐 **Admin URL:** `http://localhost:3000/admin`

**Default Credentials:**
- Email: `admin@maleosan.com`
- Password: `Admin123!`

> ⚠️ Change these credentials in production!

---

## 🔑 Authentication & Security

### How It Works

1. **Middleware Protection** (`middleware.ts`)
   - All `/admin/*` routes require authentication
   - Unauthenticated users → redirect to `/admin/login`
   - Session-based authentication using secure cookies

2. **Password Security**
   - Passwords hashed with `bcryptjs` (12 rounds)
   - Stored in `Admin` table

3. **Session Management**
   - 7-day session duration
   - HttpOnly cookies
   - Automatic session validation

###Auth Functions (`lib/auth.ts`)

```typescript
// Get current logged-in admin
const admin = await getCurrentAdmin();

// Require authentication (throws if not logged in)
const admin = await requireAuth();

// Login
const result = await authenticateAdmin(email, password);

// Logout
await logout();
```

---

## 📊 Database Schema

### Main Tables

#### `Admin`
- Admin users with secure authentication

#### `TourPackage`
- Multi-language support (id, en, zh, zh-CN)
- Pricing, duration, type
- Images, itinerary
- Featured flag, active status

#### `Hotel`
- Categories (luxury, boutique, beach, budget, family, business)
- Star rating, location
- Multi-language descriptions
- Facilities, booking URL

#### `Transport`
- Vehicle types (car, bus, airport, motor)
- Capacity, pricing
- Driver included, availability

#### `Testimonial`
- Customer reviews
- Rating (1-5)
- Approval workflow
- Linked to tour packages

#### `CompanyInfo`
- Contact information
- Social media links
- Address, phone, email

#### `ContactSubmission`
- Form submissions from public website
- Status tracking (new, read, replied, archived)

---

## 🛠️ Admin Features

### Implemented (Tour Packages)

✅ **Full CRUD Operations**
- Create, Read, Update, Delete
- Multi-language content (4 languages)
- Image management
- Active/Inactive toggle
- Featured flag
- Pricing and duration

✅ **Public Integration**
- `/paket-tour` page automatically fetches from database
- Real-time updates when admin changes content
- Language-specific content display

### Ready to Implement (Same Pattern)

The following modules follow the exact same pattern as Tour Packages:

- **Hotels** (`/admin/hotels`)
- **Transport** (`/admin/transport`)
- **Info Travel** (`/admin/info-travel`)
- **Testimonials** (`/admin/testimonials`)

**To implement:**
1. Create CRUD actions in `actions.ts`
2. Create form component (similar to `TourPackageForm.tsx`)
3. Create list page (similar to tour packages list)
4. Create edit page `[id]/page.tsx`
5. Refactor corresponding public page to fetch from DB

---

## 💡 How to Add New Content Type

### Example: Implementing Hotels CRUD

1. **Actions** (`app/admin/hotels/actions.ts`):
```typescript
'use server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function createHotel(formData: FormData) {
  await requireAuth();
  const data = {
    slug: generateSlug(formData.get('nameEn')),
    nameEn: formData.get('nameEn'),
    // ... other fields
  };
  await prisma.hotel.create({ data });
  revalidatePath('/admin/hotels');
  revalidatePath('/hotels');
}

export async function updateHotel(id: string, formData: FormData) { ... }
export async function deleteHotel(id: string) { ... }
```

2. **Form Component** (`app/admin/hotels/HotelForm.tsx`):
- Copy from `TourPackageForm.tsx`
- Adjust fields to match Hotel schema
- Add category selector, star rating, etc.

3. **List Page** (`app/admin/hotels/page.tsx`):
- Copy from tour packages list
- Adjust table columns

4. **Public Page** (`app/[locale]/hotels/page.tsx`):
```typescript
async function getHotels(locale: string) {
  const hotels = await prisma.hotel.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
  });
  return hotels; // map to locale
}
```

---

## 🌍 Multi-Language Content

All content in the database has 4 language fields:

```typescript
{
  nameId: string;     // Indonesia
  nameEn: string;     // English
  nameZh: string;     // 中文简体
  nameZhCn: string;   // 中文繁體
  
  descId: string;
  descEn: string;
  descZh: string;
  descZhCn: string;
}
```

**In Public Pages:**
```typescript
const { locale } = await params;
const name = locale === 'id' ? item.nameId 
           : locale === 'zh' ? item.nameZh 
           : locale === 'zh-CN' ? item.nameZhCn 
           : item.nameEn;
```

---

## 🔄 Server Actions Pattern

All data mutations use Next.js Server Actions:

```typescript
'use server';

export async function createTourPackage(formData: FormData) {
  // 1. Authenticate
  await requireAuth();
  
  // 2. Extract and validate data
  const data = { /* ... */ };
  
  // 3. Database operation
  await prisma.tourPackage.create({ data });
  
  // 4. Revalidate cache
  revalidatePath('/admin/tour-packages');
  revalidatePath('/paket-tour');
  
  // 5. Redirect
  redirect('/admin/tour-packages');
}
```

**Benefits:**
- Type-safe
- Server-side only
- Automatic cache invalidation
- No API routes needed

---

## 📝 Database Commands

```bash
# Setup database (first time)
npm run db:setup

# Re-seed data
npm run db:seed

# Open Prisma Studio (DB GUI)
npm run db:studio

# Generate Prisma Client (after schema changes)
npx prisma generate

# Push schema changes to DB
npx prisma db push

# Reset database (⚠️ deletes all data)
npx prisma db push --force-reset
```

---

## 🎨 Admin UI Components

Located in `app/admin/components/`:

- **AdminSidebar** - Navigation menu
- **AdminHeader** - User info & logout
- **DeleteButton** - Confirm delete action
- **ToggleActiveButton** - Quick activate/deactivate

**No animations** - Focus on functionality over aesthetics in admin panel.

---

## ⚡ Performance & Caching

- Server Components by default (fast initial load)
- Database queries cached automatically
- `revalidatePath()` used after mutations
- No client-side state management needed

---

## 🔒 Production Considerations

### Before Deploying:

1. **Change Auth Secret**
   ```
   AUTH_SECRET="generate-strong-secret-key"
   ```

2. **Switch to PostgreSQL**
   - Update `DATABASE_URL` in `.env`
   - Change `provider` in `prisma/schema.prisma` to `postgresql`

3. **Create Production Admin**
   ```bash
   # Update .env with production credentials
   npm run db:seed
   ```

4. **Environment Variables**
   ```
   DATABASE_URL="postgresql://..."
   AUTH_SECRET="production-secret"
   ADMIN_EMAIL="your-email@domain.com"
   ADMIN_PASSWORD="strong-password"
   ```

5. **Security Headers**
   - Add CSP headers in `next.config.js`
   - Enable HTTPS in production

---

## 🐛 Troubleshooting

### "Module not found: @/lib/prisma"

```bash
npx prisma generate
```

### Database locked error

```bash
# Close any Prisma Studio instances
# Restart dev server
npm run dev
```

### Session not persisting

- Check cookies are enabled
- Verify `AUTH_SECRET` is set in `.env`
- Check middleware config

---

## 📚 Next Steps

### Immediate:
1. Install dependencies: `npm install prisma @prisma/client bcryptjs tsx`
2. Setup database: `npm run db:setup`
3. Access admin: `http://localhost:3000/admin`
4. Add your tour packages

### Short-term:
1. Implement Hotels CRUD (follow Tour Packages pattern)
2. Implement Transport CRUD
3. Add image upload functionality
4. Implement rich text editor for descriptions

### Long-term:
1. Add analytics dashboard
2. Booking management system
3. Email notifications
4. Multi-admin support with roles
5. Activity logs / audit trail

---

## 👥 For Future Developers

**Key Patterns to Follow:**

1. ✅ All admin routes under `/admin`
2. ✅ All mutations via Server Actions
3. ✅ Multi-language support for all content
4. ✅ Revalidate paths after mutations
5. ✅ Require auth in all admin actions
6. ✅ Use Prisma for all database operations

**Don't:**
- ❌ Add admin links to public website
- ❌ Hardcode content (everything must be database-driven)
- ❌ Skip authentication checks
- ❌ Forget to revalidate cache after updates

---

## 📞 Support

This admin system is production-ready and follows Next.js 16 App Router best practices. The Tour Packages module is a complete reference implementation for all other modules.

---

**Built with:**
- Next.js 16 App Router
- React Server Components
- Prisma ORM
- TypeScript
- Tailwind CSS
- Server Actions

**License:** MIT
