'use client';

import React from 'react';
import { Cpu, Zap, Award, Sparkles, Activity } from 'lucide-react';

interface HeaderProps {
  policy: string;
  onPolicyChange: (p: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ policy, onPolicyChange }) => {
  return (
    <header className="w-full bg-[#0a0f18]/90 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Hardware status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-600/20 text-white font-black">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-white">
                NeuralRoute <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-orange-400">AMD</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                ROCm 6.2 Cluster
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Smart Agentic Model Router & Token Optimizer on AMD Instinct™ GPUs
            </p>
          </div>
        </div>

        {/* Challenge Badges & Policy Switcher */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Lablab x AMD AI Academy Challenge 2026</span>
          </div>

          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs font-mono">
            <button
              onClick={() => onPolicyChange('COST_OPTIMIZED')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                policy === 'COST_OPTIMIZED'
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Cost-First (-70%)
            </button>
            <button
              onClick={() => onPolicyChange('LATENCY_FIRST')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                policy === 'LATENCY_FIRST'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ultra-Fast (18ms)
            </button>
            <button
              onClick={() => onPolicyChange('ACCURACY_FIRST')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                policy === 'ACCURACY_FIRST'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Accuracy-First
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
