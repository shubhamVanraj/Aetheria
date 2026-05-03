import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Key, 
  Eye, 
  EyeOff, 
  Trash2, 
  Edit2, 
  Shield, 
  Plus, 
  Lock, 
  AlertCircle,
  Hash,
  Copy,
  Check
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Secret {
  id: string;
  provider: string;
  description: string;
  key: string;
  createdAt: string;
}

export function SecretsManager() {
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showKeyId, setShowKeyId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // For New/Edit
  const [editingSecret, setEditingSecret] = useState<Partial<Secret> | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('aetheria_secrets');
    if (stored) {
      try {
        setSecrets(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse secrets", e);
      }
    }
  }, []);

  const saveSecrets = (newSecrets: Secret[]) => {
    setSecrets(newSecrets);
    localStorage.setItem('aetheria_secrets', JSON.stringify(newSecrets));
  };

  const handleUnlock = () => {
    // Demo password for the secure experience requested
    if (password === 'admin123') {
      setIsUnlocked(true);
      setError('');
    } else {
      setError('Invalid master password. For demo, use "admin123"');
    }
  };

  const handleCreateOrUpdate = () => {
    if (!editingSecret?.provider || !editingSecret?.key) return;

    if (editingSecret.id) {
      // Update
      const updated = secrets.map(s => s.id === editingSecret.id ? { ...s, ...editingSecret as Secret } : s);
      saveSecrets(updated);
    } else {
      // Create
      const newSecret: Secret = {
        id: Math.random().toString(36).substr(2, 9),
        provider: editingSecret.provider,
        description: editingSecret.description || '',
        key: editingSecret.key,
        createdAt: new Date().toISOString()
      };
      saveSecrets([...secrets, newSecret]);
    }
    setEditingSecret(null);
  };

  const handleDelete = (id: string) => {
    saveSecrets(secrets.filter(s => s.id !== id));
  };

  const handleCopy = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isUnlocked) {
    return (
      <div className="flex items-center justify-center h-[60vh] animate-in fade-in zoom-in duration-500">
        <Card className="w-full max-w-md bg-slate-900/50 border-slate-800 shadow-2xl backdrop-blur-xl">
          <CardHeader className="text-center pb-2">
            <div className="w-12 h-12 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
              <Lock className="w-6 h-6 text-blue-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-white tracking-tight">Secrets Vault</CardTitle>
            <CardDescription className="text-slate-500">Enter master password to access encrypted keys</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-mono text-slate-500">Master Password</Label>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-slate-950 border-slate-800 text-white"
                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
              />
              {error && <p className="text-[10px] text-rose-500 font-medium italic">{error}</p>}
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-500 font-bold uppercase text-[10px] tracking-widest py-6" onClick={handleUnlock}>
              Unlock Vault
            </Button>
            <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg flex gap-3">
               <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
               <p className="text-[10px] text-amber-500/80 leading-relaxed italic">
                 Security Note: In this demo environment, secrets are stored in LocalStorage. For production, use Firebase Secrets or HSM-backed vaults.
               </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tighter flex items-center gap-3">
            <Shield className="text-blue-500 w-6 h-6" /> Managed Keys
          </h2>
          <p className="text-slate-500 text-sm">Centralized governance for your cloud provider and model APIs.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-800 text-slate-400 hover:bg-slate-800 text-[10px] font-bold uppercase tracking-widest" onClick={() => setIsUnlocked(false)}>
            Lock Vault
          </Button>
          <Dialog open={!!editingSecret} onOpenChange={(open) => !open && setEditingSecret(null)}>
            <DialogTrigger
              render={
                <Button className="bg-blue-600 hover:bg-blue-500 font-bold uppercase text-[10px] tracking-widest py-6 px-6" onClick={() => setEditingSecret({})}>
                  <Plus className="w-4 h-4 mr-2" /> Add Key
                </Button>
              }
            />
            <DialogContent className="bg-slate-900 border-slate-800 text-white">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">{editingSecret?.id ? 'Edit Internal Key' : 'Provision New Key'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Provider Name</Label>
                  <Input 
                    value={editingSecret?.provider || ''} 
                    onChange={(e) => setEditingSecret({ ...editingSecret, provider: e.target.value })}
                    placeholder="e.g., OpenAI, AWS, GCP" 
                    className="bg-slate-950 border-slate-800 text-white" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description / Usage</Label>
                  <Input 
                    value={editingSecret?.description || ''} 
                    onChange={(e) => setEditingSecret({ ...editingSecret, description: e.target.value })}
                    placeholder="Regional inference cluster A" 
                    className="bg-slate-950 border-slate-800 text-white" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Secret Value</Label>
                  <Input 
                    type="password"
                    value={editingSecret?.key || ''} 
                    onChange={(e) => setEditingSecret({ ...editingSecret, key: e.target.value })}
                    placeholder="sk-..." 
                    className="bg-slate-950 border-slate-800 text-white" 
                  />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-500 font-bold uppercase text-xs tracking-widest mt-4" onClick={handleCreateOrUpdate}>
                  {editingSecret?.id ? 'Save Changes' : 'Confirm & Encrypt'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {secrets.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl group hover:border-blue-500/20 transition-colors">
            <Key className="w-12 h-12 text-slate-800 mx-auto mb-4 group-hover:text-blue-500/40 transition-colors" />
            <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">Vault is currently empty</p>
          </div>
        ) : (
          secrets.map((secret) => (
            <Card key={secret.id} className="bg-slate-900/50 border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all group">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800/50">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center">
                     <Hash className="w-4 h-4 text-blue-500" />
                   </div>
                   <div>
                     <CardTitle className="text-sm font-semibold text-slate-300">{secret.provider}</CardTitle>
                     <p className="text-[10px] font-mono text-slate-500 mt-0.5 uppercase tracking-tighter">ID: KMS-{secret.id.toUpperCase()}</p>
                   </div>
                </div>
                <Badge variant="outline" className="border-slate-800 text-slate-500 text-[9px] uppercase">Active</Badge>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-1.5">
                   <Label className="text-[10px] uppercase font-mono text-slate-500">Access Secret</Label>
                   <div className="flex items-center gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl relative group-hover:border-slate-700 transition-colors">
                      <span className="font-mono text-[11px] text-white truncate max-w-[140px]">
                        {showKeyId === secret.id ? secret.key : '••••••••••••••••••••'}
                      </span>
                      <div className="ml-auto flex items-center gap-2">
                        <button 
                          onClick={() => setShowKeyId(showKeyId === secret.id ? null : secret.id)}
                          className="text-slate-500 hover:text-white transition-colors"
                          title={showKeyId === secret.id ? "Hide Key" : "View Key"}
                        >
                          {showKeyId === secret.id ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button 
                          onClick={() => handleCopy(secret.key, secret.id)}
                          className="text-slate-500 hover:text-white transition-colors"
                          title="Copy to Clipboard"
                        >
                          {copiedId === secret.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                   </div>
                </div>

                <div className="space-y-1">
                   <Label className="text-[10px] uppercase font-mono text-slate-500">Meta Information</Label>
                   <p className="text-xs text-slate-400 italic">"{secret.description || 'System generated'}"</p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-between gap-4">
                  <Button variant="ghost" className="flex-1 text-[10px] uppercase font-bold tracking-widest text-slate-500 hover:text-white hover:bg-slate-800" onClick={() => setEditingSecret(secret)}>
                    <Edit2 className="w-3 h-3 mr-2" /> Modify
                  </Button>
                  <Button variant="ghost" className="flex-1 text-[10px] uppercase font-bold tracking-widest text-slate-500 hover:text-rose-400 hover:bg-rose-500/10" onClick={() => handleDelete(secret.id)}>
                    <Trash2 className="w-3 h-3 mr-2" /> Purge
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
