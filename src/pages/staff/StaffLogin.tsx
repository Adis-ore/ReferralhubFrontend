import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStaffAuth } from '@/contexts/StaffAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FaGift, FaEye, FaEyeSlash, FaCircleNotch, FaStar } from 'react-icons/fa';

export default function StaffLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useStaffAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/staff');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-staff-bg flex flex-col">
      {/* Header Illustration */}
      <div className="bg-staff-gradient pt-12 pb-24 px-6 text-center text-white">
        <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
          <FaGift className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold mb-2">ReferralHub</h1>
        <p className="text-white/80">Earn rewards for every referral</p>
      </div>

      {/* Login Card */}
      <div className="flex-1 -mt-12 px-6">
        <div className="bg-card rounded-2xl shadow-xl p-6 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-foreground text-center mb-6">
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  className="text-sm text-staff-primary hover:underline"
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
                  className="h-12 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-staff-gradient hover:opacity-90 text-white text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FaCircleNotch className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 rounded-xl bg-staff-primary/5 border border-staff-primary/20">
            <div className="flex items-center gap-2 text-staff-primary mb-2">
              <FaStar className="w-4 h-4" />
              <span className="text-sm font-medium">Demo Mode</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Enter any email and password to explore the staff dashboard.
            </p>
          </div>
        </div>

        {/* Admin Link */}
        <div className="text-center mt-8 pb-8">
          <p className="text-sm text-muted-foreground">
            Are you an admin?{' '}
            <a href="/login" className="text-staff-primary font-medium hover:underline">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
