import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Terminal, 
  Cloud, 
  Webhook, 
  Code2, 
  ShieldCheck, 
  Zap,
  ArrowRight,
  Blocks,
  Network
} from 'lucide-react';

export function IntegrationGuide() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="max-w-4xl space-y-4">
        <h2 className="text-3xl font-bold text-white tracking-tight">Enterprise Integration Blueprint</h2>
        <p className="text-slate-400 leading-relaxed">
          Aetheria serves as the intelligent orchestration layer between your application and the global GPU supply. 
          Below are the primary vectors for integrating our platform into your existing infrastructure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <IntegrationCard 
          icon={<Terminal className="w-5 h-5 text-blue-400" />}
          title="Direct API Gateway"
          description="Drop-in replacement for standard LLM endpoints. Redirect your traffic through Aetheria to gain instant cost-routing and spot-market resilience."
          tag="Easiest"
          code="BASE_URL = 'https://api.aetheria.ai/v1'"
        />
        <IntegrationCard 
          icon={<Cloud className="w-5 h-5 text-emerald-400" />}
          title="Native SDK Support"
          description="High-performance Python and TypeScript drivers with built-in retry logic, semantic caching, and local-first failover routing."
          tag="Recommended"
          code="pip install aetheria-sdk"
        />
      </div>

      <Card className="bg-slate-900 border-slate-800 rounded-2xl overflow-hidden">
        <CardHeader className="bg-slate-950/50 p-6 border-b border-slate-800">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Network className="text-indigo-400 w-5 h-5" /> Connection Protocols
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-800">
            <ProtocolRow 
              title="Cloud Provider IAM"
              mechanism="OIDC / Role ARN"
              scope="Allows Aetheria to spin up GPU nodes in your VPCs (AWS/GCP/Azure) to maintain data residency."
            />
            <ProtocolRow 
              title="Webhook Governance"
              mechanism="HTTP POST / HMAC"
              scope="Trigger custom alerts or automated failovers to managed APIs when private cluster health dips below 95%."
            />
            <ProtocolRow 
              title="Private Link (VPC)"
              mechanism="AWS PrivateLink / Peering"
              scope="Connect your sensitive workloads to Aetheria clusters without traffic ever touching the public internet."
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
          </div>
          <h4 className="font-bold text-white">Security First</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            SOC2 Type II compliant. All keys are encrypted at rest with hardware-backed HSMs. Aetheria never persists your query data unless auditing is explicitly enabled.
          </p>
        </div>
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-emerald-400" />
          </div>
          <h4 className="font-bold text-white">Real-time Failover</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            If a spot instance cluster is reclaimed by the provider, Aetheria detects it in &lt;100ms and seamlessly routes requests to the next cheapest available resource.
          </p>
        </div>
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <Code2 className="w-5 h-5 text-indigo-400" />
          </div>
          <h4 className="font-bold text-white">Developer Observability</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Full OpenTelemetry support. Export traces, metrics, and logs directly to your existing Datadog, New Relic, or Grafana dashboards.
          </p>
        </div>
      </div>
    </div>
  );
}

function IntegrationCard({ icon, title, description, tag, code }: any) {
  return (
    <Card className="bg-slate-900 border-slate-800 p-6 rounded-2xl group hover:border-slate-600 transition-all cursor-default">
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center border border-slate-800 group-hover:bg-slate-800 transition-colors">
          {icon}
        </div>
        <Badge variant="outline" className="border-slate-800 text-slate-500 text-[10px] uppercase font-mono">{tag}</Badge>
      </div>
      <h3 className="font-bold text-lg text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed mb-6">{description}</p>
      <div className="p-3 bg-slate-950 rounded-lg font-mono text-[11px] text-blue-400 border border-slate-800/50 flex justify-between items-center group-hover:border-blue-500/20">
        <code>{code}</code>
        <ArrowRight className="w-3 h-3 text-slate-600" />
      </div>
    </Card>
  );
}

function ProtocolRow({ title, mechanism, scope }: any) {
  return (
    <div className="p-6 flex flex-col md:flex-row gap-4 md:gap-8 hover:bg-slate-800/20 transition-colors">
      <div className="md:w-48 shrink-0">
        <h4 className="font-bold text-sm text-white mb-1">{title}</h4>
        <p className="text-[10px] font-mono text-indigo-400 uppercase">{mechanism}</p>
      </div>
      <p className="text-sm text-slate-400 leading-relaxed">{scope}</p>
    </div>
  );
}
