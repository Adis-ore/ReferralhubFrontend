import { FaBell as Bell, FaSearch as Search, FaQuestionCircle as HelpCircle } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function AdminHeader({ title, subtitle, action }: AdminHeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      {/* Main Header Content */}
      <div className="h-16 px-4 md:px-6 flex items-center justify-between">
        {/* Title Section - Responsive */}
        <div className="min-w-0 flex-1">
          <h1 className="text-lg md:text-xl font-semibold text-foreground truncate">{title}</h1>
          {subtitle && (
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block truncate">{subtitle}</p>
          )}
        </div>

        {/* Right Side Actions - Responsive */}
        <div className="flex items-center gap-2 md:gap-4 ml-4">
          {/* Search - Hidden on mobile, shown on desktop */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-48 xl:w-64 pl-9 bg-muted/30 border-0"
            />
          </div>

          {/* Search Icon - Shown on mobile */}
          <Button variant="ghost" size="icon" className="lg:hidden text-muted-foreground">
            <Search className="w-5 h-5" />
          </Button>

          {/* Help - Hidden on small mobile */}
          <Button variant="ghost" size="icon" className="hidden sm:flex text-muted-foreground">
            <HelpCircle className="w-5 h-5" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-muted-foreground">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-destructive">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 max-w-[calc(100vw-2rem)]">
              <DropdownMenuLabel className="flex items-center justify-between">
                Notifications
                <Button variant="ghost" size="sm" className="text-xs text-accent">
                  Mark all read
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[60vh] overflow-y-auto">
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span className="font-medium text-sm">New withdrawal request</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-4">
                    John Doe requested a withdrawal of 500 points
                  </p>
                  <span className="text-xs text-muted-foreground ml-4">2 min ago</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-warning" />
                    <span className="font-medium text-sm">Sync completed</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-4">
                    External rostering sync completed with 3 warnings
                  </p>
                  <span className="text-xs text-muted-foreground ml-4">15 min ago</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span className="font-medium text-sm">Campaign activated</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-4">
                    Summer Referral Bonus campaign is now live
                  </p>
                  <span className="text-xs text-muted-foreground ml-4">1 hour ago</span>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-sm text-accent">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Custom Action - If provided */}
          {action && <div className="hidden md:block">{action}</div>}
        </div>
      </div>

      {/* Mobile Action Row - Shown only on mobile if action exists */}
      {action && (
        <div className="md:hidden px-4 pb-3">
          {action}
        </div>
      )}
    </header>
  );
}
