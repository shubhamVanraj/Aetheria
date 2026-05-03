/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BarChart3, 
  Calculator, 
  LayoutDashboard, 
  Layers, 
  Settings, 
  Activity,
  ChevronRight,
  TrendingUp,
  Cpu,
  Monitor,
  Database,
  CheckCircle2,
  Bell,
  Plus,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  Legend,
  AreaChart,
  Area
} from 'recharts';

import { BuildVsBuyCalculator } from '@/src/components/BuildVsBuyCalculator';
import { CloudInfrastructure } from '@/src/components/CloudInfrastructure';

// Mock Data
const COMPARISON_DATA = [
  { month: 'Jan', api: 12000, selfHosted: 25000 },
  { month: 'Feb', api: 18000, selfHosted: 25000 },
  { month: 'Mar', api: 32000, selfHosted: 26000 },
  { month: 'Apr', api: 45000, selfHosted: 26500 },
  { month: 'May', api: 62000, selfHosted: 27000 },
  { month: 'Jun', api: 85000, selfHosted: 28000 },
];

const QUERY_STATS = [
  { time: '10:01:12', cost: 0.0042, model: 'GPT-4o', latency: '640ms' },
  { time: '10:01:15', cost: 0.0012, model: 'Claude 3.5', latency: '420ms' },
  { time: '10:01:22', cost: 0.0038, model: 'GPT-4o', latency: '580ms' },
  { time: '10:01:28', cost: 0.0008, model: 'Llama 3 70B', latency: '310ms' },
];

