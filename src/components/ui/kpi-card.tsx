import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { FaChartLine as TrendingUp, FaChartLine as TrendingDown, FaMinus as Minus } from 'react-icons/fa';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    period: string;
  };
  icon?: ReactNode;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'accent';
}

const variantStyles = {
  default: 'before:bg-primary',
  success: 'before:bg-success',
  warning: 'before:bg-warning',
  destructive: 'before:bg-destructive',
  accent: 'before:bg-accent',
};

export function KPICard({
  title,
  value,
  change,
  icon,
  className,
  variant = 'default',
}: KPICardProps) {
  const getTrendIcon = () => {
    if (!change) return null;
    if (change.value > 0) return <TrendingUp className="w-4 h-4" />;
    if (change.value < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (!change) return '';
    if (change.value > 0) return 'text-success';
    if (change.value < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  return (
    <div className={cn('kpi-card', variantStyles[variant], className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-semibold text-foreground mt-2">{value}</p>
          {change && (
            <div className={cn('flex items-center gap-1 mt-2 text-sm', getTrendColor())}>
              {getTrendIcon()}
              <span className="font-medium">
                {change.value > 0 ? '+' : ''}{change.value}%
              </span>
              <span className="text-muted-foreground">vs {change.period}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 rounded-lg bg-muted/50 text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
