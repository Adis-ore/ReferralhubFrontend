import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FaClock, FaCalendar, FaChartLine } from 'react-icons/fa';
import { cn } from '@/lib/utils';

interface HoursPeriod {
  period: string;
  startDate: string;
  endDate: string;
  hours: number;
  status: 'synced' | 'pending';
}

const mockHours: HoursPeriod[] = [
  { period: 'Week 24, 2024', startDate: '2024-06-10', endDate: '2024-06-16', hours: 38, status: 'synced' },
  { period: 'Week 23, 2024', startDate: '2024-06-03', endDate: '2024-06-09', hours: 42, status: 'synced' },
  { period: 'Week 22, 2024', startDate: '2024-05-27', endDate: '2024-06-02', hours: 36, status: 'synced' },
  { period: 'Week 21, 2024', startDate: '2024-05-20', endDate: '2024-05-26', hours: 40, status: 'synced' },
  { period: 'Week 20, 2024', startDate: '2024-05-13', endDate: '2024-05-19', hours: 38, status: 'synced' },
  { period: 'Week 19, 2024', startDate: '2024-05-06', endDate: '2024-05-12', hours: 44, status: 'synced' },
];

const monthlyTotals = [
  { month: 'June 2024', hours: 116, trend: 5 },
  { month: 'May 2024', hours: 162, trend: -3 },
  { month: 'April 2024', hours: 158, trend: 8 },
  { month: 'March 2024', hours: 156, trend: 2 },
];

export default function StaffHours() {
  const [viewType, setViewType] = useState('weekly');

  const totalHoursThisMonth = 156;
  const averageWeekly = 39;

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Hours Summary</h1>
        <p className="text-muted-foreground">Your synced work hours</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-staff-primary/10 flex items-center justify-center">
              <FaClock className="w-5 h-5 text-staff-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalHoursThisMonth}</p>
              <p className="text-xs text-muted-foreground">This Month</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <FaChartLine className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{averageWeekly}</p>
              <p className="text-xs text-muted-foreground">Avg/Week</p>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-foreground">Hours Breakdown</h2>
        <Select value={viewType} onValueChange={setViewType}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Hours List */}
      {viewType === 'weekly' ? (
        <div className="space-y-3">
          {mockHours.map((period, index) => (
            <div key={period.period} className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{period.period}</p>
                  <p className="text-sm text-muted-foreground">
                    {period.startDate} - {period.endDate}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-foreground">{period.hours}h</p>
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    period.status === 'synced' 
                      ? 'bg-success/10 text-success' 
                      : 'bg-warning/10 text-warning'
                  )}>
                    {period.status}
                  </span>
                </div>
              </div>
              {/* Visual bar */}
              <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-staff-primary rounded-full"
                  style={{ width: `${Math.min((period.hours / 48) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {monthlyTotals.map((month) => (
            <div key={month.month} className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <FaCalendar className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="font-medium text-foreground">{month.month}</p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <p className="text-xl font-bold text-foreground">{month.hours}h</p>
                  </div>
                  <div className={cn(
                    'flex items-center gap-1 text-sm px-2 py-1 rounded-lg',
                    month.trend >= 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                  )}>
                    <FaChartLine className={cn('w-3.5 h-3.5', month.trend < 0 && 'rotate-180')} />
                    <span>{Math.abs(month.trend)}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Note */}
      <div className="mt-6 p-4 bg-muted/30 rounded-xl">
        <div className="flex items-start gap-3">
          <FaClock className="w-5 h-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Hours are synced automatically</p>
            <p className="text-sm text-muted-foreground">
              Data is pulled from your rostering system. Contact your manager if hours appear incorrect.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
