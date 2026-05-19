import { NextRequest, NextResponse } from 'next/server';
import { playCespEvent } from '@/lib/cesp';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, volume } = body;

    if (!event) {
      return NextResponse.json({ error: 'Event category is required (e.g. task.complete)' }, { status: 400 });
    }

    // Determine volume, fallback to 1.0
    const parsedVolume = volume !== undefined ? parseFloat(volume) : 1.0;
    
    // Play the audio async
    await playCespEvent(event, parsedVolume);

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error('[CESP API] Error processing request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
