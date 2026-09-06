import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rssUrl = searchParams.get('url') || 'https://anchor.fm/s/1eccd468/podcast/rss';
  const limit = parseInt(searchParams.get('limit') || '5', 10);

  try {
    const res = await fetch(rssUrl, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error('Failed to fetch RSS feed');
    const xmlText = await res.text();

    const items: any[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xmlText)) !== null && items.length < limit) {
      const itemContent = match[1];

      const titleMatch = itemContent.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i) || itemContent.match(/<title>([\s\S]*?)<\/title>/i);
      const linkMatch = itemContent.match(/<link>([\s\S]*?)<\/link>/i);
      const pubDateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);
      const enclosureMatch = itemContent.match(/<enclosure[^>]*url=["']([^"']+)["']/i);
      const imageMatch = itemContent.match(/<itunes:image[^>]*href=["']([^"']+)["']/i);
      const descMatch = itemContent.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i) || itemContent.match(/<description>([\s\S]*?)<\/description>/i);

      const title = titleMatch ? titleMatch[1].trim().replace(/&amp;/g, '&') : 'Episode Podcast';
      const link = linkMatch ? linkMatch[1].trim() : '';
      const pubDate = pubDateMatch ? pubDateMatch[1].trim() : '';
      const rawAudioUrl = enclosureMatch ? enclosureMatch[1] : '';
      let audioUrl = rawAudioUrl.replace(/&amp;/g, '&');
      if (audioUrl.includes('https%3A%2F%2F')) {
        const directMatch = audioUrl.match(/https%3A%2F%2F(.*)/i);
        if (directMatch) {
          audioUrl = 'https://' + decodeURIComponent(directMatch[1]);
        }
      }
      const imageUrl = imageMatch ? imageMatch[1] : '';
      const description = descMatch ? descMatch[1].replace(/<[^>]*>?/gm, '').replace(/&amp;/g, '&').slice(0, 150) + '...' : '';

      items.push({
        title,
        link,
        pubDate,
        audioUrl,
        imageUrl,
        description,
      });
    }

    return NextResponse.json({ items });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error parsing RSS' }, { status: 500 });
  }
}
