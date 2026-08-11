import { NextRequest, NextResponse } from 'next/server';
import { notificationService } from '@/lib/notificationService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const notificationType = body.type || 'info';
    const title = body.title || `New ${notificationType}`;
    const message = body.message || (body.data?.saran_ide || body.data?.message || 'New event received');
    const aiSummary = typeof body.aiSummary === 'string' 
      ? body.aiSummary 
      : (body.aiSummary?.summary || JSON.stringify(body.aiSummary));

    notificationService.emit({
      type: notificationType,
      title,
      message,
      data: body.data,
      source: body.source || 'strapi',
      aiSummary,
    });

    return NextResponse.json({ success: true, message: 'Broadcast triggered' });
  } catch (error) {
    console.error('Broadcast error:', error);
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }
}
