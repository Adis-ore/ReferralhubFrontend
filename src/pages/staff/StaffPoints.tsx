import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FaClock, FaGift, FaChartLine, FaFilter } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import { GiTwoCoins } from 'react-icons/gi';
import { cn } from '@/lib/utils';

type TransactionType = 'earned' | 'pending' | 'withdrawn' | 'adjusted';

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  referralName?: string;
}

const mockTransactions: Transaction[] = [
  { id: '1', type: 'earned', amount: 500, description: 'Referral bonus', referralName: 'Emma Wilson', date: '2024-05-25' },
  { id: '2', type: 'withdrawn', amount: -500, description: 'Withdrawal request #WR-1234', date: '2024-05-20' },
  { id: '3', type: 'earned', amount: 500, description: 'Referral bonus', referralName: 'David Kim', date: '2024-04-15' },
  { id: '4', type: 'pending', amount: 500, description: 'Pending - James Chen (awaiting verification)', date: '2024-06-01' },
  { id: '5', type: 'earned', amount: 500, description: 'Referral bonus', referralName: 'Rachel Adams', date: '2024-03-10' },
  { id: '6', type: 'adjusted', amount: 100, description: 'Manual adjustment - Campaign bonus', date: '2024-03-05' },
  { id: '7', type: 'withdrawn', amount: -400, description: 'Withdrawal request #WR-1189', date: '2024-02-28' },
  { id: '8', type: 'earned', amount: 500, description: 'Referral bonus', referralName: 'Tom Wilson', date: '2024-02-15' },
];

const typeConfig: Record<TransactionType, { icon: React.ComponentType<{ className?: string }>; color: string; bgColor: string }> = {
  earned: { icon: FaChartLine, color: 'text-success', bgColor: 'bg-success/10' },
  pending: { icon: FaClock, color: 'text-warning', bgColor: 'bg-warning/10' },
  withdrawn: { icon: FaChartLine, color: 'text-info', bgColor: 'bg-info/10' },
  adjusted: { icon: FiSettings, color: 'text-accent', bgColor: 'bg-accent/10' },
};

export default function StaffPoints() {
  const [activeTab, setActiveTab] = useState('all');

  const totalEarned = mockTransactions.filter(t => t.type === 'earned').reduce((sum, t) => sum + t.amount, 0);
  const pendingPoints = mockTransactions.filter(t => t.type === 'pending').reduce((sum, t) => sum + t.amount, 0);
  const withdrawnPoints = Math.abs(mockTransactions.filter(t => t.type === 'withdrawn').reduce((sum, t) => sum + t.amount, 0));

  const getFilteredTransactions = () => {
    if (activeTab === 'all') return mockTransactions;
    return mockTransactions.filter(t => t.type === activeTab);
  };

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">My Points</h1>
        <p className="text-muted-foreground">View your points history</p>
      </div>

      {/* Balance Card */}
      <div className="bg-staff-gradient rounded-2xl p-6 text-white mb-6">
        <p className="text-white/70 text-sm">Available Balance</p>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-4xl font-bold">2,500</span>
          <span className="text-white/70">points</span>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
          <div>
            <p className="text-white/70 text-xs">Total Earned</p>
            <p className="font-semibold">{totalEarned.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-white/70 text-xs">Pending</p>
            <p className="font-semibold">{pendingPoints.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-white/70 text-xs">Withdrawn</p>
            <p className="font-semibold">{withdrawnPoints.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList className="w-full grid grid-cols-5 h-auto p-1">
          <TabsTrigger value="all" className="text-xs py-2">All</TabsTrigger>
          <TabsTrigger value="earned" className="text-xs py-2">Earned</TabsTrigger>
          <TabsTrigger value="pending" className="text-xs py-2">Pending</TabsTrigger>
          <TabsTrigger value="withdrawn" className="text-xs py-2">Withdrawn</TabsTrigger>
          <TabsTrigger value="adjusted" className="text-xs py-2">Adjusted</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Transaction List */}
      <div className="space-y-3">
        {getFilteredTransactions().length === 0 ? (
          <div className="text-center py-12">
            <GiTwoCoins className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No transactions in this category</p>
          </div>
        ) : (
          getFilteredTransactions().map((transaction) => {
            const config = typeConfig[transaction.type];
            const Icon = config.icon;

            return (
              <div key={transaction.id} className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center gap-4">
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', config.bgColor)}>
                    <Icon className={cn('w-5 h-5', config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{transaction.description}</p>
                    {transaction.referralName && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <FaGift className="w-3.5 h-3.5" />
                        <span>{transaction.referralName}</span>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">{transaction.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      'font-semibold text-lg',
                      transaction.amount > 0 ? 'text-success' : 'text-foreground'
                    )}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Conversion Info */}
      <div className="mt-6 p-4 bg-muted/30 rounded-xl text-center">
        <p className="text-sm text-muted-foreground">
          💡 <strong>2 points = $1.00</strong> when you withdraw
        </p>
      </div>
    </div>
  );
}
