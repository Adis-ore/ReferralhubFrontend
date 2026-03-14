import { cn } from '@/lib/utils';

type StatusType = 'pending' | 'approved' | 'rejected' | 'active' | 'inactive' | 'paid' | 'processing' | 'scheduled' | 'expired';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'status-pending',
  },
  approved: {
    label: 'Approved',
    className: 'status-approved',
  },
  rejected: {
    label: 'Rejected',
    className: 'status-rejected',
  },
  active: {
    label: 'Active',
    className: 'status-active',
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-muted text-muted-foreground',
  },
  paid: {
    label: 'Paid',
    className: 'bg-success/10 text-success',
  },
  processing: {
    label: 'Processing',
    className: 'bg-info/10 text-info',
  },
  scheduled: {
    label: 'Scheduled',
    className: 'bg-info/10 text-info',
  },
  expired: {
    label: 'Expired',
    className: 'bg-muted text-muted-foreground',
  },
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={cn('status-badge', config.className, className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label || config.label}
    </span>
  );
}
