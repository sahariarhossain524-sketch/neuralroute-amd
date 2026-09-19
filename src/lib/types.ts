export type RoutingPolicy = 'COST_OPTIMIZED' | 'LATENCY_FIRST' | 'ACCURACY_FIRST';

export interface PromptComplexity {
  score: number; // 0.00 to 1.00
  level: 'SIMPLE' | 'MODERATE' | 'COMPLEX' | 'EXTREME';
  domain: 'CODE' | 'CREATIVE' | 'REASONING' | 'FACTUAL' | 'DATA_ANALYSIS';
  estimatedTokens: number;
  requiresFrontier: boolean;
  reasons: string[];
}

export interface TargetModel {
  id: string;
  name: string;
  provider: 'AMD_ROCm_vLLM' | 'AMD_Cloud_Inference' | 'Frontier_Cloud';
  hardware: 'AMD Instinct™ MI300X' | 'AMD Instinct™ MI250' | 'Cloud API Cluster';
  costPer1kTokens: number; // in USD
  avgLatencyMs: number;
  throughputTokensPerSec: number;
  isLocalAMD: boolean;
}

export interface RouteDecision {
  id: string;
  prompt: string;
  selectedModel: TargetModel;
  policy: RoutingPolicy;
  complexity: PromptComplexity;
  tokenCount: number;
  executionTimeMs: number;
  routingOverheadMs: number; // Real CPU latency to analyze and route (in ms)
  estimatedTtftMs: number; // Hardware Time-To-First-Token (in ms)
  estimatedCost: number;
  cloudEquivalentCost: number;
  dollarSaved: number;
  percentSaved: number;
  responsePreview: string;
  timestamp: string;
}

export interface AmdHardwareTelemetry {
  gpuModel: string;
  driverVersion: string;
  rocmVersion: string;
  totalVramGB: number;
  usedVramGB: number;
  freeVramGB: number;
  computeUnits: number;
  gpuUtilization: number;
  memoryBandwidthTBps: number;
  peakTFlopsFP16: number;
  currentThroughputTokensSec: number;
  activeContextBatches: number;
  temperatureC: number;
  powerWatts: number;
}

export interface SystemStats {
  totalQueriesRouted: number;
  queriesRoutedToAmd: number;
  queriesRoutedToFrontier: number;
  cumulativeDollarsSaved: number;
  averageLatencyMs: number;
  amdLoadPercentage: number;
}
