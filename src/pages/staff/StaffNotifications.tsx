import { useState } from 'react';
import { FaBell, FaGift, FaCreditCard, FaCheck, FaClock, FaInfoCircle, FaTrashAlt } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'referral' | 'withdrawal' | 'points' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: '1', type: 'referral', title: 'Referral Progress Update', message: 'James Chen has completed 100 hours! Just 20 more to go.', time: '2 hours ago', read: false },
  { id: '2', type: 'withdrawal', title: 'Withdrawal Approved', message: 'Your withdrawal request #WR-2001 has been approved and will be processed shortly.', time: '1 day ago', read: false },
  { id: '3', type: 'points', title: 'Points Earned! 🎉', message: 'You earned 500 points from your referral of Emma Wilson. Great job!', time: '3 days ago', read: false },
  { id: '4', type: 'system', title: 'New Referral Campaign', message: 'Summer Bonus Campaign is now active! Earn extra 100 points per referral.', time: '5 days ago', read: true },
  { id: '5', type: 'referral', title: 'New Referral Started', message: 'Sarah Brown has started working. Keep encouraging them!', time: '1 week ago', read: true },
  { id: '6', type: 'withdrawal', title: 'Withdrawal Paid', message: 'Your withdrawal of $200 has been deposited to your bank account.', time: '2 weeks ago', read: true },
];

const typeConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bgColor: string }> = {
  referral: { icon: FaGift, color: 'text-staff-primary', bgColor: 'bg-staff-primary/10' },
  withdrawal: { icon: FaCreditCard, color: 'text-info', bgColor: 'bg-info/10' },
  points: { icon: FaCheck, color: 'text-success', bgColor: 'bg-success/10' },
  system: { icon: FaInfoCircle, color: 'text-warning', bgColor: 'bg-warning/10' },
};

export default function StaffNotifications() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            <FaCheck className="w-4 h-4 mr-1" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <FaBell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const config = typeConfig[notification.type];
            const Icon = config.icon;

            return (
              <button
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={cn(
                  'w-full bg-card rounded-xl p-4 border text-left transition-all',
                  notification.read 
                    ? 'border-border' 
                    : 'border-staff-primary/30 bg-staff-primary/5'
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', config.bgColor)}>
                    <Icon className={cn('w-5 h-5', config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className={cn(
                        'font-medium text-foreground',
                        !notification.read && 'font-semibold'
                      )}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="w-2 h-2 rounded-full bg-staff-primary flex-shrink-0 mt-2" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <FaClock className="w-3 h-3" />
                      <span>{notification.time}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
