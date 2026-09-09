import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { STRAPI_INTERNAL_URL } from '../../../lib/strapi';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

sharp.concurrency(1);
sharp.cache({ memory: 50, files: 0, items: 100 });

const CACHE_DIR = path.join(process.cwd(), '.image-cache');
const MAX_CACHE_FILES = 500;

// Whitelist domain resmi yang diperbolehkan untuk image compression
const ALLOWED_HOSTS = [
  'osisstrapi.biezz.my.id',
  'osissmaitfi.biezz.my.id',
  'localhost',
  '127.0.0.1',
  '100.100.68.83',
];

function isHostAllowed(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return ALLOWED_HOSTS.some((allowed) => host === allowed || host.endsWith('.' + allowed));
}

// 1x1 transparent PNG fallback buffer
const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64'
);

async function pruneCache() {
  try {
    const files = await fs.readdir(CACHE_DIR);
    if (files.length <= MAX_CACHE_FILES) return;
    const fileStats = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(CACHE_DIR, file);
        const stat = await fs.stat(filePath);
        return { filePath, mtime: stat.mtimeMs };
      })
    );
    fileStats.sort((a, b) => a.mtime - b.mtime);
    const toDelete = fileStats.slice(0, fileStats.length - MAX_CACHE_FILES);
    await Promise.all(toDelete.map((item) => fs.unlink(item.filePath).catch(() => {})));
  } catch (err) {
    console.error('Image cache prune error:', err);
  }
}

async function ensureCacheDir() {
  try {
    await fs.access(CACHE_DIR);
  } catch {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get('url');
  const qualityParam = searchParams.get('q');

  if (!imageUrl) {
    return new NextResponse('Missing image URL parameter', { status: 400 });
  }

  const compressParam = searchParams.get('compress');
  const parsedQuality = parseInt(qualityParam || '85', 10);
  const quality = Math.min(Math.max(isNaN(parsedQuality) ? 85 : parsedQuality, 1), 100);
  const shouldCompress = compressParam !== 'false';

  try {
    let targetUrl = imageUrl;
    if (targetUrl.startsWith('/')) {
      const host = req.headers.get('host') || 'localhost:3002';
      const protocol = req.headers.get('x-forwarded-proto') || 'http';
      targetUrl = `${protocol}://${host}${targetUrl}`;
    }

    if (!/^https?:\/\//i.test(targetUrl)) {
      return new NextResponse('Only HTTP/HTTPS URLs are allowed', { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(targetUrl);
    } catch {
      return new NextResponse('Invalid target image URL', { status: 400 });
    }

    // SSRF Protection: validasi allowlist host
    if (!isHostAllowed(parsedUrl.hostname)) {
      return new NextResponse('Forbidden host', { status: 403 });
    }

    const publicStrapiURL = 'https://osisstrapi.biezz.my.id';
    if (targetUrl.startsWith(publicStrapiURL)) {
      targetUrl = targetUrl.replace(publicStrapiURL, STRAPI_INTERNAL_URL);
    } else if (targetUrl.startsWith('http://localhost:1337')) {
      targetUrl = targetUrl.replace('http://localhost:1337', STRAPI_INTERNAL_URL);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    let response: Response;
    try {
      response = await fetch(targetUrl, { cache: 'no-store', signal: controller.signal });
    } catch {
      // Hilangkan redirect 302 ke URL eksternal (mencegah Open Redirect)
      return new NextResponse(TRANSPARENT_PNG, {
        status: 200,
        headers: { 'Content-Type': 'image/png', 'Cache-Control': 'no-store' },
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      return new NextResponse(TRANSPARENT_PNG, {
        status: 200,
        headers: { 'Content-Type': 'image/png', 'Cache-Control': 'no-store' },
      });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const imageBuffer = await response.arrayBuffer();

    const cacheKey = crypto.createHash('sha256').update(`${imageUrl}-${quality}-${shouldCompress}`).digest('hex');
    const cachePath = path.join(CACHE_DIR, `${cacheKey}.webp`);

    try {
      await ensureCacheDir();
      const cachedBuffer = await fs.readFile(cachePath);
      const headers = new Headers();
      headers.set('Content-Type', 'image/webp');
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      headers.set('X-Cache', 'HIT');
      return new NextResponse(cachedBuffer, { status: 200, headers });
    } catch (e) {
      // Cache miss
    }

    let processedBuffer = Buffer.from(imageBuffer) as Buffer;
    let outContentType = contentType;

    if (shouldCompress && contentType.startsWith('image/')) {
      let sharpInstance = sharp(processedBuffer);
      // Kompresi WebP mempertahankan ketajaman HD dengan smartSubsample
      sharpInstance = sharpInstance.webp({
        quality,
        effort: 4,
        smartSubsample: true,
      });
      processedBuffer = await sharpInstance.toBuffer();
      outContentType = 'image/webp';

      try {
        await fs.writeFile(cachePath, processedBuffer);
        pruneCache().catch(() => {});
      } catch (cacheErr) {
        console.error('Failed to write image cache:', cacheErr);
      }
    }

    const headers = new Headers();
    headers.set('Content-Type', outContentType);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    headers.set('X-Compressed-Quality', quality.toString());
    headers.set('X-Compressed-Format', shouldCompress ? 'webp' : 'original');
    headers.set('X-Cache', 'MISS');

    return new NextResponse(processedBuffer as any, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Image compression proxy error:', error);
    return new NextResponse(TRANSPARENT_PNG, {
      status: 200,
      headers: { 'Content-Type': 'image/png', 'Cache-Control': 'no-store' },
    });
  }
}
