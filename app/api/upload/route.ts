import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

/**
 * Upload API Route - Cloudinary Version
 * This uploads files directly to Cloudinary to solve Vercel's Read-Only FS issue.
 */

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB per image
const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB per video
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
          { error: 'Ukuran gambar terlalu besar. Maksimal 1MB untuk menghemat penyimpanan.' },
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

    // Convert Blob to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary using upload_stream
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto', // Automatically detect image or video
          folder: 'maleosan-travel',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary Upload Stream Error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    }) as any;

    // Return the secure URL from Cloudinary
    return NextResponse.json({
      url: result.secure_url,
      filename: result.public_id,
      size: result.bytes,
      type: result.resource_type,
    });

  } catch (error: any) {
    console.error('Cloudinary Upload error:', error);
    return NextResponse.json({
      error: 'Gagal upload ke Cloudinary: ' + (error.message || 'Unknown error')
    }, { status: 500 });
  }
}
