import { useState } from 'react';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  FaPlug,
  FaKey,
  FaBuilding,
  FaLink,
  FaSyncAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaEyeSlash,
  FaInfoCircle,
  FaClock,
} from 'react-icons/fa';
import { connecteamSettings as defaultSettings } from '@/data/mockData';
import { testConnection } from '@/services/connecteamApi';
import { toast } from 'sonner';

const multiplierLabels: Record<string, string> = {
  regular: 'Regular Shift',
  overtime: 'Overtime Shift',
  weekend: 'Weekend Shift',
  public_holiday: 'Public Holiday',
};

export default function ConnecteamSettings() {
  const [apiKey, setApiKey] = useState(defaultSettings.apiKey);
  const [orgId, setOrgId] = useState(defaultSettings.organizationId);
  const [webhookUrl, setWebhookUrl] = useState(defaultSettings.webhookUrl);
  const [syncFrequency, setSyncFrequency] = useState(defaultSettings.syncFrequency);
  const [autoSync, setAutoSync] = useState(defaultSettings.autoSync);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isConnected, setIsConnected] = useState(defaultSettings.isConnected);
  const [isTesting, setIsTesting] = useState(false);
  const [multipliers, setMultipliers] = useState({ ...defaultSettings.shiftMultipliers });

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const result = await testConnection(apiKey, orgId);
      if (result.success) {
        setIsConnected(true);
        toast.success(result.message);
      } else {
        setIsConnected(false);
        toast.error(result.message);
      }
    } catch {
      setIsConnected(false);
      toast.error('Connection test failed');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveSettings = () => {
    if (!apiKey || !orgId) {
      toast.error('API Key and Organization ID are required');
      return;
    }
    toast.success('Connecteam settings saved');
  };

  const updateMultiplier = (key: string, value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0) {
      setMultipliers((prev) => ({ ...prev, [key]: num }));
    }
  };

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Connecteam Settings"
        subtitle="Configure Connecteam time clock API integration"
      />

      <div className="p-4 md:p-6 space-y-6 max-w-3xl">
        {/* Connection Status Banner */}
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${isConnected ? 'bg-success/5 border-success/20' : 'bg-muted/30 border-border'}`}>
          {isConnected ? (
            <FaCheckCircle className="w-5 h-5 text-success flex-shrink-0" />
          ) : (
            <FaTimesCircle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          )}
          <div>
            <p className="font-medium text-sm">
              {isConnected ? 'Connected to Connecteam' : 'Not Connected'}
            </p>
            <p className="text-xs text-muted-foreground">
              {isConnected
                ? `Last sync: ${new Date(defaultSettings.lastSync).toLocaleString()}`
                : 'Enter your API credentials below and test the connection'}
            </p>
          </div>
        </div>

        {/* API Credentials */}
        <div className="audit-card">
          <div className="audit-card-header">
            <div className="flex items-center gap-2">
              <FaKey className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">API Credentials</h3>
            </div>
          </div>
          <div className="audit-card-body space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <div className="relative">
                <Input
                  id="api-key"
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Connecteam API key"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showApiKey ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <FaInfoCircle className="w-3 h-3" />
                Found in Connecteam Dashboard &gt; Settings &gt; API & Integrations
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-id">Organization ID</Label>
              <div className="flex items-center gap-2">
                <FaBuilding className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <Input
                  id="org-id"
                  value={orgId}
                  onChange={(e) => setOrgId(e.target.value)}
                  placeholder="e.g., org_abc123"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhook-url">Webhook URL (optional)</Label>
              <div className="flex items-center gap-2">
                <FaLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <Input
                  id="webhook-url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://your-domain.com/api/connecteam/webhook"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Receive real-time shift updates from Connecteam via webhook
              </p>
            </div>

            <Button
              onClick={handleTestConnection}
              disabled={isTesting || !apiKey || !orgId}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <FaPlug className={`w-4 h-4 mr-2 ${isTesting ? 'animate-pulse' : ''}`} />
              {isTesting ? 'Testing Connection...' : 'Test Connection'}
            </Button>
          </div>
        </div>

        {/* Sync Settings */}
        <div className="audit-card">
          <div className="audit-card-header">
            <div className="flex items-center gap-2">
              <FaSyncAlt className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Sync Settings</h3>
            </div>
          </div>
          <div className="audit-card-body space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Automatic Sync</p>
                <p className="text-xs text-muted-foreground">Automatically import hours on schedule</p>
              </div>
              <Switch checked={autoSync} onCheckedChange={setAutoSync} />
            </div>

            {autoSync && (
              <div className="space-y-2">
                <Label>Sync Frequency</Label>
                <Select value={syncFrequency} onValueChange={setSyncFrequency}>
                  <SelectTrigger className="w-full sm:w-48">
                    <FaClock className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Every hour</SelectItem>
                    <SelectItem value="every6h">Every 6 hours</SelectItem>
                    <SelectItem value="daily">Daily (midnight)</SelectItem>
                    <SelectItem value="weekly">Weekly (Monday)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        {/* Shift Multipliers */}
        <div className="audit-card">
          <div className="audit-card-header">
            <div className="flex items-center gap-2">
              <FaClock className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Shift Point Multipliers</h3>
            </div>
          </div>
          <div className="audit-card-body">
            <p className="text-xs text-muted-foreground mb-4">
              Points formula: Hours worked × Hourly rate × Profession rate × Shift multiplier
            </p>
            <div className="space-y-3">
              {Object.entries(multipliers).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">{multiplierLabels[key] || key}</p>
                    <p className="text-xs text-muted-foreground">
                      Example: 8h × $35 × 0.5 × {value}x = {Math.round(8 * 35 * 0.5 * value)} pts
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.5"
                      min="1"
                      max="5"
                      value={value}
                      onChange={(e) => updateMultiplier(key, e.target.value)}
                      className="w-20 text-center"
                    />
                    <span className="text-sm text-muted-foreground">x</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleSaveSettings} className="flex-1 sm:flex-none">
            Save Settings
          </Button>
          <Button variant="outline" onClick={() => toast.info('Settings reset to defaults')}>
            Reset Defaults
          </Button>
        </div>
      </div>
    </div>
  );
}
