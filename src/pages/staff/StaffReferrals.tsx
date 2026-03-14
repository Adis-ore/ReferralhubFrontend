import { useState } from 'react';
import { ReferralStatusBadge } from '@/components/staff/ReferralStatusBadge';
import { ReferralProgress } from '@/components/staff/ReferralProgress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FaUsers, FaClock, FaChevronRight } from 'react-icons/fa';
import { GiTwoCoins } from 'react-icons/gi';
import { cn } from '@/lib/utils';

type ReferralStatus = 'invited' | 'working' | 'eligible' | 'completed';

interface Referral {
  id: string;
  name: string;
  email: string;
  status: ReferralStatus;
  invitedDate: string;
  hoursCompleted: number;
  hoursRequired: number;
  pointsEarned: number;
}

const mockReferrals: Referral[] = [
  { id: '1', name: 'Emma Wilson', email: 'emma.w@email.com', status: 'completed', invitedDate: '2024-03-15', hoursCompleted: 150, hoursRequired: 120, pointsEarned: 500 },
  { id: '2', name: 'James Chen', email: 'james.c@email.com', status: 'eligible', invitedDate: '2024-04-20', hoursCompleted: 125, hoursRequired: 120, pointsEarned: 0 },
  { id: '3', name: 'Sarah Brown', email: 'sarah.b@email.com', status: 'working', invitedDate: '2024-05-10', hoursCompleted: 65, hoursRequired: 120, pointsEarned: 0 },
  { id: '4', name: 'Michael Park', email: 'michael.p@email.com', status: 'working', invitedDate: '2024-05-25', hoursCompleted: 32, hoursRequired: 120, pointsEarned: 0 },
  { id: '5', name: 'Lisa Garcia', email: 'lisa.g@email.com', status: 'invited', invitedDate: '2024-06-01', hoursCompleted: 0, hoursRequired: 120, pointsEarned: 0 },
  { id: '6', name: 'David Kim', email: 'david.k@email.com', status: 'completed', invitedDate: '2024-02-10', hoursCompleted: 180, hoursRequired: 120, pointsEarned: 500 },
  { id: '7', name: 'Rachel Adams', email: 'rachel.a@email.com', status: 'completed', invitedDate: '2024-01-20', hoursCompleted: 200, hoursRequired: 120, pointsEarned: 500 },
  { id: '8', name: 'Tom Wilson', email: 'tom.w@email.com', status: 'invited', invitedDate: '2024-06-10', hoursCompleted: 0, hoursRequired: 120, pointsEarned: 0 },
];

const statusToStep: Record<ReferralStatus, number> = {
  invited: 1,
  working: 2,
  eligible: 3,
  completed: 4,
};

