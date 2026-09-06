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

  const publicFallbackUrl = imageUrl.startsWith('/')
    ? `${req.headers.get('x-forwarded-proto') || 'https'}://${req.headers.get('host') || 'osissmaitfi.biezz.my.id'}${imageUrl}`
    : imageUrl;

  const compressParam = searchParams.get('compress');
  const quality = parseInt(qualityParam || '75', 10);
  const shouldCompress = compressParam !== 'false';

  try {
    let targetUrl = imageUrl;
    if (targetUrl.startsWith('/')) {
      const host = req.headers.get('host') || 'localhost:3002';
      const protocol = req.headers.get('x-forwarded-proto') || 'http';
      targetUrl = `${protocol}://${host}${targetUrl}`;
    }

    const publicStrapiURL = 'https://osisstrapi.biezz.my.id';
    if (targetUrl.startsWith(publicStrapiURL)) {
      targetUrl = targetUrl.replace(publicStrapiURL, STRAPI_INTERNAL_URL);
    } else if (targetUrl.startsWith('http://localhost:1337')) {
      targetUrl = targetUrl.replace('http://localhost:1337', STRAPI_INTERNAL_URL);
    }

    if (!/^https?:\/\//i.test(targetUrl)) {
      return new NextResponse('Only HTTP/HTTPS URLs are allowed', { status: 400 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    let response: Response;
    try {
      response = await fetch(targetUrl, { cache: 'no-store', signal: controller.signal });
    } catch (fetchErr) {
      return NextResponse.redirect(publicFallbackUrl, 302);
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      return NextResponse.redirect(publicFallbackUrl, 302);
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
      // Gantikan kompresi standar dengan chromaSubsampling 4:4:4 untuk mempertahankan detail piksel & warna pada Quality 80%
      sharpInstance = sharpInstance.webp({
        quality: Math.max(quality, 80),
        effort: 4,
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
    if (/^https?:\/\//i.test(publicFallbackUrl)) {
      return NextResponse.redirect(publicFallbackUrl, 302);
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
