import { NextResponse } from 'next/server';
import { getLiveAmdGpuTelemetry } from '@/lib/router/telemetry';

export async function GET() {
  const telemetry = await getLiveAmdGpuTelemetry();
  return NextResponse.json({ success: true, telemetry });
}
