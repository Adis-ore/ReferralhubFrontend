import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStaffAuth } from '@/contexts/StaffAuthContext';
import { ProgressRing } from '@/components/staff/ProgressRing';
import { ReferralStatusBadge } from '@/components/staff/ReferralStatusBadge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FaClock, FaWallet, FaChevronRight, FaGift, FaCopy, FaShare, FaChartLine, FaUsers, FaStar } from 'react-icons/fa';
import { GiTwoCoins } from 'react-icons/gi';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const recentReferrals = [
  { id: '1', name: 'Emma Wilson', status: 'completed' as const, date: '2024-05-20' },
  { id: '2', name: 'James Chen', status: 'eligible' as const, date: '2024-06-01' },
  { id: '3', name: 'Sarah Brown', status: 'working' as const, date: '2024-06-10' },
];

export default function StaffHome() {
  const { user } = useStaffAuth();
  const [copied, setCopied] = useState(false);

  const totalPoints = 3500;
  const pendingPoints = 500;
  const availablePoints = 2500;
  const withdrawnPoints = 500;

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user?.referralCode || '');
    setCopied(true);
    toast.success('Referral code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Welcome Section */}
      <div className="text-center">
        <p className="text-muted-foreground">Welcome back,</p>
        <h1 className="text-2xl font-bold text-foreground">{user?.name?.split(' ')[0]}! 👋</h1>
      </div>

      {/* Points Overview Card */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground">Total Points Earned</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-staff-primary">{totalPoints.toLocaleString()}</span>
              <span className="text-staff-primary">pts</span>
            </div>
          </div>
          <ProgressRing progress={70} size={80} strokeWidth={6}>
            <div className="text-center">
              <span className="text-lg font-bold text-staff-primary">70%</span>
            </div>
          </ProgressRing>
        </div>

        {/* Points Breakdown */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-success/5 rounded-xl p-3 text-center">
            <FaWallet className="w-5 h-5 text-success mx-auto mb-1" />
            <p className="text-lg font-semibold text-foreground">{availablePoints.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Available</p>
          </div>
          <div className="bg-warning/5 rounded-xl p-3 text-center">
            <FaClock className="w-5 h-5 text-warning mx-auto mb-1" />
            <p className="text-lg font-semibold text-foreground">{pendingPoints.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
          <div className="bg-info/5 rounded-xl p-3 text-center">
            <FaChartLine className="w-5 h-5 text-info mx-auto mb-1" />
            <p className="text-lg font-semibold text-foreground">{withdrawnPoints.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Withdrawn</p>
          </div>
        </div>

        {/* Withdraw CTA */}
        <Link to="/staff/withdrawals">
          <Button className="w-full mt-6 bg-staff-gradient hover:opacity-90 text-white h-12 text-base font-semibold">
            <GiTwoCoins className="w-5 h-5 mr-2" />
            Request Withdrawal
          </Button>
        </Link>
      </div>

      {/* Referral Code Card */}
      <div className="bg-gradient-to-br from-staff-primary/10 to-staff-secondary/10 rounded-2xl p-5 border border-staff-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-staff-primary/20 flex items-center justify-center">
            <FaGift className="w-5 h-5 text-staff-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Share & Earn</p>
            <p className="text-sm text-muted-foreground">Earn 500 pts per successful referral</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 bg-card rounded-lg px-4 py-3 font-mono text-lg font-bold text-center border border-border">
            {user?.referralCode}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12"
            onClick={copyReferralCode}
          >
            <FaCopy className={cn('w-5 h-5', copied && 'text-success')} />
          </Button>
          <Button
            size="icon"
            className="h-12 w-12 bg-staff-primary hover:bg-staff-primary/90"
          >
            <FaShare className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/staff/referrals" className="bg-card rounded-xl p-4 border border-border hover:border-staff-primary/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-staff-primary/10 flex items-center justify-center">
              <FaUsers className="w-5 h-5 text-staff-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">8</p>
              <p className="text-xs text-muted-foreground">Total Referrals</p>
            </div>
          </div>
        </Link>
        <Link to="/staff/hours" className="bg-card rounded-xl p-4 border border-border hover:border-staff-primary/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <FaClock className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">156</p>
              <p className="text-xs text-muted-foreground">Hours This Month</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Referrals */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">Recent Referrals</h2>
          <Link to="/staff/referrals" className="text-sm text-staff-primary font-medium flex items-center">
            View all
            <FaChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {recentReferrals.map((referral) => (
            <div key={referral.id} className="bg-card rounded-xl p-4 border border-border flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-staff-primary/10 text-staff-primary">
                  {referral.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-foreground">{referral.name}</p>
                <p className="text-xs text-muted-foreground">Referred {referral.date}</p>
              </div>
              <ReferralStatusBadge status={referral.status} />
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Banner */}
      <div className="bg-gradient-to-r from-staff-primary to-staff-secondary rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3">
          <FaStar className="w-8 h-8" />
          <div>
            <p className="font-semibold">You're doing great!</p>
            <p className="text-sm text-white/80">2 more referrals to reach Gold status 🏆</p>
          </div>
        </div>
      </div>
    </div>
  );
}
