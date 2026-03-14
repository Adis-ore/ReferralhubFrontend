import { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaHome as Home, FaUsers as Users, FaCoins as Coins, FaCreditCard as CreditCard, FaClock as Clock, FaBell as Bell, FaUser as User, FaGift as Gift, FaSignOutAlt as LogOut, FaBars as Menu } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { useStaffAuth } from '@/contexts/StaffAuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
  { href: '/staff', icon: Home, label: 'Home', exact: true },
  { href: '/staff/referrals', icon: Users, label: 'My Referrals' },
  { href: '/staff/points', icon: Coins, label: 'My Points' },
  { href: '/staff/withdrawals', icon: CreditCard, label: 'Withdrawals' },
  { href: '/staff/hours', icon: Clock, label: 'Hours Summary' },
  { href: '/staff/notifications', icon: Bell, label: 'Notifications' },
  { href: '/staff/profile', icon: User, label: 'Profile & Help' },
];

export function StaffHeader() {
  const { user, logout } = useStaffAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-staff-gradient text-white">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 bg-card">
            <div className="p-6 bg-staff-gradient text-white">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-white/30">
                  <AvatarFallback className="bg-white/20 text-white">
                    {user?.name?.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-sm text-white/70">{user?.classification}</p>
                </div>
              </div>
            </div>
            <nav className="p-4">
              {navItems.map((item) => {
                const isActive = item.exact 
                  ? location.pathname === item.href
                  : location.pathname.startsWith(item.href);
                
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-1',
                      isActive
                        ? 'bg-staff-primary/10 text-staff-primary font-medium'
                        : 'text-foreground hover:bg-muted'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
              <button
                onClick={logout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/5 w-full mt-4"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Gift className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg hidden md:block">ReferralHub</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.slice(0, 5).map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.href
              : location.pathname.startsWith(item.href);
            
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-white/20'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                )}
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <NavLink to="/staff/notifications" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-staff-primary text-[10px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </NavLink>
          <NavLink to="/staff/profile" className="hidden md:block">
            <Avatar className="h-8 w-8 border-2 border-white/30">
              <AvatarFallback className="bg-white/20 text-white text-sm">
                {user?.name?.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </NavLink>
        </div>
      </div>
    </header>
  );
}
