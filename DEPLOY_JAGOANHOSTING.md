# Cara Upload Next.js ke Hosting cPanel (Jagoan Hosting)

## Prasyarat
- Node.js 18+ sudah terinstall di lokal
- Akun Jagoan Hosting dengan plan yang support Node.js (misal: ID SUPERSTAR)
- MySQL database sudah disiapkan di cPanel

---

## Langkah 1 — Pastikan Next.js Berjalan di Localhost

Jalankan dev server untuk memastikan tidak ada error:

```powershell
cd "e:\Orders\Project\Maleosan Tours & Travel\Maleosan-Travel"
node node_modules/next/dist/bin/next dev
```

Buka `http://localhost:3000` dan pastikan semua halaman berjalan normal.

---

## Langkah 2 — File `server.cjs` (Sudah Ada)

File `server.cjs` sudah dibuat di root project. Isinya menggunakan CommonJS (`require`) dengan port **8080** sesuai requirement Jagoan Hosting:

```js
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 8080

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
```

> ⚠️ File ini bernama `server.cjs` (bukan `server.js`) karena project menggunakan `"type": "module"` di `package.json`.

---

## Langkah 3 — Script `package.json` (Sudah Diupdate)

Pastikan bagian `scripts` di `package.json` sudah seperti ini:

```json
"scripts": {
  "build": "next build",
  "start": "NODE_ENV=production node server.cjs"
}
```

---

## Langkah 4 — Build Project

Hentikan dev server jika masih berjalan, lalu jalankan build:

```powershell
cd "e:\Orders\Project\Maleosan Tours & Travel\Maleosan-Travel"
node node_modules/next/dist/bin/next build
```

Tunggu hingga proses build selesai. Pastikan tidak ada error. Folder `.next/` akan terbentuk.

---

## Langkah 5 — Buat File `.env` untuk Production

Buat file `.env` (jangan commit ke git) dengan isi berikut, sesuaikan dengan kredensial database di cPanel:

```env
DATABASE_URL="mysql://cpanel_username_dbuser:password@localhost:3306/cpanel_username_dbname"
NODE_ENV=production
NEXTAUTH_SECRET=isi_dengan_random_string_panjang
NEXTAUTH_URL=https://domainanda.com
```

---

## Langkah 6 — Compress Semua File ke ZIP

Compress **semua file dan folder** project ke format `.zip`, **termasuk `node_modules/`** dan folder `.next/`.

**Yang harus ada di dalam ZIP:**
```
Maleosan-Travel/
├── .next/           ← hasil build (WAJIB ADA)
├── node_modules/    ← dependencies (WAJIB ADA)
├── app/
├── components/
├── lib/
├── prisma/
├── public/
├── server.cjs       ← startup file
├── package.json
├── next.config.js
├── .env             ← isi dengan kredensial production
└── ... (semua file lainnya)
```

> ⚠️ Jangan lupa sertakan file `.env` yang sudah diisi dengan `DATABASE_URL` production.

---

## Langkah 7 — Login cPanel dan Setup Node.js App

1. Login ke cPanel Jagoan Hosting
2. Cari menu **"Setup Node.js App"**
3. Klik **"Create Application"**
4. Isi konfigurasi:
   - **Node.js version**: 18.x atau 20.x
   - **Application mode**: Production
   - **Application root**: path folder upload (misal: `public_html/maleosan`)
   - **Application URL**: pilih domain/subdomain
   - **Application startup file**: `server.cjs`
5. Klik **Create**

---

## Langkah 8 — Upload File ZIP ke File Manager

1. Buka **File Manager** di cPanel
2. Masuk ke folder yang sudah ditentukan di Langkah 7 (misal: `public_html/maleosan`)
3. Upload file `.zip`
4. Klik kanan file ZIP → **Extract**
5. Pastikan semua file terekstrak dengan benar

---

## Langkah 9 — Jalankan npm install via Terminal cPanel

1. Kembali ke menu **"Setup Node.js App"**
2. Copy **path virtual environment** yang ada di halaman tersebut

   Contoh: `source /home/username/nodevenv/public_html/maleosan/18/bin/activate && cd /home/username/public_html/maleosan`

3. Buka **Terminal** di cPanel
4. Paste command tersebut dan tekan **Enter**
5. Setelah aktif, jalankan:

```bash
npm install
```

6. Tunggu hingga selesai

---

## Langkah 10 — Setup Database MySQL di cPanel

1. cPanel → **MySQL Databases**
2. Buat database baru (misal: `username_maleosan`)
3. Buat user MySQL baru dan assign ke database dengan **ALL PRIVILEGES**
4. Import file SQL yang sudah diexport dari phpMyAdmin lokal:
   - Buka **phpMyAdmin** di cPanel
   - Pilih database yang baru dibuat
   - Tab **Import** → upload file `.sql` → klik **Go**

---

## Langkah 11 — Restart Node.js App

1. Kembali ke menu **"Setup Node.js App"** di cPanel
2. Temukan aplikasi yang sudah dibuat
3. Klik tombol **Restart**

---

## Langkah 12 — Selesai!

Buka URL domain/subdomain yang sudah dikonfigurasi. Jika tampilan sama seperti di localhost, deployment berhasil! 🎉

---

## Troubleshooting

### Website error / tidak bisa dibuka
- Cek log di terminal cPanel: `cat /home/username/nodevenv/logs/...`
- Pastikan file `.env` sudah ada dan `DATABASE_URL` benar

### Error `Cannot find module`
- Jalankan ulang `npm install` via terminal cPanel

### Database connection error
- Pastikan nama user, password, dan nama database di `DATABASE_URL` sesuai dengan yang dibuat di cPanel MySQL Databases
- Format: `mysql://cpanel_user_dbuser:password@localhost:3306/cpanel_user_dbname`

### Halaman admin tidak bisa login
- Pastikan tabel `Admin` sudah ada di database (dari hasil import SQL)
- Password admin: `password123` (sesuai yang di-setup di lokal)

---

## Catatan Penting

| Item | Nilai |
|------|-------|
| Startup file | `server.cjs` |
| Port | `8080` (otomatis dari env cPanel) |
| Node.js version | 18.x+ |
| Database | MySQL |
| Admin email | `admin@maleosan.com` |
| Admin password | `password123` |
