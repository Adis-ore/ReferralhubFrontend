import { useState } from 'react';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import {
  FaBell,
  FaBullhorn,
  FaPlus,
  FaTrash,
  FaCheck,
  FaCheckDouble,
  FaExclamationTriangle,
  FaInfoCircle,
  FaGift,
  FaCoins,
  FaCreditCard,
  FaUsers,
  FaShieldAlt,
  FaClock,
  FaEnvelope,
  FaEnvelopeOpen,
} from 'react-icons/fa';
import { cn } from '@/lib/utils';

type NotificationType = 'system' | 'withdrawal' | 'referral' | 'points' | 'user' | 'security';

interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, string>;
}

interface BroadcastMessage {
  id: string;
  title: string;
  message: string;
  audience: 'all_staff' | 'all_admins' | 'department';
  department?: string;
  sentBy: string;
  sentAt: string;
  readCount: number;
  totalRecipients: number;
}

const typeIcons: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
  system: FaShieldAlt,
  withdrawal: FaCreditCard,
  referral: FaGift,
  points: FaCoins,
  user: FaUsers,
  security: FaExclamationTriangle,
};

const typeColors: Record<NotificationType, string> = {
  system: 'bg-primary/10 text-primary',
  withdrawal: 'bg-accent/10 text-accent',
  referral: 'bg-success/10 text-success',
  points: 'bg-warning/10 text-warning',
  user: 'bg-info/10 text-info',
  security: 'bg-destructive/10 text-destructive',
};

const priorityColors: Record<string, string> = {
  low: 'text-muted-foreground',
  normal: 'text-foreground',
  high: 'text-warning',
  urgent: 'text-destructive',
};

const mockNotifications: AdminNotification[] = [
  {
    id: 'N-001',
    title: 'New withdrawal request pending',
    message: 'Sarah Johnson has submitted a withdrawal request for 500 points ($250.00 AUD). Awaiting approval.',
    type: 'withdrawal',
    priority: 'high',
    isRead: false,
    createdAt: '2024-06-15 09:30',
    actionUrl: '/withdrawals',
    actionLabel: 'View Withdrawals',
    metadata: { userId: '1', amount: '500 pts' },
  },
  {
    id: 'N-002',
    title: 'New withdrawal request pending',
    message: 'Michael Chen has submitted a withdrawal request for 1,000 points ($500.00 AUD). Awaiting approval.',
    type: 'withdrawal',
    priority: 'high',
    isRead: false,
    createdAt: '2024-06-14 14:20',
    actionUrl: '/withdrawals',
    actionLabel: 'View Withdrawals',
  },
  {
    id: 'N-003',
    title: 'Referral milestone reached',
    message: 'Oluwaseun Adebayo has reached 18 successful referrals this quarter, qualifying for the bonus tier.',
    type: 'referral',
    priority: 'normal',
    isRead: false,
    createdAt: '2024-06-14 11:00',
    actionUrl: '/users/3',
    actionLabel: 'View User',
  },
  {
    id: 'N-004',
    title: 'System rate change scheduled',
    message: 'A new conversion rate (1.5 pts = $1.00 AUD) is scheduled to take effect on 2024-07-01.',
    type: 'system',
    priority: 'normal',
    isRead: true,
    createdAt: '2024-06-10 14:30',
    actionUrl: '/points-config',
    actionLabel: 'View Configuration',
  },
  {
    id: 'N-005',
    title: 'Inactive user alert',
    message: '3 users have been inactive for over 3 months: Chinedu Okoro, Chijioke Nnadi, Sade Williams. Consider reviewing their accounts.',
    type: 'user',
    priority: 'normal',
    isRead: true,
    createdAt: '2024-06-10 08:00',
    actionUrl: '/users',
    actionLabel: 'View Users',
  },
  {
    id: 'N-006',
    title: 'Failed login attempt detected',
    message: 'Multiple failed login attempts detected from IP 192.168.1.45 for admin account michael.torres@company.com.',
    type: 'security',
    priority: 'urgent',
    isRead: false,
    createdAt: '2024-06-13 23:45',
    actionUrl: '/audit',
    actionLabel: 'View Audit Log',
  },
  {
    id: 'N-007',
    title: 'Points adjustment completed',
    message: 'Bulk points adjustment for Q2 bonus has been processed. 42 users received bonus points totaling 8,400 pts.',
    type: 'points',
    priority: 'low',
    isRead: true,
    createdAt: '2024-06-09 10:00',
  },
  {
    id: 'N-008',
    title: 'New user registration',
    message: 'Zainab Mohammed has completed registration and is awaiting profile verification.',
    type: 'user',
    priority: 'normal',
    isRead: true,
    createdAt: '2024-06-08 16:30',
    actionUrl: '/users/12',
    actionLabel: 'View Profile',
  },
];

