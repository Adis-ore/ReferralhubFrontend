import { useState } from 'react';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import {
  FaShieldAlt as Shield,
  FaExclamationTriangle as AlertTriangle,
  FaKey as Key,
  FaFileAlt as FileText,
  FaCheckCircle as CheckCircle,
  FaTimesCircle as XCircle,
  FaClock as Clock,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';
import { cn } from '@/lib/utils';

const recentOverrides = [
  {
    id: '1',
    action: 'Force-approved withdrawal WR-1892',
    reason: 'User escalation - urgent medical expense',
    admin: 'Sarah Chen',
    timestamp: '2024-06-10 14:30',
    status: 'completed',
  },
  {
    id: '2',
    action: 'Bypassed probation requirement for USR-4521',
    reason: 'Pre-approved by HR director',
    admin: 'Sarah Chen',
    timestamp: '2024-06-08 09:15',
    status: 'completed',
  },
  {
    id: '3',
    action: 'Restored deleted campaign CAMP-003',
    reason: 'Accidental deletion by Operations Admin',
    admin: 'Sarah Chen',
    timestamp: '2024-06-05 16:45',
    status: 'completed',
  },
];

const overrideTypes = [
  { id: 'withdrawal', label: 'Force Approve/Reject Withdrawal' },
  { id: 'points', label: 'Manual Points Adjustment' },
  { id: 'user', label: 'User Status Override' },
  { id: 'campaign', label: 'Campaign Force Activation' },
  { id: 'restore', label: 'Restore Deleted Resource' },
  { id: 'bypass', label: 'Bypass Eligibility Rules' },
];

export default function SuperAdminOverride() {
  const [overrideType, setOverrideType] = useState('');
  const [resourceId, setResourceId] = useState('');
  const [reason, setReason] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const canSubmit = overrideType && resourceId && reason.length >= 20;

  const handleOverride = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowConfirm(false);
      setOverrideType('');
      setResourceId('');
      setReason('');
    }, 2000);
  };

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Super Admin Override"
        subtitle="Emergency access controls for critical operations"
      />

      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Warning Banner */}
        <div className="flex items-start gap-3 md:gap-4 p-4 md:p-6 rounded-lg bg-destructive/5 border-2 border-destructive/20">
          <div className="p-2 md:p-3 rounded-full bg-destructive/10 shrink-0">
            <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-destructive" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-destructive text-sm md:text-base">Break-Glass Override Zone</h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Actions performed here bypass normal approval workflows. All overrides are:
            </p>
            <ul className="text-xs md:text-sm text-muted-foreground mt-2 space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent shrink-0" />
                Permanently logged and cannot be deleted
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent shrink-0" />
                Flagged for compliance review
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent shrink-0" />
                Require mandatory reason documentation
              </li>
            </ul>
          </div>
        </div>

        {/* Main Grid - Stack on mobile, side-by-side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Override Form */}
          <div className="lg:col-span-2">
            <div className="audit-card">
              <div className="audit-card-header">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 md:w-5 md:h-5 text-warning" />
                  <h3 className="font-semibold text-sm md:text-base">Execute Override</h3>
                </div>
              </div>
              <div className="audit-card-body space-y-5 md:space-y-6 p-4 md:p-6">
                {/* Override Type Selection */}
                <div className="space-y-2">
                  <Label className="text-sm">Override Type</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                    {overrideTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setOverrideType(type.id)}
                        className={cn(
                          'p-3 md:p-4 rounded-lg border text-left transition-all',
                          overrideType === type.id
                            ? 'border-warning bg-warning/5'
                            : 'border-border hover:border-muted-foreground/30'
                        )}
                      >
                        <p className="font-medium text-xs md:text-sm">{type.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resource ID */}
                <div className="space-y-2">
                  <Label htmlFor="resource-id" className="text-sm">Resource ID</Label>
                  <Input
                    id="resource-id"
                    placeholder="e.g., WR-2001, USR-1234, CAMP-001"
                    value={resourceId}
                    onChange={(e) => setResourceId(e.target.value)}
                    className="text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the exact ID of the resource you want to override
                  </p>
                </div>

                {/* Justification */}
                <div className="space-y-2">
                  <Label htmlFor="reason" className="text-sm">
                    Justification <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="reason"
                    placeholder="Provide a detailed explanation for this override. This will be permanently recorded in the audit log."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                    className="text-sm"
                  />
                  <p className={cn(
                    'text-xs',
                    reason.length < 20 ? 'text-destructive' : 'text-muted-foreground'
                  )}>
                    {reason.length}/20 characters minimum required
                  </p>
                </div>

                <Button
                  onClick={() => setShowConfirm(true)}
                  disabled={!canSubmit}
                  className="w-full bg-warning hover:bg-warning/90 text-warning-foreground"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Execute Override
                </Button>
              </div>
            </div>
          </div>

          {/* Recent Overrides */}
          <div>
            {/* Mobile: Collapsible section */}
            <div className="audit-card">
              <div className="audit-card-header">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="w-full flex items-center justify-between lg:pointer-events-none"
                >
                  <h3 className="font-semibold text-sm md:text-base">Recent Overrides</h3>
                  <span className="lg:hidden">
                    {showHistory ? <FaChevronUp className="w-3.5 h-3.5" /> : <FaChevronDown className="w-3.5 h-3.5" />}
                  </span>
                </button>
              </div>
              <div className={cn(
                'divide-y divide-border',
                !showHistory && 'hidden lg:block'
              )}>
                {recentOverrides.map((override) => (
                  <div key={override.id} className="p-3 md:p-4">
                    <div className="flex items-start gap-2.5 md:gap-3">
                      <div className="p-1.5 md:p-2 rounded-lg bg-warning/10 text-warning shrink-0">
                        <Shield className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm font-medium leading-snug">{override.action}</p>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {override.reason}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 shrink-0" />
                          <span className="truncate">{override.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={cn(
                'p-3 md:p-4 border-t border-border',
                !showHistory && 'hidden lg:block'
              )}>
                <Button variant="ghost" className="w-full text-xs md:text-sm">
                  <FileText className="w-3.5 h-3.5 md:w-4 md:h-4 mr-2" />
                  View Full Override History
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Confirm Override Action"
        description={`You are about to execute a ${overrideType} override on ${resourceId}. This action will be permanently logged and flagged for compliance review. Are you absolutely sure?`}
        confirmText={isProcessing ? "Processing..." : "Execute Override"}
        variant="warning"
        onConfirm={handleOverride}
        isLoading={isProcessing}
      />
    </div>
  );
}
