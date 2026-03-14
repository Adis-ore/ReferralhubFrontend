import { FaGift as Gift, FaCoins as Coins, FaCreditCard as CreditCard, FaUserPlus as UserPlus } from 'react-icons/fa';
import { FiSettings as Settings } from 'react-icons/fi';
import { cn } from '@/lib/utils';

const activities = [
  {
    id: 1,
    type: 'referral',
    icon: Gift,
    title: 'New Referral Completed',
    description: 'Sarah Johnson referred Michael Chen',
    time: '2 minutes ago',
    color: 'text-accent bg-accent/10',
  },
  {
    id: 2,
    type: 'points',
    icon: Coins,
    title: 'Points Awarded',
    description: '500 points issued to Emma Williams',
    time: '15 minutes ago',
    color: 'text-success bg-success/10',
  },
  {
    id: 3,
    type: 'withdrawal',
    icon: CreditCard,
    title: 'Withdrawal Approved',
    description: 'John Doe withdrawal of $250 approved',
    time: '1 hour ago',
    color: 'text-info bg-info/10',
  },
  {
    id: 4,
    type: 'user',
    icon: UserPlus,
    title: 'New User Registered',
    description: 'Alex Thompson joined via referral link',
    time: '2 hours ago',
    color: 'text-primary bg-primary/10',
  },
  {
    id: 5,
    type: 'config',
    icon: Settings,
    title: 'Campaign Updated',
    description: 'Summer Bonus campaign rules modified',
    time: '3 hours ago',
    color: 'text-warning bg-warning/10',
  },
];

export function RecentActivity() {
  return (
    <div className="audit-card">
      <div className="audit-card-header">
        <h3 className="font-semibold text-foreground">Recent Activity</h3>
        <button className="text-sm text-accent hover:text-accent/80 transition-colors">
          View all
        </button>
      </div>
      <div className="divide-y divide-border">
        {activities.map((activity) => (
          <div key={activity.id} className="px-6 py-4 flex items-start gap-4 hover:bg-muted/30 transition-colors">
            <div className={cn('p-2 rounded-lg', activity.color)}>
              <activity.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{activity.title}</p>
              <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {activity.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
