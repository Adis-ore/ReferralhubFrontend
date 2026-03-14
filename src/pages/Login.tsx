import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FaBolt, FaEye, FaEyeSlash, FaCircleNotch, FaShieldAlt } from 'react-icons/fa';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
              <FaBolt className="w-7 h-7 text-accent-foreground" />
            </div>
            <span className="font-bold text-3xl text-primary-foreground">ReferralHub</span>
          </div>
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">
            Staff Referral Bonuses
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-md">
            Manage your entire referral program from one powerful admin dashboard. Track referrals, hours, points, and payouts with enterprise-grade security.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-6">
            <div className="bg-primary-foreground/10 rounded-lg p-4">
              <p className="text-3xl font-bold text-primary-foreground">2,847</p>
              <p className="text-primary-foreground/70">Active Users</p>
            </div>
            <div className="bg-primary-foreground/10 rounded-lg p-4">
              <p className="text-3xl font-bold text-primary-foreground">$89K+</p>
              <p className="text-primary-foreground/70">Paid Out</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <FaBolt className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl text-foreground">ReferralHub</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground mt-2">
              Sign in to your admin account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  className="text-sm text-accent hover:text-accent/80 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 pr-10"
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

            <Button type="submit" className="w-full h-11 bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
              {isLoading ? (
                <>
                  <FaCircleNotch className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs font-medium text-muted-foreground mb-2">Demo Credentials:</p>
            <div className="space-y-1 font-mono text-xs text-muted-foreground">
              <p>Admin: <span className="text-foreground">admin@company.com</span> / <span className="text-foreground">admin123</span></p>
              <p>Manager: <span className="text-foreground">manager@company.com</span> / <span className="text-foreground">manager123</span></p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
            <Link
              to="/superadmin/login"
              className="flex items-center gap-1.5 text-red-500 hover:text-red-600 transition-colors font-medium"
            >
              <FaShieldAlt className="w-3.5 h-3.5" />
              Super Admin Login
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
