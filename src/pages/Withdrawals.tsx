import { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { DataTable } from '@/components/ui/data-table';
import { FilterBar } from '@/components/ui/filter-bar';
import { StatusBadge } from '@/components/ui/status-badge';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  FaDownload as Download,
  FaCheck as Check,
  FaTimes as X,
  FaEye as Eye,  
  FaFileAlt as FileText,
  FaDollarSign as DollarSign,
  FaCoins as Coins,
  FaArrowRight as ArrowRight,
  FaLock as Lock,
  FaChartLine as TrendingUp,
  FaChartLine as TrendingDown,
  FaExclamationTriangle as AlertTriangle,
  FaInfoCircle as Info,
  FaUniversity as University,
  FaCheckSquare,
  FaRegSquare,
  FaMinusSquare,
} from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { withdrawalsApi } from '@/services/api';
import { toast } from 'sonner';
import { SkeletonPage } from '@/components/ui/skeletons';

interface Withdrawal {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  pointsWithdrawn: number;
  conversionRate: number;
  currencySymbol: string;
  currencyCode: string;
  finalAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid' | 'processing';
  requestedDate: string;
  processedDate?: string;
  processedBy?: string;
  note?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
}

// Current active rate for comparison
const currentActiveRate = {
  pointsPerUnit: 2,
  currencySymbol: '$',
  currencyCode: 'AUD'
};

