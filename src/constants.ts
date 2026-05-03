
export interface ModelPricing {
  id: string;
  name: string;
  provider: string;
  type: 'api' | 'build';
  inputCostPer1M: number; // in USD
  outputCostPer1M: number; // in USD
  monthlyMaintenance?: number; // for build
  setupCost?: number; // for build
}

export const MARKET_MODELS: ModelPricing[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    type: 'api',
    inputCostPer1M: 5.00,
    outputCostPer1M: 15.00,
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    type: 'api',
    inputCostPer1M: 3.00,
    outputCostPer1M: 15.00,
  },
  {
    id: 'llama-3-70b-modal',
    name: 'Llama 3 70B (Serverless)',
    provider: 'Modal / Replicate',
    type: 'api',
    inputCostPer1M: 0.65,
    outputCostPer1M: 2.75,
  }
];

export interface GpuOption {
  id: string;
  name: string;
  reservedMonthly: number;
  spotMonthly: number;
  throughputFactor: number; // Comparative performance multiplier
  specs: {
    vram: string;
    tflops: string;
    power: string;
  };
}

export const GPU_OPTIONS: GpuOption[] = [
  { 
    id: 'h100', 
    name: 'NVIDIA H100', 
    reservedMonthly: 3800, 
    spotMonthly: 1200, 
    throughputFactor: 1.0,
    specs: { vram: '80GB HBM3', tflops: '2000 (FP8)', power: '700W' }
  },
  { 
    id: 'a100', 
    name: 'NVIDIA A100 (80GB)', 
    reservedMonthly: 2400, 
    spotMonthly: 850, 
    throughputFactor: 0.65,
    specs: { vram: '80GB HBM2e', tflops: '624 (TF32)', power: '400W' }
  },
  { 
    id: 'l40s', 
    name: 'NVIDIA L40S', 
    reservedMonthly: 1800, 
    spotMonthly: 600, 
    throughputFactor: 0.45,
    specs: { vram: '48GB GDDR6', tflops: '1466 (FP8)', power: '350W' }
  },
  { 
    id: 'l4', 
    name: 'NVIDIA L4', 
    reservedMonthly: 600, 
    spotMonthly: 200, 
    throughputFactor: 0.15,
    specs: { vram: '24GB GDDR6', tflops: '485 (FP8)', power: '72W' }
  },
];

export const BUILD_PARAMETERS = {
  ENGINEER_MONTHLY_COST: 15000, // Allocated dev time
  OPS_OVERHEAD_PERCENT: 0.15,
};
