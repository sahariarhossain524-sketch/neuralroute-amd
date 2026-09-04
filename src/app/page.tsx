'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { TelemetryBar } from '@/components/TelemetryBar';
import { RoutingPlayground } from '@/components/RoutingPlayground';
import { CostSavingsDashboard } from '@/components/CostSavingsDashboard';
import type { AmdHardwareTelemetry, RouteDecision, RoutingPolicy } from '@/lib/types';
import { getAmdGpuTelemetry } from '@/lib/router/telemetry';

export default function Home() {
  const [policy, setPolicy] = useState<RoutingPolicy>('COST_OPTIMIZED');
  const [telemetry, setTelemetry] = useState<AmdHardwareTelemetry>(getAmdGpuTelemetry());
  const [history, setHistory] = useState<RouteDecision[]>([]);

  useEffect(() => {
    fetch('/api/telemetry')
      .then((res) => res.json())
      .then((data) => {
        if (data.telemetry) setTelemetry(data.telemetry);
      })
      .catch((err) => console.error('Telemetry fetch error:', err));
  }, []);

  const handleDecisionMade = (decision: RouteDecision) => {
    setHistory((prev) => [decision, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Navigation Header */}
      <Header policy={policy} onPolicyChange={(p) => setPolicy(p)} />

      {/* Main Terminal Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        {/* Real-Time AMD Hardware Telemetry HUD */}
        <TelemetryBar telemetry={telemetry} />

        {/* Interactive Semantic Routing Playground */}
        <RoutingPlayground policy={policy} onDecisionMade={handleDecisionMade} />

        {/* Enterprise Cost & Token Savings Analytics */}
        <CostSavingsDashboard history={history} />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 py-4 px-6 text-center text-xs font-mono text-slate-500">
        Built natively for the <span className="text-slate-300 font-bold">Lablab x AMD AI Academy Challenge 2026</span> &bull; Powered by AMD ROCm™ 6.2 & AMD Instinct™ GPU Architecture
      </footer>
    </div>
  );
}
