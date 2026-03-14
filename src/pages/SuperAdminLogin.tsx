import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
  FaCircleNotch,
  FaLock,
  FaExclamationTriangle,
  FaFingerprint,
  FaUserShield,
  FaServer,
  FaHistory,
} from 'react-icons/fa';

export default function SuperAdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in as super_admin, redirect
  if (isAuthenticated && user?.role === 'super_admin') {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials.');
      setIsLoading(false);
      return;
    }

    // Check if logged in user is super_admin after login
    const stored = localStorage.getItem('admin_user');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.role !== 'super_admin') {
        // Not a super admin - clear auth and show error
        localStorage.removeItem('admin_user');
        localStorage.removeItem('admin_token');
        setError('Access denied. This login is restricted to Super Administrators only.');
        setIsLoading(false);
        // Force re-render by reloading
        window.location.reload();
        return;
      }
    }

    setIsLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Security Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-96 h-96 bg-red-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500 rounded-full blur-3xl" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 w-full">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-14 h-14 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
              <FaShieldAlt className="w-7 h-7 text-red-400" />
            </div>
            <div>
              <span className="font-bold text-2xl text-white">ReferralHub</span>
              <p className="text-xs text-red-400 font-mono tracking-wider">SUPER ADMIN ACCESS</p>
            </div>
          </div>

          <h1 className="text-3xl xl:text-4xl font-bold text-white mb-4">
            Restricted Access Portal
          </h1>
          <p className="text-lg text-slate-400 max-w-md mb-10">
            This is a high-security area. Only authorized Super Administrators can access the system override controls.
          </p>

          {/* Security features */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
              <FaFingerprint className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">Credential Verification</p>
                <p className="text-xs text-slate-400">Multi-layer authentication required</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
              <FaHistory className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">Full Audit Trail</p>
                <p className="text-xs text-slate-400">All actions permanently logged</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
              <FaServer className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">System Override Controls</p>
                <p className="text-xs text-slate-400">Direct access to break-glass operations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-background min-h-screen lg:min-h-0">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-red-500/10 border-2 border-red-500/20 flex items-center justify-center mb-4">
              <FaShieldAlt className="w-8 h-8 text-red-500" />
            </div>
            <span className="font-bold text-2xl text-foreground">ReferralHub</span>
            <p className="text-xs text-red-500 font-mono tracking-wider mt-1">SUPER ADMIN ACCESS</p>
          </div>

          {/* Warning Banner */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/5 border border-red-500/20 mb-6">
            <FaExclamationTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400">Restricted Area</p>
              <p className="text-xs text-muted-foreground mt-1">
                Unauthorized access attempts are logged and reported. Only Super Admin credentials are accepted.
              </p>
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Super Admin Sign In</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Enter your Super Administrator credentials
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                <FaExclamationTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="sa-email" className="flex items-center gap-2">
                <FaUserShield className="w-3.5 h-3.5 text-muted-foreground" />
                Admin Email
              </Label>
              <Input
                id="sa-email"
                type="email"
                placeholder="admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sa-password" className="flex items-center gap-2">
                <FaLock className="w-3.5 h-3.5 text-muted-foreground" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="sa-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-red-600 hover:bg-red-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FaCircleNotch className="w-4 h-4 mr-2 animate-spin" />
                  Verifying credentials...
                </>
              ) : (
                <>
                  <FaShieldAlt className="w-4 h-4 mr-2" />
                  Access Super Admin Panel
                </>
              )}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs font-medium text-muted-foreground mb-2">Demo Credentials:</p>
            <div className="space-y-1 font-mono text-xs text-muted-foreground">
              <p>Email: <span className="text-foreground">admin@company.com</span></p>
              <p>Password: <span className="text-foreground">admin123</span></p>
            </div>
          </div>

          {/* Links */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
            <Link
              to="/login"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Regular Admin Login
            </Link>
            <span className="hidden sm:inline text-muted-foreground">|</span>
            <Link
              to="/staff/login"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Staff Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
