import { NextRequest, NextResponse } from 'next/server';
import { routePrompt } from '@/lib/router/engine';
import type { RoutingPolicy } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { prompt, policy } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'A valid text prompt is required.' },
        { status: 400 }
      );
    }

    const decision = routePrompt(prompt, (policy || 'COST_OPTIMIZED') as RoutingPolicy);
    return NextResponse.json({ success: true, decision });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Routing error' }, { status: 500 });
  }
}
