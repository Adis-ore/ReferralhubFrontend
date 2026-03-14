import { useState } from 'react';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuditInfo } from '@/components/ui/audit-info';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/data-table';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import {
  FaDollarSign,
  FaChartLine,
  FaPlus,
  FaCalendar,
  FaCheck,
  FaClock,
  FaExclamationTriangle,
  FaInfoCircle,
  FaArrowRight,
  FaUserMd,
  FaSave,
  FaToggleOn,
  FaToggleOff
} from 'react-icons/fa';
import { FaHistory } from 'react-icons/fa';
import { GiTwoCoins } from 'react-icons/gi';
import { cn } from '@/lib/utils';
import { professionRates as initialProfessionRates } from '@/data/mockData';

interface ProfessionRate {
  id: number;
  classification: string;
  pointsPerUnit: number;
  cashPerPoint: number;
  currencySymbol: string;
  currencyCode: string;
  isActive: boolean;
}

interface ConversionRate {
  id: string;
  pointsPerUnit: number;
  currencyCode: string;
  currencySymbol: string;
  effectiveFrom: string;
  effectiveTo?: string;
  status: 'active' | 'scheduled' | 'expired';
  createdBy: string;
  createdAt: string;
}

const mockRates: ConversionRate[] = [
  { 
    id: 'CR-001', 
    pointsPerUnit: 2, 
    currencyCode: 'AUD', 
    currencySymbol: '$',
    effectiveFrom: '2024-01-01', 
    status: 'active',
    createdBy: 'Sarah Chen',
    createdAt: '2023-12-15 09:00'
  },
  { 
    id: 'CR-002', 
    pointsPerUnit: 1.5, 
    currencyCode: 'AUD', 
    currencySymbol: '$',
    effectiveFrom: '2024-07-01', 
    status: 'scheduled',
    createdBy: 'Michael Torres',
    createdAt: '2024-06-10 14:30'
  },
  { 
    id: 'CR-003', 
    pointsPerUnit: 2.5, 
    currencyCode: 'AUD', 
    currencySymbol: '$',
    effectiveFrom: '2023-06-01', 
    effectiveTo: '2023-12-31',
    status: 'expired',
    createdBy: 'Sarah Chen',
    createdAt: '2023-05-20 11:00'
  },
];

