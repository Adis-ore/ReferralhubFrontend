import { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { Button } from '@/components/ui/button';
import { SkeletonPage } from '@/components/ui/skeletons';
import { brevityApi } from '@/services/api';
import { toast } from 'sonner';
import {
  FaSyncAlt, FaCheckCircle, FaTimesCircle,
  FaRobot, FaUser, FaClock, FaDownload, FaSpinner,
} from 'react-icons/fa';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('en-AU', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

export default function BrevityLogs() {
  const [syncLogs, setSyncLogs] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [syncing, setSyncing]   = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([brevityApi.getLogs(), brevityApi.getSettings()])
      .then(([logsRes, settingsRes]) => {
        setSyncLogs(logsRes.data ?? []);
        setSettings(settingsRes);
      })
      .catch((err) => toast.error(err.message || 'Failed to load Brevity data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await brevityApi.syncNow();
      toast.success(res.message || 'Brevity sync complete');
      load();
    } catch (err: any) {
      toast.error(err.message || 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  const handleExport = () => {
    const headers = ['ID', 'Synced At', 'Status', 'Fetched', 'Imported', 'Failed', 'Duration', 'Triggered By', 'Error'];
    const rows = syncLogs.map((l) => [
      l.id, l.syncedAt, l.status, l.recordsFetched,
      l.recordsImported, l.recordsFailed, l.duration,
      l.triggeredBy, l.errorMessage || '',
    ]);
    const csv  = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'brevity-sync-logs.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported as CSV');
  };

  if (loading) return <SkeletonPage rows={8} cols={4} />;

  const successCount  = syncLogs.filter((l) => l.status === 'success').length;
  const failedCount   = syncLogs.filter((l) => l.status === 'failed').length;
  const totalImported = syncLogs.reduce((s, l) => s + (l.recordsImported ?? 0), 0);

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Brevity Sync Logs"
        subtitle="History of all Brevity timesheet sync operations"
      />

      <div className="p-4 md:p-6 space-y-6">

        {/* Connection status + sync button */}
        <div className="audit-card">
          <div className="audit-card-body flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${settings?.isConnected ? 'bg-success' : 'bg-muted-foreground'}`} />
              <div>
                <p className="text-sm font-medium">
                  {settings?.isConnected ? 'Connected to Brevity' : 'Brevity not connected'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {settings?.lastSync
                    ? `Last synced ${formatDate(settings.lastSync)}`
                    : 'Never synced'}
                </p>
              </div>
            </div>
            <Button onClick={handleSync} disabled={syncing} className="gap-2">
              {syncing
                ? <><FaSpinner className="w-3.5 h-3.5 animate-spin" /> Syncing...</>
                : <><FaSyncAlt className="w-3.5 h-3.5" /> Sync Now</>}
            </Button>
          </div>
        </div>

        {/* Not configured warning */}
        {!settings?.companyCode && !settings?.apiKey && (
          <div className="audit-card border-warning/40 bg-warning/5">
            <div className="audit-card-body text-sm text-warning">
              Brevity credentials not set. Go to <strong>Settings</strong> and enter your Company Code and API Key to enable syncing.
            </div>
          </div>
        )}

        {/* KPI cards */}
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
            <p className="text-xs text-muted-foreground">Timesheets Imported</p>
            <p className="text-2xl font-semibold mt-1">{totalImported}</p>
          </div>
        </div>

        {/* Logs table */}
        <div className="audit-card">
          <div className="audit-card-header flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaSyncAlt className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Sync History</h3>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport} disabled={syncLogs.length === 0}>
              <FaDownload className="w-3.5 h-3.5 mr-1.5" /> Export CSV
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  {['Log ID', 'Synced At', 'Status', 'Fetched', 'Imported', 'Failed', 'Duration', 'Trigger'].map((h) => (
                    <th key={h} className="px-4 md:px-6 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {syncLogs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground text-sm">
                      No sync logs yet. Click <strong>Sync Now</strong> to run your first Brevity sync.
                    </td>
                  </tr>
                ) : syncLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 md:px-6 py-3 font-mono text-xs text-muted-foreground">{log.id}</td>
                    <td className="px-4 md:px-6 py-3">
                      <div className="flex items-center gap-1.5">
                        <FaClock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs">{formatDate(log.syncedAt)}</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-3">
                      {log.status === 'success' ? (
                        <span className="flex items-center gap-1.5 text-success text-xs font-medium">
                          <FaCheckCircle className="w-3.5 h-3.5" /> Success
                        </span>
                      ) : log.status === 'skipped' ? (
                        <span className="text-xs text-muted-foreground">Skipped</span>
                      ) : (
                        <div>
                          <span className="flex items-center gap-1.5 text-destructive text-xs font-medium">
                            <FaTimesCircle className="w-3.5 h-3.5" /> Failed
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
                      {log.recordsFailed > 0
                        ? <span className="text-destructive font-medium">{log.recordsFailed}</span>
                        : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-4 md:px-6 py-3 text-center text-muted-foreground">{log.duration}</td>
                    <td className="px-4 md:px-6 py-3">
                      {log.triggeredBy === 'manual'
                        ? <span className="flex items-center gap-1.5 text-xs"><FaUser className="w-3 h-3 text-info" /> Manual</span>
                        : <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><FaRobot className="w-3 h-3" /> Scheduled</span>}
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
