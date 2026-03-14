import { useState } from 'react';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuditInfo } from '@/components/ui/audit-info';
import {
  FaGlobe as Globe,
  FaDollarSign as DollarSign,
  FaShieldAlt as Shield,
  FaDatabase as Database,
  FaSave as Save
} from 'react-icons/fa';
import { FaSyncAlt as RotateCcw } from 'react-icons/fa';

export default function Settings() {
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = () => {
    setHasChanges(true);
  };

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="System Configuration"
        subtitle="Manage global system settings"
      />

      <div className="p-6">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">
              <Globe className="w-4 h-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="currency">
              <DollarSign className="w-4 h-4 mr-2" />
              Currency & Rates
            </TabsTrigger>
            <TabsTrigger value="features">
              <Shield className="w-4 h-4 mr-2" />
              Feature Toggles
            </TabsTrigger>
            <TabsTrigger value="data">
              <Database className="w-4 h-4 mr-2" />
              Data Retention
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <div className="audit-card">
              <div className="audit-card-header">
                <h3 className="font-semibold">General Settings</h3>
              </div>
              <div className="audit-card-body space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">System Timezone</Label>
                    <Select defaultValue="australia/sydney" onValueChange={handleChange}>
                      <SelectTrigger id="timezone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="australia/sydney">Australia/Sydney (UTC+10)</SelectItem>
                        <SelectItem value="australia/melbourne">Australia/Melbourne (UTC+10)</SelectItem>
                        <SelectItem value="australia/brisbane">Australia/Brisbane (UTC+10)</SelectItem>
                        <SelectItem value="australia/perth">Australia/Perth (UTC+8)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <Select defaultValue="dd/mm/yyyy" onValueChange={handleChange}>
                      <SelectTrigger id="date-format">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fiscal-year">Fiscal Year Start</Label>
                    <Select defaultValue="july" onValueChange={handleChange}>
                      <SelectTrigger id="fiscal-year">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="january">January</SelectItem>
                        <SelectItem value="april">April</SelectItem>
                        <SelectItem value="july">July</SelectItem>
                        <SelectItem value="october">October</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="week-start">Week Starts On</Label>
                    <Select defaultValue="monday" onValueChange={handleChange}>
                      <SelectTrigger id="week-start">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sunday">Sunday</SelectItem>
                        <SelectItem value="monday">Monday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="audit-card-footer">
                <AuditInfo
                  updatedAt="2024-06-10 09:15"
                  updatedBy="Sarah Chen"
                  onViewHistory={() => {}}
                />
              </div>
            </div>
          </TabsContent>

          {/* Currency Settings */}
          <TabsContent value="currency">
            <div className="audit-card">
              <div className="audit-card-header">
                <h3 className="font-semibold">Currency & Exchange Rates</h3>
              </div>
              <div className="audit-card-body space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Base Currency</Label>
                    <Select defaultValue="aud" onValueChange={handleChange}>
                      <SelectTrigger id="currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aud">AUD - Australian Dollar</SelectItem>
                        <SelectItem value="usd">USD - US Dollar</SelectItem>
                        <SelectItem value="nzd">NZD - New Zealand Dollar</SelectItem>
                        <SelectItem value="gbp">GBP - British Pound</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="points-rate">Points to Currency Rate</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="points-rate"
                        type="number"
                        defaultValue="2"
                        className="w-24"
                        onChange={handleChange}
                      />
                      <span className="text-sm text-muted-foreground">points = $1.00</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="min-withdrawal">Minimum Withdrawal</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">$</span>
                      <Input
                        id="min-withdrawal"
                        type="number"
                        defaultValue="50"
                        className="w-24"
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rounding">Rounding Rule</Label>
                    <Select defaultValue="nearest" onValueChange={handleChange}>
                      <SelectTrigger id="rounding">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="up">Round Up</SelectItem>
                        <SelectItem value="down">Round Down</SelectItem>
                        <SelectItem value="nearest">Round to Nearest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="audit-card-footer">
                <AuditInfo
                  updatedAt="2024-05-28 11:30"
                  updatedBy="Michael Torres"
                  onViewHistory={() => {}}
                />
              </div>
            </div>
          </TabsContent>

          {/* Feature Toggles */}
          <TabsContent value="features">
            <div className="audit-card">
              <div className="audit-card-header">
                <h3 className="font-semibold">Feature Toggles</h3>
              </div>
              <div className="audit-card-body">
                <div className="space-y-6">
                  <div className="flex items-center justify-between py-4 border-b border-border">
                    <div>
                      <p className="font-medium">Self-Service Withdrawals</p>
                      <p className="text-sm text-muted-foreground">
                        Allow users to request withdrawals directly
                      </p>
                    </div>
                    <Switch defaultChecked onCheckedChange={handleChange} />
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-border">
                    <div>
                      <p className="font-medium">Referral Link Sharing</p>
                      <p className="text-sm text-muted-foreground">
                        Enable users to share personal referral links
                      </p>
                    </div>
                    <Switch defaultChecked onCheckedChange={handleChange} />
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-border">
                    <div>
                      <p className="font-medium">Points Balance Visibility</p>
                      <p className="text-sm text-muted-foreground">
                        Show points balance to users on their dashboard
                      </p>
                    </div>
                    <Switch defaultChecked onCheckedChange={handleChange} />
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-border">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Send email notifications for referral events
                      </p>
                    </div>
                    <Switch defaultChecked onCheckedChange={handleChange} />
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-border">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Send SMS notifications for important updates
                      </p>
                    </div>
                    <Switch onCheckedChange={handleChange} />
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-medium">Leaderboard</p>
                      <p className="text-sm text-muted-foreground">
                        Display public referral leaderboard
                      </p>
                    </div>
                    <Switch onCheckedChange={handleChange} />
                  </div>
                </div>
              </div>
              <div className="audit-card-footer">
                <AuditInfo
                  updatedAt="2024-06-12 16:45"
                  updatedBy="Sarah Chen"
                  onViewHistory={() => {}}
                />
              </div>
            </div>
          </TabsContent>

          {/* Data Retention */}
          <TabsContent value="data">
            <div className="audit-card">
              <div className="audit-card-header">
                <h3 className="font-semibold">Data Retention Policies</h3>
              </div>
              <div className="audit-card-body space-y-6">
                <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> Audit logs are retained indefinitely for compliance purposes and cannot be modified.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Inactive User Data</Label>
                    <Select defaultValue="24" onValueChange={handleChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12 months</SelectItem>
                        <SelectItem value="24">24 months</SelectItem>
                        <SelectItem value="36">36 months</SelectItem>
                        <SelectItem value="indefinite">Indefinite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Session Logs</Label>
                    <Select defaultValue="6" onValueChange={handleChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 months</SelectItem>
                        <SelectItem value="6">6 months</SelectItem>
                        <SelectItem value="12">12 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Transaction History</Label>
                    <Select defaultValue="84" onValueChange={handleChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="36">3 years</SelectItem>
                        <SelectItem value="60">5 years</SelectItem>
                        <SelectItem value="84">7 years</SelectItem>
                        <SelectItem value="indefinite">Indefinite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Backup Frequency</Label>
                    <Select defaultValue="daily" onValueChange={handleChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="audit-card-footer">
                <AuditInfo
                  updatedAt="2024-06-01 10:00"
                  updatedBy="Sarah Chen"
                  onViewHistory={() => {}}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Save Actions */}
        {hasChanges && (
          <div className="fixed bottom-0 left-64 right-0 p-4 bg-card border-t border-border flex items-center justify-end gap-3 animate-fade-in">
            <Button variant="outline" onClick={() => setHasChanges(false)}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Discard Changes
            </Button>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
