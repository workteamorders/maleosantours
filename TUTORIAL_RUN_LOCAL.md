# Tutorial: Menjalankan Maleosan Travel Secara Lokal

## Prasyarat


Pastikan sudah terinstall di komputer Anda:

- **Node.js** (v18 atau lebih baru) — cek dengan perintah `node -v`
- **MySQL** — database harus aktif (gunakan XAMPP, Laragon, atau MySQL langsung)
- **Git** (opsional, untuk clone/pull repository)

--


## Langkah-langkah

### 1. Buka Terminal

Buka **PowerShell** atau **Command Prompt** di Windows.

### 2. Masuk ke Folder Project

```powershell
cd "e:\Orders\Project\Maleosan Tours & Travel\Maleosan-Travel"
```

### 3. Install Dependencies

Jalankan perintah ini (hanya perlu sekali, atau jika ada perubahan package):

```powershell
npm install
```

Tunggu hingga selesai. Ini akan menginstall semua package yang dibutuhkan.

### 4. Setup Database (Hanya Pertama Kali)

Pastikan MySQL sudah berjalan, lalu jalankan:

```powershell
npx prisma db push
```

Ini akan membuat tabel-tabel yang dibutuhkan di database.

### 5. Jalankan Dev Server

> **⚠️ PENTING:** Karena nama folder mengandung karakter `&` ("Maleosan Tours **&** Travel"), perintah `npm run dev` bisa error di Windows. Gunakan perintah ini sebagai gantinya:

```powershell
node node_modules/next/dist/bin/next dev
```

Tunggu sampai muncul pesan:

```
✓ Ready in ...s
- Local: http://localhost:3000
```

### 6. Buka Browser

Buka browser dan akses: **http://localhost:3000**

---

## Perintah Ringkas (Copy-Paste)

Untuk menjalankan dengan cepat, copy-paste semua perintah ini sekaligus:

```powershell
cd "e:\Orders\Project\Maleosan Tours & Travel\Maleosan-Travel"
node node_modules/next/dist/bin/next dev
```

---

## Troubleshooting

### Port 3000 Sudah Dipakai

Jika muncul error bahwa port 3000 sudah digunakan:

```powershell
# Matikan semua proses Node.js yang sedang berjalan
Get-Process -Name "node" | Stop-Process -Force

# Hapus lock file
Remove-Item ".next\dev\lock" -ErrorAction SilentlyContinue

# Jalankan ulang
node node_modules/next/dist/bin/next dev
```

### Error "Module not found"

Jika ada error module tidak ditemukan, jalankan install ulang:

```powershell
npm install
```

Lalu jalankan dev server lagi.

### Error Database / Prisma

Jika ada error terkait database:

1. Pastikan MySQL sudah berjalan
2. Cek file `.env` — pastikan `DATABASE_URL` sudah benar
3. Jalankan ulang: `npx prisma db push`

### Lock File Error

Jika muncul error terkait lock file saat menjalankan server:

```powershell
Remove-Item ".next\dev\lock" -ErrorAction SilentlyContinue
node node_modules/next/dist/bin/next dev
```

---

## Menghentikan Server

Tekan **`Ctrl + C`** di terminal untuk menghentikan dev server.

---

## Halaman-halaman Penting

| Halaman | URL |
|---|---|
| Homepage | http://localhost:3000 |
| Admin Panel | http://localhost:3000/admin |
| Admin Login | http://localhost:3000/admin/login |
| Info Travel | http://localhost:3000/info-travel |
| Paket Tour | http://localhost:3000/paket-tour |
| Hotels | http://localhost:3000/hotels |
| Transport | http://localhost:3000/transport |
| Testimoni | http://localhost:3000/testimoni |
| Kontak | http://localhost:3000/kontak |

---

## Catatan Tambahan

- Website menggunakan **Next.js 16** dengan **Turbopack**
- Database menggunakan **MySQL** via **Prisma ORM**
- Multi-bahasa tersedia: Indonesia (id), English (en), 中文 (zh)
- File environment (`.env`) berisi konfigurasi database — jangan di-share ke publik
