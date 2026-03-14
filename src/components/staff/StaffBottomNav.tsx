import { NavLink, useLocation } from 'react-router-dom';
import { FaHome as Home, FaUsers as Users, FaCoins as Coins, FaCreditCard as CreditCard, FaClock as Clock, FaBell as Bell, FaUser as User } from 'react-icons/fa';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/staff', icon: Home, label: 'Home' },
  { href: '/staff/referrals', icon: Users, label: 'Referrals' },
  { href: '/staff/points', icon: Coins, label: 'Points' },
  { href: '/staff/withdrawals', icon: CreditCard, label: 'Withdraw' },
  { href: '/staff/profile', icon: User, label: 'Profile' },
];

export function StaffBottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden">
      <div className="flex items-center justify-around py-2 px-4 safe-area-inset-bottom">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== '/staff' && location.pathname.startsWith(item.href));
          
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors',
                isActive
                  ? 'text-staff-primary'
                  : 'text-muted-foreground'
              )}
            >
              <item.icon className={cn('w-5 h-5', isActive && 'stroke-[2.5]')} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
