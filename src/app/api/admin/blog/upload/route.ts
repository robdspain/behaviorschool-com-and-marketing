import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create filename with timestamp to avoid conflicts
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_'); // Sanitize filename
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);
    const filename = `${baseName}_${timestamp}${extension}`;

    // Create uploads directory structure
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'blog');
    const yearMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    const fullUploadDir = path.join(uploadDir, yearMonth);

    // Ensure directory exists
    if (!existsSync(fullUploadDir)) {
      await mkdir(fullUploadDir, { recursive: true });
    }

    // Write file
    const filePath = path.join(fullUploadDir, filename);
    await writeFile(filePath, buffer);

    // Generate URL paths for both local and production
    const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://behaviorschool.com';
    const localUrl = `/uploads/blog/${yearMonth}/${filename}`;
    const fullUrl = `${siteUrl}${localUrl}`;

    // Return response in Ghost-compatible format
    return NextResponse.json({
      images: [{
        url: fullUrl,
        ref: filename,
        width: null, // Could add image dimensions here if needed
        height: null,
      }],
      // Also provide the local URL for development
      localUrl: localUrl,
      filename: filename,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}