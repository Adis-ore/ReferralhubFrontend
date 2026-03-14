import { useState } from 'react';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FaChartBar,
  FaDownload,
  FaPlus,
  FaCalendar,
  FaFileAlt,
  FaClock,
  FaPlay,
  FaPause,
  FaTrashAlt,
  FaEdit
} from 'react-icons/fa';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn } from '@/lib/utils';

const savedReports = [
  { id: '1', name: 'Monthly Referral Summary', type: 'referrals', schedule: 'Monthly', lastRun: '2024-06-01', status: 'active' },
  { id: '2', name: 'Weekly Points Distribution', type: 'points', schedule: 'Weekly', lastRun: '2024-06-10', status: 'active' },
  { id: '3', name: 'Quarterly Payout Report', type: 'payouts', schedule: 'Quarterly', lastRun: '2024-04-01', status: 'active' },
  { id: '4', name: 'User Activity Report', type: 'users', schedule: 'On-demand', lastRun: '2024-06-14', status: 'inactive' },
];

const reportTemplates = [
  { id: 'referrals', name: 'Referral Analytics', description: 'Track referral trends, conversion rates, and top performers', icon: '👥' },
  { id: 'points', name: 'Points Distribution', description: 'Analyze points earned, spent, and pending across all users', icon: '🪙' },
  { id: 'payouts', name: 'Payout Summary', description: 'Financial overview of withdrawals and processed payments', icon: '💰' },
  { id: 'users', name: 'User Engagement', description: 'User activity metrics and engagement statistics', icon: '📊' },
  { id: 'campaigns', name: 'Campaign Performance', description: 'Effectiveness analysis of referral campaigns', icon: '🎯' },
  { id: 'audit', name: 'Compliance Report', description: 'Administrative actions and system changes overview', icon: '🔒' },
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState('builder');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [dateRange, setDateRange] = useState('30d');

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Reports & Analytics"
        subtitle="Generate insights and scheduled reports"
      />

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="builder">
              <BarChart3 className="w-4 h-4 mr-2" />
              Report Builder
            </TabsTrigger>
            <TabsTrigger value="saved">
              <FileText className="w-4 h-4 mr-2" />
              Saved Reports ({savedReports.length})
            </TabsTrigger>
            <TabsTrigger value="scheduled">
              <Clock className="w-4 h-4 mr-2" />
              Scheduled
            </TabsTrigger>
          </TabsList>

          {/* Report Builder */}
          <TabsContent value="builder" className="space-y-6">
            <div className="audit-card">
              <div className="audit-card-header">
                <h3 className="font-semibold">Select Report Type</h3>
              </div>
              <div className="audit-card-body">
                <div className="grid grid-cols-3 gap-4">
                  {reportTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={cn(
                        'p-4 rounded-lg border text-left transition-all',
                        selectedTemplate === template.id
                          ? 'border-accent bg-accent/5'
                          : 'border-border hover:border-muted-foreground/30'
                      )}
                    >
                      <span className="text-2xl">{template.icon}</span>
                      <p className="font-medium mt-2">{template.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {template.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {selectedTemplate && (
              <div className="audit-card animate-fade-in">
                <div className="audit-card-header">
                  <h3 className="font-semibold">Configure Report</h3>
                </div>
                <div className="audit-card-body">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date Range</label>
                      <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger>
                          <Calendar className="w-4 h-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7d">Last 7 days</SelectItem>
                          <SelectItem value="30d">Last 30 days</SelectItem>
                          <SelectItem value="90d">Last 90 days</SelectItem>
                          <SelectItem value="12m">Last 12 months</SelectItem>
                          <SelectItem value="custom">Custom range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Location Filter</label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Locations</SelectItem>
                          <SelectItem value="sydney">Sydney</SelectItem>
                          <SelectItem value="melbourne">Melbourne</SelectItem>
                          <SelectItem value="brisbane">Brisbane</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Group By</label>
                      <Select defaultValue="month">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="day">Day</SelectItem>
                          <SelectItem value="week">Week</SelectItem>
                          <SelectItem value="month">Month</SelectItem>
                          <SelectItem value="quarter">Quarter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
                    <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      <Play className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export as CSV
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export as PDF
                    </Button>
                    <Button variant="ghost" className="ml-auto">
                      <Plus className="w-4 h-4 mr-2" />
                      Save as Template
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Saved Reports */}
          <TabsContent value="saved">
            <div className="audit-card">
              <div className="audit-card-header">
                <h3 className="font-semibold">Saved Reports</h3>
                <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  New Report
                </Button>
              </div>
              <div className="divide-y divide-border">
                {savedReports.map((report) => (
                  <div key={report.id} className="px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-muted">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {report.schedule} • Last run: {report.lastRun}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={report.status as any} />
                      <Button variant="ghost" size="sm">
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Scheduled Reports */}
          <TabsContent value="scheduled">
            <div className="audit-card">
              <div className="audit-card-header">
                <h3 className="font-semibold">Scheduled Reports</h3>
                <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Report
                </Button>
              </div>
              <div className="divide-y divide-border">
                {savedReports.filter(r => r.schedule !== 'On-demand').map((report) => (
                  <div key={report.id} className="px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-accent/10 text-accent">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Runs {report.schedule.toLowerCase()} • Next run: {report.schedule === 'Monthly' ? 'Jul 1' : report.schedule === 'Weekly' ? 'Jun 17' : 'Jul 1'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={report.status as any} />
                      <Button variant="ghost" size="sm">
                        {report.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
