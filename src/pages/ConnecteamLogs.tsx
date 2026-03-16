import { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  FaSyncAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaRobot,
  FaUser,
  FaClock,
  FaDownload,
} from 'react-icons/fa';
import { connecteamApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { SkeletonPage } from '@/components/ui/skeletons';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function ConnecteamLogs() {
  const [syncLogs, setSyncLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setLoading(true);
    connecteamApi.getLogs()
      .then((res) => {
        setSyncLogs(res.data);
      })
      .catch((err) => {
        toast.error(err.message || 'Failed to load sync logs');
      })
      .finally(() => setLoading(false));
  }, []);

  const successCount = syncLogs.filter((l) => l.status === 'success').length;
  const failedCount = syncLogs.filter((l) => l.status === 'failed').length;
  const totalImported = syncLogs.reduce((s, l) => s + (l.recordsImported ?? 0), 0);

  const handleExport = () => {
    const headers = ['ID', 'Synced At', 'Status', 'Records Fetched', 'Records Imported', 'Records Failed', 'Duration', 'Triggered By', 'Error'];
    const rows = syncLogs.map((l) => [
      l.id,
      l.syncedAt,
      l.status,
      l.recordsFetched,
      l.recordsImported,
      l.recordsFailed,
      l.duration,
      l.triggeredBy,
      l.errorMessage || '',
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'connecteam-sync-logs.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Sync logs exported as CSV');
  };

  if (loading) return <SkeletonPage rows={8} cols={4} />;

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Connecteam Sync Logs"
        subtitle="History of all Connecteam time clock sync operations"
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="kpi-card before:bg-accent">
            <p className="text-xs text-muted-foreground">Total Syncs</p>
            <p className="text-2xl font-semibold mt-1">{syncLogs.length}</p>
          </div>
          <div className="kpi-card before:bg-success">
            <p className="text-xs text-muted-foreground">Successful</p>
            <p className="text-2xl font-semibold mt-1">{successCount}</p>
          </div>
          <div className="kpi-card before:bg-destructive">
            <p className="text-xs text-muted-foreground">Failed</p>
            <p className="text-2xl font-semibold mt-1">{failedCount}</p>
          </div>
          <div className="kpi-card before:bg-warning">
            <p className="text-xs text-muted-foreground">Records Imported</p>
            <p className="text-2xl font-semibold mt-1">{totalImported}</p>
          </div>
        </div>

        {/* Logs Table */}
        <div className="audit-card">
          <div className="audit-card-header flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaSyncAlt className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Sync History</h3>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <FaDownload className="w-3.5 h-3.5 mr-1.5" />
              Export CSV
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-4 md:px-6 py-3 text-xs font-medium text-muted-foreground">Log ID</th>
                  <th className="px-4 md:px-6 py-3 text-xs font-medium text-muted-foreground">Synced At</th>
                  <th className="px-4 md:px-6 py-3 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-4 md:px-6 py-3 text-xs font-medium text-muted-foreground">Fetched</th>
                  <th className="px-4 md:px-6 py-3 text-xs font-medium text-muted-foreground">Imported</th>
                  <th className="px-4 md:px-6 py-3 text-xs font-medium text-muted-foreground">Failed</th>
                  <th className="px-4 md:px-6 py-3 text-xs font-medium text-muted-foreground">Duration</th>
                  <th className="px-4 md:px-6 py-3 text-xs font-medium text-muted-foreground">Trigger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr><td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">Loading sync logs...</td></tr>
                ) : syncLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 md:px-6 py-3 font-mono text-xs text-muted-foreground">{log.id}</td>
                    <td className="px-4 md:px-6 py-3">
                      <div className="flex items-center gap-1.5">
                        <FaClock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs">{formatDate(log.syncedAt)}</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-3">
                      {log.status === 'success' ? (
                        <span className="flex items-center gap-1.5 text-success text-xs font-medium">
                          <FaCheckCircle className="w-3.5 h-3.5" />
                          Success
                        </span>
                      ) : (
                        <div>
                          <span className="flex items-center gap-1.5 text-destructive text-xs font-medium">
                            <FaTimesCircle className="w-3.5 h-3.5" />
                            Failed
                          </span>
                          {log.errorMessage && (
                            <p className="text-xs text-muted-foreground mt-0.5 max-w-[200px] truncate" title={log.errorMessage}>
                              {log.errorMessage}
                            </p>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 md:px-6 py-3 text-center font-medium">{log.recordsFetched}</td>
                    <td className="px-4 md:px-6 py-3 text-center">
                      <span className="text-success font-medium">{log.recordsImported}</span>
                    </td>
                    <td className="px-4 md:px-6 py-3 text-center">
                      {log.recordsFailed > 0 ? (
                        <span className="text-destructive font-medium">{log.recordsFailed}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 md:px-6 py-3 text-center text-muted-foreground">{log.duration}</td>
                    <td className="px-4 md:px-6 py-3">
                      {log.triggeredBy === 'manual' ? (
                        <span className="flex items-center gap-1.5 text-xs">
                          <FaUser className="w-3 h-3 text-info" />
                          Manual
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <FaRobot className="w-3 h-3" />
                          Scheduled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