const PRICING_PLANS = [
  { name: 'Starter', price: '$0', features: ['Up to 1M queries', 'Basic Calculator', 'Web Connectors'], current: false },
  { name: 'Professional', price: '$499', features: ['Up to 50M queries', 'Real-time API Hook', 'Auto-Transition Plan'], current: true },
  { name: 'Enterprise', price: 'Custom', features: ['Unlimited scale', 'SSO/SAML', 'Cluster Management'], current: false },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'budget', threshold: 100000, current: 42891, active: true },
    { id: 2, type: 'model', model: 'GPT-4o', threshold: 5000, current: 3200, active: true },
  ]);

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-600/30">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900/40 border-r border-slate-800/60 flex flex-col pt-6 backdrop-blur-xl">
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">AETHERIA</span>
        </div>

        <nav className="flex-1 px-3 space-y-2">
          <NavItem 
            icon={<LayoutDashboard className="w-4 h-4" />} 
            label="Dashboard" 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')} 
          />
          <NavItem 
            icon={<Calculator className="w-4 h-4" />} 
            label="Build vs Buy" 
            active={activeTab === 'calculator'} 
            onClick={() => setActiveTab('calculator')} 
          />
          <NavItem 
            icon={<TrendingUp className="w-4 h-4" />} 
            label="Platform Pricing" 
            active={activeTab === 'pricing'} 
            onClick={() => setActiveTab('pricing')} 
          />
          <NavItem 
            icon={<Layers className="w-4 h-4" />} 
            label="Cloud Infrastructure" 
            active={activeTab === 'infrastructure'} 
            onClick={() => setActiveTab('infrastructure')} 
          />
          <NavItem 
            icon={<Bell className="w-4 h-4" />} 
            label="Cost Alerts" 
            active={activeTab === 'alerts'} 
            onClick={() => setActiveTab('alerts')} 
          />
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
            <p className="text-[10px] font-mono text-slate-500 mb-2 uppercase tracking-widest">Monthly Budget</p>
            <div className="flex justify-between items-end mb-2">
              <span className="text-xl font-mono font-medium text-white">$42.8k</span>
              <span className="text-xs text-slate-500">/ $100k</span>
            </div>
            <Progress value={42.8} className="h-1 bg-slate-800" />
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800 italic text-[10px] text-slate-500 flex items-center justify-between">
            <span>v1.0.4 Enterprise</span>
            <div className="flex gap-2">
              <Settings className="w-3 h-3 hover:text-slate-300 cursor-pointer" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto flex flex-col">
        {/* Top Header Bar */}
        <header className="h-16 bg-slate-950/80 border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-white tracking-tight">
              {activeTab === 'overview' ? 'Compute Intelligence' : 
               activeTab === 'calculator' ? 'Strategy Simulator' : 
               activeTab === 'infrastructure' ? 'Cluster Control Plane' :
               activeTab === 'alerts' ? 'Governance Gates' :
               'Platform Configuration'}
            </h1>
            <Badge variant="outline" className="font-mono text-[10px] uppercase border-slate-700 text-slate-400">Region: US-EAST-1</Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-mono text-slate-500 uppercase">Live Efficiency</p>
              <p className="text-sm font-mono font-medium text-emerald-400">92.4% / High</p>
            </div>
            <Separator orientation="vertical" className="h-8 bg-slate-800" />
            <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20">Sync Data</Button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
          
          {activeTab === 'overview' && (
            <div className="grid grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Alert Status Banner */}
              {alerts.some(a => (a.current / a.threshold) > 0.8) && (
                <Card className="col-span-12 bg-rose-500/10 border-rose-500/20 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                    <div>
                      <p className="text-sm font-bold text-rose-400">Critical Threshold Warning</p>
                      <p className="text-xs text-rose-400/70">Budget utilization for GPT-4o has exceeded 80% of monthly threshold.</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest text-rose-400 hover:bg-rose-500/20 hover:text-rose-300" onClick={() => setActiveTab('alerts')}>
                    Mitigate Now
                  </Button>
                </Card>
              )}

              {/* Metrics Grid */}
              <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard 
                  label="Avg Query Cost" 
                  value="$0.0034" 
                  trend="+2.4%" 
                  trendType="up" 
                  icon={<Cpu className="w-4 h-4 text-blue-400" />} 
                  description="Average cost per individual LLM request across all providers and self-hosted clusters."
                />
                <StatCard 
                  label="Total Tokens (24h)" 
                  value="12.8M" 
                  trend="-12.1%" 
                  trendType="down" 
                  icon={<Database className="w-4 h-4 text-emerald-400" />} 
                  description="The cumulative sum of input and output tokens processed in the last 24-hour cycle."
                />
                <StatCard 
                  label="Cloud Commit" 
                  value="$8,240" 
                  trend="Target: $10k" 
                  icon={<Monitor className="w-4 h-4 text-indigo-400" />} 
                  description="Total provisioned expenditure across AWS, GCP, and Azure for reserved instance capacity."
                />
                <StatCard 
                  label="Optimization" 
                  value="92%" 
                  trend="Health: A+" 
                  icon={<Activity className="w-4 h-4 text-rose-400" />} 
                  description="Weighted score of compute efficiency, latency SLA compliance, and spot instance utilization."
                />
              </div>

              {/* Primary Chart: Build vs Buy Projections */}
              <Card className="col-span-12 lg:col-span-8 bg-slate-900/50 border-slate-800 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800/50 pb-4">
                  <div>
                    <CardTitle className="text-sm font-semibold uppercase tracking-widest text-slate-500">Infrastructure Scaling Analysis</CardTitle>
                    <CardDescription className="text-slate-400">Unit cost delta between managed API and private cluster</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">Real-time Feed</Badge>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-[350px] w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={COMPARISON_DATA}>
                        <defs>
                          <linearGradient id="colorApi" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorBuild" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontFamily: 'monospace'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontFamily: 'monospace'}} tickFormatter={(val) => `$${val/1000}k`} />
                        <RechartsTooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
                          itemStyle={{ fontSize: '12px' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                        <Area type="monotone" dataKey="api" name="Direct API Spend" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorApi)" />
                        <Area type="monotone" dataKey="selfHosted" name="Self-Hosted Baseline" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorBuild)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Right Panel: Live Query Costing Feed */}
              <Card className="col-span-12 lg:col-span-4 bg-slate-900/50 border-slate-800 shadow-xl rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800/50 pb-4">
                  <CardTitle className="text-sm font-semibold uppercase tracking-widest text-slate-500">Live Traffic</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-emerald-400 font-mono">STABLE</span>
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {QUERY_STATS.map((query, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-950 border border-slate-800 group transition-all hover:border-slate-700">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-mono text-slate-500">{query.time}</span>
                            <Badge variant="outline" className="px-1 py-0 h-4 text-[8px] font-mono uppercase border-slate-800 bg-slate-900 text-slate-400">{query.model}</Badge>
                          </div>
                          <div className="text-xs font-medium text-slate-300">Compute Allocation</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-mono font-bold text-white">${query.cost}</div>
                          <div className="text-[9px] font-mono text-slate-500">{query.latency}</div>
                        </div>
                      </div>
                    ))}
                    <Button variant="ghost" className="w-full text-[10px] text-slate-500 font-bold uppercase tracking-widest hover:text-white group">
                      Detailed Audit Log <ChevronRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Bottom Analysis Cards */}
              <Card className="col-span-12 lg:col-span-7 bg-slate-900/80 border-slate-800 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Strategic Market Gap</h3>
                  <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 text-[9px]">Priority α</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2 border-l-2 border-orange-500/50 pl-4">
                    <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Current Deficiency</p>
                    <p className="text-sm font-semibold text-white">Cross-Region Latency Bias</p>
                    <p className="text-xs text-slate-400 leading-relaxed">Competitors aggregate global costs but ignore the 14% performance penalty on cross-region GPU clusters.</p>
                  </div>
                  <div className="space-y-2 border-l-2 border-blue-500/50 pl-4">
                    <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Aetheria Advantage</p>
                    <p className="text-sm font-semibold text-white">Auto-Distillation Routing</p>
                    <p className="text-xs text-slate-400 leading-relaxed">Our engine automatically switches between small and large models based on task complexity, saving 40% on average.</p>
                  </div>
                </div>
              </Card>

              <Card className="col-span-12 lg:col-span-5 bg-blue-600 rounded-2xl p-6 text-white relative overflow-hidden group">
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Current Active Plan</h3>
                    <div className="text-3xl font-bold tracking-tight">$4,999<span className="text-sm font-normal opacity-70">/mo</span></div>
                  </div>
                  <div className="space-y-3 mt-6">
                    <div className="flex items-center gap-2 text-xs font-medium bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/10 uppercase tracking-tight">
                      <CheckCircle2 className="w-4 h-4" /> Real-time Anomaly Guard
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/10 uppercase tracking-tight">
                      <CheckCircle2 className="w-4 h-4" /> Multi-Cloud Sync (AWS/GCP/AZ)
                    </div>
                  </div>
                  <Button className="mt-6 w-full bg-white text-blue-600 hover:bg-slate-100 font-bold uppercase text-[10px] tracking-widest py-6">
                    Upgrade Workspace
                  </Button>
                </div>
                <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors" />
              </Card>

              {/* Scenarios Section */}
              <div className="col-span-12">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Compute Strategy Scenarios</h3>
                   <Badge variant="outline" className="border-slate-800 text-[10px] text-slate-500 italic">Self-Explainer</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <ScenarioCard 
                      title="The Latency Bias" 
                      problem="Apps in EMEA using US-East-1 GPUs experience 180ms extra latency, costing user engagement."
                      solution="Aetheria detects peak latency and cross-routes payloads to local EU-West-1 L40S spot instances."
                   />
                   <ScenarioCard 
                      title="Shadow AI Decay" 
                      problem="Developers spinning up unmonitored A100s for test-dev without budget gates."
                      solution="Our 'Control Plane' detects orphaned clusters and forces model distillation to cheaper L4 nodes."
                   />
                   <ScenarioCard 
                      title="Model Distillation" 
                      problem="Using GPT-4o for simple classification tasks is 22x more expensive than needed."
                      solution="We monitor semantic complexity and automatically route 'simple' queries to self-hosted Llama 3."
                   />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'infrastructure' && <CloudInfrastructure />}

          {activeTab === 'alerts' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tighter">Cost-Based Governance</h2>
                  <p className="text-slate-500 text-sm">Define automated triggers for budget protection and anomaly detection.</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-500 font-bold uppercase text-[10px] tracking-widest py-6 px-6">
                      <Plus className="w-4 h-4 mr-2" /> Create Alert Trigger
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-800 text-white">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">New Cost Threshold</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Alert Type</Label>
                        <select className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-sm">
                          <option>Total Monthly Spend</option>
                          <option>Model-Specific Utilization</option>
                          <option>Anomaly / Spike Detection</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Threshold ($)</Label>
                        <Input placeholder="5000" className="bg-slate-950 border-slate-800 text-white" />
                      </div>
                      <div className="space-y-2">
                        <Label>Notification Channel</Label>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="cursor-pointer border-slate-700 hover:border-blue-500">Slack</Badge>
                          <Badge variant="outline" className="cursor-pointer border-slate-700 hover:border-blue-500">Email</Badge>
                          <Badge variant="outline" className="cursor-pointer border-slate-700 hover:border-blue-500">System Notification</Badge>
                        </div>
                      </div>
                      <Button className="w-full bg-blue-600 hover:bg-blue-500 font-bold uppercase text-xs tracking-widest mt-4">Deploy Trigger</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {alerts.map((alert) => (
                  <Card key={alert.id} className="bg-slate-900/50 border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800/50">
                      <div>
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                          {alert.type === 'budget' ? 'Total Budget Gate' : `${alert.model} Monitor`}
                        </CardTitle>
                        <CardDescription className="text-[10px] font-mono text-slate-500 mt-1">ID: TRG-0{alert.id}-INFRA</CardDescription>
                      </div>
                      <Badge className={alert.active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500'}>
                        {alert.active ? 'Live' : 'Paused'}
                      </Badge>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] uppercase font-mono text-slate-500 mb-1">Consumption</p>
                          <p className="text-2xl font-mono font-bold text-white tracking-tighter">${alert.current.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase font-mono text-slate-500 mb-1">Threshold</p>
                          <p className="text-lg font-mono font-medium text-slate-400">${alert.threshold.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-mono uppercase">
                          <span className="text-slate-500">Burn Rate</span>
                          <span className={`${(alert.current / alert.threshold) > 0.8 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {Math.round((alert.current / alert.threshold) * 100)}%
                          </span>
                        </div>
                        <Progress value={(alert.current / alert.threshold) * 100} className={`h-1.5 bg-slate-800 ${ (alert.current / alert.threshold) > 0.8 ? '[&>div]:bg-rose-500' : '[&>div]:bg-emerald-500'}`} />
                      </div>

                      <div className="pt-4 border-t border-slate-800 flex justify-between gap-4">
                        <Button variant="ghost" className="flex-1 text-[10px] uppercase font-bold tracking-widest text-slate-500 hover:text-white">Edit Gateway</Button>
                        <Button variant="ghost" className="flex-1 text-[10px] uppercase font-bold tracking-widest text-slate-500 hover:text-rose-400">Disable</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'calculator' && <BuildVsBuyCalculator />}

          {activeTab === 'pricing' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {PRICING_PLANS.map((plan) => (
                <Card key={plan.name} className={`bg-slate-900 border-slate-800 shadow-2xl rounded-2xl overflow-hidden flex flex-col transition-all duration-300 ${plan.current ? 'ring-2 ring-blue-500 ring-offset-4 ring-offset-slate-950 scale-[1.02]' : 'hover:-translate-y-1'}`}>
                  <CardHeader className="pb-8 p-8 border-b border-slate-800/50">
                    <div className="flex justify-between items-start mb-6">
                      <CardTitle className="text-xl font-bold text-white">{plan.name}</CardTitle>
                      {plan.current && <Badge className="bg-blue-600 text-white border-0 py-1">Active Now</Badge>}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold text-white tracking-tighter">{plan.price}</span>
                      {plan.price !== 'Custom' && <span className="text-slate-500 text-sm font-mono">/ mo</span>}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-6 p-8">
                    <ul className="space-y-4">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <div className="p-8 pt-0 mt-auto">
                    <Button 
                      className={`w-full py-6 font-bold uppercase tracking-widest text-[10px] ${plan.current ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}
                      variant="default"
                    >
                      {plan.current ? 'Launch Suite' : 'Subscribe Now'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
    </TooltipProvider>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick} 
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
        active 
          ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(37,99,235,0.05)]' 
          : 'text-slate-500 hover:text-slate-200 hover:bg-slate-900/50'
      }`}
    >
      <span className={`${active ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'} transition-colors`}>
        {icon}
      </span>
      <span className="text-sm font-medium tracking-tight whitespace-nowrap">{label}</span>
      {active && <div className="absolute left-1 w-1 h-4 bg-blue-600 rounded-full" />}
    </button>
  );
}

function StatCard({ label, value, trend, trendType = 'neutral', icon, description }: { label: string, value: string, trend: string, trendType?: 'up' | 'down' | 'neutral', icon: React.ReactNode, description?: string }) {
  const cardContent = (
    <Card className="bg-slate-900/50 border-slate-800 shadow-sm transition-all hover:bg-slate-900 hover:border-slate-700 group rounded-2xl cursor-help">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.2em]">{label}</p>
          <div className="p-2 rounded-lg bg-slate-950 group-hover:scale-110 transition-transform">
            {icon}
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-mono font-bold text-white tracking-tighter">{value}</h3>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            trendType === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 
            trendType === 'down' ? 'bg-rose-500/10 text-rose-400' : 
            'bg-slate-800 text-slate-500'
          }`}>
            {trend}
          </span>
        </div>
      </CardContent>
    </Card>
  );

  if (!description) return cardContent;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {cardContent}
      </TooltipTrigger>
      <TooltipContent className="bg-slate-900 border-slate-800 text-slate-300 text-xs p-3 max-w-[200px]">
        <p>{description}</p>
      </TooltipContent>
    </Tooltip>
  );
}


function ScenarioCard({ title, problem, solution }: { title: string, problem: string, solution: string }) {
  return (
    <Card className="bg-slate-900/30 border-slate-800/60 p-6 rounded-2xl hover:border-blue-500/30 transition-all group">
      <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
        {title}
      </h4>
      <div className="space-y-4">
        <div>
          <p className="text-[10px] uppercase font-mono text-slate-500 mb-1">The Problem</p>
          <p className="text-xs text-slate-400 italic">"{problem}"</p>
        </div>
        <div className="pt-3 border-t border-slate-800">
          <p className="text-[10px] uppercase font-mono text-blue-400 mb-1">The Response</p>
          <p className="text-xs text-slate-300">{solution}</p>
        </div>
      </div>
    </Card>
  );
}

function TableRow({ name, type, cost, gap, reliability }: { name: string, type: string, cost: string, gap: string, reliability: string }) {
  return (
    <tr className="hover:bg-zinc-50 transition-colors group">
      <td className="px-6 py-4 pl-9">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-zinc-300 group-hover:bg-zinc-900 transition-colors" />
          <span className="text-sm font-medium text-zinc-700">{name}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-xs text-zinc-500 font-mono italic">{type}</td>
      <td className="px-6 py-4 text-xs font-mono font-medium text-zinc-900">{cost}</td>
      <td className="px-6 py-4 italic">
        <Badge className="font-mono text-[9px] uppercase h-5 bg-white border border-zinc-200 text-zinc-500 shadow-none">
          {gap}
        </Badge>
      </td>
      <td className="px-6 py-4 text-xs font-mono text-zinc-500 text-right pr-9">{reliability}</td>
    </tr>
  );
}
