import { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { DataTable } from '@/components/ui/data-table';
import { FilterBar } from '@/components/ui/filter-bar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { FaEye, FaCalendar, FaUser, FaFileAlt, FaShieldAlt, FaCreditCard, FaGift, FaDownload } from 'react-icons/fa';
import { auditLogsApi } from '@/services/api';
import { toast } from 'sonner';
import { FiSettings } from 'react-icons/fi';
import { GiTwoCoins } from 'react-icons/gi';
import { cn } from '@/lib/utils';

interface AuditLog {
  id: string;
  action: string;
  actionType: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'override' | 'login' | 'config';
  resource: string;
  resourceId: string;
  admin: string;
  adminRole: string;
  timestamp: string;
  ipAddress: string;
  changes?: { field: string; before: string; after: string }[];
}


const actionTypeConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  create: { icon: FaGift, color: 'bg-success/10 text-success' },
  update: { icon: FiSettings, color: 'bg-info/10 text-info' },
  delete: { icon: FaFileAlt, color: 'bg-destructive/10 text-destructive' },
  approve: { icon: FaCreditCard, color: 'bg-success/10 text-success' },
  reject: { icon: FaCreditCard, color: 'bg-destructive/10 text-destructive' },
  override: { icon: FaShieldAlt, color: 'bg-warning/10 text-warning' },
  login: { icon: FaUser, color: 'bg-muted text-muted-foreground' },
  config: { icon: FiSettings, color: 'bg-accent/10 text-accent' },
};

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [adminFilter, setAdminFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  useEffect(() => {
    setLoading(true);
    auditLogsApi.list()
      .then((res) => {
        const mapped: AuditLog[] = res.data.map((l: any) => ({
          id: String(l.id),
          action: l.action ?? '',
          actionType: l.actionType ?? 'update',
          resource: l.resource ?? '',
          resourceId: String(l.resourceId ?? ''),
          admin: l.admin ?? '',
          adminRole: l.adminRole ?? '',
          timestamp: l.timestamp ?? '',
          ipAddress: l.ipAddress ?? '',
          changes: l.changes,
        }));
        setLogs(mapped);
      })
      .catch((err) => {
        toast.error(err.message || 'Failed to load audit logs');
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.resourceId.toLowerCase().includes(search.toLowerCase()) ||
      log.admin.toLowerCase().includes(search.toLowerCase());
    const matchesAdmin = adminFilter === 'all' || log.admin === adminFilter;
    const matchesAction = actionFilter === 'all' || log.actionType === actionFilter;
    return matchesSearch && matchesAdmin && matchesAction;
  });

  const uniqueAdmins = [...new Set(logs.map(l => l.admin))];

  const columns = [
    {
      key: 'action',
      header: 'Action',
      render: (log: AuditLog) => {
        const config = actionTypeConfig[log.actionType];
        const Icon = config.icon;
        return (
          <div className="flex items-center gap-3">
            <div className={cn('p-2 rounded-lg', config.color)}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium text-sm">{log.action}</p>
              <p className="text-xs text-muted-foreground">
                {log.resource} • {log.resourceId}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'admin',
      header: 'Admin',
      render: (log: AuditLog) => (
        <div>
          <p className="font-medium text-sm">{log.admin}</p>
          <p className="text-xs text-muted-foreground">{log.adminRole}</p>
        </div>
      ),
    },
    {
      key: 'timestamp',
      header: 'Timestamp',
      render: (log: AuditLog) => (
        <div className="text-sm">
          <p>{log.timestamp.split(' ')[0]}</p>
          <p className="text-muted-foreground">{log.timestamp.split(' ')[1]}</p>
        </div>
      ),
    },
    {
      key: 'ip',
      header: 'IP Address',
      render: (log: AuditLog) => (
        <span className="font-mono text-sm text-muted-foreground">{log.ipAddress}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (log: AuditLog) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedLog(log);
          }}
        >
          <FaEye className="w-4 h-4 mr-1" />
          Details
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Audit Logs"
        subtitle="Immutable record of all administrative actions"
      />

      <div className="p-6 space-y-6">
        {/* Info Banner */}
        <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/5 border border-accent/20">
          <FaShieldAlt className="w-5 h-5 text-accent" />
          <p className="text-sm text-muted-foreground">
            Audit logs are immutable and cannot be modified or deleted. All administrative actions are automatically recorded for compliance purposes.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Activity Log</h2>
          <Button variant="outline">
            <FaDownload className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
        </div>

        {/* Filters */}
        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search logs..."
          onClearFilters={() => {
            setSearch('');
            setAdminFilter('all');
            setActionFilter('all');
            setDateFilter('all');
          }}
        >
          <Select value={adminFilter} onValueChange={setAdminFilter}>
            <SelectTrigger className="w-44">
              <FaUser className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Admin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Admins</SelectItem>
              {uniqueAdmins.map(admin => (
                <SelectItem key={admin} value={admin}>{admin}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Action Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="create">Create</SelectItem>
              <SelectItem value="update">Update</SelectItem>
              <SelectItem value="delete">Delete</SelectItem>
              <SelectItem value="approve">Approve</SelectItem>
              <SelectItem value="reject">Reject</SelectItem>
              <SelectItem value="override">Override</SelectItem>
              <SelectItem value="login">Login</SelectItem>
              <SelectItem value="config">Config</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-40">
              <FaCalendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </FilterBar>

        {/* Table */}
        {loading ? (
          <div className="py-12 text-center text-muted-foreground">Loading audit logs...</div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredLogs}
            keyExtractor={(log) => log.id}
            onRowClick={(log) => setSelectedLog(log)}
            pagination={{
              page,
              pageSize,
              total: filteredLogs.length,
              onPageChange: setPage,
              onPageSizeChange: setPageSize,
            }}
          />
        )}
      </div>

      {/* Log Detail Sheet */}
      <Sheet open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <SheetContent className="w-[500px] sm:max-w-[500px]">
          <SheetHeader>
            <SheetTitle>Audit Log Details</SheetTitle>
            <SheetDescription>
              Complete record of this administrative action
            </SheetDescription>
          </SheetHeader>

          {selectedLog && (
            <div className="mt-6 space-y-6">
              {/* Action Summary */}
              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <p className="font-medium">{selectedLog.action}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedLog.resource} • {selectedLog.resourceId}
                </p>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Admin</p>
                    <p className="font-medium">{selectedLog.admin}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="font-medium">{selectedLog.adminRole}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Timestamp</p>
                    <p className="font-medium">{selectedLog.timestamp}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">IP Address</p>
                    <p className="font-mono text-sm">{selectedLog.ipAddress}</p>
                  </div>
                </div>
              </div>

              {/* Changes */}
              {selectedLog.changes && selectedLog.changes.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Changes Made</h4>
                  <div className="space-y-3">
                    {selectedLog.changes.map((change, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-muted/30 border border-border">
                        <p className="text-sm text-muted-foreground mb-2">{change.field}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 p-2 rounded bg-destructive/5 border border-destructive/20">
                            <p className="text-xs text-muted-foreground">Before</p>
                            <p className="text-sm font-medium text-destructive">{change.before}</p>
                          </div>
                          <span className="text-muted-foreground">→</span>
                          <div className="flex-1 p-2 rounded bg-success/5 border border-success/20">
                            <p className="text-xs text-muted-foreground">After</p>
                            <p className="text-sm font-medium text-success">{change.after}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Immutable Notice */}
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                <FaShieldAlt className="w-4 h-4" />
                <span>This record is immutable and cannot be modified.</span>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