const currencies = [
  { code: 'AUD', name: 'Australian Dollar', symbol: '$' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: '$' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
];

export default function PointsConfiguration() {
  const [activeTab, setActiveTab] = useState('current');
  const [showNewRate, setShowNewRate] = useState(false);
  const [showDeactivate, setShowDeactivate] = useState(false);
  
  // Profession rates state
  const [professionRates, setProfessionRates] = useState<ProfessionRate[]>(
    initialProfessionRates as ProfessionRate[]
  );
  const [editingRateId, setEditingRateId] = useState<number | null>(null);
  const [editCashPerPoint, setEditCashPerPoint] = useState('');

  // New rate form
  const [newCurrency, setNewCurrency] = useState('AUD');
  const [newPointsPerUnit, setNewPointsPerUnit] = useState('2');
  const [newEffectiveDate, setNewEffectiveDate] = useState('');

  const activeRate = mockRates.find(r => r.status === 'active');
  const scheduledRate = mockRates.find(r => r.status === 'scheduled');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <FaCheck className="w-4 h-4" />;
      case 'scheduled': return <FaClock className="w-4 h-4" />;
      default: return <FaHistory className="w-4 h-4" />;
    }
  };

  const historyColumns = [
    {
      key: 'id',
      header: 'Rate ID',
      render: (r: ConversionRate) => <span className="font-mono text-sm">{r.id}</span>,
    },
    {
      key: 'rate',
      header: 'Conversion Rate',
      render: (r: ConversionRate) => (
        <span className="font-medium">{r.pointsPerUnit} pts = {r.currencySymbol}1.00</span>
      ),
    },
    {
      key: 'currency',
      header: 'Currency',
      render: (r: ConversionRate) => r.currencyCode,
    },
    {
      key: 'effectiveFrom',
      header: 'Effective From',
    },
    {
      key: 'effectiveTo',
      header: 'Effective To',
      render: (r: ConversionRate) => r.effectiveTo || '—',
    },
    {
      key: 'status',
      header: 'Status',
      render: (r: ConversionRate) => <StatusBadge status={r.status} />,
    },
    {
      key: 'createdBy',
      header: 'Created By',
    },
  ];

  const selectedCurrency = currencies.find(c => c.code === newCurrency);
  const previewValue = parseFloat(newPointsPerUnit) || 0;

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Points & Currency Configuration"
        subtitle="Manage conversion rates and currency settings"
      />

      <div className="p-6 space-y-6">
        {/* Current Rate Overview */}
        <div className="grid grid-cols-3 gap-6">
          {/* Active Rate Card */}
          <div className="audit-card">
            <div className="audit-card-header">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                  <FaCheck className="w-4 h-4 text-success" />
                </div>
                <h3 className="font-semibold">Active Rate</h3>
              </div>
              <StatusBadge status="active" />
            </div>
            <div className="audit-card-body">
              {activeRate ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl font-bold text-foreground">
                      {activeRate.pointsPerUnit}
                    </div>
                    <div className="text-muted-foreground">
                      <div className="text-sm">points per</div>
                      <div className="text-lg font-medium">{activeRate.currencySymbol}1.00 {activeRate.currencyCode}</div>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <GiTwoCoins className="w-4 h-4" />
                      <span>1 point = {activeRate.currencySymbol}{(1 / activeRate.pointsPerUnit).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <span>Effective since </span>
                    <span className="font-medium text-foreground">{activeRate.effectiveFrom}</span>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No active rate configured</p>
              )}
            </div>
            {activeRate && (
              <div className="audit-card-footer">
                <AuditInfo
                  updatedAt={activeRate.createdAt}
                  updatedBy={activeRate.createdBy}
                  onViewHistory={() => setActiveTab('history')}
                />
              </div>
            )}
          </div>

          {/* Scheduled Rate Card */}
          <div className="audit-card">
            <div className="audit-card-header">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center">
                  <FaClock className="w-4 h-4 text-info" />
                </div>
                <h3 className="font-semibold">Scheduled Rate</h3>
              </div>
              {scheduledRate && <StatusBadge status="scheduled" />}
            </div>
            <div className="audit-card-body">
              {scheduledRate ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl font-bold text-foreground">
                      {scheduledRate.pointsPerUnit}
                    </div>
                    <div className="text-muted-foreground">
                      <div className="text-sm">points per</div>
                      <div className="text-lg font-medium">{scheduledRate.currencySymbol}1.00 {scheduledRate.currencyCode}</div>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-info/5 border border-info/20">
                    <div className="flex items-center gap-2 text-sm text-info">
                      <FaCalendar className="w-4 h-4" />
                      <span>Activates on {scheduledRate.effectiveFrom}</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setShowDeactivate(true)}
                  >
                    Cancel Scheduled Rate
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">No scheduled rate</p>
                  <Button variant="outline" size="sm" onClick={() => setShowNewRate(true)}>
                    <FaPlus className="w-4 h-4 mr-2" />
                    Schedule New Rate
                  </Button>
                </div>
              )}
            </div>
            {scheduledRate && (
              <div className="audit-card-footer">
                <AuditInfo
                  updatedAt={scheduledRate.createdAt}
                  updatedBy={scheduledRate.createdBy}
                  onViewHistory={() => setActiveTab('history')}
                />
              </div>
            )}
          </div>

          {/* Quick Actions Card */}
          <div className="audit-card">
            <div className="audit-card-header">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <FaChartLine className="w-4 h-4 text-accent" />
                </div>
                <h3 className="font-semibold">Rate Impact</h3>
              </div>
            </div>
            <div className="audit-card-body space-y-4">
              {activeRate && scheduledRate && (
                <>
                  <div className="p-3 rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground mb-2">Value Change</p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-medium">{activeRate.currencySymbol}{(1 / activeRate.pointsPerUnit).toFixed(2)}</span>
                      <FaArrowRight className="w-4 h-4 text-muted-foreground" />
                      <span className={cn(
                        "text-lg font-medium",
                        scheduledRate.pointsPerUnit < activeRate.pointsPerUnit ? "text-success" : "text-destructive"
                      )}>
                        {scheduledRate.currencySymbol}{(1 / scheduledRate.pointsPerUnit).toFixed(2)}
                      </span>
                      <span className="text-sm text-muted-foreground">per point</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-warning/5 border border-warning/20">
                    <div className="flex gap-2">
                      <FaExclamationTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground">
                        Staff withdrawals will use the rate active at the time of request. 
                        Pending withdrawals are not affected by rate changes.
                      </p>
                    </div>
                  </div>
                </>
              )}

              <Button className="w-full" onClick={() => setShowNewRate(true)}>
                <FaPlus className="w-4 h-4 mr-2" />
                Create New Rate
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs for History */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="current">
              <FaDollarSign className="w-4 h-4 mr-2" />
              Currency Settings
            </TabsTrigger>
            <TabsTrigger value="profession">
              <FaUserMd className="w-4 h-4 mr-2" />
              Profession Rates
            </TabsTrigger>
            <TabsTrigger value="history">
              <FaHistory className="w-4 h-4 mr-2" />
              Rate History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="mt-6">
            <div className="audit-card">
              <div className="audit-card-header">
                <h3 className="font-semibold">Currency Configuration</h3>
              </div>
              <div className="audit-card-body">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Base Currency</Label>
                    <Select defaultValue="AUD">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map(currency => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.symbol} {currency.code} - {currency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      All point values and payouts use this currency
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Minimum Withdrawal (Points)</Label>
                    <Input type="number" defaultValue="100" />
                    <p className="text-xs text-muted-foreground">
                      Staff must have at least this many points to withdraw
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Rounding Rule</Label>
                    <Select defaultValue="down">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="up">Round Up</SelectItem>
                        <SelectItem value="down">Round Down</SelectItem>
                        <SelectItem value="nearest">Round to Nearest</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Applied when converting points to currency
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Decimal Places</Label>
                    <Select defaultValue="2">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0 (Whole numbers)</SelectItem>
                        <SelectItem value="2">2 (Standard)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="audit-card-footer">
                <AuditInfo
                  updatedAt="2024-06-10 09:15"
                  updatedBy="Sarah Chen"
                  onViewHistory={() => setActiveTab('history')}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profession" className="mt-6">
            <div className="audit-card">
              <div className="audit-card-header">
                <div>
                  <h3 className="font-semibold">Profession-Based Conversion Rates</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Set different cash-per-point values for each classification. Higher-value roles like Registered Nurses can be rewarded more.
                  </p>
                </div>
              </div>
              <div className="audit-card-body">
                <div className="space-y-3">
                  {/* Header row */}
                  <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <div className="col-span-3">Classification</div>
                    <div className="col-span-2">Points Per Unit</div>
                    <div className="col-span-2">Cash Per Point</div>
                    <div className="col-span-2">Example (100 pts)</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>

                  {professionRates.map((rate) => (
                    <div
                      key={rate.id}
                      className={cn(
                        'grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 p-4 rounded-xl border transition-all',
                        rate.isActive
                          ? 'border-border bg-card'
                          : 'border-border/50 bg-muted/20 opacity-60'
                      )}
                    >
                      {/* Classification */}
                      <div className="md:col-span-3 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <FaUserMd className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{rate.classification}</p>
                          <p className="text-xs text-muted-foreground md:hidden">
                            {rate.pointsPerUnit} pts/unit
                          </p>
                        </div>
                      </div>

                      {/* Points Per Unit */}
                      <div className="md:col-span-2 flex items-center">
                        <span className="text-sm font-medium">{rate.pointsPerUnit} pts</span>
                      </div>

                      {/* Cash Per Point */}
                      <div className="md:col-span-2 flex items-center">
                        {editingRateId === rate.id ? (
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-muted-foreground">{rate.currencySymbol}</span>
                            <Input
                              type="number"
                              value={editCashPerPoint}
                              onChange={(e) => setEditCashPerPoint(e.target.value)}
                              className="w-20 h-8 text-sm"
                              min="0.01"
                              step="0.01"
                              autoFocus
                            />
                          </div>
                        ) : (
                          <span className="text-sm font-semibold text-primary">
                            {rate.currencySymbol}{rate.cashPerPoint.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Example */}
                      <div className="md:col-span-2 flex items-center">
                        <span className="text-sm text-muted-foreground">
                          100 pts = <span className="font-medium text-foreground">{rate.currencySymbol}{(100 * rate.cashPerPoint).toFixed(2)}</span>
                        </span>
                      </div>

                      {/* Status */}
                      <div className="md:col-span-1 flex items-center">
                        <button
                          onClick={() => {
                            setProfessionRates(prev =>
                              prev.map(r => r.id === rate.id ? { ...r, isActive: !r.isActive } : r)
                            );
                          }}
                          className="text-lg"
                        >
                          {rate.isActive ? (
                            <FaToggleOn className="w-6 h-6 text-success" />
                          ) : (
                            <FaToggleOff className="w-6 h-6 text-muted-foreground" />
                          )}
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="md:col-span-2 flex items-center justify-end gap-2">
                        {editingRateId === rate.id ? (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => {
                                const val = parseFloat(editCashPerPoint);
                                if (val > 0) {
                                  setProfessionRates(prev =>
                                    prev.map(r => r.id === rate.id ? { ...r, cashPerPoint: val } : r)
                                  );
                                }
                                setEditingRateId(null);
                              }}
                            >
                              <FaSave className="w-3 h-3 mr-1" />
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingRateId(null)}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingRateId(rate.id);
                              setEditCashPerPoint(String(rate.cashPerPoint));
                            }}
                          >
                            Edit Rate
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="mt-6 p-4 rounded-xl bg-info/5 border border-info/20">
                  <div className="flex gap-2">
                    <FaInfoCircle className="w-4 h-4 text-info shrink-0 mt-0.5" />
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p className="font-medium text-foreground">How profession-based rates work</p>
                      <p>Each classification has its own cash-per-point value. When a staff member requests a withdrawal, the system uses their classification to calculate the payout. For example, a Registered Nurse with 100 points at $2.50/point receives $250.00, while a Care Worker with 100 points at $0.50/point receives $50.00.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="audit-card-footer">
                <AuditInfo
                  updatedAt="2024-06-14 10:30"
                  updatedBy="Sarah Chen"
                  onViewHistory={() => setActiveTab('history')}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <div className="audit-card">
              <div className="audit-card-header">
                <h3 className="font-semibold">Conversion Rate History</h3>
                <p className="text-sm text-muted-foreground">
                  Historical record of all conversion rates (read-only)
                </p>
              </div>
              <div className="audit-card-body p-0">
                <DataTable
                  columns={historyColumns}
                  data={mockRates}
                  keyExtractor={(r) => r.id}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* New Rate Modal */}
      <ConfirmationModal
        open={showNewRate}
        onOpenChange={setShowNewRate}
        title="Create New Conversion Rate"
        description=""
        confirmText="Schedule Rate"
        variant="success"
        onConfirm={() => setShowNewRate(false)}
      >
        <div className="space-y-6 py-4">
          <div className="p-4 rounded-lg bg-info/5 border border-info/20">
            <div className="flex gap-2">
              <FaInfoCircle className="w-4 h-4 text-info shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                New rates will apply to all withdrawals requested after the effective date. 
                Existing pending withdrawals will use their original locked rate.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={newCurrency} onValueChange={setNewCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(currency => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Effective Date</Label>
              <Input 
                type="date" 
                value={newEffectiveDate}
                onChange={(e) => setNewEffectiveDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Conversion Rate</Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={newPointsPerUnit}
                onChange={(e) => setNewPointsPerUnit(e.target.value)}
                className="w-24"
                min="0.1"
                step="0.1"
              />
              <span className="text-muted-foreground">points = {selectedCurrency?.symbol}1.00</span>
            </div>
          </div>

          {previewValue > 0 && (
            <div className="p-4 rounded-lg bg-muted/30 space-y-2">
              <p className="text-sm font-medium">Preview</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">1 point = </span>
                  <span className="font-medium">{selectedCurrency?.symbol}{(1 / previewValue).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">100 points = </span>
                  <span className="font-medium">{selectedCurrency?.symbol}{(100 / previewValue).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">500 points = </span>
                  <span className="font-medium">{selectedCurrency?.symbol}{(500 / previewValue).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">1000 points = </span>
                  <span className="font-medium">{selectedCurrency?.symbol}{(1000 / previewValue).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ConfirmationModal>

      {/* Deactivate Modal */}
      <ConfirmationModal
        open={showDeactivate}
        onOpenChange={setShowDeactivate}
        title="Cancel Scheduled Rate"
        description="Are you sure you want to cancel the scheduled rate change? The current active rate will remain in effect."
        confirmText="Cancel Rate"
        variant="destructive"
        onConfirm={() => setShowDeactivate(false)}
      />
    </div>
  );
}
