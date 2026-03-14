import { useState } from 'react';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { DataTable } from '@/components/ui/data-table';
import { FilterBar } from '@/components/ui/filter-bar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { FaUsers, FaEye, FaCheck, FaTimes, FaClock, FaSearch, FaFilter, FaDownload } from 'react-icons/fa';
import { cn } from '@/lib/utils';

interface Referral {
  id: string;
  referrerName: string;
  refereeName: string;
  refereeEmail: string;
  refereePhone: string;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  pointsAwarded: number;
  submittedDate: string;
  processedDate?: string;
  notes?: string;
}

const mockReferrals: Referral[] = [
  {
    id: '1',
    referrerName: 'Adewale Johnson',
    refereeName: 'John Smith',
    refereeEmail: 'john.smith@example.com',
    refereePhone: '+234 803 123 4567',
    status: 'pending',
    pointsAwarded: 0,
    submittedDate: '2024-06-15',
  },
  {
    id: '2',
    referrerName: 'Chioma Okafor',
    refereeName: 'Sarah Williams',
    refereeEmail: 'sarah.williams@example.com',
    refereePhone: '+234 806 987 6543',
    status: 'approved',
    pointsAwarded: 0,
    submittedDate: '2024-06-10',
    processedDate: '2024-06-12',
  },
  {
    id: '3',
    referrerName: 'Oluwaseun Adebayo',
    refereeName: 'Michael Brown',
    refereeEmail: 'michael.brown@example.com',
    refereePhone: '+234 810 456 7890',
    status: 'completed',
    pointsAwarded: 500,
    submittedDate: '2024-06-01',
    processedDate: '2024-06-15',
    notes: 'Successfully onboarded and completed 30 days',
  },
  {
    id: '4',
    referrerName: 'Blessing Eze',
    refereeName: 'Emily Davis',
    refereeEmail: 'emily.davis@example.com',
    refereePhone: '+234 813 234 5678',
    status: 'rejected',
    pointsAwarded: 0,
    submittedDate: '2024-06-05',
    processedDate: '2024-06-07',
    notes: 'Duplicate entry - candidate already referred',
  },
];

