import { useState } from 'react';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/ui/status-badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import {
  FaGift,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaUsers,
  FaCoins,
  FaClock,
  FaChartLine,
  FaCalendar,
  FaCopy,
  FaToggleOn,
  FaToggleOff,
} from 'react-icons/fa';
import { cn } from '@/lib/utils';

interface ReferralProgram {
  id: string;
  name: string;
  description: string;
  pointsPerReferral: number;
  bonusPoints: number;
  bonusThreshold: number;
  minHoursRequired: number;
  maxReferrals: number | null;
  status: 'active' | 'paused' | 'draft' | 'expired';
  startDate: string;
  endDate?: string;
  totalReferrals: number;
  totalPointsAwarded: number;
  participantCount: number;
  createdBy: string;
  createdAt: string;
}

const mockPrograms: ReferralProgram[] = [
  {
    id: 'RP-001',
    name: 'Standard Referral Program',
    description: 'Earn points for every successful referral who completes their onboarding and works minimum required hours.',
    pointsPerReferral: 200,
    bonusPoints: 500,
    bonusThreshold: 5,
    minHoursRequired: 40,
    maxReferrals: null,
    status: 'active',
    startDate: '2024-01-01',
    totalReferrals: 245,
    totalPointsAwarded: 62500,
    participantCount: 42,
    createdBy: 'Sarah Chen',
    createdAt: '2023-12-15',
  },
  {
    id: 'RP-002',
    name: 'Summer Boost Campaign',
    description: 'Double points for referrals during the summer period. Limited time offer to boost hiring during peak season.',
    pointsPerReferral: 400,
    bonusPoints: 1000,
    bonusThreshold: 3,
    minHoursRequired: 20,
    maxReferrals: 10,
    status: 'active',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    totalReferrals: 58,
    totalPointsAwarded: 28000,
    participantCount: 28,
    createdBy: 'Operations Admin',
    createdAt: '2024-05-20',
  },
  {
    id: 'RP-003',
    name: 'Nursing Specialist Referral',
    description: 'Premium points for referring registered nurses. Higher reward tier for critical staffing needs.',
    pointsPerReferral: 500,
    bonusPoints: 1500,
    bonusThreshold: 3,
    minHoursRequired: 60,
    maxReferrals: null,
    status: 'active',
    startDate: '2024-03-01',
    totalReferrals: 32,
    totalPointsAwarded: 19500,
    participantCount: 18,
    createdBy: 'Sarah Chen',
    createdAt: '2024-02-20',
  },
  {
    id: 'RP-004',
    name: 'Q1 Referral Sprint',
    description: 'First quarter referral competition with accelerated rewards.',
    pointsPerReferral: 300,
    bonusPoints: 800,
    bonusThreshold: 4,
    minHoursRequired: 30,
    maxReferrals: 15,
    status: 'expired',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    totalReferrals: 89,
    totalPointsAwarded: 35600,
    participantCount: 35,
    createdBy: 'Operations Admin',
    createdAt: '2023-12-20',
  },
  {
    id: 'RP-005',
    name: 'Driver Recruitment Push',
    description: 'Targeted referral program for driver positions with competitive rewards.',
    pointsPerReferral: 350,
    bonusPoints: 700,
    bonusThreshold: 3,
    minHoursRequired: 40,
    maxReferrals: null,
    status: 'paused',
    startDate: '2024-04-01',
    totalReferrals: 12,
    totalPointsAwarded: 4900,
    participantCount: 8,
    createdBy: 'Sarah Chen',
    createdAt: '2024-03-25',
  },
];

