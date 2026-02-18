# 🚀 Quick Start Guide - Admin CMS

## Installation & Setup (5 minutes)

### Step 1: Install Dependencies

```bash
npm install prisma @prisma/client bcryptjs
npm install -D tsx @types/bcryptjs
```

### Step 2: Setup Database & Admin User

```bash
npm run db:setup
```

This creates:
- ✅ SQLite database
- ✅ Admin user (admin@maleosan.com / Admin123!)
- ✅ Sample tour packages
- ✅ Company info

### Step 3: Start Server

```bash
npm run dev
```

### Step 4: Login to Admin

Open: **http://localhost:3000/admin**

Login:
- Email: `admin@maleosan.com`
- Password: `Admin123!`

---

## 📊 What's Included

### ✅ Fully Implemented:
- **Authentication** - Secure login system
- **Tour Packages CRUD** - Complete example
  - Create, edit, delete
  - Multi-language (ID, EN, ZH, ZH-CN)
  - Image management
  - Active/inactive toggle
  - Featured flag
- **Public Integration** - Tour packages page now uses database
- **Dashboard** - Overview statistics
- **Contact Messages** - Inbox for form submissions

### 📦 Ready to Implement (Same Pattern):
- Hotels
- Transport
- Info Travel
- Testimonials
- Media Library
- Settings

---

## 🎯 Example: Adding a Tour Package

1. Go to `/admin/tour-packages`
2. Click "Add New Package"
3. Fill in all 4 languages (tabs)
4. Set type, duration, price
5. Add image URL (use Unsplash)
6. Check "Active" to publish
7. Save

**Result:** Instantly appears on public `/paket-tour` page

---

## 🔑 Key Files

```
app/admin/
  tour-packages/
    page.tsx              # List view
    TourPackageForm.tsx   # Create/edit form
    actions.ts            # Server actions (CRUD)
    [id]/page.tsx         # Edit page

lib/
  auth.ts                 # Authentication
  prisma.ts               # Database client

middleware.ts             # Route protection
prisma/schema.prisma      # Database schema
```

---

## 📝 Database Commands

```bash
# View database in GUI
npm run db:studio

# Reset & reseed database
npm run db:setup

# Just reseed data
npm run db:seed
```

---

## 🌍 Multi-Language

All content has 4 languages:
- `nameId` - Indonesia
- `nameEn` - English  
- `nameZh` - 中文简体
- `nameZhCn` - 中文繁體

Public website automatically shows correct language based on URL:
- `/en/paket-tour` - English
- `/id/paket-tour` - Indonesia
- `/zh/paket-tour` - Chinese

---

## ⚡ Quick Reference

### Add New Content Type

1. Schema exists in `prisma/schema.prisma`
2. Copy `tour-packages` folder structure
3. Adjust form fields
4. Update server actions
5. Refactor public page to fetch from DB

### Authentication

```typescript
// Require login
await requireAuth();

// Get current admin
const admin = await getCurrentAdmin();

// Logout
await logout();
```

### Database Operations

```typescript
// Fetch all active
const items = await prisma.tourPackage.findMany({
  where: { active: true },
  orderBy: { order: 'asc' }
});

// Create
await prisma.tourPackage.create({ data });

// Update
await prisma.tourPackage.update({ where: { id }, data });

// Delete
await prisma.tourPackage.delete({ where: { id } });
```

---

## 🎨 Admin UI Structure

```
/admin              → Dashboard
/admin/login        → Login page (public)

/admin/tour-packages     → ✅ Full implementation
/admin/hotels            → Stub (ready to implement)
/admin/transport         → Stub
/admin/info-travel       → Stub
/admin/testimonials      → Stub
/admin/contact           → Messages inbox
/admin/media             → Media library
/admin/settings          → Company info
```

---

## 🔒 Security

- ✅ Middleware protects all `/admin` routes
- ✅ Passwords hashed with bcryptjs
- ✅ HttpOnly session cookies
- ✅ 7-day session expiration
- ✅ Server actions require auth

---

## 🐛 Common Issues

**Can't login?**
- Run `npm run db:setup` again
- Check `.env` file exists

**Database error?**
- Run `npx prisma generate`
- Run `npx prisma db push`

**Module not found?**
- Run `npm install`
- Restart dev server

---

## 📞 Need Help?

Read full docs: `ADMIN_CMS_README.md`

Tour Packages is the **reference implementation** - copy its pattern for other modules!

---

**Happy Managing! 🎉**