const statusConfig = {
  pending: { label: 'Pending Review', className: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20' },
  approved: { label: 'Approved', className: 'bg-blue-500/10 text-blue-700 border-blue-500/20' },
  completed: { label: 'Completed', className: 'bg-green-500/10 text-green-700 border-green-500/20' },
  rejected: { label: 'Rejected', className: 'bg-red-500/10 text-red-700 border-red-500/20' },
};

export default function Referrals() {
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReferrals = mockReferrals.filter((referral) => {
    const matchesStatus = statusFilter === 'all' || referral.status === statusFilter;
    const matchesSearch =
      referral.referrerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referral.refereeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referral.refereeEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const columns = [
    {
      key: 'refereeName',
      label: 'Referee Name',
      render: (referral: Referral) => (
        <div className="font-medium">{referral.refereeName}</div>
      ),
    },
    {
      key: 'referrerName',
      label: 'Referred By',
      render: (referral: Referral) => (
        <div className="text-sm text-muted-foreground">{referral.referrerName}</div>
      ),
    },
    {
      key: 'refereeEmail',
      label: 'Contact',
      render: (referral: Referral) => (
        <div className="text-sm">
          <div>{referral.refereeEmail}</div>
          <div className="text-muted-foreground">{referral.refereePhone}</div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (referral: Referral) => {
        const config = statusConfig[referral.status];
        return (
          <Badge variant="outline" className={config.className}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: 'pointsAwarded',
      label: 'Points',
      render: (referral: Referral) => (
        <div className="font-medium">
          {referral.pointsAwarded > 0 ? `${referral.pointsAwarded}` : '-'}
        </div>
      ),
    },
    {
      key: 'submittedDate',
      label: 'Submitted',
      render: (referral: Referral) => (
        <div className="text-sm text-muted-foreground">{referral.submittedDate}</div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (referral: Referral) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedReferral(referral)}
        >
          <FaEye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  const handleApprove = () => {
    console.log('Approve referral:', selectedReferral?.id);
    setSelectedReferral(null);
  };

  const handleReject = () => {
    console.log('Reject referral:', selectedReferral?.id);
    setSelectedReferral(null);
  };

  const handleComplete = () => {
    console.log('Complete referral:', selectedReferral?.id);
    setSelectedReferral(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader
        title="Referral Management"
        subtitle="Review and manage all staff referrals"
        action={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="hidden md:flex">
              <FaDownload className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <FaUsers className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">View Stats</span>
            </Button>
          </div>
        }
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          <div className="bg-card border border-border rounded-lg p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs md:text-sm text-muted-foreground">Total Referrals</span>
              <FaUsers className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-xl md:text-2xl font-bold">257</div>
            <div className="text-xs text-green-600 mt-1">+12 this month</div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs md:text-sm text-muted-foreground">Pending</span>
              <FaClock className="w-4 h-4 text-yellow-500" />
            </div>
            <div className="text-xl md:text-2xl font-bold">23</div>
            <div className="text-xs text-muted-foreground mt-1">Awaiting review</div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs md:text-sm text-muted-foreground">Approved</span>
              <FaCheck className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-xl md:text-2xl font-bold">64</div>
            <div className="text-xs text-muted-foreground mt-1">In progress</div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs md:text-sm text-muted-foreground">Completed</span>
              <FaCheck className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-xl md:text-2xl font-bold">90</div>
            <div className="text-xs text-green-600 mt-1">35% success rate</div>
          </div>
        </div>

        {/* Filters - Responsive */}
        <div className="bg-card border border-border rounded-lg p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search referrals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table - Responsive */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="hidden md:block">
            <DataTable
              columns={columns}
              data={filteredReferrals}
              emptyMessage="No referrals found"
            />
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-border">
            {filteredReferrals.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No referrals found
              </div>
            ) : (
              filteredReferrals.map((referral) => (
                <div
                  key={referral.id}
                  className="p-4 hover:bg-muted/50 cursor-pointer"
                  onClick={() => setSelectedReferral(referral)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium">{referral.refereeName}</div>
                      <div className="text-sm text-muted-foreground">
                        By {referral.referrerName}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={statusConfig[referral.status].className}
                    >
                      {statusConfig[referral.status].label}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {referral.refereeEmail}
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span>{referral.submittedDate}</span>
                    {referral.pointsAwarded > 0 && (
                      <span className="font-medium text-green-600">
                        {referral.pointsAwarded} pts
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Detail Sheet - Responsive */}
      <Sheet open={!!selectedReferral} onOpenChange={() => setSelectedReferral(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selectedReferral && (
            <>
              <SheetHeader>
                <SheetTitle>Referral Details</SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Status Badge */}
                <div>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-sm',
                      statusConfig[selectedReferral.status].className
                    )}
                  >
                    {statusConfig[selectedReferral.status].label}
                  </Badge>
                </div>

                {/* Referee Information */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">Referee Information</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <div className="font-medium">{selectedReferral.refereeName}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <div className="font-medium">{selectedReferral.refereeEmail}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>
                      <div className="font-medium">{selectedReferral.refereePhone}</div>
                    </div>
                  </div>
                </div>

                {/* Referrer Information */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">Referrer Information</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <div className="font-medium">{selectedReferral.referrerName}</div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">Timeline</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Submitted:</span>
                      <div className="font-medium">{selectedReferral.submittedDate}</div>
                    </div>
                    {selectedReferral.processedDate && (
                      <div>
                        <span className="text-muted-foreground">Processed:</span>
                        <div className="font-medium">{selectedReferral.processedDate}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Points */}
                {selectedReferral.pointsAwarded > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Points Awarded</h3>
                    <div className="text-2xl font-bold text-green-600">
                      {selectedReferral.pointsAwarded}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedReferral.notes && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Notes</h3>
                    <div className="text-sm text-muted-foreground">
                      {selectedReferral.notes}
                    </div>
                  </div>
                )}

                {/* Actions - Responsive */}
                {selectedReferral.status === 'pending' && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      onClick={handleApprove}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <FaCheck className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={handleReject}
                      variant="destructive"
                      className="flex-1"
                    >
                      <FaTimes className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}

                {selectedReferral.status === 'approved' && (
                  <Button
                    onClick={handleComplete}
                    className="w-full bg-accent hover:bg-accent/90"
                  >
                    <FaCheck className="w-4 h-4 mr-2" />
                    Mark as Completed
                  </Button>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
