import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  FaPlus as Plus,
  FaMinus as Minus,
  FaClock as Clock,
  FaLock as Lock,
  FaExclamationTriangle as AlertTriangle,
  FaCoins as Coins,
  FaArrowRight as ArrowRight
} from 'react-icons/fa';
import { cn } from '@/lib/utils';

interface PointsAdjustmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName?: string;
  currentBalance?: number;
  onConfirm?: (data: AdjustmentData) => void;
}

interface AdjustmentData {
  type: 'add' | 'remove' | 'expire' | 'freeze';
  amount: number;
  reason: string;
}

const adjustmentTypes = [
  { 
    value: 'add', 
    label: 'Add Points', 
    icon: Plus, 
    color: 'text-success',
    bgColor: 'bg-success/10',
    description: 'Add points to user balance'
  },
  { 
    value: 'remove', 
    label: 'Remove Points', 
    icon: Minus, 
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    description: 'Deduct points from user balance'
  },
  { 
    value: 'expire', 
    label: 'Expire Points', 
    icon: Clock, 
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    description: 'Mark points as expired (cannot be recovered)'
  },
  { 
    value: 'freeze', 
    label: 'Freeze Points', 
    icon: Lock, 
    color: 'text-info',
    bgColor: 'bg-info/10',
    description: 'Temporarily prevent withdrawal'
  },
];

const reasonPresets = [
  'Manual correction',
  'Referral adjustment',
  'Hours recalculation',
  'System error correction',
  'Policy change adjustment',
  'Promotional bonus',
  'Manager override',
  'Other (specify below)',
];

export function PointsAdjustmentModal({
  open,
  onOpenChange,
  userName = 'User',
  currentBalance = 0,
  onConfirm
}: PointsAdjustmentModalProps) {
  const [adjustmentType, setAdjustmentType] = useState<string>('add');
  const [amount, setAmount] = useState('');
  const [reasonPreset, setReasonPreset] = useState('');
  const [customReason, setCustomReason] = useState('');

  const selectedType = adjustmentTypes.find(t => t.value === adjustmentType);
  const parsedAmount = parseInt(amount) || 0;
  
  const getNewBalance = () => {
    switch (adjustmentType) {
      case 'add':
        return currentBalance + parsedAmount;
      case 'remove':
      case 'expire':
        return Math.max(0, currentBalance - parsedAmount);
      case 'freeze':
        return currentBalance; // Balance doesn't change, just frozen
      default:
        return currentBalance;
    }
  };

  const isValid = parsedAmount > 0 && (reasonPreset || customReason);
  const newBalance = getNewBalance();
  const showWarning = (adjustmentType === 'remove' || adjustmentType === 'expire') && parsedAmount > currentBalance;

  const handleConfirm = () => {
    if (onConfirm && isValid) {
      onConfirm({
        type: adjustmentType as AdjustmentData['type'],
        amount: parsedAmount,
        reason: customReason || reasonPreset
      });
    }
    handleClose();
  };

  const handleClose = () => {
    setAdjustmentType('add');
    setAmount('');
    setReasonPreset('');
    setCustomReason('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            Points Adjustment
          </DialogTitle>
          <DialogDescription>
            Adjust points for {userName}. All adjustments are logged for audit.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Balance */}
          <div className="p-4 rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground">Current Balance</p>
            <p className="text-2xl font-bold">{currentBalance.toLocaleString()} pts</p>
          </div>

          {/* Adjustment Type */}
          <div className="space-y-3">
            <Label>Adjustment Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {adjustmentTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => setAdjustmentType(type.value)}
                    className={cn(
                      'p-3 rounded-lg border text-left transition-all',
                      adjustmentType === type.value
                        ? `${type.bgColor} border-current ${type.color}`
                        : 'border-border hover:border-muted-foreground/50'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={cn('w-4 h-4', adjustmentType === type.value ? type.color : 'text-muted-foreground')} />
                      <span className={cn('font-medium text-sm', adjustmentType === type.value ? type.color : 'text-foreground')}>
                        {type.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label>Points Amount</Label>
            <Input
              type="number"
              placeholder="Enter points amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
            />
          </div>

          {/* Impact Preview */}
          {parsedAmount > 0 && (
            <div className={cn(
              'p-4 rounded-lg border',
              showWarning ? 'bg-destructive/5 border-destructive/20' : 'bg-muted/30 border-border'
            )}>
              <p className="text-sm font-medium mb-3">Impact Preview</p>
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Current</p>
                  <p className="text-lg font-semibold">{currentBalance.toLocaleString()}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">After</p>
                  <p className={cn(
                    'text-lg font-semibold',
                    newBalance > currentBalance ? 'text-success' : 
                    newBalance < currentBalance ? 'text-destructive' : ''
                  )}>
                    {newBalance.toLocaleString()}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs text-muted-foreground">Change</p>
                  <p className={cn(
                    'text-lg font-semibold',
                    selectedType?.color
                  )}>
                    {adjustmentType === 'add' ? '+' : adjustmentType === 'freeze' ? '±' : '-'}
                    {parsedAmount.toLocaleString()}
                  </p>
                </div>
              </div>
              
              {showWarning && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-destructive/20 text-destructive">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">Amount exceeds current balance. Will be capped at {currentBalance} points.</span>
                </div>
              )}
            </div>
          )}

          {/* Reason */}
          <div className="space-y-2">
            <Label>Reason (Required)</Label>
            <Select value={reasonPreset} onValueChange={setReasonPreset}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason..." />
              </SelectTrigger>
              <SelectContent>
                {reasonPresets.map((reason) => (
                  <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {(reasonPreset === 'Other (specify below)' || reasonPreset === '') && (
              <Textarea
                placeholder="Provide additional details for this adjustment..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                rows={3}
              />
            )}
          </div>

          {/* Audit Notice */}
          <div className="p-3 rounded-lg bg-muted/30 text-sm text-muted-foreground">
            <p>This action will be logged with:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>Your admin ID and name</li>
              <li>Timestamp</li>
              <li>Before/after values</li>
              <li>Reason provided</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleConfirm}
            disabled={!isValid}
            className={cn(
              adjustmentType === 'add' && 'bg-success hover:bg-success/90 text-success-foreground',
              (adjustmentType === 'remove' || adjustmentType === 'expire') && 'bg-destructive hover:bg-destructive/90',
              adjustmentType === 'freeze' && 'bg-info hover:bg-info/90 text-info-foreground'
            )}
          >
            {selectedType && <selectedType.icon className="w-4 h-4 mr-2" />}
            Confirm Adjustment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