export default function StaffReferrals() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);

  const getFilteredReferrals = () => {
    if (activeTab === 'all') return mockReferrals;
    return mockReferrals.filter(r => r.status === activeTab);
  };

  const statusCounts = {
    all: mockReferrals.length,
    invited: mockReferrals.filter(r => r.status === 'invited').length,
    working: mockReferrals.filter(r => r.status === 'working').length,
    eligible: mockReferrals.filter(r => r.status === 'eligible').length,
    completed: mockReferrals.filter(r => r.status === 'completed').length,
  };

  const totalEarned = mockReferrals.reduce((sum, r) => sum + r.pointsEarned, 0);

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">My Referrals</h1>
        <p className="text-muted-foreground">Track your referral progress</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-staff-primary/10 flex items-center justify-center">
              <FaUsers className="w-5 h-5 text-staff-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{mockReferrals.length}</p>
              <p className="text-xs text-muted-foreground">Total Referrals</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <GiTwoCoins className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalEarned.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Points Earned</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList className="w-full grid grid-cols-5 h-auto p-1">
          <TabsTrigger value="all" className="text-xs py-2">
            All ({statusCounts.all})
          </TabsTrigger>
          <TabsTrigger value="invited" className="text-xs py-2">
            Invited
          </TabsTrigger>
          <TabsTrigger value="working" className="text-xs py-2">
            Working
          </TabsTrigger>
          <TabsTrigger value="eligible" className="text-xs py-2">
            Eligible
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs py-2">
            Done
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Referral List */}
      <div className="space-y-3">
        {getFilteredReferrals().length === 0 ? (
          <div className="text-center py-12">
            <FaUsers className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No referrals in this category</p>
          </div>
        ) : (
          getFilteredReferrals().map((referral) => (
            <button
              key={referral.id}
              onClick={() => setSelectedReferral(referral)}
              className="w-full bg-card rounded-xl p-4 border border-border text-left hover:border-staff-primary/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-staff-primary/10 text-staff-primary">
                    {referral.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-foreground">{referral.name}</p>
                    <ReferralStatusBadge status={referral.status} />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <FaClock className="w-3.5 h-3.5" />
                      <span>{referral.hoursCompleted >= 120 ? '120+' : referral.hoursCompleted}/{referral.hoursRequired} hrs</span>
                    </div>
                    {referral.pointsEarned > 0 && (
                      <div className="flex items-center gap-1 text-success">
                        <GiTwoCoins className="w-3.5 h-3.5" />
                        <span>+{referral.pointsEarned}</span>
                      </div>
                    )}
                  </div>
                  {/* Progress Bar */}
                  <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        referral.status === 'completed' ? 'bg-success' :
                        referral.status === 'eligible' ? 'bg-warning' :
                        'bg-staff-primary'
                      )}
                      style={{ width: `${Math.min((referral.hoursCompleted / referral.hoursRequired) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <FaChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </button>
          ))
        )}
      </div>

      {/* Detail Sheet */}
      <Sheet open={!!selectedReferral} onOpenChange={() => setSelectedReferral(null)}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Referral Details</SheetTitle>
          </SheetHeader>

          {selectedReferral && (
            <div className="mt-6 space-y-6">
              {/* Profile */}
              <div className="text-center">
                <Avatar className="h-20 w-20 mx-auto mb-3">
                  <AvatarFallback className="bg-staff-primary/10 text-staff-primary text-xl">
                    {selectedReferral.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold">{selectedReferral.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedReferral.email}</p>
                <div className="mt-2">
                  <ReferralStatusBadge status={selectedReferral.status} />
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="bg-muted/30 rounded-xl p-4">
                <ReferralProgress currentStep={statusToStep[selectedReferral.status]} />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card rounded-xl p-4 border border-border text-center">
                  <FaClock className="w-6 h-6 text-staff-primary mx-auto mb-2" />
                  <p className="text-xl font-bold">{selectedReferral.hoursCompleted >= 120 ? '120+' : selectedReferral.hoursCompleted}</p>
                  <p className="text-xs text-muted-foreground">{selectedReferral.hoursCompleted >= 120 ? 'Capped for privacy' : 'Hours Worked'}</p>
                </div>
                <div className="bg-card rounded-xl p-4 border border-border text-center">
                  <GiTwoCoins className="w-6 h-6 text-success mx-auto mb-2" />
                  <p className="text-xl font-bold">{selectedReferral.pointsEarned}</p>
                  <p className="text-xs text-muted-foreground">Points Earned</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Invited On</span>
                  <span className="font-medium">{selectedReferral.invitedDate}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Hours Required</span>
                  <span className="font-medium">{selectedReferral.hoursRequired} hours</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {Math.round((selectedReferral.hoursCompleted / selectedReferral.hoursRequired) * 100)}%
                  </span>
                </div>
              </div>

              {selectedReferral.status === 'eligible' && (
                <div className="bg-success/5 rounded-xl p-4 border border-success/20">
                  <p className="text-sm text-success font-medium">
                    🎉 Great news! Your referral is eligible. Points will be awarded once verified.
                  </p>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
