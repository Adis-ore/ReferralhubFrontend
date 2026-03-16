import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { StaffAuthProvider, useStaffAuth } from "./contexts/StaffAuthContext";
import { AdminLayout } from "./components/layout/AdminLayout";
import { StaffLayout } from "./components/staff/StaffLayout";

// Admin Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import UserDetail from "./pages/UserDetail";
import Referrals from "./pages/Referrals";
import Withdrawals from "./pages/Withdrawals";
import AuditLogs from "./pages/AuditLogs";
import Settings from "./pages/Settings";
import SuperAdminOverride from "./pages/SuperAdminOverride";
import AdminManagement from "./pages/AdminManagement";
import Reports from "./pages/Reports";
import PointsConfiguration from "./pages/PointsConfiguration";
import ShiftsHours from "./pages/ShiftsHours";
import ReferralPrograms from "./pages/ReferralPrograms";
import AdminNotifications from "./pages/AdminNotifications";
import ConnecteamSettings from "./pages/ConnecteamSettings";
import HoursImport from "./pages/HoursImport";
import ConnecteamLogs from "./pages/ConnecteamLogs";
import ReferralRegister from "./pages/ReferralRegister";
import NotFound from "./pages/NotFound";

// Staff Pages
import StaffLogin from "./pages/staff/StaffLogin";
import StaffHome from "./pages/staff/StaffHome";
import StaffReferrals from "./pages/staff/StaffReferrals";
import StaffPoints from "./pages/staff/StaffPoints";
import StaffWithdrawals from "./pages/staff/StaffWithdrawals";
import StaffHours from "./pages/staff/StaffHours";
import StaffNotifications from "./pages/staff/StaffNotifications";
import StaffProfile from "./pages/staff/StaffProfile";

const queryClient = new QueryClient();

function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function SuperAdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/superadmin/login" replace />;
  }

  if (user?.role !== 'super_admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function StaffProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useStaffAuth();

  if (!isAuthenticated) {
    return <Navigate to="/staff/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Landing - redirects based on auth */}
      <Route path="/" element={<Index />} />

      {/* Auth Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/superadmin/login" element={<SuperAdminLogin />} />

      {/* Admin Routes */}
      <Route path="/" element={
        <AdminProtectedRoute>
          <AdminLayout />
        </AdminProtectedRoute>
      }>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="users/:id" element={<UserDetail />} />
        <Route path="referrals" element={<Referrals />} />
        <Route path="referrals/register-new" element={<ReferralRegister />} />
        <Route path="shifts" element={<ShiftsHours />} />
        <Route path="programs" element={<ReferralPrograms />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="withdrawals" element={<Withdrawals />} />
        <Route path="points-config" element={<PointsConfiguration />} />
        <Route path="reports" element={<Reports />} />
        <Route path="audit" element={<AuditLogs />} />
        <Route path="settings" element={<Settings />} />
        <Route path="hours-import" element={<HoursImport />} />
        <Route path="connecteam-logs" element={<ConnecteamLogs />} />
        {/* Super Admin Only Routes */}
        <Route path="connecteam-settings" element={
          <SuperAdminProtectedRoute>
            <ConnecteamSettings />
          </SuperAdminProtectedRoute>
        } />
        <Route path="admin-management" element={
          <SuperAdminProtectedRoute>
            <AdminManagement />
          </SuperAdminProtectedRoute>
        } />
        <Route path="override" element={
          <SuperAdminProtectedRoute>
            <SuperAdminOverride />
          </SuperAdminProtectedRoute>
        } />
      </Route>

      {/* Staff Routes */}
      <Route path="/staff/login" element={<StaffLogin />} />
      <Route path="/staff" element={
        <StaffProtectedRoute>
          <StaffLayout />
        </StaffProtectedRoute>
      }>
        <Route index element={<StaffHome />} />
        <Route path="referrals" element={<StaffReferrals />} />
        <Route path="points" element={<StaffPoints />} />
        <Route path="withdrawals" element={<StaffWithdrawals />} />
        <Route path="hours" element={<StaffHours />} />
        <Route path="notifications" element={<StaffNotifications />} />
        <Route path="profile" element={<StaffProfile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <StaffAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </StaffAuthProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