export default function Withdrawals() {
  const { user } = useAuth();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('pending');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [modalType, setModalType] = useState<'approve' | 'reject' | 'pay' | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLoading(true);
    withdrawalsApi.list()
      .then((res) => {
        const mapped: Withdrawal[] = res.data.map((w: any) => ({
          id: String(w.id),
          userId: String(w.userId),
          userName: w.userName ?? '',
          userEmail: w.userEmail ?? '',
          pointsWithdrawn: w.pointsWithdrawn ?? 0,
          conversionRate: w.conversionRate ?? 2,
          currencySymbol: w.currencySymbol ?? '$',
          currencyCode: w.currencyCode ?? 'AUD',
          finalAmount: w.finalAmount ?? 0,
          status: w.status,
          requestedDate: w.requestedDate ? w.requestedDate.split('T')[0] : '',
          processedDate: w.processedDate ? w.processedDate.split('T')[0] : undefined,
          processedBy: w.processedBy,
          note: w.note,
          bankName: w.bankName,
          accountNumber: w.accountNumber,
          accountName: w.accountName,
        }));
        setWithdrawals(mapped);
      })
      .catch((err) => {
        toast.error(err.message || 'Failed to load withdrawals');
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAllFiltered = () => {
    const filtered = getFilteredWithdrawals();
    const allSelected = filtered.every(w => selectedIds.has(w.id));
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(w => w.id)));
    }
  };

  const exportSelected = (format: 'csv' | 'pdf' | 'aba') => {
    const items = withdrawals.filter(w => selectedIds.has(w.id));
    if (items.length === 0) {
      alert('Select at least one withdrawal to export.');
      return;
    }

    if (format === 'csv') {
      const headers = 'Employee,Account Name,Account Number,Bank,Reference,Points,Amount,Status,Date\n';
      const rows = items.map(w =>
        `${w.userName},${w.accountName || ''},${w.accountNumber || ''},${w.bankName || ''},${w.id},${w.pointsWithdrawn},${w.finalAmount},${w.status},${w.requestedDate}`
      ).join('\n');
      const blob = new Blob([headers + rows], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `withdrawals-${new Date().toISOString().split('T')[0]}.csv`; a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      const content = items.map(w =>
        `${w.userName} | ${w.accountName || 'N/A'} | ${w.accountNumber || 'N/A'} | ${w.bankName || 'N/A'} | ${w.id} | ${w.currencySymbol}${w.finalAmount.toFixed(2)}`
      ).join('\n');
      const blob = new Blob([
        `Bank Payments - Paramount Care Solutions Pty Ltd\nPeriod: ${new Date().toLocaleDateString()}\n\nEmployee | Account Name | Account Number | Bank | Reference | Amount\n${'='.repeat(80)}\n${content}\n${'='.repeat(80)}\nTotal: $${items.reduce((s, w) => s + w.finalAmount, 0).toFixed(2)}\n`
      ], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `withdrawals-${new Date().toISOString().split('T')[0]}.txt`; a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'aba') {
      const lines = ['0                 01BQL       Paramount Care    001234Account 0106260623                      '];
      items.forEach(w => {
        const accNum = (w.accountNumber || '').padEnd(9, ' ');
        const name = (w.accountName || w.userName).padEnd(32, ' ').slice(0, 32);
        const amount = String(Math.round(w.finalAmount * 100)).padStart(10, '0');
        lines.push(`1062-000${accNum} 500${amount}${name}PCS SALARY      001234${name}00000000`);
      });
      const totalAmount = String(Math.round(items.reduce((s, w) => s + w.finalAmount, 0) * 100)).padStart(10, '0');
      lines.push(`7999-999            ${totalAmount}${totalAmount}                        ${String(items.length).padStart(6, '0')}                                        `);
      const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `withdrawals-${new Date().toISOString().split('T')[0]}.aba`; a.click();
      URL.revokeObjectURL(url);
    }
  };

  const canManage = user?.role === 'super_admin' || user?.role === 'finance_admin';

  const getFilteredWithdrawals = () => {
    return withdrawals.filter(w => {
      const matchesSearch = w.userName.toLowerCase().includes(search.toLowerCase()) ||
        w.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || w.status === statusFilter;
      const matchesTab = activeTab === 'all' ||
        (activeTab === 'pending' && w.status === 'pending') ||
        (activeTab === 'processing' && (w.status === 'approved' || w.status === 'processing')) ||
        (activeTab === 'completed' && (w.status === 'paid' || w.status === 'rejected'));
      return matchesSearch && matchesStatus && matchesTab;
    });
  };

  const pendingCount = withdrawals.filter(w => w.status === 'pending').length;
  const processingCount = withdrawals.filter(w => w.status === 'approved' || w.status === 'processing').length;
  const completedCount = withdrawals.filter(w => w.status === 'paid' || w.status === 'rejected').length;
  
  // Calculate totals
  const pendingAmount = withdrawals.filter(w => w.status === 'pending').reduce((a, b) => a + b.finalAmount, 0);
  const processingAmount = withdrawals.filter(w => w.status === 'approved' || w.status === 'processing').reduce((a, b) => a + b.finalAmount, 0);
  const paidAmount = withdrawals.filter(w => w.status === 'paid').reduce((a, b) => a + b.finalAmount, 0);

  // Check if rate differs from current
  const getRateDifference = (w: Withdrawal) => {
    if (w.conversionRate === currentActiveRate.pointsPerUnit) return null;
    const currentValue = w.pointsWithdrawn / currentActiveRate.pointsPerUnit;
    const lockedValue = w.finalAmount;
    return currentValue - lockedValue;
  };

  const filteredData = getFilteredWithdrawals();
  const allFilteredSelected = filteredData.length > 0 && filteredData.every(w => selectedIds.has(w.id));
  const someFilteredSelected = filteredData.some(w => selectedIds.has(w.id));

  const columns = [
    {
      key: 'select',
      header: '',
      className: 'w-10',
      render: (w: Withdrawal) => (
        <button
          onClick={(e) => { e.stopPropagation(); toggleSelection(w.id); }}
          className="text-muted-foreground hover:text-foreground"
        >
          {selectedIds.has(w.id) ? (
            <FaCheckSquare className="w-4 h-4 text-primary" />
          ) : (
            <FaRegSquare className="w-4 h-4" />
          )}
        </button>
      ),
    },
    {
      key: 'id',
      header: 'Request ID',
      render: (w: Withdrawal) => (
        <span className="font-mono text-sm">{w.id}</span>
      ),
    },
    {
      key: 'user',
      header: 'User',
      render: (w: Withdrawal) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {w.userName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{w.userName}</p>
            <p className="text-xs text-muted-foreground">{w.userEmail}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'points',
      header: 'Points',
      render: (w: Withdrawal) => (
        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">{w.pointsWithdrawn.toLocaleString()}</span>
        </div>
      ),
    },
    {
      key: 'rate',
      header: 'Rate Used',
      render: (w: Withdrawal) => {
        const diff = getRateDifference(w);
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm">
              <Lock className="w-3 h-3 text-muted-foreground" />
              <span>{w.conversionRate} pts = {w.currencySymbol}1</span>
            </div>
            {diff !== null && (
              <div className={cn(
                "flex items-center gap-1 text-xs",
                diff > 0 ? "text-destructive" : "text-success"
              )}>
                {diff > 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                <span>
                  {diff > 0 ? '+' : ''}{w.currencySymbol}{Math.abs(diff).toFixed(2)} vs current
                </span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'amount',
      header: 'Final Amount',
      render: (w: Withdrawal) => (
        <div>
          <span className="font-semibold text-primary">{w.currencySymbol}{w.finalAmount.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground ml-1">{w.currencyCode}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (w: Withdrawal) => <StatusBadge status={w.status} />,
    },
    {
      key: 'requestedDate',
      header: 'Requested',
    },
    {
      key: 'actions',
      header: '',
      render: (w: Withdrawal) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedWithdrawal(w);
              setShowDetails(true);
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
          {canManage && w.status === 'pending' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-success hover:text-success"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedWithdrawal(w);
                  setModalType('approve');
                }}
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedWithdrawal(w);
                  setModalType('reject');
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          )}
          {canManage && w.status === 'approved' && (
            <Button
              variant="ghost"
              size="sm"
              className="text-accent hover:text-accent"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedWithdrawal(w);
                setModalType('pay');
              }}
            >
              <DollarSign className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (loading) return <SkeletonPage rows={8} cols={5} />;

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Withdrawals & Payouts"
        subtitle="Process and track withdrawal requests"
      />

      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          <div className="kpi-card before:bg-warning">
            <p className="text-xs md:text-sm text-muted-foreground">Pending Requests</p>
            <p className="text-xl md:text-2xl font-semibold mt-1">{pendingCount}</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              {currentActiveRate.currencySymbol}{pendingAmount.toLocaleString()} {currentActiveRate.currencyCode}
            </p>
          </div>
          <div className="kpi-card before:bg-info">
            <p className="text-xs md:text-sm text-muted-foreground">Processing</p>
            <p className="text-xl md:text-2xl font-semibold mt-1">{processingCount}</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              {currentActiveRate.currencySymbol}{processingAmount.toLocaleString()} {currentActiveRate.currencyCode}
            </p>
          </div>
          <div className="kpi-card before:bg-success">
            <p className="text-xs md:text-sm text-muted-foreground">Paid This Month</p>
            <p className="text-xl md:text-2xl font-semibold mt-1">
              {currentActiveRate.currencySymbol}{paidAmount.toLocaleString()}
            </p>
          </div>
          <div className="kpi-card before:bg-accent">
            <p className="text-xs md:text-sm text-muted-foreground">Total Processed</p>
            <p className="text-xl md:text-2xl font-semibold mt-1">{completedCount}</p>
          </div>
          <div className="kpi-card before:bg-primary col-span-2 md:col-span-1">
            <p className="text-xs md:text-sm text-muted-foreground">Current Rate</p>
            <p className="text-xl md:text-2xl font-semibold mt-1">{currentActiveRate.pointsPerUnit} pts</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              = {currentActiveRate.currencySymbol}1.00 {currentActiveRate.currencyCode}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="pending" className="text-xs md:text-sm">
                Pending ({pendingCount})
              </TabsTrigger>
              <TabsTrigger value="processing" className="text-xs md:text-sm">
                Processing ({processingCount})
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-xs md:text-sm">
                Completed ({completedCount})
              </TabsTrigger>
              <TabsTrigger value="all" className="text-xs md:text-sm">All</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              {/* Select all toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleAllFiltered}
                className="text-xs md:text-sm"
              >
                {allFilteredSelected ? (
                  <FaCheckSquare className="w-3.5 h-3.5 mr-1.5 text-primary" />
                ) : someFilteredSelected ? (
                  <FaMinusSquare className="w-3.5 h-3.5 mr-1.5 text-primary" />
                ) : (
                  <FaRegSquare className="w-3.5 h-3.5 mr-1.5" />
                )}
                {selectedIds.size > 0 ? `${selectedIds.size} selected` : 'Select all'}
              </Button>

              {/* Export dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs md:text-sm">
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    Export {selectedIds.size > 0 ? `(${selectedIds.size})` : ''}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => exportSelected('csv')}>
                    <Download className="w-4 h-4 mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportSelected('pdf')}>
                    <FileText className="w-4 h-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportSelected('aba')}>
                    <University className="w-4 h-4 mr-2" />
                    Export as ABA
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-4 md:mt-6">
            {/* Filters */}
            <FilterBar
              searchValue={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search by ID or user..."
              onClearFilters={() => {
                setSearch('');
                setStatusFilter('all');
              }}
            >
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </FilterBar>

            {/* Table */}
            {loading ? (
              <div className="py-12 text-center text-muted-foreground">Loading withdrawals...</div>
            ) : (
            <DataTable
              columns={columns}
              data={filteredData}
              keyExtractor={(w) => w.id}
              pagination={{
                page,
                pageSize,
                total: filteredData.length,
                onPageChange: setPage,
                onPageSizeChange: setPageSize,
              }}
            />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Details Sheet */}
      <Sheet open={showDetails} onOpenChange={setShowDetails}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Withdrawal Details</SheetTitle>
            <SheetDescription>
              Request {selectedWithdrawal?.id}
            </SheetDescription>
          </SheetHeader>
          
          {selectedWithdrawal && (
            <div className="mt-6 space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {selectedWithdrawal.userName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedWithdrawal.userName}</p>
                  <p className="text-sm text-muted-foreground">{selectedWithdrawal.userEmail}</p>
                </div>
                <StatusBadge status={selectedWithdrawal.status} className="ml-auto" />
              </div>

              {/* Conversion Details */}
              <div className="p-4 rounded-xl bg-muted/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-muted-foreground" />
                    <span className="text-muted-foreground">Points Withdrawn</span>
                  </div>
                  <span className="text-xl font-bold">{selectedWithdrawal.pointsWithdrawn.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-center gap-3 py-2">
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-muted-foreground" />
                    <span className="text-muted-foreground">Final Amount</span>
                  </div>
                  <span className="text-xl font-bold text-primary">
                    {selectedWithdrawal.currencySymbol}{selectedWithdrawal.finalAmount.toFixed(2)} {selectedWithdrawal.currencyCode}
                  </span>
                </div>
              </div>

              {/* Bank Account Details */}
              {selectedWithdrawal.bankName && (
                <div className="p-4 rounded-xl border border-border space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <University className="w-4 h-4" />
                    <span>Bank Account Details</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Bank Name</span>
                    <span className="font-medium">{selectedWithdrawal.bankName}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Account Number</span>
                    <span className="font-mono font-medium">{selectedWithdrawal.accountNumber}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Account Name</span>
                    <span className="font-medium">{selectedWithdrawal.accountName}</span>
                  </div>
                </div>
              )}

              {/* Rate Information */}
              <div className="p-4 rounded-xl border border-border space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Lock className="w-4 h-4" />
                  <span>Locked Conversion Rate</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Rate at Request</span>
                  <span className="font-medium">
                    {selectedWithdrawal.conversionRate} pts = {selectedWithdrawal.currencySymbol}1.00
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Current Active Rate</span>
                  <span className="font-medium">
                    {currentActiveRate.pointsPerUnit} pts = {currentActiveRate.currencySymbol}1.00
                  </span>
                </div>
                
                {getRateDifference(selectedWithdrawal) !== null && (
                  <div className={cn(
                    "p-3 rounded-lg flex items-start gap-2",
                    getRateDifference(selectedWithdrawal)! > 0 
                      ? "bg-destructive/5 border border-destructive/20" 
                      : "bg-success/5 border border-success/20"
                  )}>
                    {getRateDifference(selectedWithdrawal)! > 0 ? (
                      <TrendingDown className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    )}
                    <div className="text-sm">
                      <p className={cn(
                        "font-medium",
                        getRateDifference(selectedWithdrawal)! > 0 ? "text-destructive" : "text-success"
                      )}>
                        {getRateDifference(selectedWithdrawal)! > 0 
                          ? `User received ${selectedWithdrawal.currencySymbol}${Math.abs(getRateDifference(selectedWithdrawal)!).toFixed(2)} more than current rate`
                          : `User received ${selectedWithdrawal.currencySymbol}${Math.abs(getRateDifference(selectedWithdrawal)!).toFixed(2)} less than current rate`
                        }
                      </p>
                      <p className="text-muted-foreground mt-1">
                        Rate was locked at time of request
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className="space-y-3">
                <p className="text-sm font-medium">Timeline</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Requested</span>
                    <span>{selectedWithdrawal.requestedDate}</span>
                  </div>
                  {selectedWithdrawal.processedDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Processed</span>
                      <span>{selectedWithdrawal.processedDate}</span>
                    </div>
                  )}
                  {selectedWithdrawal.processedBy && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Processed By</span>
                      <span>{selectedWithdrawal.processedBy}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedWithdrawal.note && (
                <div className="p-3 rounded-lg bg-warning/5 border border-warning/20">
                  <p className="text-sm font-medium mb-1">Note</p>
                  <p className="text-sm text-muted-foreground">{selectedWithdrawal.note}</p>
                </div>
              )}

              {/* PDF Receipt Download */}
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => {
                  const url = `${import.meta.env.VITE_API_URL || 'http://localhost:9000'}/api/withdrawals/${selectedWithdrawal.id}/pdf`;
                  window.open(url, '_blank');
                }}
              >
                <Download className="w-4 h-4" />
                Download PDF Receipt
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Approval Modal */}
      <ConfirmationModal
        open={modalType === 'approve'}
        onOpenChange={(open) => !open && setModalType(null)}
        title="Approve Withdrawal"
        description=""
        confirmText="Approve"
        variant="success"
        onConfirm={() => setModalType(null)}
      >
        {selectedWithdrawal && (
          <div className="py-4 space-y-4">
            <p className="text-muted-foreground">
              Are you sure you want to approve this withdrawal request?
            </p>
            <div className="p-4 rounded-lg bg-muted/30 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Request ID</span>
                <span className="font-mono">{selectedWithdrawal.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Points</span>
                <span>{selectedWithdrawal.pointsWithdrawn.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Locked Rate</span>
                <span>{selectedWithdrawal.conversionRate} pts = {selectedWithdrawal.currencySymbol}1.00</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Amount to Pay</span>
                <span className="text-primary">{selectedWithdrawal.currencySymbol}{selectedWithdrawal.finalAmount.toFixed(2)} {selectedWithdrawal.currencyCode}</span>
              </div>
            </div>
          </div>
        )}
      </ConfirmationModal>

      {/* Rejection Modal */}
      <ConfirmationModal
        open={modalType === 'reject'}
        onOpenChange={(open) => !open && setModalType(null)}
        title="Reject Withdrawal"
        description={`Are you sure you want to reject the withdrawal request ${selectedWithdrawal?.id}? Points will be returned to the user's balance. You must provide a reason.`}
        confirmText="Reject"
        variant="destructive"
        onConfirm={() => setModalType(null)}
      />

      {/* Pay Modal */}
      <ConfirmationModal
        open={modalType === 'pay'}
        onOpenChange={(open) => !open && setModalType(null)}
        title="Confirm Payment"
        description=""
        confirmText="Confirm Payment"
        variant="success"
        onConfirm={() => setModalType(null)}
      >
        {selectedWithdrawal && (
          <div className="py-4 space-y-4">
            <div className="p-3 rounded-lg bg-warning/5 border border-warning/20 flex gap-2">
              <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Confirm that payment has been made. This action cannot be undone.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Request ID</span>
                <span className="font-mono">{selectedWithdrawal.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">User</span>
                <span>{selectedWithdrawal.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rate Used</span>
                <span>{selectedWithdrawal.conversionRate} pts = {selectedWithdrawal.currencySymbol}1.00</span>
              </div>
              <div className="flex justify-between font-medium text-base pt-2 border-t">
                <span>Amount Paid</span>
                <span className="text-success">{selectedWithdrawal.currencySymbol}{selectedWithdrawal.finalAmount.toFixed(2)} {selectedWithdrawal.currencyCode}</span>
              </div>
            </div>
          </div>
        )}
      </ConfirmationModal>
    </div>
  );
}
