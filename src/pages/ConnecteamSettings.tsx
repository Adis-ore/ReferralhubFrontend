import { useState, useEffect } from 'react';
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
  FaStar,
  FaUsers,
} from 'react-icons/fa';
import { connecteamApi, brevityApi } from '@/services/api';
import { toast } from 'sonner';

const multiplierLabels: Record<string, string> = {
  regular: 'Regular Shift',
  overtime: 'Overtime Shift',
  weekend: 'Weekend Shift',
  public_holiday: 'Public Holiday',
};

export default function ConnecteamSettings() {
  const [apiKey, setApiKey] = useState('');
  const [orgId, setOrgId] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [syncFrequency, setSyncFrequency] = useState('daily');
  const [autoSync, setAutoSync] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [multipliers, setMultipliers] = useState<Record<string, number>>({
    regular: 1,
    overtime: 1.5,
    weekend: 1.5,
    public_holiday: 2,
  });
  const [pointsPerHour, setPointsPerHour]               = useState(10);
  const [referrerBonusPercentage, setReferrerBonusPct]  = useState(50);
  const [lastSync, setLastSync] = useState<string | null>(null);

  // Brevity state
  const [brevityCompanyCode, setBrevityCompanyCode] = useState('');
  const [brevityApiKey, setBrevityApiKey]           = useState('');
  const [showBrevityKey, setShowBrevityKey]         = useState(false);
  const [brevityConnected, setBrevityConnected]     = useState(false);
  const [brevityTesting, setBrevityTesting]         = useState(false);

  useEffect(() => {
    connecteamApi.getSettings()
      .then((data) => {
        setApiKey(data.apiKey ?? '');
        setOrgId(data.organizationId ?? '');
        setWebhookUrl(data.webhookUrl ?? '');
        setSyncFrequency(data.syncFrequency ?? 'daily');
        setAutoSync(data.autoSync ?? false);
        setIsConnected(data.isConnected ?? false);
        if (data.shiftMultipliers) setMultipliers({ ...data.shiftMultipliers });
        if (data.lastSync) setLastSync(data.lastSync);
        if (data.pointsPerHour        != null) setPointsPerHour(data.pointsPerHour);
        if (data.referrerBonusPercentage != null) setReferrerBonusPct(data.referrerBonusPercentage);
      })
      .catch((err) => toast.error(err.message || 'Failed to load Connecteam settings'));

    brevityApi.getSettings()
      .then((data) => {
        setBrevityCompanyCode(data.companyCode ?? '');
        setBrevityApiKey(data.apiKey ?? '');
        setBrevityConnected(data.isConnected ?? false);
      })
      .catch(() => {});
  }, []);

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const result = await connecteamApi.testConnection(apiKey, orgId);
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
    connecteamApi.updateSettings({
      apiKey,
      organizationId: orgId,
      webhookUrl,
      syncFrequency,
      autoSync,
      shiftMultipliers: multipliers,
      pointsPerHour,
      referrerBonusPercentage,
    })
      .then(() => {
        toast.success('Connecteam settings saved');
      })
      .catch((err) => {
        toast.error(err.message || 'Failed to save settings');
      });
  };

  const handleTestBrevity = async () => {
    if (!brevityCompanyCode || !brevityApiKey) {
      toast.error('Company code and API key are required');
      return;
    }
    setBrevityTesting(true);
    try {
      const res = await brevityApi.testConnection(brevityCompanyCode, brevityApiKey);
      if (res.success) {
        setBrevityConnected(true);
        toast.success(res.message);
        await brevityApi.updateSettings({ companyCode: brevityCompanyCode, apiKey: brevityApiKey });
      } else {
        setBrevityConnected(false);
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error(err.message || 'Connection test failed');
    } finally {
      setBrevityTesting(false);
    }
  };

  const handleSaveBrevity = () => {
    brevityApi.updateSettings({ companyCode: brevityCompanyCode, apiKey: brevityApiKey })
      .then(() => toast.success('Brevity settings saved'))
      .catch((err: any) => toast.error(err.message || 'Failed to save Brevity settings'));
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
                ? `Last sync: ${lastSync ? new Date(lastSync).toLocaleString() : 'N/A'}`
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
        {/* Points Per Hour */}
        <div className="audit-card">
          <div className="audit-card-header">
            <div className="flex items-center gap-2">
              <FaStar className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Points Per Hour</h3>
            </div>
          </div>
          <div className="audit-card-body space-y-4">
            <p className="text-xs text-muted-foreground">
              How many points a staff member earns for each hour worked. Multiplied by the shift multiplier below.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-1">
                <Label>Points per hour worked</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min="1"
                    max="1000"
                    value={pointsPerHour}
                    onChange={(e) => setPointsPerHour(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-28 text-center text-lg font-semibold"
                  />
                  <span className="text-sm text-muted-foreground">pts / hour</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted/40 text-center min-w-[120px]">
                <p className="text-xs text-muted-foreground mb-1">8h regular shift earns</p>
                <p className="text-lg font-bold">{(8 * pointsPerHour * (multipliers.regular || 1)).toLocaleString()} pts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Referrer Bonus */}
        <div className="audit-card">
          <div className="audit-card-header">
            <div className="flex items-center gap-2">
              <FaUsers className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Referrer Bonus</h3>
            </div>
          </div>
          <div className="audit-card-body space-y-4">
            <p className="text-xs text-muted-foreground">
              When a referred staff member's hours are approved, the referrer automatically earns this percentage of the employee's points as a bonus.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-1">
                <Label>Referrer bonus (% of employee's points)</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={referrerBonusPercentage}
                    onChange={(e) => setReferrerBonusPct(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-28 text-center text-lg font-semibold"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted/40 text-center min-w-[140px]">
                <p className="text-xs text-muted-foreground mb-1">Referrer earns per 8h shift</p>
                <p className="text-lg font-bold">{Math.round(8 * pointsPerHour * (referrerBonusPercentage / 100)).toLocaleString()} pts</p>
              </div>
            </div>
            {referrerBonusPercentage === 0 && (
              <p className="text-xs text-warning">Referrer bonus is disabled (0%). Set a value above 0 to reward referrers.</p>
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
              Points formula: Hours × {pointsPerHour} pts/hr × Shift multiplier
            </p>
            <div className="space-y-3">
              {Object.entries(multipliers).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">{multiplierLabels[key] || key}</p>
                    <p className="text-xs text-muted-foreground">
                      Example: 8h × {pointsPerHour} × {value}x = {Math.round(8 * pointsPerHour * value)} pts
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

        {/* ── Brevity Integration ───────────────────────────────────── */}
        <div className="audit-card">
          <div className="audit-card-header">
            <div className="flex items-center gap-2">
              <FaPlug className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Brevity Integration</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${brevityConnected ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                {brevityConnected ? 'Connected' : 'Not Connected'}
              </span>
            </div>
          </div>
          <div className="audit-card-body space-y-4">
            <p className="text-xs text-muted-foreground">
              Connect Brevity to automatically import approved timesheets and award points to staff.
            </p>

            <div className="space-y-1.5">
              <Label htmlFor="brevityCompanyCode">Company Code</Label>
              <Input
                id="brevityCompanyCode"
                value={brevityCompanyCode}
                onChange={(e) => setBrevityCompanyCode(e.target.value)}
                placeholder="e.g. paramountcare"
              />
              <p className="text-xs text-muted-foreground">Found in Brevity → System Setup → Organisation</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="brevityApiKey">Brevity API Key</Label>
              <div className="relative">
                <Input
                  id="brevityApiKey"
                  type={showBrevityKey ? 'text' : 'password'}
                  value={brevityApiKey}
                  onChange={(e) => setBrevityApiKey(e.target.value)}
                  placeholder="Your Brevity API key"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowBrevityKey(!showBrevityKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showBrevityKey ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Found in Brevity → System Setup → API Settings</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleTestBrevity} disabled={brevityTesting} className="gap-2">
                <FaLink className="w-3.5 h-3.5" />
                {brevityTesting ? 'Testing...' : 'Test Connection'}
              </Button>
              <Button onClick={handleSaveBrevity} className="gap-2">
                <FaKey className="w-3.5 h-3.5" /> Save Brevity Credentials
              </Button>
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
