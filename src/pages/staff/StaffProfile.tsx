import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStaffAuth } from '@/contexts/StaffAuthContext';
import { connecteamApi } from '@/services/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaCalendar,
  FaGift,
  FaChevronRight,
  FaQuestionCircle,
  FaFileAlt,
  FaCommentDots,
  FaSignOutAlt,
  FaShieldAlt,
  FaUniversity,
  FaEdit,
  FaCheck,
  FaTimes,
  FaCamera,
  FaClock,
  FaDollarSign,
} from 'react-icons/fa';
import { toast } from 'sonner';
import { SkeletonProfile } from '@/components/ui/skeletons';
const shiftTypeColors: Record<string, string> = {
  regular: 'bg-muted text-muted-foreground',
  overtime: 'bg-warning/10 text-warning',
  weekend: 'bg-info/10 text-info',
  public_holiday: 'bg-destructive/10 text-destructive',
};
const shiftTypeLabels: Record<string, string> = {
  regular: 'Regular', overtime: 'Overtime', weekend: 'Weekend', public_holiday: 'Public Holiday',
};

const faqs = [
  { question: 'How do I earn referral points?', answer: 'You earn 500 points for each successful referral when the person you referred completes 120 working hours. Points are automatically credited to your account once verified.' },
  { question: 'How long does it take to get paid?', answer: 'Withdrawal requests are processed within 3-5 business days. Once approved, the amount will be deposited to your registered bank account.' },
  { question: 'What is the minimum withdrawal amount?', answer: 'The minimum withdrawal amount is 100 points.' },
  { question: 'Why are my points showing as pending?', answer: 'Points remain pending until your referral completes the required working hours (usually 120 hours) and passes the probation verification. Once verified, they become available for withdrawal.' },
  { question: 'Can I refer someone from a different location?', answer: 'Yes! You can refer anyone to any of our locations. Points are earned regardless of which location your referral works at.' },
  { question: 'How are my working hours calculated?', answer: 'Hours are automatically synced from our rostering system. Only approved and verified shifts count toward the referral requirements.' },
];

const referralRules = [
  'Referral must be a new hire (not previously employed)',
  'Referred person must complete 120 hours of work',
  'Both parties must be active employees at time of payout',
  'Points expire after 12 months if not withdrawn',
  'Maximum 10 referrals per calendar year',
];

