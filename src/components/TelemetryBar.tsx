'use client';

import React from 'react';
import { Cpu, HardDrive, Gauge, Zap, Flame } from 'lucide-react';
import type { AmdHardwareTelemetry } from '@/lib/types';

interface TelemetryBarProps {
  telemetry: AmdHardwareTelemetry;
}

export const TelemetryBar: React.FC<TelemetryBarProps> = ({ telemetry }) => {
  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* VRAM Load */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider">AMD GPU VRAM Load</p>
          <p className="text-xl font-black text-white font-mono mt-0.5">
            {telemetry.usedVramGB} <span className="text-xs text-slate-500 font-normal">/ {telemetry.totalVramGB} GB</span>
          </p>
          <p className="text-[10px] text-emerald-400 font-mono mt-0.5">
            HBM3 High-Bandwidth ({((telemetry.usedVramGB / telemetry.totalVramGB) * 100).toFixed(0)}% Active)
          </p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-rose-400 shrink-0">
          <HardDrive className="w-5 h-5" />
        </div>
      </div>

      {/* Generation Speed */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider">Inference Speed</p>
          <p className="text-xl font-black text-rose-400 font-mono mt-0.5">
            {telemetry.currentThroughputTokensSec} <span className="text-xs text-slate-400 font-normal">tok/s</span>
          </p>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
            vLLM ROCm PagedAttention
          </p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 shrink-0">
          <Gauge className="w-5 h-5" />
        </div>
      </div>

      {/* Memory Bandwidth */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider">Memory Bandwidth</p>
          <p className="text-xl font-black text-cyan-400 font-mono mt-0.5">
            {telemetry.memoryBandwidthTBps} <span className="text-xs text-slate-400 font-normal">TB/sec</span>
          </p>
          <p className="text-[10px] text-cyan-500/80 font-mono mt-0.5">
            AMD Instinct™ Architecture
          </p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
          <Zap className="w-5 h-5" />
        </div>
      </div>

      {/* GPU Utilization & Temp */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider">Compute Load</p>
          <p className="text-xl font-black text-white font-mono mt-0.5">
            {telemetry.gpuUtilization}% <span className="text-xs text-slate-500 font-normal">({telemetry.computeUnits} CUs)</span>
          </p>
          <p className="text-[10px] text-amber-400 font-mono mt-0.5">
            Thermal: {telemetry.temperatureC}°C | {telemetry.powerWatts}W
          </p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 shrink-0">
          <Flame className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
