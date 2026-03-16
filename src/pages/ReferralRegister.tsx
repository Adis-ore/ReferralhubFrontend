import { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import {
  FaUserPlus,
  FaSearch,
  FaCheckCircle,
  FaCopy,
  FaPrint,
  FaSpinner,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBriefcase,
  FaBarcode,
  FaTimes,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { referralsApi } from '@/services/api';
import { toast } from 'sonner';

const CLASSIFICATIONS = [
  'Security Officer',
  'Security Coordinator',
  'Patrol Officer',
  'Staff',
  'Registered Nurse',
  'Care Worker',
  'Support Worker',
  'Admin Staff',
  'Driver',
];

interface FieldError {
  refereeName?: string;
  refereeEmail?: string;
  refereePhone?: string;
  classification?: string;
}

export default function ReferralRegister() {
  // Form state
  const [refereeName, setRefereeName]       = useState('');
  const [refereeEmail, setRefereeEmail]     = useState('');
  const [refereePhone, setRefereePhone]     = useState('');
  const [classification, setClassification] = useState('');
  const [errors, setErrors]                 = useState<FieldError>({});
  const [touched, setTouched]               = useState<Record<string, boolean>>({});

  // Referrer state
  const [referrerCode, setReferrerCode]         = useState('');
  const [referrerSearch, setReferrerSearch]     = useState('');
  const [searchResults, setSearchResults]       = useState<any[]>([]);
  const [selectedReferrer, setSelectedReferrer] = useState<any | null>(null);
  const [codeNotFound, setCodeNotFound]         = useState(false);
  const [searchLoading, setSearchLoading]       = useState(false);

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [credentials, setCredentials] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  // ── Referral code lookup ────────────────────────────────────────────────────
  useEffect(() => {
    if (referrerCode.trim().length < 3) { setCodeNotFound(false); return; }
    const timer = setTimeout(async () => {
      try {
        const results = await referralsApi.searchReferrers({ code: referrerCode.trim().toUpperCase() });
        const list = Array.isArray(results) ? results : [];
        if (list.length > 0) {
          setSelectedReferrer(list[0]);
          setCodeNotFound(false);
          setReferrerSearch('');
          setSearchResults([]);
        } else {
          setCodeNotFound(true);
          setSelectedReferrer(null);
        }
      } catch { setCodeNotFound(true); }
    }, 450);
    return () => clearTimeout(timer);
  }, [referrerCode]);

  // ── Name / phone search ─────────────────────────────────────────────────────
  useEffect(() => {
    if (referrerSearch.trim().length < 2) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const results = await referralsApi.searchReferrers({ q: referrerSearch.trim() });
        setSearchResults(Array.isArray(results) ? results : []);
      } catch { setSearchResults([]); }
      finally { setSearchLoading(false); }
    }, 350);
    return () => clearTimeout(timer);
  }, [referrerSearch]);

  const selectReferrer = (u: any) => {
    setSelectedReferrer(u);
    setReferrerCode(u.referralCode);
    setReferrerSearch('');
    setSearchResults([]);
    setCodeNotFound(false);
  };

  const clearReferrer = () => {
    setSelectedReferrer(null);
    setReferrerCode('');
    setReferrerSearch('');
    setSearchResults([]);
    setCodeNotFound(false);
  };

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = (): FieldError => {
    const errs: FieldError = {};
    if (!refereeName.trim()) errs.refereeName = 'Full name is required';
    if (!refereeEmail.trim()) {
      errs.refereeEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(refereeEmail)) {
      errs.refereeEmail = 'Enter a valid email address';
    }
    if (!refereePhone.trim()) {
      errs.refereePhone = 'Phone number is required';
    } else if (!/^\+?\d[\d\s\-]{7,}$/.test(refereePhone)) {
      errs.refereePhone = 'Enter a valid phone number';
    }
    if (!classification) errs.classification = 'Select a job classification';
    return errs;
  };

  const handleBlur = (field: keyof FieldError) => {
    setTouched((p) => ({ ...p, [field]: true }));
    setErrors(validate());
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setTouched({ refereeName: true, refereeEmail: true, refereePhone: true, classification: true });
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const payload: Record<string, any> = {
        refereeName: refereeName.trim(),
        refereeEmail: refereeEmail.trim().toLowerCase(),
        refereePhone: refereePhone.trim(),
        classification,
      };
      if (selectedReferrer) payload.referrerId = selectedReferrer.id;

      const result = await referralsApi.register(payload);
      setCredentials(result);
      setShowModal(true);
      toast.success('Referee registered successfully');

      setRefereeName(''); setRefereeEmail(''); setRefereePhone(''); setClassification('');
      clearReferrer();
      setTouched({}); setErrors({});
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = () => {
    if (!credentials) return;
    const text = [
      'ReferralHub Staff Login Credentials',
      `Email:         ${credentials.credentials.email}`,
      `Password:      ${credentials.credentials.password}`,
      `Referral Code: ${credentials.credentials.referralCode}`,
      '',
      `Login at: ${window.location.origin}/staff/login`,
    ].join('\n');
    navigator.clipboard.writeText(text);
    toast.success('Credentials copied to clipboard');
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      <AdminHeader title="Register New Referee" subtitle="Create a staff account and link them to their referrer" />

      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
        <form onSubmit={handleSubmit} noValidate>

          {/* ── New Staff Details ──────────────────────────────────────── */}
          <div className="audit-card mb-6">
            <div className="audit-card-header">
              <div className="flex items-center gap-2">
                <FaUser className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm">New Staff Details</h3>
              </div>
            </div>
            <div className="audit-card-body space-y-4">

              <div className="space-y-1.5">
                <Label htmlFor="refereeName">Full Name <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    id="refereeName" value={refereeName}
                    onChange={(e) => setRefereeName(e.target.value)}
                    onBlur={() => handleBlur('refereeName')}
                    placeholder="e.g. John Doe"
                    className={`pl-9 ${touched.refereeName && errors.refereeName ? 'border-destructive' : ''}`}
                  />
                </div>
                {touched.refereeName && errors.refereeName && <p className="text-xs text-destructive">{errors.refereeName}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="refereeEmail">Email Address <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    id="refereeEmail" type="email" value={refereeEmail}
                    onChange={(e) => setRefereeEmail(e.target.value)}
                    onBlur={() => handleBlur('refereeEmail')}
                    placeholder="john.doe@example.com"
                    className={`pl-9 ${touched.refereeEmail && errors.refereeEmail ? 'border-destructive' : ''}`}
                  />
                </div>
                {touched.refereeEmail && errors.refereeEmail && <p className="text-xs text-destructive">{errors.refereeEmail}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="refereePhone">Phone Number <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    id="refereePhone" value={refereePhone}
                    onChange={(e) => setRefereePhone(e.target.value)}
                    onBlur={() => handleBlur('refereePhone')}
                    placeholder="+234 803 123 4567"
                    className={`pl-9 ${touched.refereePhone && errors.refereePhone ? 'border-destructive' : ''}`}
                  />
                </div>
                {touched.refereePhone && errors.refereePhone && <p className="text-xs text-destructive">{errors.refereePhone}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="classification">Job Classification <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <FaBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  <select
                    id="classification" value={classification}
                    onChange={(e) => setClassification(e.target.value)}
                    onBlur={() => handleBlur('classification')}
                    className={`w-full pl-9 pr-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                      touched.classification && errors.classification ? 'border-destructive' : 'border-input'
                    }`}
                  >
                    <option value="">Select classification...</option>
                    {CLASSIFICATIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                {touched.classification && errors.classification && <p className="text-xs text-destructive">{errors.classification}</p>}
              </div>

            </div>
          </div>

          {/* ── Referrer (optional) ────────────────────────────────────── */}
          <div className="audit-card mb-6">
            <div className="audit-card-header">
              <div className="flex items-center gap-2">
                <FaBarcode className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm">Referrer</h3>
                <span className="text-xs text-muted-foreground">— optional</span>
              </div>
            </div>
            <div className="audit-card-body space-y-4">

              {/* Selected referrer pill — shown when one is chosen */}
              {selectedReferrer ? (
                <div className="flex items-start justify-between p-3 rounded-lg bg-success/10 border border-success/20">
                  <div className="flex items-center gap-3">
                    <FaCheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">{selectedReferrer.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedReferrer.email}</p>
                      <p className="text-xs text-muted-foreground">{selectedReferrer.classification} &bull; code: <span className="font-mono">{selectedReferrer.referralCode}</span></p>
                    </div>
                  </div>
                  <button type="button" onClick={clearReferrer} className="text-muted-foreground hover:text-foreground p-1">
                    <FaTimes className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  {/* Code input */}
                  <div className="space-y-1.5">
                    <Label htmlFor="referrerCode">Referral Code</Label>
                    <div className="relative">
                      <FaBarcode className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <Input
                        id="referrerCode"
                        value={referrerCode}
                        onChange={(e) => { setReferrerCode(e.target.value.toUpperCase()); setCodeNotFound(false); }}
                        placeholder="e.g. REFST51"
                        className="pl-9 font-mono uppercase"
                      />
                    </div>
                    {codeNotFound && referrerCode.length >= 3 && (
                      <p className="text-xs text-destructive">No staff member found with that code</p>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="h-px flex-1 bg-border" />
                    <span>or search by name / phone</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  {/* Name/phone search */}
                  <div className="space-y-1.5">
                    <Label htmlFor="referrerSearch">Search Staff</Label>
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <Input
                        id="referrerSearch"
                        value={referrerSearch}
                        onChange={(e) => setReferrerSearch(e.target.value)}
                        placeholder="Type a name or phone number..."
                        className="pl-9"
                        autoComplete="off"
                      />
                      {searchLoading && (
                        <FaSpinner className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 animate-spin text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Inline search results — no absolute positioning */}
                  {searchResults.length > 0 && (
                    <div className="rounded-lg border border-border overflow-hidden">
                      <p className="text-xs text-muted-foreground px-3 py-2 bg-muted/30 border-b">
                        {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} — click to select
                      </p>
                      {searchResults.map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => selectReferrer(u)}
                          className="w-full text-left px-4 py-3 hover:bg-accent/50 active:bg-accent transition-colors border-b last:border-0 flex items-center justify-between group"
                        >
                          <div>
                            <p className="text-sm font-medium group-hover:text-primary">{u.name}</p>
                            <p className="text-xs text-muted-foreground">{u.email} &bull; {u.classification}</p>
                          </div>
                          <span className="text-xs font-mono text-muted-foreground">{u.referralCode}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {referrerSearch.length >= 2 && !searchLoading && searchResults.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-2">No staff found matching "{referrerSearch}"</p>
                  )}
                </>
              )}

            </div>
          </div>

          <Button type="submit" className="w-full gap-2" disabled={submitting} size="lg">
            {submitting
              ? <><FaSpinner className="w-4 h-4 animate-spin" /> Registering...</>
              : <><FaUserPlus className="w-4 h-4" /> Register Referee</>
            }
          </Button>

        </form>
      </div>

      {/* ── Credentials Modal ───────────────────────────────────────── */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FaCheckCircle className="w-5 h-5 text-success" />
              Registered Successfully
            </DialogTitle>
            <DialogDescription>
              {credentials?.referral
                ? `${credentials.credentials.email} registered under ${credentials.referral.referrerName}.`
                : `${credentials?.credentials?.email} has been registered.`}
            </DialogDescription>
          </DialogHeader>

          {credentials && (
            <div className="space-y-4 py-2">
              {/* Credentials box */}
              <div className="p-4 rounded-lg bg-muted/50 border space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Staff Login Credentials</p>
                <div className="space-y-2 font-mono text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground text-xs">Email</span>
                    <span className="font-medium truncate">{credentials.credentials.email}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground text-xs">Password</span>
                    <span className="font-bold text-primary tracking-wider">{credentials.credentials.password}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground text-xs">Referral Code</span>
                    <span className="font-semibold">{credentials.credentials.referralCode}</span>
                  </div>
                </div>
              </div>

              {/* Staff login instruction */}
              <div className="p-3 rounded-lg bg-info/10 border border-info/20 text-xs">
                <p className="font-semibold mb-1">Give these to the new staff member.</p>
                <p className="text-muted-foreground">They log in at <span className="font-mono font-medium">/staff/login</span> using this email and password right away.</p>
              </div>

              {/* Connecteam note */}
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20 text-xs flex gap-2">
                <FaExclamationTriangle className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-warning mb-0.5">Connecteam account — manual step required</p>
                  <p className="text-muted-foreground">
                    Connecteam does not allow account creation via API yet. You need to manually invite{' '}
                    <span className="font-medium">{credentials.credentials.email}</span> in your Connecteam dashboard so their shifts sync automatically.
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => window.print()} className="gap-2">
              <FaPrint className="w-3.5 h-3.5" /> Print
            </Button>
            <Button onClick={handleCopy} className="gap-2">
              <FaCopy className="w-3.5 h-3.5" /> Copy Credentials
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