const mockBroadcasts: BroadcastMessage[] = [
  {
    id: 'B-001',
    title: 'Holiday Schedule Update',
    message: 'Please note that the office will be closed on June 20th for a public holiday. All shift submissions for this date should be marked as "Public Holiday" type.',
    audience: 'all_staff',
    sentBy: 'Sarah Chen',
    sentAt: '2024-06-12 09:00',
    readCount: 38,
    totalRecipients: 50,
  },
  {
    id: 'B-002',
    title: 'New Referral Program Launch',
    message: 'We are excited to announce the Summer Boost Campaign! Earn double points for every successful referral from June 1st to August 31st. Check your Referral Programs page for details.',
    audience: 'all_staff',
    sentBy: 'Operations Admin',
    sentAt: '2024-06-01 08:00',
    readCount: 45,
    totalRecipients: 50,
  },
  {
    id: 'B-003',
    title: 'System Maintenance Notice',
    message: 'The platform will undergo scheduled maintenance on June 25th from 2:00 AM to 4:00 AM AEST. During this time, login and withdrawal requests will be temporarily unavailable.',
    audience: 'all_staff',
    sentBy: 'Sarah Chen',
    sentAt: '2024-06-10 14:00',
    readCount: 30,
    totalRecipients: 50,
  },
  {
    id: 'B-004',
    title: 'Q2 Points Review',
    message: 'All finance admins: Please review and approve pending points adjustments for Q2 by June 30th. Access the Points Configuration page for the full list.',
    audience: 'all_admins',
    sentBy: 'Sarah Chen',
    sentAt: '2024-06-05 11:00',
    readCount: 3,
    totalRecipients: 5,
  },
];

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [broadcasts, setBroadcasts] = useState(mockBroadcasts);
  const [activeTab, setActiveTab] = useState('inbox');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showBroadcastSheet, setShowBroadcastSheet] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Broadcast form
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastAudience, setBroadcastAudience] = useState<'all_staff' | 'all_admins'>('all_staff');

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const urgentCount = notifications.filter(n => n.priority === 'urgent' && !n.isRead).length;

  const filteredNotifications = notifications.filter(n => {
    if (typeFilter === 'all') return true;
    if (typeFilter === 'unread') return !n.isRead;
    return n.type === typeFilter;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllRead = () => {
    setNotifications(prev => prev.filter(n => !n.isRead));
    setShowClearConfirm(false);
  };

  const sendBroadcast = () => {
    if (!broadcastTitle || !broadcastMessage) return;
    const newBroadcast: BroadcastMessage = {
      id: `B-${String(broadcasts.length + 1).padStart(3, '0')}`,
      title: broadcastTitle,
      message: broadcastMessage,
      audience: broadcastAudience,
      sentBy: 'Current Admin',
      sentAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      readCount: 0,
      totalRecipients: broadcastAudience === 'all_staff' ? 50 : 5,
    };
    setBroadcasts(prev => [newBroadcast, ...prev]);
    setShowBroadcastSheet(false);
    setBroadcastTitle('');
    setBroadcastMessage('');
    setBroadcastAudience('all_staff');
  };

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date('2024-06-15T12:00:00');
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Notifications"
        subtitle="System alerts, messages, and broadcast management"
      />

      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="kpi-card before:bg-primary">
            <p className="text-xs md:text-sm text-muted-foreground">Unread</p>
            <p className="text-xl md:text-2xl font-semibold mt-1">{unreadCount}</p>
          </div>
          <div className="kpi-card before:bg-destructive">
            <p className="text-xs md:text-sm text-muted-foreground">Urgent</p>
            <p className="text-xl md:text-2xl font-semibold mt-1">{urgentCount}</p>
          </div>
          <div className="kpi-card before:bg-success">
            <p className="text-xs md:text-sm text-muted-foreground">Total Notifications</p>
            <p className="text-xl md:text-2xl font-semibold mt-1">{notifications.length}</p>
          </div>
          <div className="kpi-card before:bg-info">
            <p className="text-xs md:text-sm text-muted-foreground">Broadcasts Sent</p>
            <p className="text-xl md:text-2xl font-semibold mt-1">{broadcasts.length}</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="inbox" className="text-xs md:text-sm">
                Inbox {unreadCount > 0 && `(${unreadCount})`}
              </TabsTrigger>
              <TabsTrigger value="broadcasts" className="text-xs md:text-sm">
                Broadcasts
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              {activeTab === 'inbox' && (
                <>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-32 text-xs md:text-sm">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="unread">Unread</SelectItem>
                      <SelectItem value="withdrawal">Withdrawals</SelectItem>
                      <SelectItem value="referral">Referrals</SelectItem>
                      <SelectItem value="points">Points</SelectItem>
                      <SelectItem value="user">Users</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
                    <FaCheckDouble className="w-3.5 h-3.5 mr-1.5" />
                    <span className="hidden md:inline">Mark All Read</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowClearConfirm(true)} className="text-destructive hover:text-destructive">
                    <FaTrash className="w-3.5 h-3.5 mr-1.5" />
                    <span className="hidden md:inline">Clear Read</span>
                  </Button>
                </>
              )}
              {activeTab === 'broadcasts' && (
                <Button size="sm" onClick={() => setShowBroadcastSheet(true)}>
                  <FaBullhorn className="w-3.5 h-3.5 mr-1.5" />
                  New Broadcast
                </Button>
              )}
            </div>
          </div>

          {/* Inbox */}
          <TabsContent value="inbox" className="mt-4 md:mt-6">
            <div className="space-y-2">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-lg border border-border">
                  <FaBell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No notifications</p>
                </div>
              ) : (
                filteredNotifications.map((notif) => {
                  const Icon = typeIcons[notif.type];
                  return (
                    <div
                      key={notif.id}
                      className={cn(
                        'bg-card rounded-xl border p-4 transition-all hover:border-primary/20',
                        !notif.isRead && 'border-primary/30 bg-primary/[0.02]'
                      )}
                    >
                      <div className="flex gap-3">
                        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', typeColors[notif.type])}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className={cn('text-sm', !notif.isRead ? 'font-semibold' : 'font-medium')}>
                                {notif.title}
                              </h4>
                              {notif.priority === 'urgent' && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-destructive/10 text-destructive uppercase">
                                  Urgent
                                </span>
                              )}
                              {notif.priority === 'high' && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-warning/10 text-warning uppercase">
                                  High
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <span className="text-xs text-muted-foreground">{getTimeAgo(notif.createdAt)}</span>
                              {!notif.isRead && (
                                <div className="w-2 h-2 rounded-full bg-primary ml-1" />
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notif.message}</p>
                          <div className="flex items-center gap-2 mt-2">
                            {!notif.isRead && (
                              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => markAsRead(notif.id)}>
                                <FaCheck className="w-3 h-3 mr-1" />
                                Mark Read
                              </Button>
                            )}
                            {notif.actionUrl && (
                              <Button variant="ghost" size="sm" className="h-7 text-xs text-primary" asChild>
                                <a href={notif.actionUrl}>{notif.actionLabel || 'View'}</a>
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive ml-auto" onClick={() => deleteNotification(notif.id)}>
                              <FaTrash className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* Broadcasts */}
          <TabsContent value="broadcasts" className="mt-4 md:mt-6">
            <div className="space-y-3">
              {broadcasts.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-lg border border-border">
                  <FaBullhorn className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No broadcasts sent yet</p>
                </div>
              ) : (
                broadcasts.map((broadcast) => (
                  <div key={broadcast.id} className="bg-card rounded-xl border border-border p-4 md:p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center shrink-0">
                          <FaBullhorn className="w-4 h-4 text-info" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{broadcast.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            <span>By {broadcast.sentBy}</span>
                            <span>-</span>
                            <span>{broadcast.sentAt}</span>
                          </div>
                        </div>
                      </div>
                      <span className={cn(
                        'px-2 py-1 rounded-md text-xs font-medium border shrink-0',
                        broadcast.audience === 'all_staff' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-warning/10 text-warning border-warning/20'
                      )}>
                        {broadcast.audience === 'all_staff' ? 'All Staff' : 'All Admins'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 ml-[52px]">{broadcast.message}</p>
                    <div className="ml-[52px] flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FaEnvelopeOpen className="w-3 h-3" />
                        <span>{broadcast.readCount} read</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaEnvelope className="w-3 h-3" />
                        <span>{broadcast.totalRecipients - broadcast.readCount} unread</span>
                      </div>
                      <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(broadcast.readCount / broadcast.totalRecipients) * 100}%` }}
                        />
                      </div>
                      <span>{Math.round((broadcast.readCount / broadcast.totalRecipients) * 100)}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Broadcast Sheet */}
      <Sheet open={showBroadcastSheet} onOpenChange={setShowBroadcastSheet}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Send Broadcast</SheetTitle>
            <SheetDescription>Send a message to staff or admin users</SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label>Audience</Label>
              <Select value={broadcastAudience} onValueChange={(v) => setBroadcastAudience(v as 'all_staff' | 'all_admins')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_staff">All Staff (50 users)</SelectItem>
                  <SelectItem value="all_admins">All Admins (5 users)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={broadcastTitle} onChange={(e) => setBroadcastTitle(e.target.value)} placeholder="Message title..." />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <textarea
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Type your broadcast message..."
                className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="p-3 rounded-lg bg-warning/5 border border-warning/20">
              <div className="flex gap-2">
                <FaExclamationTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  This message will be sent to {broadcastAudience === 'all_staff' ? '50 staff members' : '5 admin users'} immediately. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={sendBroadcast} disabled={!broadcastTitle || !broadcastMessage} className="flex-1">
                <FaBullhorn className="w-3.5 h-3.5 mr-2" />
                Send Broadcast
              </Button>
              <Button variant="outline" onClick={() => setShowBroadcastSheet(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Clear Read Confirmation */}
      <ConfirmationModal
        open={showClearConfirm}
        onOpenChange={setShowClearConfirm}
        title="Clear Read Notifications"
        description="Remove all read notifications from your inbox? This cannot be undone."
        confirmText="Clear Read"
        variant="destructive"
        onConfirm={clearAllRead}
      />
    </div>
  );
}
