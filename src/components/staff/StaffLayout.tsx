import { Outlet } from 'react-router-dom';
import { StaffHeader } from './StaffHeader';
import { StaffBottomNav } from './StaffBottomNav';

export function StaffLayout() {
  return (
    <div className="min-h-screen bg-staff-bg pb-20 md:pb-0">
      <StaffHeader />
      <main className="max-w-2xl mx-auto">
        <Outlet />
      </main>
      <StaffBottomNav />
    </div>
  );
}
