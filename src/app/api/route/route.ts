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

    // Optional Live AMD ROCm vLLM Proxy Forwarding
    const liveInferenceUrl = process.env.AMD_ROCM_INFERENCE_URL;
    if (liveInferenceUrl && decision.selectedModel.isLocalAMD) {
      try {
        const vllmResponse = await fetch(liveInferenceUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'meta-llama/Meta-Llama-3-8B-Instruct',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 256,
            temperature: 0.2
          }),
          signal: AbortSignal.timeout(5000)
        });
        if (vllmResponse.ok) {
          const vllmData = await vllmResponse.json();
          const generatedContent = vllmData.choices?.[0]?.message?.content;
          if (generatedContent) {
            decision.responsePreview = generatedContent;
          }
        }
      } catch {
        // Transparent fallback to simulated preview if backend is offline
      }
    }

    return NextResponse.json({ success: true, decision });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Routing error' }, { status: 500 });
  }
}
