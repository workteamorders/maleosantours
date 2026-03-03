import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

/**
 * Upload API Route
 * - Jika Cloudinary dikonfigurasi: upload ke Cloudinary
 * - Jika tidak: simpan ke public/uploads/images/ (lokal)
 */

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const isCloudinaryConfigured =
  !!process.env.CLOUDINARY_CLOUD_NAME &&
  !!process.env.CLOUDINARY_API_KEY &&
  !!process.env.CLOUDINARY_API_SECRET;

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as Blob | null;
    const type = formData.get('type') as string; // 'image' or 'video'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type and size
    if (type === 'image') {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: 'Format gambar tidak didukung (Gunakan JPG, PNG, atau WebP)' },
          { status: 400 }
        );
      }
      if (file.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          { error: 'Ukuran gambar terlalu besar. Maksimal 5MB.' },
          { status: 400 }
        );
      }
    } else if (type === 'video') {
      if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: 'Format video tidak didukung (Gunakan MP4 atau WebM)' },
          { status: 400 }
        );
      }
      if (file.size > MAX_VIDEO_SIZE) {
        return NextResponse.json(
          { error: 'Ukuran video terlalu besar. Maksimal 10MB.' },
          { status: 400 }
        );
      }
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ── CLOUDINARY ──────────────────────────────────────────────────────────
    if (isCloudinaryConfigured) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto', folder: 'maleosan-travel' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      }) as any;

      return NextResponse.json({
        url: result.secure_url,
        filename: result.public_id,
        size: result.bytes,
        type: result.resource_type,
      });
    }

    // ── LOCAL FALLBACK ───────────────────────────────────────────────────────
    const ext = (file as File).name?.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'images');

    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);

    return NextResponse.json({
      url: `/uploads/images/${filename}`,
      filename,
      size: buffer.byteLength,
      type: 'image',
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({
      error: 'Gagal upload: ' + (error.message || 'Unknown error')
    }, { status: 500 });
  }
}
