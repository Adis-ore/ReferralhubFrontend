import { useState } from 'react';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { DataTable } from '@/components/ui/data-table';
import { FilterBar } from '@/components/ui/filter-bar';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import {
  FaCalendar,
  FaClock,
  FaCheck,
  FaTimes,
  FaEye,
  FaPlus,
  FaUsers,
  FaChartBar,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { cn } from '@/lib/utils';

interface Shift {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  department: string;
  date: string;
  startTime: string;
  endTime: string;
  hoursWorked: number;
  type: 'regular' | 'overtime' | 'weekend' | 'public_holiday';
  status: 'pending' | 'approved' | 'rejected' | 'auto_approved';
  approvedBy?: string;
  notes?: string;
}

const mockShifts: Shift[] = [
  { id: 'SH-001', userId: '1', userName: 'Adewale Johnson', userEmail: 'adewale.johnson@company.com', department: 'Sales', date: '2024-06-15', startTime: '08:00', endTime: '16:00', hoursWorked: 8, type: 'regular', status: 'approved', approvedBy: 'Operations Admin' },
  { id: 'SH-002', userId: '2', userName: 'Chioma Okafor', userEmail: 'chioma.okafor@company.com', department: 'Sales', date: '2024-06-15', startTime: '09:00', endTime: '17:00', hoursWorked: 8, type: 'regular', status: 'pending' },
  { id: 'SH-003', userId: '3', userName: 'Oluwaseun Adebayo', userEmail: 'oluwaseun.adebayo@company.com', department: 'Sales', date: '2024-06-15', startTime: '08:00', endTime: '20:00', hoursWorked: 12, type: 'overtime', status: 'pending', notes: 'Urgent project deadline' },
  { id: 'SH-004', userId: '4', userName: 'Blessing Eze', userEmail: 'blessing.eze@company.com', department: 'Sales', date: '2024-06-14', startTime: '08:00', endTime: '16:00', hoursWorked: 8, type: 'regular', status: 'approved', approvedBy: 'Operations Admin' },
  { id: 'SH-005', userId: '5', userName: 'Emeka Nwosu', userEmail: 'emeka.nwosu@company.com', department: 'Sales', date: '2024-06-14', startTime: '10:00', endTime: '18:00', hoursWorked: 8, type: 'regular', status: 'rejected', approvedBy: 'Operations Admin', notes: 'Duplicate entry' },
  { id: 'SH-006', userId: '21', userName: 'Ahmed Musa', userEmail: 'ahmed.musa@company.com', department: 'Marketing', date: '2024-06-16', startTime: '08:00', endTime: '16:00', hoursWorked: 8, type: 'weekend', status: 'pending' },
  { id: 'SH-007', userId: '33', userName: 'Victor Eze', userEmail: 'victor.eze@company.com', department: 'IT', date: '2024-06-15', startTime: '22:00', endTime: '06:00', hoursWorked: 8, type: 'regular', status: 'auto_approved' },
  { id: 'SH-008', userId: '6', userName: 'Fatima Abdullahi', userEmail: 'fatima.abdullahi@company.com', department: 'Sales', date: '2024-06-13', startTime: '08:00', endTime: '16:00', hoursWorked: 8, type: 'regular', status: 'approved', approvedBy: 'Manager' },
  { id: 'SH-009', userId: '22', userName: 'Grace Adekunle', userEmail: 'grace.adekunle@company.com', department: 'Marketing', date: '2024-06-13', startTime: '08:00', endTime: '20:00', hoursWorked: 12, type: 'overtime', status: 'approved', approvedBy: 'Operations Admin' },
  { id: 'SH-010', userId: '7', userName: 'Ibrahim Yusuf', userEmail: 'ibrahim.yusuf@company.com', department: 'Sales', date: '2024-06-12', startTime: '08:00', endTime: '16:00', hoursWorked: 8, type: 'public_holiday', status: 'approved', approvedBy: 'Operations Admin' },
];

const shiftTypeLabels: Record<string, string> = {
  regular: 'Regular',
  overtime: 'Overtime',
  weekend: 'Weekend',
  public_holiday: 'Public Holiday',
};

const shiftTypeColors: Record<string, string> = {
  regular: 'bg-primary/10 text-primary',
  overtime: 'bg-warning/10 text-warning',
  weekend: 'bg-info/10 text-info',
  public_holiday: 'bg-accent/10 text-accent',
};

export default function ShiftsHours() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('pending');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [modalType, setModalType] = useState<'approve' | 'reject' | null>(null);
  const [shifts, setShifts] = useState(mockShifts);

  const pendingCount = shifts.filter(s => s.status === 'pending').length;
  const approvedCount = shifts.filter(s => s.status === 'approved' || s.status === 'auto_approved').length;
  const totalHours = shifts.filter(s => s.status === 'approved' || s.status === 'auto_approved').reduce((a, b) => a + b.hoursWorked, 0);
  const overtimeHours = shifts.filter(s => s.type === 'overtime' && (s.status === 'approved' || s.status === 'auto_approved')).reduce((a, b) => a + b.hoursWorked, 0);

  const getFilteredShifts = () => {
    return shifts.filter(s => {
      const matchesSearch = s.userName.toLowerCase().includes(search.toLowerCase()) ||
        s.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      const matchesType = typeFilter === 'all' || s.type === typeFilter;
      const matchesTab = activeTab === 'all' ||
        (activeTab === 'pending' && s.status === 'pending') ||
        (activeTab === 'approved' && (s.status === 'approved' || s.status === 'auto_approved')) ||
        (activeTab === 'rejected' && s.status === 'rejected');
      return matchesSearch && matchesStatus && matchesType && matchesTab;
    });
  };

  const handleApprove = () => {
    if (!selectedShift) return;
    setShifts(prev => prev.map(s =>
      s.id === selectedShift.id ? { ...s, status: 'approved' as const, approvedBy: 'Current Admin' } : s
    ));
    setModalType(null);
    setSelectedShift(null);
  };

  const handleReject = () => {
    if (!selectedShift) return;
    setShifts(prev => prev.map(s =>
      s.id === selectedShift.id ? { ...s, status: 'rejected' as const, approvedBy: 'Current Admin' } : s
    ));
    setModalType(null);
    setSelectedShift(null);
  };

  const columns = [
    {
      key: 'id',
      header: 'Shift ID',
      render: (s: Shift) => <span className="font-mono text-sm">{s.id}</span>,
    },
    {
      key: 'user',
      header: 'Staff Member',
      render: (s: Shift) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {s.userName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{s.userName}</p>
            <p className="text-xs text-muted-foreground">{s.department}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date',
    },
    {
      key: 'time',
      header: 'Time',
      render: (s: Shift) => (
        <span className="text-sm">{s.startTime} - {s.endTime}</span>
      ),
    },
    {
      key: 'hoursWorked',
      header: 'Hours',
      render: (s: Shift) => (
        <span className="font-semibold text-sm">{s.hoursWorked}h</span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (s: Shift) => (
        <span className={cn('px-2 py-1 rounded-md text-xs font-medium', shiftTypeColors[s.type])}>
          {shiftTypeLabels[s.type]}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (s: Shift) => <StatusBadge status={s.status === 'auto_approved' ? 'approved' : s.status} />,
    },
    {
      key: 'actions',
      header: '',
      render: (s: Shift) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedShift(s); setShowDetails(true); }}>
            <FaEye className="w-4 h-4" />
          </Button>
          {s.status === 'pending' && (
            <>
              <Button variant="ghost" size="sm" className="text-success hover:text-success" onClick={(e) => { e.stopPropagation(); setSelectedShift(s); setModalType('approve'); }}>
                <FaCheck className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); setSelectedShift(s); setModalType('reject'); }}>
                <FaTimes className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const filtered = getFilteredShifts();

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Shifts & Hours"
        subtitle="Track and approve staff shift hours"
      />

      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="kpi-card before:bg-warning">
            <p className="text-xs md:text-sm text-muted-foreground">Pending Approval</p>
            <p className="text-xl md:text-2xl font-semibold mt-1">{pendingCount}</p>
          </div>
          <div className="kpi-card before:bg-success">
            <p className="text-xs md:text-sm text-muted-foreground">Approved Shifts</p>
            <p className="text-xl md:text-2xl font-semibold mt-1">{approvedCount}</p>
          </div>
          <div className="kpi-card before:bg-primary">
            <p className="text-xs md:text-sm text-muted-foreground">Total Hours</p>
            <p className="text-xl md:text-2xl font-semibold mt-1">{totalHours}h</p>
          </div>
          <div className="kpi-card before:bg-accent">
            <p className="text-xs md:text-sm text-muted-foreground">Overtime Hours</p>
            <p className="text-xl md:text-2xl font-semibold mt-1">{overtimeHours}h</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="pending" className="text-xs md:text-sm">Pending ({pendingCount})</TabsTrigger>
              <TabsTrigger value="approved" className="text-xs md:text-sm">Approved ({approvedCount})</TabsTrigger>
              <TabsTrigger value="rejected" className="text-xs md:text-sm">Rejected</TabsTrigger>
              <TabsTrigger value="all" className="text-xs md:text-sm">All</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-4 md:mt-6">
            <FilterBar
              searchValue={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search by name or shift ID..."
              onClearFilters={() => { setSearch(''); setStatusFilter('all'); setTypeFilter('all'); }}
            >
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="overtime">Overtime</SelectItem>
                  <SelectItem value="weekend">Weekend</SelectItem>
                  <SelectItem value="public_holiday">Public Holiday</SelectItem>
                </SelectContent>
              </Select>
            </FilterBar>

            <DataTable
              columns={columns}
              data={filtered}
              keyExtractor={(s) => s.id}
              pagination={{
                page,
                pageSize,
                total: filtered.length,
                onPageChange: setPage,
                onPageSizeChange: setPageSize,
              }}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Details Sheet */}
      <Sheet open={showDetails} onOpenChange={setShowDetails}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Shift Details</SheetTitle>
            <SheetDescription>{selectedShift?.id}</SheetDescription>
          </SheetHeader>

          {selectedShift && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {selectedShift.userName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedShift.userName}</p>
                  <p className="text-sm text-muted-foreground">{selectedShift.userEmail}</p>
                </div>
                <StatusBadge status={selectedShift.status === 'auto_approved' ? 'approved' : selectedShift.status} className="ml-auto" />
              </div>

              <div className="p-4 rounded-xl bg-muted/30 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{selectedShift.date}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium">{selectedShift.startTime} - {selectedShift.endTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Hours Worked</span>
                  <span className="font-semibold text-primary">{selectedShift.hoursWorked}h</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shift Type</span>
                  <span className={cn('px-2 py-0.5 rounded-md text-xs font-medium', shiftTypeColors[selectedShift.type])}>
                    {shiftTypeLabels[selectedShift.type]}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Department</span>
                  <span className="font-medium">{selectedShift.department}</span>
                </div>
              </div>

              {selectedShift.approvedBy && (
                <div className="flex justify-between text-sm p-3 rounded-lg border border-border">
                  <span className="text-muted-foreground">Processed By</span>
                  <span className="font-medium">{selectedShift.approvedBy}</span>
                </div>
              )}

              {selectedShift.notes && (
                <div className="p-3 rounded-lg bg-warning/5 border border-warning/20">
                  <p className="text-sm font-medium mb-1">Notes</p>
                  <p className="text-sm text-muted-foreground">{selectedShift.notes}</p>
                </div>
              )}

              {selectedShift.status === 'pending' && (
                <div className="flex gap-3">
                  <Button className="flex-1 bg-success hover:bg-success/90 text-white" onClick={() => { setShowDetails(false); setModalType('approve'); }}>
                    <FaCheck className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={() => { setShowDetails(false); setModalType('reject'); }}>
                    <FaTimes className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Approve Modal */}
      <ConfirmationModal
        open={modalType === 'approve'}
        onOpenChange={(open) => !open && setModalType(null)}
        title="Approve Shift"
        description={`Approve ${selectedShift?.hoursWorked}h ${shiftTypeLabels[selectedShift?.type || 'regular']} shift for ${selectedShift?.userName} on ${selectedShift?.date}?`}
        confirmText="Approve"
        variant="success"
        onConfirm={handleApprove}
      />

      {/* Reject Modal */}
      <ConfirmationModal
        open={modalType === 'reject'}
        onOpenChange={(open) => !open && setModalType(null)}
        title="Reject Shift"
        description={`Reject the shift entry for ${selectedShift?.userName} on ${selectedShift?.date}? The staff member will be notified.`}
        confirmText="Reject"
        variant="destructive"
        onConfirm={handleReject}
      />
    </div>
  );
}
