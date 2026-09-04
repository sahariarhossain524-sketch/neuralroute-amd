'use client';

import React, { useState } from 'react';
import { Send, ArrowRight, ShieldAlert, Cpu, Sparkles, CheckCircle2, TrendingDown, Clock, Layers } from 'lucide-react';
import type { RouteDecision, RoutingPolicy } from '@/lib/types';

interface RoutingPlaygroundProps {
  policy: RoutingPolicy;
  onDecisionMade: (d: RouteDecision) => void;
}

const PRESETS = [
  {
    label: 'PyTorch ROCm HIP Kernel',
    prompt: 'Write a high-performance PyTorch custom HIP kernel for matrix multiplication optimized on AMD Instinct MI300X Compute Units.'
  },
  {
    label: 'AMD CDNA 3 vs Hopper Architecture',
    prompt: 'Summarize the architectural differences between AMD CDNA 3 (MI300X) unified APU architecture and NVIDIA Hopper H100.'
  },
  {
    label: 'Multi-Step Mathematical Proof',
    prompt: 'Formulate a rigorous formal mathematical proof for Black-Scholes partial differential equation under stochastic volatility and jump diffusion.'
  }
];

export const RoutingPlayground: React.FC<RoutingPlaygroundProps> = ({ policy, onDecisionMade }) => {
  const [prompt, setPrompt] = useState(PRESETS[0].prompt);
  const [isLoading, setIsLoading] = useState(false);
  const [decision, setDecision] = useState<RouteDecision | null>(null);

  const handleRoute = async (promptToRun?: string) => {
    const text = promptToRun || prompt;
    if (!text.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, policy })
      });

      if (res.ok) {
        const data = await res.json();
        setDecision(data.decision);
        onDecisionMade(data.decision);
      }
    } catch (err) {
      console.error('Routing failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-rose-400" />
            NeuralRoute Smart Gateway
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Analyzes semantic prompt complexity and routes to local AMD ROCm GPU vs Frontier Cloud
          </p>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-slate-500 font-bold">Quick Presets:</span>
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(p.prompt);
                handleRoute(p.prompt);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="space-y-3">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder="Type any developer prompt, algorithm, or analytical query..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-rose-500/50 transition-colors resize-none"
          />
          <button
            onClick={() => handleRoute()}
            disabled={isLoading || !prompt.trim()}
            className="absolute right-3 bottom-4 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-rose-500 via-amber-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-slate-950 shadow-lg shadow-rose-500/20 disabled:opacity-40 transition-all cursor-pointer"
          >
            {isLoading ? 'Routing...' : 'Route & Execute'}
            <Send className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>
      </div>

      {/* Routing Decision Display */}
      {decision && (
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-4 animate-fadeIn">
          {/* Top Status Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-850">
            <div className="flex items-center gap-3">
              <div className={`px-2.5 py-1 rounded-md text-xs font-mono font-black ${
                decision.selectedModel.isLocalAMD
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
              }`}>
                {decision.selectedModel.isLocalAMD ? '⚡ ROUTED TO AMD ROCm INSTINCT CLUSTER' : '🌐 ROUTED TO FRONTIER CLOUD'}
              </div>
              <span className="text-xs font-bold text-white font-mono">
                {decision.selectedModel.name}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1 text-emerald-400">
                <TrendingDown className="w-4 h-4" />
                <span>{decision.percentSaved}% Cost Saved</span>
              </div>
              <div className="flex items-center gap-1 text-cyan-400">
                <Clock className="w-4 h-4" />
                <span>{decision.executionTimeMs}ms Latency</span>
              </div>
            </div>
          </div>

          {/* Complexity & Telemetry Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-850">
              <span className="text-slate-500 block text-[10px]">Semantic Complexity</span>
              <span className="font-bold text-white text-sm">{decision.complexity.score} / 1.00</span>
              <span className="text-[10px] text-amber-400 block mt-0.5">({decision.complexity.level})</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-855">
              <span className="text-slate-500 block text-[10px]">Domain Classification</span>
              <span className="font-bold text-white text-sm">{decision.complexity.domain}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{decision.tokenCount} Tokens</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-850">
              <span className="text-slate-500 block text-[10px]">Actual Model Cost</span>
              <span className="font-bold text-emerald-400 text-sm">${decision.estimatedCost}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">${decision.selectedModel.costPer1kTokens}/1K</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-850">
              <span className="text-slate-500 block text-[10px]">Cloud Equivalent Cost</span>
              <span className="font-bold text-slate-400 text-sm line-through">${decision.cloudEquivalentCost}</span>
              <span className="text-[10px] text-rose-400 block mt-0.5">Saved ${decision.dollarSaved}</span>
            </div>
          </div>

          {/* Response Preview Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Execution Output Preview</span>
              <span className="text-rose-400 font-bold">{decision.selectedModel.hardware}</span>
            </div>
            <pre className="p-4 rounded-xl bg-black/80 border border-slate-850 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {decision.responsePreview}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
