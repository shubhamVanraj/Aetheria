
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { MARKET_MODELS, BUILD_PARAMETERS, GPU_OPTIONS } from '@/src/constants';
import { Info, CheckCircle2, TrendingUp, Zap, Cpu, HardDrive, Gauge, Settings, Plus, Trash2, ArrowDown } from 'lucide-react';

interface PipelineStage {
  id: string;
  name: string;
  modelId: string;
  inputTokens: number;
  outputTokens: number;
}

export function BuildVsBuyCalculator() {
  const [stages, setStages] = useState<PipelineStage[]>([
    { id: '1', name: 'Primary Model', modelId: MARKET_MODELS[0].id, inputTokens: 500, outputTokens: 1000 }
  ]);
  const [monthlyRequests, setMonthlyRequests] = useState(100000);
  const [selectedGpu, setSelectedGpu] = useState(GPU_OPTIONS[0]);
  const [useSpot, setUseSpot] = useState(false);
  const [engineerCost, setEngineerCost] = useState(BUILD_PARAMETERS.ENGINEER_MONTHLY_COST);
  const [opsOverheadPercent, setOpsOverheadPercent] = useState(BUILD_PARAMETERS.OPS_OVERHEAD_PERCENT * 100);

  const stats = useMemo(() => {
    let totalApiCost = 0;
    let totalTokens = 0;
    
    stages.forEach(stage => {
      const model = MARKET_MODELS.find(m => m.id === stage.modelId) || MARKET_MODELS[0];
      const monthlyInputM = (monthlyRequests * stage.inputTokens) / 1000000;
      const monthlyOutputM = (monthlyRequests * stage.outputTokens) / 1000000;
      
      totalApiCost += (monthlyInputM * model.inputCostPer1M) + (monthlyOutputM * model.outputCostPer1M);
      totalTokens += monthlyRequests * (stage.inputTokens + stage.outputTokens);
    });

    // Data Transfer (Simulated egress/internal move cost for Buy)
    const dataTransferBuy = stages.length > 1 ? (monthlyRequests * (stages.length - 1) * 0.00001) : 0;
    const finalApiCost = totalApiCost + dataTransferBuy;

    // Self-Hosted Costs (BUILD)
    const BASE_TOKEN_CAPACITY_MONTHLY = 12000000000;
    const capacityPerNodeTokens = BASE_TOKEN_CAPACITY_MONTHLY * selectedGpu.throughputFactor;
    const nodesRequired = Math.max(1, Math.ceil(totalTokens / capacityPerNodeTokens)); 
    
    const gpuMonthlyUnit = useSpot ? selectedGpu.spotMonthly : selectedGpu.reservedMonthly;
    const computeCost = nodesRequired * gpuMonthlyUnit;
    const talentCost = engineerCost;
    
    // Extra complexity for pipeline management (Build side)
    const complexityMultiplier = 1 + ((stages.length - 1) * 0.05); 
    const opsOverhead = (computeCost + talentCost) * (opsOverheadPercent / 100) * complexityMultiplier;
    
    // Data transfer (Build side - networking between pods/nodes)
    const dataTransferBuild = stages.length > 1 ? (monthlyRequests * (stages.length - 1) * 0.000005) : 0;
    
    const selfHostedTotal = computeCost + talentCost + opsOverhead + dataTransferBuild;

    const savings = finalApiCost - selfHostedTotal;
    const isBuildBetter = savings > 0;

    const breakdownData = [
      { name: 'GPU Infrastructure', value: computeCost, color: '#3b82f6' },
      { name: 'ML Talent', value: talentCost, color: '#10b981' },
      { name: 'Ops Overhead', value: opsOverhead + dataTransferBuild, color: '#6366f1' },
    ];

    const comparisonBarData = [
      { name: 'Managed API', cost: finalApiCost, fill: '#3b82f6' },
      { name: 'Private Cluster', cost: selfHostedTotal, fill: '#10b981' },
    ];

    return { 
      apiCost: finalApiCost,
      selfHostedTotal, 
      savings, 
      isBuildBetter, 
      nodesRequired,
      gpuMonthlyUnit,
      infrastructureCost: computeCost,
      talentCost,
      opsOverhead: opsOverhead + dataTransferBuild,
      capacityPerNodeTokens,
      totalMonthlyTokens: totalTokens,
      breakdownData,
      comparisonBarData
    };
  }, [stages, monthlyRequests, selectedGpu, useSpot, engineerCost, opsOverheadPercent]);

  const addStage = () => {
    const newId = (stages.length + 1).toString();
    setStages([...stages, { 
      id: newId, 
      name: `Stage ${newId}`, 
      modelId: MARKET_MODELS[0].id, 
      inputTokens: 500, 
      outputTokens: 500 
    }]);
  };

  const removeStage = (id: string) => {
    if (stages.length === 1) return;
    setStages(stages.filter(s => s.id !== id));
  };

  const updateStage = (id: string, updates: Partial<PipelineStage>) => {
    setStages(stages.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Controls */}
        <Card className="lg:col-span-1 bg-slate-900/50 border-slate-800 shadow-xl rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <Settings className="w-4 h-4" /> Parameters
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addStage}
              className="border-slate-800 text-[10px] font-bold uppercase transition-all hover:bg-blue-600 hover:text-white"
            >
              <Plus className="w-3 h-3 mr-1" /> Add Stage
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-mono uppercase text-slate-500 tracking-[0.2em]">Monthly Pipelines Runs ({monthlyRequests.toLocaleString()})</Label>
              <Input 
                type="number" 
                value={monthlyRequests} 
                onChange={(e) => setMonthlyRequests(Number(e.target.value))} 
                className="bg-slate-950 border-slate-800 text-slate-200 font-mono focus:ring-blue-500"
              />
            </div>

            <div className="space-y-6 pt-2">
              <Label className="text-[10px] font-mono uppercase text-slate-500 tracking-[0.2em]">Pipeline Stages</Label>
              <div className="space-y-4">
                {stages.map((stage, index) => (
                  <div key={stage.id} className="relative p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-4 animate-in slide-in-from-right-2">
                    <div className="flex justify-between items-center group">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="h-5 w-5 rounded-full p-0 flex items-center justify-center border-slate-700 text-[10px] font-bold">
                          {index + 1}
                        </Badge>
                        <Input 
                          value={stage.name} 
                          onChange={(e) => updateStage(stage.id, { name: e.target.value })}
                          className="bg-transparent border-none text-slate-200 font-bold p-0 h-auto focus-visible:ring-0 w-24"
                        />
                      </div>
                      <button 
                        onClick={() => removeStage(stage.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-600 hover:text-rose-500 transition-all"
                        disabled={stages.length === 1}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <Select 
                        onValueChange={(val) => updateStage(stage.id, { modelId: val })}
                        defaultValue={stage.modelId}
                      >
                        <SelectTrigger className="bg-slate-900 border-slate-800 text-[11px] h-8 text-slate-300">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                          {MARKET_MODELS.filter(m => m.type === 'api').map(m => (
                            <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-[8px] font-mono uppercase text-slate-600">Input</Label>
                          <Input 
                            type="number" 
                            value={stage.inputTokens} 
                            onChange={(e) => updateStage(stage.id, { inputTokens: Number(e.target.value) })} 
                            className="bg-slate-900 border-slate-800 text-slate-300 font-mono text-[10px] h-7 px-2"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[8px] font-mono uppercase text-slate-600">Output</Label>
                          <Input 
                            type="number" 
                            value={stage.outputTokens} 
                            onChange={(e) => updateStage(stage.id, { outputTokens: Number(e.target.value) })} 
                            className="bg-slate-900 border-slate-800 text-slate-300 font-mono text-[10px] h-7 px-2"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {index < stages.length - 1 && (
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10 bg-slate-900 p-1 rounded-full border border-slate-800">
                        <ArrowDown className="w-3 h-3 text-blue-500" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-mono uppercase text-slate-500 tracking-[0.2em]">Build GPU Cluster</Label>
                  <Dialog>
                    <DialogTrigger
                      render={
                        <button className="text-[10px] text-blue-400 hover:text-blue-300 font-bold uppercase tracking-widest flex items-center gap-1 transition-colors">
                          <Info className="w-3 h-3" /> Specs
                        </button>
                      }
                    />
                    <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                          <Cpu className="text-blue-400" /> {selectedGpu.name} Details
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                            <div className="text-[10px] uppercase font-mono text-slate-500 mb-1 flex items-center gap-1">
                              <HardDrive className="w-3 h-3" /> Memory
                            </div>
                            <div className="text-lg font-bold">{selectedGpu.specs.vram}</div>
                          </div>
                          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                            <div className="text-[10px] uppercase font-mono text-slate-500 mb-1 flex items-center gap-1">
                              <Gauge className="w-3 h-3" /> Monthly Cap
                            </div>
                            <div className="text-lg font-bold">{(stats.capacityPerNodeTokens / 1000000000).toFixed(1)}B tokens</div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Economic Breakdown</h4>
                          <div className="flex justify-between items-center p-3 border-b border-slate-800">
                            <span className="text-sm text-slate-400">Reserved (Annualized)</span>
                            <span className="text-sm font-mono font-bold">${selectedGpu.reservedMonthly.toLocaleString()}/mo</span>
                          </div>
                          <div className="flex justify-between items-center p-3 border-b border-slate-800">
                            <span className="text-sm text-slate-400">Spot Market (Avg)</span>
                            <span className="text-sm font-mono font-bold text-orange-400">${selectedGpu.spotMonthly.toLocaleString()}/mo</span>
                          </div>
                          <div className="flex justify-between items-center p-3">
                            <span className="text-sm text-slate-400">Relative Throughput</span>
                            <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                              {Math.round(selectedGpu.throughputFactor * 100)}% of H100
                            </Badge>
                          </div>
                        </div>

                        <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-xl">
                          <p className="text-xs text-blue-300 leading-relaxed">
                            <strong>Note:</strong> Performance metrics based on FP8/INT8 Mixed Precision during inference workloads. Actual throughput may vary by model architecture.
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <Select 
                  onValueChange={(val) => setSelectedGpu(GPU_OPTIONS.find(g => g.id === val) || GPU_OPTIONS[0])}
                  defaultValue={selectedGpu.id}
                >
                  <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-200 focus:ring-blue-500 shadow-inner">
                    <SelectValue placeholder="Select GPU" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                    {GPU_OPTIONS.map(g => (
                      <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="space-y-0.5">
                  <Label className="text-[10px] font-bold text-slate-300 uppercase flex items-center gap-1">
                    <Zap className="w-3 h-3 text-orange-400" /> Spot Instances
                  </Label>
                  <p className="text-[10px] text-slate-500 font-mono">Reduce cost by ~70% (Preemptible)</p>
                </div>
                <Switch 
                  checked={useSpot} 
                  onCheckedChange={setUseSpot} 
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="space-y-2">
                  <Label className="text-[10px] font-mono uppercase text-slate-500 tracking-[0.2em]">ML Talent Cost (Monthly)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-500">$</span>
                    <Input 
                      type="number" 
                      value={engineerCost} 
                      onChange={(e) => setEngineerCost(Number(e.target.value))} 
                      className="bg-slate-950 border-slate-800 text-slate-200 font-mono pl-7 h-9 text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-mono uppercase text-slate-500 tracking-[0.2em]">Ops Overhead %</Label>
                    <span className="text-[10px] font-mono text-blue-400 font-bold">{opsOverheadPercent}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={opsOverheadPercent}
                    onChange={(e) => setOpsOverheadPercent(Number(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <p className="text-[9px] text-slate-500 italic">Includes networking, storage, and platform maintenance.</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 italic text-[10px] text-slate-500 flex items-start gap-2">
              <Info className="w-3 h-3 mt-0.5 text-blue-400" />
              <span>Estimates based on {selectedGpu.name} {useSpot ? 'spot' : 'reserved'} pricing @ ${stats.gpuMonthlyUnit.toLocaleString()}/mo.</span>
            </div>
          </CardContent>
        </Card>

        {/* Results Pane */}
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 shadow-xl rounded-2xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-sm font-semibold uppercase tracking-widest text-slate-500">Crossover Intelligence</CardTitle>
                <CardDescription className="text-slate-400">Economic feasibility of private infrastructure migration</CardDescription>
              </div>
              {stats.isBuildBetter ? (
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-none py-1">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Strategy: PRIVATE CLUSTER
                </Badge>
              ) : (
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-none py-1">
                  Strategy: MANAGED API
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none mb-2 underline decoration-slate-800 underline-offset-4">Managed Spend (BUY)</p>
                    <div className="text-3xl font-mono font-bold text-white tracking-tighter">${stats.apiCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                    <p className="text-[10px] text-slate-500 italic mt-1 font-mono">Managed ecosystem cost</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none mb-2 underline decoration-slate-800 underline-offset-4">Private Spend (BUILD)</p>
                    <div className="text-3xl font-mono font-bold text-white tracking-tighter">${stats.selfHostedTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                    <p className="text-[10px] text-slate-500 italic mt-1 font-mono">Req: {stats.nodesRequired} {selectedGpu.name} nodes</p>
                  </div>
                </div>
              </div>

              <div className="h-32 border-l border-slate-800/50 pl-8">
                <p className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-4">Cost Comparison ($)</p>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.comparisonBarData} layout="vertical" margin={{ left: -20, right: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} style={{ fontSize: '10px', fill: '#64748b', fontWeight: 'bold' }} width={80} />
                    <RechartsTooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '10px' }} 
                      formatter={(value: number) => `$${value.toLocaleString()}`}
                    />
                    <Bar dataKey="cost" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={`p-8 rounded-2xl ${stats.isBuildBetter ? 'bg-emerald-500/5 border border-emerald-500/10' : 'bg-slate-950 border border-slate-800'}`}>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Monthly Net Result</span>
                    <Badge className={stats.isBuildBetter ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}>
                      {stats.isBuildBetter ? 'ROI Positive' : 'Scaling Threshold Required'}
                    </Badge>
                  </div>
                  <div className={`text-5xl font-mono font-bold tracking-tighter ${stats.isBuildBetter ? 'text-emerald-400' : 'text-slate-600'}`}>
                    {stats.isBuildBetter ? '+' : '-'}${Math.abs(stats.savings).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
                    {stats.isBuildBetter 
                      ? `Infrastructure utilization has reached the efficiency crossover for ${selectedGpu.name}. Self-hosting reduces your per-token cost by ~${Math.round((stats.savings / stats.apiCost) * 100)}%.` 
                      : `Current volume does not justify private infrastructure overhead. API providers offer ${Math.round((stats.selfHostedTotal / stats.apiCost) * 100)}% better economics for this profile.`}
                  </p>
                </div>

                <div className="w-full md:w-56 h-auto md:h-64 border-t md:border-t-0 md:border-l border-slate-800/50 pt-6 md:pt-0 md:pl-8">
                  <p className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-4 text-center">Cost Mix (Monthly Build)</p>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.breakdownData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {stats.breakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '10px', color: '#fff' }} 
                          itemStyle={{ color: '#fff' }}
                          formatter={(value: number) => `$${value.toLocaleString()}`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
                    {stats.breakdownData.map((entry, index) => (
                      <div key={index} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-tighter">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest mb-4">Cost Allocation Matrix (Monthly Build)</p>
              <div className="grid grid-cols-4 gap-4 text-[10px] font-mono">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between h-20 group hover:border-blue-500/30 transition-colors">
                  <span className="text-slate-500 uppercase tracking-tighter">GPU Compute</span>
                  <span className="font-bold text-white text-sm">${stats.infrastructureCost.toLocaleString()}</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between h-20 group hover:border-emerald-500/30 transition-colors">
                  <span className="text-slate-500 uppercase tracking-tighter">ML talent</span>
                  <span className="font-bold text-white text-sm">${stats.talentCost.toLocaleString()}</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between h-20 group hover:border-indigo-500/30 transition-colors">
                  <span className="text-slate-500 uppercase tracking-tighter">Ops Overhead</span>
                  <span className="font-bold text-white text-sm">${stats.opsOverhead.toLocaleString()}</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between h-20 group hover:border-slate-500/30 transition-colors">
                  <span className="text-slate-500 uppercase tracking-tighter">Capacity</span>
                  <span className="font-bold text-slate-400 text-sm">{(stats.totalMonthlyTokens / 1000000).toFixed(0)}M Tok</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-blue-500/40 border-dashed bg-blue-500/5 rounded-2xl overflow-hidden relative group">
        <CardContent className="py-8 px-8 flex items-center gap-6 relative z-10">
          <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/30">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-lg text-white tracking-tight mb-1">Architecture Insight: The "Llama 3 Gap"</h4>
            <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
              Based on your unique traffic profile, initializing a private transition to **Llama 3 70B** would reclaim <span className="font-bold text-blue-400">${Math.max(0, stats.savings).toLocaleString()}</span> in monthly cloud waste.
            </p>
          </div>
          <Button className="bg-white text-blue-600 hover:bg-slate-100 font-bold uppercase tracking-widest text-[10px] px-8 py-6 rounded-xl">
            Launch transition plan
          </Button>
        </CardContent>
        <div className="absolute right-0 top-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl" />
      </Card>
    </div>

  );
}