export default function ReferralPrograms() {
  const [programs, setPrograms] = useState(mockPrograms);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProgram, setSelectedProgram] = useState<ReferralProgram | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Create form state
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPointsPerReferral, setFormPointsPerReferral] = useState('200');
  const [formBonusPoints, setFormBonusPoints] = useState('500');
  const [formBonusThreshold, setFormBonusThreshold] = useState('5');
  const [formMinHours, setFormMinHours] = useState('40');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');

  const filtered = programs.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = programs.filter(p => p.status === 'active').length;
  const totalRefs = programs.reduce((sum, p) => sum + p.totalReferrals, 0);
  const totalPoints = programs.reduce((sum, p) => sum + p.totalPointsAwarded, 0);
  const totalParticipants = new Set(programs.flatMap(p => Array(p.participantCount).fill(0).map((_, i) => `${p.id}-${i}`))).size;

  const handleCreateProgram = () => {
    if (!formName || !formStartDate) return;
    const newProgram: ReferralProgram = {
      id: `RP-${String(programs.length + 1).padStart(3, '0')}`,
      name: formName,
      description: formDescription,
      pointsPerReferral: parseInt(formPointsPerReferral) || 200,
      bonusPoints: parseInt(formBonusPoints) || 500,
      bonusThreshold: parseInt(formBonusThreshold) || 5,
      minHoursRequired: parseInt(formMinHours) || 40,
      maxReferrals: null,
      status: 'draft',
      startDate: formStartDate,
      endDate: formEndDate || undefined,
      totalReferrals: 0,
      totalPointsAwarded: 0,
      participantCount: 0,
      createdBy: 'Current Admin',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setPrograms(prev => [newProgram, ...prev]);
    setShowCreate(false);
    setFormName('');
    setFormDescription('');
    setFormPointsPerReferral('200');
    setFormBonusPoints('500');
    setFormBonusThreshold('5');
    setFormMinHours('40');
    setFormStartDate('');
    setFormEndDate('');
  };

  const toggleProgramStatus = (id: string) => {
    setPrograms(prev => prev.map(p => {
      if (p.id !== id) return p;
      if (p.status === 'active') return { ...p, status: 'paused' as const };
      if (p.status === 'paused' || p.status === 'draft') return { ...p, status: 'active' as const };
      return p;
    }));
  };

  const handleDelete = () => {
    if (!selectedProgram) return;
    setPrograms(prev => prev.filter(p => p.id !== selectedProgram.id));
    setShowDeleteConfirm(false);
    setSelectedProgram(null);
  };

  const statusColors: Record<string, string> = {
    active: 'bg-success/10 text-success border-success/20',
    paused: 'bg-warning/10 text-warning border-warning/20',
    draft: 'bg-muted text-muted-foreground border-border',
    expired: 'bg-muted/50 text-muted-foreground/60 border-border/50',
  };

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Referral Programs"
        subtitle="Create and manage referral incentive programs"
      />

      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="kpi-card before:bg-success">
            <p className="text-xs md:text-sm text-muted-foreground">Active Programs</p>
            <p className="text-xl md:text-2xl font-semibold mt-1">{activeCount}</p>
          </div>
          <div className="kpi-card before:bg-primary">
            <p className="text-xs md:text-sm text-muted-foreground">Total Referrals</p>
            <p className="text-xl md:text-2xl font-semibold mt-1">{totalRefs}</p>
          </div>
          <div className="kpi-card before:bg-accent">
            <p className="text-xs md:text-sm text-muted-foreground">Points Awarded</p>
            <p className="text-xl md:text-2xl font-semibold mt-1">{totalPoints.toLocaleString()}</p>
          </div>
          <div className="kpi-card before:bg-info">
            <p className="text-xs md:text-sm text-muted-foreground">Total Participants</p>
            <p className="text-xl md:text-2xl font-semibold mt-1">{programs.reduce((s, p) => s + p.participantCount, 0)}</p>
          </div>
        </div>

        {/* Filters + Create Button */}
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1 flex flex-col md:flex-row gap-3">
            <Input
              placeholder="Search programs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="md:max-w-xs"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-36">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setShowCreate(true)} className="shrink-0">
            <FaPlus className="w-3.5 h-3.5 mr-2" />
            Create Program
          </Button>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-card rounded-lg border border-border">
              <FaGift className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No programs match your search</p>
            </div>
          ) : (
            filtered.map((program) => (
              <div
                key={program.id}
                className={cn(
                  'bg-card rounded-xl border p-5 hover:shadow-md transition-all cursor-pointer',
                  program.status === 'expired' ? 'border-border/50 opacity-70' : 'border-border'
                )}
                onClick={() => { setSelectedProgram(program); setShowDetails(true); }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <FaGift className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm md:text-base">{program.name}</h3>
                      <span className="font-mono text-xs text-muted-foreground">{program.id}</span>
                    </div>
                  </div>
                  <span className={cn('px-2 py-1 rounded-md text-xs font-medium border', statusColors[program.status])}>
                    {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{program.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2 rounded-lg bg-muted/30">
                    <p className="text-lg font-bold">{program.pointsPerReferral}</p>
                    <p className="text-xs text-muted-foreground">Pts/Referral</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/30">
                    <p className="text-lg font-bold">{program.totalReferrals}</p>
                    <p className="text-xs text-muted-foreground">Referrals</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/30">
                    <p className="text-lg font-bold">{program.participantCount}</p>
                    <p className="text-xs text-muted-foreground">Participants</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                  <div className="flex items-center gap-1">
                    <FaCalendar className="w-3 h-3" />
                    <span>{program.startDate}{program.endDate ? ` to ${program.endDate}` : ' (Ongoing)'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {program.status !== 'expired' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleProgramStatus(program.id); }}
                        className="hover:text-foreground"
                      >
                        {program.status === 'active' ? (
                          <FaToggleOn className="w-5 h-5 text-success" />
                        ) : (
                          <FaToggleOff className="w-5 h-5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Details Sheet */}
      <Sheet open={showDetails} onOpenChange={setShowDetails}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedProgram?.name}</SheetTitle>
            <SheetDescription>{selectedProgram?.id}</SheetDescription>
          </SheetHeader>

          {selectedProgram && (
            <div className="mt-6 space-y-6">
              <p className="text-sm text-muted-foreground">{selectedProgram.description}</p>

              <div className="p-4 rounded-xl bg-muted/30 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Points Per Referral</span>
                  <span className="font-semibold">{selectedProgram.pointsPerReferral} pts</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Bonus Points</span>
                  <span className="font-semibold">{selectedProgram.bonusPoints} pts</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Bonus After</span>
                  <span className="font-medium">{selectedProgram.bonusThreshold} referrals</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Min Hours Required</span>
                  <span className="font-medium">{selectedProgram.minHoursRequired}h</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Max Referrals</span>
                  <span className="font-medium">{selectedProgram.maxReferrals ?? 'Unlimited'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-border text-center">
                  <p className="text-2xl font-bold">{selectedProgram.totalReferrals}</p>
                  <p className="text-xs text-muted-foreground">Total Referrals</p>
                </div>
                <div className="p-3 rounded-xl border border-border text-center">
                  <p className="text-2xl font-bold">{selectedProgram.totalPointsAwarded.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Points Awarded</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date</span>
                  <span>{selectedProgram.startDate}</span>
                </div>
                {selectedProgram.endDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">End Date</span>
                    <span>{selectedProgram.endDate}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created By</span>
                  <span>{selectedProgram.createdBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created At</span>
                  <span>{selectedProgram.createdAt}</span>
                </div>
              </div>

              <div className="flex gap-3">
                {selectedProgram.status !== 'expired' && (
                  <Button
                    className="flex-1"
                    variant={selectedProgram.status === 'active' ? 'outline' : 'default'}
                    onClick={() => { toggleProgramStatus(selectedProgram.id); setShowDetails(false); }}
                  >
                    {selectedProgram.status === 'active' ? 'Pause Program' : 'Activate Program'}
                  </Button>
                )}
                <Button
                  variant="destructive"
                  onClick={() => { setShowDetails(false); setShowDeleteConfirm(true); }}
                >
                  <FaTrash className="w-3.5 h-3.5 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Create Program Sheet */}
      <Sheet open={showCreate} onOpenChange={setShowCreate}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Create Referral Program</SheetTitle>
            <SheetDescription>Set up a new referral incentive program</SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label>Program Name</Label>
              <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g., Summer Referral Boost" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Describe the program and its goals..."
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Points Per Referral</Label>
                <Input type="number" value={formPointsPerReferral} onChange={(e) => setFormPointsPerReferral(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Bonus Points</Label>
                <Input type="number" value={formBonusPoints} onChange={(e) => setFormBonusPoints(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Bonus After (referrals)</Label>
                <Input type="number" value={formBonusThreshold} onChange={(e) => setFormBonusThreshold(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Min Hours Required</Label>
                <Input type="number" value={formMinHours} onChange={(e) => setFormMinHours(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" value={formStartDate} onChange={(e) => setFormStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>End Date (optional)</Label>
                <Input type="date" value={formEndDate} onChange={(e) => setFormEndDate(e.target.value)} />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleCreateProgram} disabled={!formName || !formStartDate} className="flex-1">
                <FaPlus className="w-3.5 h-3.5 mr-2" />
                Create Program
              </Button>
              <Button variant="outline" onClick={() => setShowCreate(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation */}
      <ConfirmationModal
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Program"
        description={`Are you sure you want to delete "${selectedProgram?.name}"? This will not affect points already awarded to staff. This action cannot be undone.`}
        confirmText="Delete Program"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
