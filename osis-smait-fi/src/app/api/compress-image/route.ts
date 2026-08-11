import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { STRAPI_INTERNAL_URL } from '../../../lib/strapi';

// Configure sharp to use a single thread to minimize CPU usage and prevent CPU spikes
sharp.concurrency(1);
// Enable memory cache to reuse processed operations and reduce CPU load
sharp.cache({ memory: 50, files: 0, items: 100 });

import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const CACHE_DIR = path.join(process.cwd(), '.image-cache');

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
  const quality = parseInt(qualityParam || '75', 10);
  const shouldCompress = compressParam !== 'false';

  try {
    let targetUrl = imageUrl;
    if (targetUrl.startsWith('/')) {
      const host = req.headers.get('host') || 'localhost:3002';
      const protocol = req.headers.get('x-forwarded-proto') || 'http';
      targetUrl = `${protocol}://${host}${targetUrl}`;
    }

    // Rewrite public or local port Strapi URLs to the internal backend URL for faster retrieval
    const publicStrapiURL = 'https://osisstrapi.biezz.my.id';
    if (targetUrl.startsWith(publicStrapiURL)) {
      targetUrl = targetUrl.replace(publicStrapiURL, STRAPI_INTERNAL_URL);
    } else if (targetUrl.startsWith('http://localhost:1337')) {
      targetUrl = targetUrl.replace('http://localhost:1337', STRAPI_INTERNAL_URL);
    }

    // SSRF prevention: only allow http/https URLs
    if (!/^https?:\/\//i.test(targetUrl)) {
      return new NextResponse('Only HTTP/HTTPS URLs are allowed', { status: 400 });
    }

    // Fetch with 5s timeout to prevent hanging when upstream is slow
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    let response: Response;
    try {
      response = await fetch(targetUrl, { cache: 'force-cache', signal: controller.signal });
    } catch (fetchErr) {
      // ponytail: timeout or network error → redirect to original image
      return NextResponse.redirect(targetUrl, 302);
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      return NextResponse.redirect(targetUrl, 302);
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const imageBuffer = await response.arrayBuffer();

    // File-based cache check
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
      // Cache miss, proceed to process
    }

    let processedBuffer = Buffer.from(imageBuffer) as Buffer;
    let outContentType = contentType;

    // Compress and convert to webp using sharp if enabled and it's an image
    if (shouldCompress && contentType.startsWith('image/')) {
      let sharpInstance = sharp(processedBuffer);

      // Convert to webp format with chosen quality (0-100)
      sharpInstance = sharpInstance.webp({ quality });
      processedBuffer = await sharpInstance.toBuffer();
      outContentType = 'image/webp';

      // Save to cache
      try {
        await fs.writeFile(cachePath, processedBuffer);
      } catch (cacheErr) {
        console.error('Failed to write image cache:', cacheErr);
      }
    }

    // Set cache control headers to preserve bandwidth
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
    // Graceful degradation: redirect to original image on any processing error
    const fallbackUrl = imageUrl.startsWith('/')
      ? `${req.headers.get('x-forwarded-proto') || 'http'}://${req.headers.get('host') || 'localhost:3002'}${imageUrl}`
      : imageUrl;
    if (/^https?:\/\//i.test(fallbackUrl)) {
      return NextResponse.redirect(fallbackUrl, 302);
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
