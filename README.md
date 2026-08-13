# Maleosan Travel & Tours

Website resmi **Maleosan Travel** — Travel & Tour Operator di Manado, Sulawesi Utara. Website publik multibahasa + Admin CMS untuk mengelola konten.

## Fitur

### Website Publik
- Beranda dengan hero, destinasi, jurnal, **section kontak** (telepon, WhatsApp, email, alamat, sosmed, QR WeChat/KakaoTalk)
- Halaman paket tour, hotel, transportasi, info travel, testimoni, kontak
- Multibahasa: Indonesia (`/id`), English (`/en`), 中文简体 (`/zh`), 中文繁體 (`/zh-CN`)

### Admin CMS (`/admin`)
- Login aman (bcrypt + session cookie HttpOnly)
- CRUD paket tour, hotel, transportasi, testimoni (multibahasa)
- Manajemen beranda (hero, destinasi, jurnal)
- Info perusahaan & kontak (data dipakai otomatis di beranda dan footer)
- Pesan kontak, media library, admin users

## Tech Stack

- **Framework**: Next.js 16 (App Router, server actions)
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: MySQL + Prisma ORM
- **Animasi**: GSAP, Framer Motion, Lenis
- **i18n**: next-intl (4 bahasa)
- **Form**: React Hook Form + Zod
- **Lainnya**: Zustand, Recharts, Cloudinary

## Prasyarat

- Node.js 18+
- MySQL berjalan (lokal / XAMPP / Laragon / Homebrew)

## Setup Lokal

```bash
# 1. Install dependencies
npm install

# 2. Buat file environment
cp .env.example .env
# Sesuaikan DATABASE_URL, contoh: mysql://root:@localhost:3306/maleosan_travel

# 3. Buat database (pastikan sudah dibuat)
mysql -u root -e "CREATE DATABASE IF NOT EXISTS maleosan_travel;"

# 4. Setup tabel + seed data (admin, contoh data)
npm run db:setup

# 5. Jalankan dev server
npm run dev
```

Buka **http://localhost:3000** (website) dan **http://localhost:3000/admin** (admin).

### Kredensial Login Admin

| Role  | Email              | Password   |
|-------|--------------------|------------|
| Admin | admin@maleosan.com | Admin123!  |
| Boss  | boss@maleosan.com  | Boss123!   |

## Script

| Command           | Fungsi                                          |
|-------------------|-------------------------------------------------|
| `npm run dev`     | Jalankan development server                     |
| `npm run build`   | Generate Prisma client + build production       |
| `npm start`       | Jalankan production server                      |
| `npm run db:setup`| Generate, push schema, dan seed data            |
| `npm run db:seed` | Seed ulang data                                 |
| `npm run db:studio` | Buka Prisma Studio (GUI database)             |
| `npm run lint`    | Jalankan ESLint                                 |

## Struktur Proyek

```
├── app/
│   ├── [locale]/              # Website publik (multibahasa)
│   │   ├── page.tsx           # Beranda
│   │   ├── paket-tour/        # Paket tour
│   │   ├── hotels/            # Hotel & resort
│   │   ├── transport/         # Transportasi
│   │   ├── info-travel/       # Panduan wisata
│   │   ├── testimoni/         # Testimoni
│   │   └── kontak/            # Halaman kontak
│   ├── admin/                 # Admin CMS
│   └── api/                   # API routes (company-info, homepage, dll)
├── components/                # Komponen publik & admin
├── messages/                  # File terjemahan (id, en, zh, zh-CN)
├── i18n/                      # Konfigurasi next-intl
├── prisma/schema.prisma       # Skema database
├── lib/                       # Utilitas (prisma, auth, seo, dll)
├── scripts/                   # Script setup & seed
└── public/                    # Aset statis
```

## Mengelola Info Kontak (Beranda & Footer)

Info kontak yang tampil di beranda dan footer diambil otomatis dari database:

1. Login ke `/admin`
2. Buka menu **Settings** → **Info Perusahaan**
3. Ubah nomor telepon, WhatsApp, email, alamat, sosmed, atau link Google Maps
4. Simpan — perubahan langsung tampil di beranda dan footer

## Kustomisasi Beranda

- **Hero, destinasi, jurnal**: kelola lewat `/admin/homepage`
- **Section kontak**: komponen `components/ContactSection.tsx`, muncul di antara Jurnal dan Footer

## Bahasa

URL menggunakan prefix locale:

| URL           | Bahasa          |
|---------------|-----------------|
| `/id`         | Bahasa Indonesia|
| `/en`         | English         |
| `/zh`         | 中文简体         |
| `/zh-CN`      | 中文繁體         |

## Troubleshooting

**Tidak bisa login?**
```bash
npm run db:setup
```

**Error database?**
```bash
npm run db:generate
npm run db:push
```

**Module not found?**
```bash
npm install
```

## Lisensi

Hak cipta © 2026 Maleosan Travel. Seluruh hak dilindungi.