export default function StaffProfile() {
  const { user, logout } = useStaffAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingBank, setEditingBank] = useState(false);
  const [bankName, setBankName] = useState('GTBank');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState(user?.name || '');
  const [hasBankAccount, setHasBankAccount] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [myHours, setMyHours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    connecteamApi.getHours({ userId: user.id, limit: 5 }).then(({ data }: any) => setMyHours(data || [])).catch(() => {}).finally(() => setLoading(false));
  }, [user?.id]);

  const handleLogout = () => {
    logout();
    navigate('/staff/login');
  };

  const handleSaveBank = () => {
    if (!bankName || !accountNumber || !accountName) {
      toast.error('All bank fields are required');
      return;
    }
    if (accountNumber.length < 10) {
      toast.error('Account number must be at least 10 digits');
      return;
    }
    setEditingBank(false);
    setHasBankAccount(true);
    toast.success('Bank account updated successfully');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      toast.error('Only JPG, JPEG, and PNG files are allowed');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarPreview(event.target?.result as string);
      toast.success('Profile picture updated');
    };
    reader.readAsDataURL(file);
  };

  if (loading) return <div className="px-4 py-6"><SkeletonProfile /></div>;

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Profile Card */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <Avatar className="h-16 w-16">
              {avatarPreview && <AvatarImage src={avatarPreview} />}
              <AvatarFallback className="bg-staff-primary/10 text-staff-primary text-xl">
                {user?.name?.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-staff-primary text-white flex items-center justify-center border-2 border-card"
            >
              <FaCamera className="w-3 h-3" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{user?.name}</h2>
            <p className="text-muted-foreground">{user?.classification}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <FaEnvelope className="w-4 h-4 text-muted-foreground" />
            <span>{user?.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <FaMapMarkerAlt className="w-4 h-4 text-muted-foreground" />
            <span>{user?.location}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <FaCalendar className="w-4 h-4 text-muted-foreground" />
            <span>Joined {user?.joinedDate}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <FaGift className="w-4 h-4 text-muted-foreground" />
            <span>Referral Code: <strong className="font-mono">{user?.referralCode}</strong></span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <FaDollarSign className="w-4 h-4 text-muted-foreground" />
            <span>Hourly Rate: <strong>${(user as any)?.hourlyRate ?? 25}/hr</strong></span>
          </div>
        </div>
      </div>

      {/* My Work Hours */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <FaClock className="w-5 h-5 text-staff-primary" />
          <h3 className="font-semibold">My Recent Work Hours</h3>
        </div>
        <div className="divide-y divide-border">
          {myHours.length === 0 ? (
            <div className="p-8 text-center">
              <FaClock className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No work hours recorded yet</p>
            </div>
          ) : (
            myHours.map((h) => (
              <div key={h.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{h.shiftDate}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${shiftTypeColors[h.shiftType]}`}>{shiftTypeLabels[h.shiftType]}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{h.clockIn} - {h.clockOut} &bull; {h.hoursWorked}h</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-warning">{h.pointsToAward.toLocaleString()} pts</p>
                  <p className={`text-xs font-medium ${h.status === 'approved' ? 'text-success' : h.status === 'rejected' ? 'text-destructive' : 'text-muted-foreground'}`}>{h.status}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bank Account Details */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaUniversity className="w-5 h-5 text-staff-primary" />
            <h3 className="font-semibold">Bank Account Details</h3>
          </div>
          {hasBankAccount && !editingBank && (
            <Button variant="ghost" size="sm" onClick={() => setEditingBank(true)}>
              <FaEdit className="w-3.5 h-3.5 mr-1.5" />
              Edit
            </Button>
          )}
        </div>
        <div className="p-4">
          {!hasBankAccount && !editingBank ? (
            <div className="text-center py-4">
              <FaUniversity className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-3">
                No bank account added yet. Add your bank details to receive withdrawals.
              </p>
              <Button
                onClick={() => { setEditingBank(true); setBankName(''); setAccountNumber(''); setAccountName(user?.name || ''); }}
                className="bg-staff-gradient text-white"
                size="sm"
              >
                Add Bank Account
              </Button>
            </div>
          ) : editingBank ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bank-name" className="text-sm">Bank Name</Label>
                <Input id="bank-name" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g., GTBank, Access Bank" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="acc-number" className="text-sm">Account Number</Label>
                <Input id="acc-number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))} placeholder="Enter 10-digit account number" maxLength={10} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="acc-name" className="text-sm">Account Name</Label>
                <Input id="acc-name" value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="Account holder name" />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveBank} className="flex-1 bg-staff-gradient text-white" size="sm">
                  <FaCheck className="w-3.5 h-3.5 mr-1.5" />
                  Save
                </Button>
                <Button variant="outline" onClick={() => setEditingBank(false)} className="flex-1" size="sm">
                  <FaTimes className="w-3.5 h-3.5 mr-1.5" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bank Name</span>
                <span className="font-medium">{bankName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Account Number</span>
                <span className="font-mono font-medium">{accountNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Account Name</span>
                <span className="font-medium">{accountName}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Referral Rules */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <FaShieldAlt className="w-5 h-5 text-staff-primary" />
          <h3 className="font-semibold">Referral Program Rules</h3>
        </div>
        <div className="p-4">
          <ul className="space-y-3">
            {referralRules.map((rule, index) => (
              <li key={index} className="flex items-start gap-3 text-sm">
                <span className="w-5 h-5 rounded-full bg-staff-primary/10 text-staff-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-muted-foreground">{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <FaQuestionCircle className="w-5 h-5 text-staff-primary" />
          <h3 className="font-semibold">Frequently Asked Questions</h3>
        </div>
        <Accordion type="single" collapsible className="px-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-sm text-left hover:no-underline">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Help Links */}
      <div className="space-y-3">
        <button className="w-full bg-card rounded-xl p-4 border border-border flex items-center justify-between hover:border-muted-foreground/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
              <FaCommentDots className="w-5 h-5 text-info" />
            </div>
            <div className="text-left">
              <p className="font-medium">Contact Support</p>
              <p className="text-sm text-muted-foreground">Get help with your account</p>
            </div>
          </div>
          <FaChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
        <button className="w-full bg-card rounded-xl p-4 border border-border flex items-center justify-between hover:border-muted-foreground/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <FaFileAlt className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-left">
              <p className="font-medium">Terms & Conditions</p>
              <p className="text-sm text-muted-foreground">Read full program terms</p>
            </div>
          </div>
          <FaChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <Button variant="outline" className="w-full h-12 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5" onClick={handleLogout}>
        <FaSignOutAlt className="w-5 h-5 mr-2" />
        Sign Out
      </Button>

      <p className="text-center text-xs text-muted-foreground">ReferralHub Staff v1.0.0</p>
    </div>
  );
}
