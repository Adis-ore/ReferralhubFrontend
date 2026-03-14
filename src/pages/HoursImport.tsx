import { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import {
  FaSyncAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaClock,
  FaUser,
  FaCoins,
  FaFilter,
  FaCheck,
  FaTimes,
  FaInfoCircle,
} from 'react-icons/fa';
import { connecteamApi } from '@/services/api';
import { toast } from 'sonner';

type HoursRecord = {
  id: string;
  userId: number | string;
  userName: string;
  classification: string;
  shiftDate: string;
  clockIn: string;
  clockOut: string;
  hoursWorked: number;
  shiftType: string;
  multiplier: number;
  pointsToAward: number;
  status: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  hourlyRate: number;
  professionRate: number;
  connecteamShiftId: string;
};

const shiftTypeLabels: Record<string, string> = {
  regular: 'Regular',
  overtime: 'Overtime',
  weekend: 'Weekend',
  public_holiday: 'Public Holiday',
};

const shiftTypeColors: Record<string, string> = {
  regular: 'bg-muted text-muted-foreground',
  overtime: 'bg-warning/10 text-warning',
  weekend: 'bg-info/10 text-info',
  public_holiday: 'bg-destructive/10 text-destructive',
};

export default function HoursImport() {
  const [records, setRecords] = useState<HoursRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [shiftFilter, setShiftFilter] = useState('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: 'approve' | 'reject' | 'bulk_approve'; ids: string[] } | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailRecord, setDetailRecord] = useState<HoursRecord | null>(null);

  useEffect(() => {
    setLoading(true);
    connecteamApi.getHours()
      .then((res) => {
        const mapped: HoursRecord[] = res.data.map((h: any) => ({
          id: String(h.id),
          userId: h.userId,
          userName: h.userName ?? '',
          classification: h.classification ?? '',
          shiftDate: h.shiftDate ?? '',
          clockIn: h.clockIn ?? '',
          clockOut: h.clockOut ?? '',
          hoursWorked: h.hoursWorked ?? 0,
          shiftType: h.shiftType ?? 'regular',
          multiplier: h.multiplier ?? 1,
          pointsToAward: h.pointsToAward ?? 0,
          status: h.status ?? 'pending',
          approvedBy: h.approvedBy,
          approvedAt: h.approvedAt,
          rejectionReason: h.rejectionReason,
          hourlyRate: h.hourlyRate ?? 0,
          professionRate: h.professionRate ?? 0,
          connecteamShiftId: String(h.connecteamShiftId ?? ''),
        }));
        setRecords(mapped);
      })
      .catch((err) => {
        toast.error(err.message || 'Failed to load hours');
      })
      .finally(() => setLoading(false));
  }, []);

  const pending = records.filter((r) => r.status === 'pending');
  const approved = records.filter((r) => r.status === 'approved');
  const rejected = records.filter((r) => r.status === 'rejected');

  const filterRecords = (list: HoursRecord[]) => {
    return list.filter((r) => {
      const matchSearch = !search || r.userName.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
      const matchShift = shiftFilter === 'all' || r.shiftType === shiftFilter;
      return matchSearch && matchShift;
    });
  };

  const handleApprove = (ids: string[]) => {
    const approvePromises = ids.length === 1
      ? [connecteamApi.approveHours(ids[0], { status: 'approved', approvedBy: 'admin-1', approvedAt: new Date().toISOString() })]
      : [connecteamApi.bulkApproveHours(ids, 'admin-1')];

    Promise.all(approvePromises)
      .then(() => {
        setRecords((prev) =>
          prev.map((r) =>
            ids.includes(r.id)
              ? { ...r, status: 'approved', approvedBy: 'admin-1', approvedAt: new Date().toISOString() }
              : r
          )
        );
        setSelectedIds(new Set());
        setConfirmAction(null);
        toast.success(`${ids.length} record${ids.length > 1 ? 's' : ''} approved. Points will be awarded.`);
      })
      .catch((err) => {
        toast.error(err.message || 'Failed to approve records');
      });
  };

  const handleReject = (ids: string[]) => {
    const rejectPromises = ids.map((id) =>
      connecteamApi.approveHours(id, { status: 'rejected', rejectionReason: 'Rejected by admin', approvedAt: new Date().toISOString() })
    );
    Promise.all(rejectPromises)
      .then(() => {
        setRecords((prev) =>
          prev.map((r) =>
            ids.includes(r.id)
              ? { ...r, status: 'rejected', rejectionReason: 'Rejected by admin', approvedAt: new Date().toISOString() }
              : r
          )
        );
        setSelectedIds(new Set());
        setConfirmAction(null);
        toast.success(`${ids.length} record${ids.length > 1 ? 's' : ''} rejected.`);
      })
      .catch((err) => {
        toast.error(err.message || 'Failed to reject records');
      });
  };

  const handleSync = async () => {
    setIsSyncing(true);
    connecteamApi.sync()
      .then(() => {
        return connecteamApi.getHours();
      })
      .then((res) => {
        const mapped: HoursRecord[] = res.data.map((h: any) => ({
          id: String(h.id),
          userId: h.userId,
          userName: h.userName ?? '',
          classification: h.classification ?? '',
          shiftDate: h.shiftDate ?? '',
          clockIn: h.clockIn ?? '',
          clockOut: h.clockOut ?? '',
          hoursWorked: h.hoursWorked ?? 0,
          shiftType: h.shiftType ?? 'regular',
          multiplier: h.multiplier ?? 1,
          pointsToAward: h.pointsToAward ?? 0,
          status: h.status ?? 'pending',
          approvedBy: h.approvedBy,
          approvedAt: h.approvedAt,
          rejectionReason: h.rejectionReason,
          hourlyRate: h.hourlyRate ?? 0,
          professionRate: h.professionRate ?? 0,
          connecteamShiftId: String(h.connecteamShiftId ?? ''),
        }));
        setRecords(mapped);
        toast.success('Sync complete.');
      })
      .catch((err) => {
        toast.error(err.message || 'Sync failed');
      })
      .finally(() => setIsSyncing(false));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = (list: HoursRecord[]) => {
    const ids = list.map((r) => r.id);
    const allSelected = ids.every((id) => selectedIds.has(id));
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(ids));
    }
  };

  const RecordRow = ({ record }: { record: HoursRecord }) => (
    <div
      className="px-4 md:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 hover:bg-muted/20 transition-colors cursor-pointer"
      onClick={() => setDetailRecord(record)}
    >
      {record.status === 'pending' && (
        <button
          onClick={(e) => { e.stopPropagation(); toggleSelect(record.id); }}
          className="self-start sm:self-auto flex-shrink-0"
        >
          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${selectedIds.has(record.id) ? 'bg-primary border-primary' : 'border-muted-foreground/40'}`}>
            {selectedIds.has(record.id) && <FaCheck className="w-2.5 h-2.5 text-white" />}
          </div>
        </button>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-medium text-sm">{record.userName}</p>
          <span className="text-xs text-muted-foreground">{record.classification}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${shiftTypeColors[record.shiftType]}`}>
            {shiftTypeLabels[record.shiftType]}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {record.shiftDate} &bull; {record.clockIn} - {record.clockOut}
        </p>
      </div>

      <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Hours</p>
          <p className="font-semibold text-sm">{record.hoursWorked}h</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Multiplier</p>
          <p className="font-semibold text-sm">{record.multiplier}x</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Points</p>
          <p className="font-semibold text-sm text-warning">{record.pointsToAward.toLocaleString()}</p>
        </div>
        <StatusBadge status={record.status as any} />

        {record.status === 'pending' && (
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <Button
              size="sm"
              variant="outline"
              className="text-success border-success/30 hover:bg-success/5 h-7 px-2"
              onClick={() => setConfirmAction({ type: 'approve', ids: [record.id] })}
            >
              <FaCheckCircle className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-destructive border-destructive/30 hover:bg-destructive/5 h-7 px-2"
              onClick={() => setConfirmAction({ type: 'reject', ids: [record.id] })}
            >
              <FaTimesCircle className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const pendingFiltered = filterRecords(pending);

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Hours Import"
        subtitle="Review and approve time clock entries from Connecteam"
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="kpi-card before:bg-warning">
            <p className="text-xs text-muted-foreground">Pending Approval</p>
            <p className="text-2xl font-semibold mt-1">{pending.length}</p>
          </div>
          <div className="kpi-card before:bg-success">
            <p className="text-xs text-muted-foreground">Approved Today</p>
            <p className="text-2xl font-semibold mt-1">{approved.length}</p>
          </div>
          <div className="kpi-card before:bg-destructive">
            <p className="text-xs text-muted-foreground">Rejected</p>
            <p className="text-2xl font-semibold mt-1">{rejected.length}</p>
          </div>
          <div className="kpi-card before:bg-accent">
            <p className="text-xs text-muted-foreground">Points to Award</p>
            <p className="text-2xl font-semibold mt-1">
              {pending.reduce((sum, r) => sum + r.pointsToAward, 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={shiftFilter} onValueChange={setShiftFilter}>
            <SelectTrigger className="w-full sm:w-44">
              <FaFilter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Shift type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Shift Types</SelectItem>
              <SelectItem value="regular">Regular</SelectItem>
              <SelectItem value="overtime">Overtime</SelectItem>
              <SelectItem value="weekend">Weekend</SelectItem>
              <SelectItem value="public_holiday">Public Holiday</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleSync} disabled={isSyncing}>
            <FaSyncAlt className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Button>
        </div>

        {/* Bulk Approve bar */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl border border-primary/20">
            <FaUser className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{selectedIds.size} record{selectedIds.size > 1 ? 's' : ''} selected</span>
            <div className="ml-auto flex gap-2">
              <Button
                size="sm"
                className="bg-success text-white hover:bg-success/90"
                onClick={() => setConfirmAction({ type: 'bulk_approve', ids: Array.from(selectedIds) })}
              >
                <FaCheckCircle className="w-3.5 h-3.5 mr-1.5" />
                Approve All
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSelectedIds(new Set())}>
                <FaTimes className="w-3.5 h-3.5 mr-1.5" />
                Clear
              </Button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">
              Pending ({pending.length})
            </TabsTrigger>
            <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
            <TabsTrigger value="all">All ({records.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="audit-card">
              <div className="audit-card-header flex items-center justify-between">
                <h3 className="font-semibold text-sm">Pending Records</h3>
                {!loading && pendingFiltered.length > 0 && (
                  <Button variant="ghost" size="sm" className="text-xs" onClick={() => toggleSelectAll(pendingFiltered)}>
                    {pendingFiltered.every((r) => selectedIds.has(r.id)) ? 'Deselect all' : 'Select all'}
                  </Button>
                )}
              </div>
              {loading ? (
                <div className="p-12 text-center text-muted-foreground">Loading hours...</div>
              ) : pendingFiltered.length === 0 ? (
                <div className="p-12 text-center">
                  <FaCheckCircle className="w-10 h-10 text-success/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No pending records</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {pendingFiltered.map((r) => <RecordRow key={r.id} record={r} />)}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="approved">
            <div className="audit-card">
              <div className="audit-card-header"><h3 className="font-semibold text-sm">Approved Records</h3></div>
              {filterRecords(approved).length === 0 ? (
                <div className="p-12 text-center"><p className="text-muted-foreground">No approved records</p></div>
              ) : (
                <div className="divide-y divide-border">
                  {filterRecords(approved).map((r) => <RecordRow key={r.id} record={r} />)}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="rejected">
            <div className="audit-card">
              <div className="audit-card-header"><h3 className="font-semibold text-sm">Rejected Records</h3></div>
              {filterRecords(rejected).length === 0 ? (
                <div className="p-12 text-center"><p className="text-muted-foreground">No rejected records</p></div>
              ) : (
                <div className="divide-y divide-border">
                  {filterRecords(rejected).map((r) => <RecordRow key={r.id} record={r} />)}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="all">
            <div className="audit-card">
              <div className="audit-card-header"><h3 className="font-semibold text-sm">All Records</h3></div>
              <div className="divide-y divide-border">
                {filterRecords(records).map((r) => <RecordRow key={r.id} record={r} />)}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Confirm Action Dialog */}
      <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {confirmAction?.type === 'reject' ? 'Reject Hours Record' : 'Approve Hours Record(s)'}
            </DialogTitle>
            <DialogDescription>
              {confirmAction?.type === 'reject'
                ? 'This record will be marked as rejected. No points will be awarded.'
                : `Approving ${confirmAction?.ids.length} record(s) will award the calculated points to the staff members.`}
            </DialogDescription>
          </DialogHeader>
          {confirmAction && confirmAction.type !== 'reject' && (
            <div className="p-3 rounded-lg bg-muted/30 text-sm flex items-start gap-2">
              <FaInfoCircle className="w-4 h-4 text-info flex-shrink-0 mt-0.5" />
              <span>Points are calculated as: Hours &times; Hourly Rate &times; Profession Rate &times; Shift Multiplier</span>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>Cancel</Button>
            {confirmAction?.type === 'reject' ? (
              <Button variant="destructive" onClick={() => handleReject(confirmAction.ids)}>
                <FaTimesCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
            ) : (
              <Button
                className="bg-success text-white hover:bg-success/90"
                onClick={() => confirmAction && handleApprove(confirmAction.ids)}
              >
                <FaCheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={!!detailRecord} onOpenChange={() => setDetailRecord(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Shift Record Detail</DialogTitle>
            <DialogDescription>Record ID: {detailRecord?.id}</DialogDescription>
          </DialogHeader>
          {detailRecord && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground">Staff Member</p><p className="font-medium">{detailRecord.userName}</p></div>
                <div><p className="text-muted-foreground">Classification</p><p className="font-medium">{detailRecord.classification}</p></div>
                <div><p className="text-muted-foreground">Shift Date</p><p className="font-medium">{detailRecord.shiftDate}</p></div>
                <div><p className="text-muted-foreground">Shift Type</p><p className="font-medium">{shiftTypeLabels[detailRecord.shiftType]}</p></div>
                <div><p className="text-muted-foreground">Clock In</p><p className="font-medium">{detailRecord.clockIn}</p></div>
                <div><p className="text-muted-foreground">Clock Out</p><p className="font-medium">{detailRecord.clockOut}</p></div>
                <div><p className="text-muted-foreground">Hours Worked</p><p className="font-medium">{detailRecord.hoursWorked}h</p></div>
                <div><p className="text-muted-foreground">Hourly Rate</p><p className="font-medium">${detailRecord.hourlyRate}/hr</p></div>
                <div><p className="text-muted-foreground">Profession Rate</p><p className="font-medium">{detailRecord.professionRate}</p></div>
                <div><p className="text-muted-foreground">Multiplier</p><p className="font-medium">{detailRecord.multiplier}x</p></div>
              </div>
              <div className="p-3 rounded-lg bg-warning/5 border border-warning/20 flex items-center justify-between">
                <div className="flex items-center gap-2"><FaCoins className="w-4 h-4 text-warning" /><span className="font-medium">Points to Award</span></div>
                <span className="font-bold text-lg text-warning">{detailRecord.pointsToAward.toLocaleString()}</span>
              </div>
              <div><p className="text-muted-foreground text-xs">Connecteam Shift ID: {detailRecord.connecteamShiftId}</p></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailRecord(null)}>Close</Button>
            {detailRecord?.status === 'pending' && (
              <>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => { setConfirmAction({ type: 'reject', ids: [detailRecord.id] }); setDetailRecord(null); }}
                >
                  <FaTimesCircle className="w-3.5 h-3.5 mr-1.5" />
                  Reject
                </Button>
                <Button
                  className="bg-success text-white hover:bg-success/90"
                  size="sm"
                  onClick={() => { setConfirmAction({ type: 'approve', ids: [detailRecord.id] }); setDetailRecord(null); }}
                >
                  <FaCheckCircle className="w-3.5 h-3.5 mr-1.5" />
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
