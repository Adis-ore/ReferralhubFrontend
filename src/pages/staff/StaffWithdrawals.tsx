import { useState, useEffect } from 'react';
import { useStaffAuth } from '@/contexts/StaffAuthContext';
import { withdrawalsApi, usersApi, pointsApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/ui/status-badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import {
  FaWallet,
  FaCreditCard,
  FaClock,
  FaCheck,
  FaExclamationCircle,
  FaInfoCircle,
  FaChevronRight,
  FaDollarSign,
  FaArrowRight,
  FaChartLine,
  FaLock
} from 'react-icons/fa';
import { GiTwoCoins } from 'react-icons/gi';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { SkeletonList } from '@/components/ui/skeletons';

interface Withdrawal {
  id: string;
  pointsWithdrawn: number;
  conversionRate: number;
  currencySymbol: string;
  currencyCode: string;
  finalAmount: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  requestedDate: string;
  processedDate?: string;
}

// Current active conversion rate (would come from config)
const currentConversionRate = {
  pointsPerUnit: 2,
  currencySymbol: '$',
  currencyCode: 'AUD',
  effectiveDate: '2024-01-01'
};

const mockWithdrawals: Withdrawal[] = [
  { 
    id: 'WR-2001', 
    pointsWithdrawn: 500, 
    conversionRate: 2, 
    currencySymbol: '$',
    currencyCode: 'AUD',
    finalAmount: 250, 
    status: 'pending', 
    requestedDate: '2024-06-15' 
  },
  { 
    id: 'WR-1892', 
    pointsWithdrawn: 400, 
    conversionRate: 2, 
    currencySymbol: '$',
    currencyCode: 'AUD',
    finalAmount: 200, 
    status: 'paid', 
    requestedDate: '2024-05-20', 
    processedDate: '2024-05-25' 
  },
  { 
    id: 'WR-1756', 
    pointsWithdrawn: 375, 
    conversionRate: 2.5, // Historical rate
    currencySymbol: '$',
    currencyCode: 'AUD',
    finalAmount: 150, 
    status: 'paid', 
    requestedDate: '2024-04-10', 
    processedDate: '2024-04-15' 
  },
];

export default function StaffWithdrawals() {
  const { user } = useStaffAuth();
  const [activeTab, setActiveTab] = useState('request');
  const [withdrawPoints, setWithdrawPoints] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [availablePoints, setAvailablePoints] = useState(0);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(mockWithdrawals);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    Promise.all([
      usersApi.get(user.id).then((u: any) => setAvailablePoints(u.pointsBalance || 0)).catch(() => {}),
      withdrawalsApi.list({ limit: 50 }).then(({ data }: any) => {
        const mine = data?.filter((w: any) => w.userId === user.id);
        if (mine?.length) setWithdrawals(mine.map((w: any) => ({
          id: w.id, pointsWithdrawn: w.points || 0,
          conversionRate: currentConversionRate.pointsPerUnit,
          currencySymbol: '$', currencyCode: 'AUD',
          finalAmount: w.amount || 0,
          status: w.status as Withdrawal['status'],
          requestedDate: w.createdAt?.split('T')[0] || '',
          processedDate: w.processedAt?.split('T')[0],
        })));
      }).catch(() => {}),
      pointsApi.getSettings().then((s: any) => {
        if (s?.pointsPerUnit) currentConversionRate.pointsPerUnit = s.pointsPerUnit;
      }).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [user?.id]);
  const minWithdrawalPoints = 100;
  const maxWithdrawalPoints = 2500;

  // Conversion calculations using current rate
  const { pointsPerUnit, currencySymbol, currencyCode } = currentConversionRate;
  const pointsToAmount = (points: number) => points / pointsPerUnit;
  const amountToPoints = (amount: number) => amount * pointsPerUnit;

  const enteredPoints = parseInt(withdrawPoints) || 0;
  const estimatedAmount = pointsToAmount(Math.min(enteredPoints, maxWithdrawalPoints));
  const maxWithdrawableAmount = pointsToAmount(Math.min(availablePoints, maxWithdrawalPoints));

  const canWithdraw = enteredPoints >= minWithdrawalPoints && enteredPoints <= availablePoints && enteredPoints <= maxWithdrawalPoints;

  const handleWithdraw = () => {
    // Deduct points from available balance
    setAvailablePoints(prev => prev - enteredPoints);

    // Add new withdrawal to history
    const newWithdrawal: Withdrawal = {
      id: `WR-${Math.floor(1000 + Math.random() * 9000)}`,
      pointsWithdrawn: enteredPoints,
      conversionRate: pointsPerUnit,
      currencySymbol,
      currencyCode,
      finalAmount: estimatedAmount,
      status: 'pending',
      requestedDate: new Date().toISOString().split('T')[0],
    };
    setWithdrawals(prev => [newWithdrawal, ...prev]);

    setShowConfirm(false);
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setWithdrawPoints('');
    setActiveTab('history');
    toast.success('Withdrawal request submitted!', {
      description: 'You will be notified once it is processed.',
    });
  };

  const quickPoints = [100, 250, 500, 1000];

  if (loading) return <div className="px-4 py-6"><SkeletonList rows={4} /></div>;

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Withdrawals</h1>
        <p className="text-muted-foreground">Convert your points to cash</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-2 mb-6">
          <TabsTrigger value="request">Request Withdrawal</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Request Tab */}
        <TabsContent value="request" className="space-y-6">
          {/* Balance Card */}
          <div className="bg-card rounded-2xl p-5 border border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Available to Withdraw</p>
                <p className="text-3xl font-bold text-foreground">{availablePoints.toLocaleString()} pts</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-staff-primary/10 flex items-center justify-center">
                <FaWallet className="w-7 h-7 text-staff-primary" />
              </div>
            </div>
            
            {/* Conversion Rate Display */}
            <div className="p-3 rounded-lg bg-muted/30 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FaChartLine className="w-4 h-4" />
                  <span>Current Rate</span>
                </div>
                <span className="font-medium">{pointsPerUnit} pts = {currencySymbol}1.00 {currencyCode}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Estimated Value</span>
                <span className="font-semibold text-staff-primary">{currencySymbol}{maxWithdrawableAmount.toFixed(2)} {currencyCode}</span>
              </div>
            </div>
          </div>

          {/* Withdrawal Form - Points Based */}
          <div className="bg-card rounded-2xl p-5 border border-border space-y-5">
            <div>
              <Label htmlFor="points" className="text-base">Points to Withdraw</Label>
              <div className="relative mt-2">
                <GiTwoCoins className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="points"
                  type="number"
                  placeholder="0"
                  value={withdrawPoints}
                  onChange={(e) => setWithdrawPoints(e.target.value)}
                  className="pl-12 text-2xl font-semibold h-14"
                  max={availablePoints}
                />
              </div>
            </div>

            {/* Live Conversion Preview */}
            {enteredPoints > 0 && (
              <div className="p-4 rounded-xl bg-staff-primary/5 border border-staff-primary/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">Estimated Payout</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <FaLock className="w-3 h-3" />
                    <span>Rate locked at request</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{enteredPoints.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                  <FaArrowRight className="w-5 h-5 text-staff-primary" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-staff-primary">{currencySymbol}{estimatedAmount.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{currencyCode}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  @ {pointsPerUnit} points per {currencySymbol}1.00
                </p>
              </div>
            )}

            {/* Quick Select - Points Based */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Quick Select</Label>
              <div className="flex flex-wrap gap-2">
                {quickPoints.map((points) => (
                  <button
                    key={points}
                    onClick={() => setWithdrawPoints(String(points))}
                    disabled={points > availablePoints}
                    className={cn(
                      'px-4 py-2 rounded-lg border transition-colors text-sm font-medium',
                      withdrawPoints === String(points)
                        ? 'border-staff-primary bg-staff-primary/10 text-staff-primary'
                        : 'border-border hover:border-muted-foreground/50',
                      points > availablePoints && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {points} pts
                  </button>
                ))}
                <button
                  onClick={() => setWithdrawPoints(String(availablePoints))}
                  className={cn(
                    'px-4 py-2 rounded-lg border transition-colors text-sm font-medium',
                    withdrawPoints === String(availablePoints)
                      ? 'border-staff-primary bg-staff-primary/10 text-staff-primary'
                      : 'border-border hover:border-muted-foreground/50'
                  )}
                >
                  Max ({availablePoints})
                </button>
              </div>
            </div>

            {/* Validation Messages */}
            {enteredPoints > 0 && enteredPoints < minWithdrawalPoints && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/5 border border-warning/20 text-warning">
                <FaExclamationCircle className="w-4 h-4" />
                <span className="text-sm">Minimum withdrawal is {minWithdrawalPoints} points</span>
              </div>
            )}

            {enteredPoints > maxWithdrawalPoints && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/20 text-destructive">
                <FaExclamationCircle className="w-4 h-4" />
                <span className="text-sm">Maximum withdrawal is {maxWithdrawalPoints.toLocaleString()} points per request</span>
              </div>
            )}

            {enteredPoints > availablePoints && enteredPoints <= maxWithdrawalPoints && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/20 text-destructive">
                <FaExclamationCircle className="w-4 h-4" />
                <span className="text-sm">Insufficient points balance</span>
              </div>
            )}

            <Button
              onClick={() => setShowConfirm(true)}
              disabled={!canWithdraw}
              className="w-full h-12 bg-staff-gradient hover:opacity-90 text-white text-base font-semibold"
            >
              <FaCreditCard className="w-5 h-5 mr-2" />
              Request Withdrawal
            </Button>
          </div>

          {/* Rate Policy Notice */}
          <div className="p-4 bg-info/5 border border-info/20 rounded-xl">
            <div className="flex gap-3">
              <FaInfoCircle className="w-5 h-5 text-info shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm">
                <p className="font-medium text-foreground">About Conversion Rates</p>
                <p className="text-muted-foreground">
                  Conversion rates are set by the company. Your withdrawal uses the rate active at the time of request. 
                  Once submitted, the rate is locked for your request regardless of future rate changes.
                </p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-4 bg-muted/30 rounded-xl space-y-2">
            <p className="text-sm font-medium">How it works:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Current rate: {pointsPerUnit} points = {currencySymbol}1.00 {currencyCode}</li>
              <li>• Minimum withdrawal: {minWithdrawalPoints} points</li>
              <li>• Maximum withdrawal: {maxWithdrawalPoints.toLocaleString()} points per request</li>
              <li>• Processing time: 3-5 business days</li>
              <li>• Paid to your registered bank account</li>
            </ul>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <div className="space-y-3">
            {withdrawals.length === 0 ? (
              <div className="text-center py-12">
                <FaCreditCard className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No withdrawal history</p>
              </div>
            ) : (
              withdrawals.map((withdrawal) => (
                <div key={withdrawal.id} className="bg-card rounded-xl p-4 border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-sm text-muted-foreground">{withdrawal.id}</span>
                    <StatusBadge status={withdrawal.status} />
                  </div>
                  
                  {/* Points and Amount Display */}
                  <div className="flex items-center gap-3 mb-3">
                    <div>
                      <p className="text-lg font-semibold">{withdrawal.pointsWithdrawn} pts</p>
                      <p className="text-xs text-muted-foreground">Points Withdrawn</p>
                    </div>
                    <FaArrowRight className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-lg font-semibold text-staff-primary">
                        {withdrawal.currencySymbol}{withdrawal.finalAmount.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">{withdrawal.currencyCode}</p>
                    </div>
                  </div>

                  {/* Rate Used */}
                  <div className="p-2 rounded-lg bg-muted/30 mb-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <FaLock className="w-3 h-3" />
                        Rate Used
                      </span>
                      <span className="font-medium">{withdrawal.conversionRate} pts = {withdrawal.currencySymbol}1.00</span>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Requested: {withdrawal.requestedDate}</span>
                    {withdrawal.processedDate && (
                      <span className="text-success">Paid: {withdrawal.processedDate}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Confirmation Sheet */}
      <Sheet open={showConfirm} onOpenChange={setShowConfirm}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Confirm Withdrawal</SheetTitle>
            <SheetDescription>Review your withdrawal request before submitting</SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Summary */}
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-staff-primary/10 flex items-center justify-center mx-auto mb-4">
                <GiTwoCoins className="w-8 h-8 text-staff-primary" />
              </div>
              <p className="text-3xl font-bold">{enteredPoints.toLocaleString()} pts</p>
              <p className="text-muted-foreground">points to withdraw</p>
            </div>

            {/* Conversion Details */}
            <div className="space-y-3 p-4 bg-muted/30 rounded-xl">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Points Selected</span>
                <span className="font-medium">{enteredPoints.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Conversion Rate</span>
                <span className="font-medium">{pointsPerUnit} pts = {currencySymbol}1.00</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Payout</span>
                <span className="font-bold text-lg text-staff-primary">
                  {currencySymbol}{estimatedAmount.toFixed(2)} {currencyCode}
                </span>
              </div>
            </div>

            {/* Balance After */}
            <div className="p-4 bg-muted/30 rounded-xl">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Points Balance After</span>
                <span className="font-medium">{(availablePoints - enteredPoints).toLocaleString()} pts</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-muted-foreground">Processing Time</span>
                <span className="font-medium">3-5 business days</span>
              </div>
            </div>

            {/* Rate Lock Notice */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-info/5 border border-info/20 text-sm">
              <FaLock className="w-4 h-4 text-info shrink-0" />
              <span className="text-muted-foreground">
                The conversion rate will be locked at {pointsPerUnit} pts = {currencySymbol}1.00 for this request
              </span>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-staff-gradient hover:opacity-90 text-white"
                onClick={handleWithdraw}
              >
                Confirm Request
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Success Sheet */}
      <Sheet open={showSuccess} onOpenChange={setShowSuccess}>
        <SheetContent className="w-full sm:max-w-md">
          <div className="flex flex-col items-center justify-center h-full py-8">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6">
              <FaCheck className="w-10 h-10 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">Request Submitted!</h2>
            <p className="text-muted-foreground text-center mb-6">
              Your withdrawal request has been submitted successfully
            </p>

            <div className="w-full p-4 bg-muted/30 rounded-xl space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Points Withdrawn</span>
                <span className="font-medium">{enteredPoints.toLocaleString()} pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Conversion Rate Used</span>
                <span className="font-medium">{pointsPerUnit} pts = {currencySymbol}1.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Final Amount</span>
                <span className="font-bold text-staff-primary">
                  {currencySymbol}{estimatedAmount.toFixed(2)} {currencyCode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge status="pending" />
              </div>
            </div>

            <Button
              className="w-full bg-staff-gradient hover:opacity-90 text-white"
              onClick={handleSuccessClose}
            >
              Done
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
