import { cn } from '@/lib/utils';
import { FaCheck as Check, FaClock as Clock, FaBriefcase as Briefcase, FaStar as Star } from 'react-icons/fa';

type ReferralStatus = 'invited' | 'working' | 'eligible' | 'completed';

interface ReferralStatusBadgeProps {
  status: ReferralStatus;
  className?: string;
}

const statusConfig: Record<ReferralStatus, { 
  label: string; 
  icon: React.ComponentType<{ className?: string }>;
  className: string;
}> = {
  invited: {
    label: 'Invited',
    icon: Clock,
    className: 'bg-muted text-muted-foreground',
  },
  working: {
    label: 'Working',
    icon: Briefcase,
    className: 'bg-info/10 text-info',
  },
  eligible: {
    label: 'Eligible',
    icon: Star,
    className: 'bg-warning/10 text-warning',
  },
  completed: {
    label: 'Completed',
    icon: Check,
    className: 'bg-success/10 text-success',
  },
};

export function ReferralStatusBadge({ status, className }: ReferralStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
      config.className,
      className
    )}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}
