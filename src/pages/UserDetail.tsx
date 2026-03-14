import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/ui/status-badge';
import { AuditInfo } from '@/components/ui/audit-info';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import {
  FaArrowLeft as ArrowLeft,
  FaEnvelope as Mail,
  FaMapMarkerAlt as MapPin,
  FaBriefcase as Briefcase,
  FaCalendar as Calendar,
  FaGift as Gift,
  FaCoins as Coins,
  FaClock as Clock,
  FaEdit as Edit,
  FaBan as Ban,
  FaDownload,
  FaUniversity,
  FaPlus,
  FaMinus,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { usersApi, connecteamApi } from '@/services/api';

const shiftTypeColors: Record<string, string> = {
  regular: 'bg-muted text-muted-foreground',
  overtime: 'bg-warning/10 text-warning',
  weekend: 'bg-info/10 text-info',
  public_holiday: 'bg-destructive/10 text-destructive',
};
const shiftTypeLabels: Record<string, string> = {
  regular: 'Regular',
  overtime: 'Overtime',
  weekend: 'Weekend',
  public_holiday: 'Public Holiday',
};

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: adminUser } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [userHours, setUserHours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustType, setAdjustType] = useState<'add' | 'deduct'>('add');
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustReason, setAdjustReason] = useState('');
  const [currentPoints, setCurrentPoints] = useState(0);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      usersApi.get(id),
      connecteamApi.getHours({ userId: id }),
    ])
      .then(([user, hoursRes]) => {
        setUserData(user);
        setCurrentPoints(user.pointsBalance ?? 0);
        setUserHours(hoursRes.data ?? []);
      })
      .catch((err) => {
        toast.error(err.message || 'Failed to load user details');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const canAdjustPoints = adminUser?.role === 'super_admin' || adminUser?.role === 'finance_admin';

  const handleAdjustPoints = () => {
    const amount = parseInt(adjustAmount);
    if (!amount || amount <= 0) { toast.error('Enter a valid amount'); return; }
    if (!adjustReason || adjustReason.length < 5) { toast.error('Provide a reason (min 5 characters)'); return; }
    if (adjustType === 'deduct' && amount > currentPoints) { toast.error('Cannot deduct more than available points'); return; }
    usersApi.adjustPoints(id!, adjustType, amount, adjustReason)
      .then(() => {
        const newPoints = adjustType === 'add' ? currentPoints + amount : currentPoints - amount;
        setCurrentPoints(newPoints);
        setShowAdjustModal(false);
        setAdjustAmount('');
        setAdjustReason('');
        toast.success(`Points ${adjustType === 'add' ? 'added' : 'deducted'}. New balance: ${newPoints.toLocaleString()}`);
      })
      .catch((err) => {
        toast.error(err.message || 'Failed to adjust points');
      });
  };

  const handleExport = (section: string) => { toast.success(`${section} exported as PDF`); };

  if (loading) {
    return (
      <div className="min-h-screen">
        <AdminHeader title="User Details" subtitle="Loading..." />
        <div className="p-4 md:p-6">
          <div className="py-12 text-center text-muted-foreground">Loading user details...</div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen">
        <AdminHeader title="User Details" subtitle="Not found" />
        <div className="p-4 md:p-6">
          <div className="py-12 text-center text-muted-foreground">User not found.</div>
        </div>
      </div>
    );
  }

  const userName = `${userData.firstName ?? ''} ${userData.lastName ?? ''}`.trim();
  const userReferrals: any[] = userData.referrals ?? [];

  return (
    <div className="min-h-screen">
      <AdminHeader title="User Details" subtitle={`User ID: ${userData.employeeId ?? id}`} />
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <Button variant="ghost" onClick={() => navigate('/users')} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Users
        </Button>

        {/* Profile Header */}
        <div className="audit-card">
          <div className="audit-card-body">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
                <Avatar className="h-16 w-16 md:h-20 md:w-20">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl md:text-2xl">
                    {userName.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h2 className="text-xl md:text-2xl font-semibold">{userName}</h2>
                    <StatusBadge status={userData.isActive ? 'active' : 'inactive'} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground"><Mail className="w-4 h-4 shrink-0" /><span className="truncate">{userData.email}</span></div>
                    <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4 shrink-0" />{userData.location}</div>
                    <div className="flex items-center gap-2 text-muted-foreground"><Briefcase className="w-4 h-4 shrink-0" />{userData.classification}</div>
                    <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4 shrink-0" />Joined {userData.joinDate ? userData.joinDate.split('T')[0] : ''}</div>
                  </div>
                  {userData.referrer && (
                    <div className="mt-3 flex items-center gap-2">
                      <Gift className="w-4 h-4 text-accent" />
                      <span className="text-sm">Referred by <button className="text-accent hover:underline">{userData.referrer.name}</button></span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm"><Edit className="w-4 h-4 mr-2" />Edit</Button>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive"><Ban className="w-4 h-4 mr-2" />Deactivate</Button>
              </div>
            </div>
          </div>
          <div className="audit-card-footer">
            <AuditInfo updatedAt={userData.updatedAt ?? ''} updatedBy={userData.updatedBy ?? 'System'} onViewHistory={() => {}} />
          </div>
        </div>

        {/* Bank Account */}
        <div className="audit-card">
          <div className="audit-card-header"><div className="flex items-center gap-2"><FaUniversity className="w-4 h-4 text-muted-foreground" /><h3 className="font-semibold text-sm">Bank Account Details</h3></div></div>
          <div className="audit-card-body">
            {userData.bankAccount ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div><p className="text-muted-foreground mb-1">Bank Name</p><p className="font-medium">{userData.bankAccount.bankName}</p></div>
                <div><p className="text-muted-foreground mb-1">Account Number</p><p className="font-mono font-medium">{userData.bankAccount.accountNumber}</p></div>
                <div><p className="text-muted-foreground mb-1">Account Name</p><p className="font-medium">{userData.bankAccount.accountName}</p></div>
              </div>
            ) : (<p className="text-sm text-muted-foreground">No bank account details on file.</p>)}
          </div>
        </div>

        {/* Points Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="kpi-card before:bg-accent"><p className="text-xs md:text-sm text-muted-foreground">Total Points</p><p className="text-lg md:text-2xl font-semibold mt-1">{(userData.pointsBalance ?? 0).toLocaleString()}</p></div>
          <div className="kpi-card before:bg-success">
            <div className="flex items-center justify-between"><p className="text-xs md:text-sm text-muted-foreground">Available</p>{canAdjustPoints && <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setShowAdjustModal(true)}>Adjust</Button>}</div>
            <p className="text-lg md:text-2xl font-semibold mt-1">{currentPoints.toLocaleString()}</p>
          </div>
          <div className="kpi-card before:bg-warning"><p className="text-xs md:text-sm text-muted-foreground">Pending</p><p className="text-lg md:text-2xl font-semibold mt-1">{(userData.pendingPoints ?? 0).toLocaleString()}</p></div>
          <div className="kpi-card before:bg-info"><p className="text-xs md:text-sm text-muted-foreground">Withdrawn</p><p className="text-lg md:text-2xl font-semibold mt-1">{(userData.withdrawnPoints ?? 0).toLocaleString()}</p></div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="referrals" className="space-y-4 md:space-y-6">
          <TabsList className="w-full sm:w-auto flex-wrap h-auto gap-1"><TabsTrigger value="referrals">Referrals ({userReferrals.length})</TabsTrigger><TabsTrigger value="points">Points History</TabsTrigger><TabsTrigger value="withdrawals">Withdrawals</TabsTrigger><TabsTrigger value="work-hours">Work Hours ({userHours.length})</TabsTrigger></TabsList>
          <TabsContent value="referrals">
            <div className="audit-card">
              <div className="audit-card-header flex items-center justify-between"><h3 className="font-semibold">Referrals Made</h3><Button variant="outline" size="sm" onClick={() => handleExport('Referrals')}><FaDownload className="w-3.5 h-3.5 mr-1.5" />PDF</Button></div>
              <div className="divide-y divide-border">{userReferrals.map((ref: any) => (
                <div key={ref.id} className="px-4 md:px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 md:gap-4"><Avatar className="h-8 w-8 md:h-10 md:w-10"><AvatarFallback className="bg-accent/10 text-accent text-xs">{(ref.refereeName ?? '').split(' ').map((n: string) => n[0]).join('')}</AvatarFallback></Avatar><div><p className="font-medium text-sm">{ref.refereeName}</p><p className="text-xs text-muted-foreground">Referred on {ref.submittedDate ? ref.submittedDate.split('T')[0] : ''}</p></div></div>
                  <div className="flex items-center gap-2 md:gap-4"><StatusBadge status={ref.status === 'completed' ? 'approved' : 'pending'} label={ref.status} />{ref.pointsAwarded > 0 && <div className="flex items-center gap-1.5"><Coins className="w-4 h-4 text-warning" /><span className="font-medium text-sm">+{ref.pointsAwarded}</span></div>}</div>
                </div>
              ))}</div>
            </div>
          </TabsContent>
          <TabsContent value="points">
            <div className="audit-card">
              <div className="audit-card-header flex items-center justify-between"><h3 className="font-semibold">Points History</h3><Button variant="outline" size="sm" onClick={() => handleExport('Points History')}><FaDownload className="w-3.5 h-3.5 mr-1.5" />PDF</Button></div>
              <div className="divide-y divide-border">{(userData.pointsHistory ?? []).map((item: any) => (
                <div key={item.id} className="px-4 md:px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 md:gap-4"><div className={`p-2 rounded-lg ${item.type === 'earned' ? 'bg-success/10 text-success' : item.type === 'withdrawn' ? 'bg-info/10 text-info' : 'bg-warning/10 text-warning'}`}><Coins className="w-4 h-4" /></div><div><p className="font-medium text-sm">{item.description}</p><p className="text-xs text-muted-foreground">{item.date}</p></div></div>
                  <span className={`font-semibold text-sm ${item.amount > 0 ? 'text-success' : 'text-foreground'}`}>{item.amount > 0 ? '+' : ''}{item.amount.toLocaleString()}</span>
                </div>
              ))}</div>
            </div>
          </TabsContent>
          <TabsContent value="withdrawals">
            <div className="audit-card">
              <div className="audit-card-header flex items-center justify-between"><h3 className="font-semibold">Withdrawal History</h3><Button variant="outline" size="sm" onClick={() => handleExport('Withdrawal History')}><FaDownload className="w-3.5 h-3.5 mr-1.5" />PDF</Button></div>
              <div className="divide-y divide-border">{(userData.withdrawals ?? []).map((item: any) => (
                <div key={item.id} className="px-4 md:px-6 py-4 flex items-center justify-between">
                  <div><p className="font-medium text-sm">Withdrawal #{item.id}</p><p className="text-xs text-muted-foreground">Requested: {item.requestedDate ? item.requestedDate.split('T')[0] : ''} | Paid: {item.paidDate ? item.paidDate.split('T')[0] : ''}</p></div>
                  <div className="flex items-center gap-2 md:gap-4"><StatusBadge status={item.status as any} /><span className="font-semibold text-sm">${(item.amount ?? item.finalAmount ?? 0).toLocaleString()}</span></div>
                </div>
              ))}</div>
            </div>
          </TabsContent>
          <TabsContent value="work-hours">
            <div className="audit-card">
              <div className="audit-card-header flex items-center justify-between">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-muted-foreground" /><h3 className="font-semibold">Work Hours (Connecteam)</h3></div>
                <Button variant="outline" size="sm" onClick={() => handleExport('Work Hours')}><FaDownload className="w-3.5 h-3.5 mr-1.5" />PDF</Button>
              </div>
              {userHours.length === 0 ? (
                <div className="p-12 text-center">
                  <Clock className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">No imported hours found for this user</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {userHours.map((h) => (
                    <div key={h.id} className="px-4 md:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-sm">{h.shiftDate}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${shiftTypeColors[h.shiftType]}`}>{shiftTypeLabels[h.shiftType]}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{h.clockIn} - {h.clockOut} &bull; {h.hoursWorked}h &bull; {h.multiplier}x multiplier</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Points</p>
                          <p className="font-semibold text-sm text-warning">{h.pointsToAward.toLocaleString()}</p>
                        </div>
                        <StatusBadge status={h.status as any} />
                        {h.status === 'pending' && (
                          <div className="flex gap-1">
                            <button onClick={() => toast.success('Approved')} className="p-1.5 rounded text-success hover:bg-success/10"><FaCheckCircle className="w-4 h-4" /></button>
                            <button onClick={() => toast.error('Rejected')} className="p-1.5 rounded text-destructive hover:bg-destructive/10"><FaTimesCircle className="w-4 h-4" /></button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Points Adjustment Modal */}
      <Dialog open={showAdjustModal} onOpenChange={setShowAdjustModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Adjust Points</DialogTitle><DialogDescription>Adjust {userName}'s available points. Current balance: {currentPoints.toLocaleString()} pts</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex gap-2">
              <Button variant={adjustType === 'add' ? 'default' : 'outline'} onClick={() => setAdjustType('add')} className="flex-1" size="sm"><FaPlus className="w-3.5 h-3.5 mr-1.5" />Add Points</Button>
              <Button variant={adjustType === 'deduct' ? 'destructive' : 'outline'} onClick={() => setAdjustType('deduct')} className="flex-1" size="sm"><FaMinus className="w-3.5 h-3.5 mr-1.5" />Deduct Points</Button>
            </div>
            <div className="space-y-2"><Label>Amount</Label><Input type="number" value={adjustAmount} onChange={(e) => setAdjustAmount(e.target.value)} placeholder="Enter points amount" min={1} /></div>
            {adjustType === 'deduct' && <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => setAdjustAmount(String(currentPoints))}>Set to Zero (deduct all {currentPoints.toLocaleString()} points)</Button>}
            <div className="space-y-2"><Label>Reason (required)</Label><Textarea value={adjustReason} onChange={(e) => setAdjustReason(e.target.value)} placeholder="e.g., Inactive for 3+ months, bonus correction, shift penalty" rows={3} /></div>
            {adjustAmount && (
              <div className="p-3 rounded-lg bg-muted/50 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Current Balance</span><span>{currentPoints.toLocaleString()} pts</span></div>
                <div className="flex justify-between mt-1"><span className="text-muted-foreground">{adjustType === 'add' ? 'Adding' : 'Deducting'}</span><span className={adjustType === 'add' ? 'text-success' : 'text-destructive'}>{adjustType === 'add' ? '+' : '-'}{parseInt(adjustAmount || '0').toLocaleString()} pts</span></div>
                <div className="flex justify-between mt-1 pt-1 border-t font-medium"><span>New Balance</span><span>{adjustType === 'add' ? (currentPoints + parseInt(adjustAmount || '0')).toLocaleString() : Math.max(0, currentPoints - parseInt(adjustAmount || '0')).toLocaleString()} pts</span></div>
              </div>
            )}
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowAdjustModal(false)}>Cancel</Button><Button onClick={handleAdjustPoints} variant={adjustType === 'deduct' ? 'destructive' : 'default'}>{adjustType === 'add' ? 'Add Points' : 'Deduct Points'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
