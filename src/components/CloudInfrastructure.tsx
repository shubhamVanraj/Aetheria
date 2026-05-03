
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Server, Globe, Shield, Zap, Circle } from 'lucide-react';

export function CloudInfrastructure() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CloudProviderCard 
          name="AWS SageMaker" 
          region="us-east-1"
          utilization={78}
          cost="$54,201"
          color="text-orange-400"
          status="Operational"
        />
        <CloudProviderCard 
          name="GCP Vertex AI" 
          region="asia-east1"
          utilization={42}
          cost="$31,042"
          color="text-blue-400"
          status="Operational"
        />
        <CloudProviderCard 
          name="Azure AI" 
          region="westeurope"
          utilization={91}
          cost="$57,648"
          color="text-indigo-400"
          status="High Load"
        />
      </div>

      <Card className="bg-slate-900/50 border-slate-800 rounded-2xl">
        <CardHeader className="border-b border-slate-800/50">
          <CardTitle className="text-sm font-semibold uppercase tracking-widest text-slate-500">Global Cluster Orchestration</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-950/50">
                <tr>
                  <th className="px-6 py-4 text-[10px] uppercase font-mono text-slate-500 tracking-widest">Cluster ID</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-mono text-slate-500 tracking-widest">Provider</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-mono text-slate-500 tracking-widest">Type</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-mono text-slate-500 tracking-widest">Spot Health</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-mono text-slate-500 tracking-widest text-right">Latency (p99)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                <ClusterRow id="CL-A100-US" provider="AWS" type="Llama 3 70B" spot="92%" latency="420ms" />
                <ClusterRow id="CL-H100-ASIA" provider="GCP" type="Mistral Large" spot="100%" latency="180ms" />
                <ClusterRow id="CL-L40S-EU" provider="Azure" type="Internal RAG" spot="45%" latency="840ms" />
                <ClusterRow id="CL-L4-PREEMPT" provider="AWS" type="Batch Extract" spot="12%" latency="12.4s" />
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CloudProviderCard({ name, region, utilization, cost, color, status }: any) {
  return (
    <Card className="bg-slate-900 border-slate-800 rounded-2xl overflow-hidden group hover:border-slate-700 transition-all">
      <div className={`h-1 w-full bg-slate-800 overflow-hidden`}>
          <div className={`h-full ${color.replace('text', 'bg')} transition-all`} style={{ width: `${utilization}%` }} />
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-bold text-white tracking-tight">{name}</h3>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1 mt-1">
              <Globe className="w-3 h-3" /> {region}
            </p>
          </div>
          <Badge variant="outline" className={`${color} border-current/20 bg-current/5 text-[9px] uppercase`}>{status}</Badge>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Usage</span>
            <span className="text-sm font-mono font-bold text-white">{utilization}%</span>
          </div>
          <Progress value={utilization} className="h-1 bg-slate-800" />
          <div className="pt-4 border-t border-slate-800 flex justify-between">
            <div className="text-[10px] text-slate-500 uppercase">MTD Spend</div>
            <div className="text-sm font-mono font-bold text-white">{cost}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ClusterRow({ id, provider, type, spot, latency }: any) {
  return (
    <tr className="hover:bg-slate-800/30 transition-colors">
      <td className="px-6 py-4 font-mono text-[11px] text-slate-300 font-bold">{id}</td>
      <td className="px-6 py-4 text-xs font-medium text-slate-400">{provider}</td>
      <td className="px-6 py-4">
        <Badge variant="outline" className="text-[9px] border-slate-700 text-slate-500">{type}</Badge>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
           <Zap className={`w-3 h-3 ${parseInt(spot) > 80 ? 'text-emerald-400' : 'text-orange-400'}`} />
           <span className="text-xs font-mono text-slate-300">{spot}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-right text-xs font-mono text-slate-400">{latency}</td>
    </tr>
  );
}
