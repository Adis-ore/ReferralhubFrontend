import { useState } from 'react';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/ui/status-badge';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilterBar } from '@/components/ui/filter-bar';
import {
  FaUserShield,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaSearch,
  FaShieldAlt,
  FaEye,
  FaUsers,
  FaCreditCard,
  FaCoins,
  FaDownload,
  FaChartBar,
  FaFileAlt,
} from 'react-icons/fa';
import { useAuth, roleLabels, roleStyles, UserRole } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface Permission {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const allPermissions: Permission[] = [
  { id: 'view_users', label: 'View Users', description: 'Access user list and profiles', icon: FaEye },
  { id: 'edit_users', label: 'Edit Users', description: 'Modify user details and status', icon: FaUsers },
  { id: 'approve_withdrawals', label: 'Approve Withdrawals', description: 'Approve or reject withdrawal requests', icon: FaCreditCard },
  { id: 'adjust_points', label: 'Adjust Points', description: 'Manually add or deduct user points', icon: FaCoins },
  { id: 'export_data', label: 'Export Data', description: 'Download CSV, PDF, and ABA exports', icon: FaDownload },
  { id: 'access_reports', label: 'Access Reports', description: 'View analytics and reports', icon: FaChartBar },
  { id: 'delete_users', label: 'Delete Users', description: 'Permanently remove user accounts', icon: FaTrash },
  { id: 'view_audit_logs', label: 'View Audit Logs', description: 'Access system audit trail', icon: FaFileAlt },
];

const rolePermissionDefaults: Record<string, string[]> = {
  super_admin: allPermissions.map(p => p.id),
  finance_admin: ['view_users', 'approve_withdrawals', 'adjust_points', 'export_data', 'access_reports'],
  operations_admin: ['view_users', 'edit_users', 'access_reports', 'view_audit_logs'],
  manager: ['view_users', 'access_reports'],
  read_only: ['view_users'],
};

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
  status: 'active' | 'suspended';
  lastLogin: string;
  createdDate: string;
}

const mockAdmins: AdminUser[] = [
  {
    id: 'admin-1',
    name: 'Sarah Chen',
    email: 'admin@company.com',
    role: 'super_admin',
    permissions: allPermissions.map(p => p.id),
    status: 'active',
    lastLogin: '2024-06-15 09:30',
    createdDate: '2023-01-15',
  },
  {
    id: 'admin-2',
    name: 'Michael Torres',
    email: 'michael.torres@company.com',
    role: 'finance_admin',
    permissions: ['view_users', 'approve_withdrawals', 'adjust_points', 'export_data', 'access_reports'],
    status: 'active',
    lastLogin: '2024-06-14 14:20',
    createdDate: '2023-03-20',
  },
  {
    id: 'admin-3',
    name: 'Emma Williams',
    email: 'emma.williams@company.com',
    role: 'operations_admin',
    permissions: ['view_users', 'edit_users', 'access_reports', 'view_audit_logs'],
    status: 'active',
    lastLogin: '2024-06-13 11:45',
    createdDate: '2023-06-10',
  },
  {
    id: 'admin-4',
    name: 'David Park',
    email: 'david.park@company.com',
    role: 'manager',
    permissions: ['view_users', 'access_reports'],
    status: 'active',
    lastLogin: '2024-06-12 16:00',
    createdDate: '2024-01-05',
  },
  {
    id: 'admin-5',
    name: 'Rachel Adams',
    email: 'rachel.adams@company.com',
    role: 'read_only',
    permissions: ['view_users'],
    status: 'suspended',
    lastLogin: '2024-05-20 08:15',
    createdDate: '2024-02-15',
  },
];

export default function AdminManagement() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>(mockAdmins);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);

  // Edit form state
  const [editRole, setEditRole] = useState<UserRole>('read_only');
  const [editPermissions, setEditPermissions] = useState<string[]>([]);

  // Add form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('read_only');
  const [newPermissions, setNewPermissions] = useState<string[]>(['view_users']);

  const isSuperAdmin = user?.role === 'super_admin';

  const filteredAdmins = admins.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || a.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleEditAdmin = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setEditRole(admin.role);
    setEditPermissions([...admin.permissions]);
    setShowEditSheet(true);
  };

  const handleSaveEdit = () => {
    if (!selectedAdmin) return;
    setAdmins(prev => prev.map(a =>
      a.id === selectedAdmin.id
        ? { ...a, role: editRole, permissions: editPermissions }
        : a
    ));
    setShowEditSheet(false);
    setSelectedAdmin(null);
  };

  const handleAddAdmin = () => {
    if (!newName || !newEmail) return;
    const newAdmin: AdminUser = {
      id: `admin-${Date.now()}`,
      name: newName,
      email: newEmail,
      role: newRole,
      permissions: newPermissions,
      status: 'active',
      lastLogin: 'Never',
      createdDate: new Date().toISOString().split('T')[0],
    };
    setAdmins(prev => [...prev, newAdmin]);
    setShowAddSheet(false);
    setNewName('');
    setNewEmail('');
    setNewRole('read_only');
    setNewPermissions(['view_users']);
  };

  const handleDeleteAdmin = () => {
    if (!selectedAdmin) return;
    setAdmins(prev => prev.filter(a => a.id !== selectedAdmin.id));
    setShowDeleteConfirm(false);
    setSelectedAdmin(null);
  };

  const handleToggleSuspend = () => {
    if (!selectedAdmin) return;
    setAdmins(prev => prev.map(a =>
      a.id === selectedAdmin.id
        ? { ...a, status: a.status === 'active' ? 'suspended' : 'active' }
        : a
    ));
    setShowSuspendConfirm(false);
    setSelectedAdmin(null);
  };

  const togglePermission = (permId: string, target: 'edit' | 'add') => {
    if (target === 'edit') {
      setEditPermissions(prev =>
        prev.includes(permId)
          ? prev.filter(p => p !== permId)
          : [...prev, permId]
      );
    } else {
      setNewPermissions(prev =>
        prev.includes(permId)
          ? prev.filter(p => p !== permId)
          : [...prev, permId]
      );
    }
  };

  const applyRoleDefaults = (role: UserRole, target: 'edit' | 'add') => {
    const defaults = rolePermissionDefaults[role] || [];
    if (target === 'edit') {
      setEditRole(role);
      setEditPermissions(defaults);
    } else {
      setNewRole(role);
      setNewPermissions(defaults);
    }
  };

  const PermissionToggleList = ({
    permissions,
    onToggle,
    disabled,
  }: {
    permissions: string[];
    onToggle: (id: string) => void;
    disabled?: boolean;
  }) => (
    <div className="space-y-2">
      {allPermissions.map((perm) => {
        const isOn = permissions.includes(perm.id);
        return (
          <button
            key={perm.id}
            onClick={() => !disabled && onToggle(perm.id)}
            disabled={disabled}
            className={cn(
              'w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all',
              isOn
                ? 'border-primary/40 bg-primary/5'
                : 'border-border hover:border-muted-foreground/30',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <perm.icon className={cn('w-4 h-4 shrink-0', isOn ? 'text-primary' : 'text-muted-foreground')} />
            <div className="flex-1 min-w-0">
              <p className={cn('text-sm font-medium', isOn ? 'text-foreground' : 'text-muted-foreground')}>{perm.label}</p>
              <p className="text-xs text-muted-foreground truncate">{perm.description}</p>
            </div>
            <div className={cn(
              'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
              isOn ? 'border-primary bg-primary' : 'border-muted-foreground/30'
            )}>
              {isOn && <FaCheck className="w-2.5 h-2.5 text-white" />}
            </div>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Admin Management"
        subtitle="Manage administrator accounts, roles, and permissions"
      />

      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="kpi-card before:bg-primary">
            <p className="text-xs md:text-sm text-muted-foreground">Total Admins</p>
            <p className="text-xl md:text-2xl font-semibold mt-1">{admins.length}</p>
          </div>
          <div className="kpi-card before:bg-success">
            <p className="text-xs md:text-sm text-muted-foreground">Active</p>
            <p className="text-xl md:text-2xl font-semibold mt-1">{admins.filter(a => a.status === 'active').length}</p>
          </div>
          <div className="kpi-card before:bg-destructive">
            <p className="text-xs md:text-sm text-muted-foreground">Suspended</p>
            <p className="text-xl md:text-2xl font-semibold mt-1">{admins.filter(a => a.status === 'suspended').length}</p>
          </div>
          <div className="kpi-card before:bg-warning">
            <p className="text-xs md:text-sm text-muted-foreground">Roles in Use</p>
            <p className="text-xl md:text-2xl font-semibold mt-1">{new Set(admins.map(a => a.role)).size}</p>
          </div>
        </div>

        {/* Filters + Add Button */}
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1">
            <FilterBar
              searchValue={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search admins..."
              onClearFilters={() => { setSearch(''); setRoleFilter('all'); }}
            >
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {Object.entries(roleLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterBar>
          </div>
          {isSuperAdmin && (
            <Button
              onClick={() => setShowAddSheet(true)}
              className="bg-primary text-primary-foreground shrink-0"
            >
              <FaPlus className="w-3.5 h-3.5 mr-2" />
              Add Admin
            </Button>
          )}
        </div>

        {/* Admin List */}
        <div className="space-y-3">
          {filteredAdmins.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg border border-border">
              <FaUserShield className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No admins match your search</p>
            </div>
          ) : (
            filteredAdmins.map((admin) => (
              <div
                key={admin.id}
                className="bg-card rounded-xl border border-border p-4 md:p-5 hover:border-primary/20 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* User Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="h-11 w-11 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {admin.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm md:text-base truncate">{admin.name}</p>
                        {admin.status === 'suspended' && (
                          <StatusBadge status="rejected" />
                        )}
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground truncate">{admin.email}</p>
                    </div>
                  </div>

                  {/* Role + Permissions Count */}
                  <div className="flex items-center gap-4 md:gap-6 flex-wrap">
                    <div className="text-center min-w-[80px]">
                      <span className={cn('role-badge text-[10px]', roleStyles[admin.role])}>
                        {roleLabels[admin.role]}
                      </span>
                    </div>
                    <div className="text-center hidden md:block">
                      <p className="text-sm font-medium">{admin.permissions.length}</p>
                      <p className="text-xs text-muted-foreground">Permissions</p>
                    </div>
                    <div className="text-center hidden md:block">
                      <p className="text-xs text-muted-foreground">Last Login</p>
                      <p className="text-xs font-medium">{admin.lastLogin}</p>
                    </div>

                    {/* Actions */}
                    {isSuperAdmin && admin.id !== user?.id && (
                      <div className="flex items-center gap-1.5 ml-auto md:ml-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditAdmin(admin)}
                          title="Edit role and permissions"
                        >
                          <FaEdit className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedAdmin(admin);
                            setShowSuspendConfirm(true);
                          }}
                          title={admin.status === 'active' ? 'Suspend' : 'Reactivate'}
                          className={admin.status === 'active' ? 'text-warning hover:text-warning' : 'text-success hover:text-success'}
                        >
                          {admin.status === 'active' ? (
                            <FaTimes className="w-3.5 h-3.5" />
                          ) : (
                            <FaCheck className="w-3.5 h-3.5" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            setSelectedAdmin(admin);
                            setShowDeleteConfirm(true);
                          }}
                          title="Remove admin"
                        >
                          <FaTrash className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    )}
                    {admin.id === user?.id && (
                      <span className="text-xs text-muted-foreground italic ml-auto md:ml-0">You</span>
                    )}
                  </div>
                </div>

                {/* Permissions pills - mobile hidden, shown on md+ */}
                <div className="hidden md:flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border">
                  {admin.permissions.map(permId => {
                    const perm = allPermissions.find(p => p.id === permId);
                    return perm ? (
                      <span key={permId} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-xs text-muted-foreground">
                        <perm.icon className="w-3 h-3" />
                        {perm.label}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Admin Sheet */}
      <Sheet open={showEditSheet} onOpenChange={setShowEditSheet}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Admin</SheetTitle>
            <SheetDescription>
              Update role and permissions for {selectedAdmin?.name}
            </SheetDescription>
          </SheetHeader>

          {selectedAdmin && (
            <div className="mt-6 space-y-6">
              {/* Admin Info */}
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {selectedAdmin.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedAdmin.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedAdmin.email}</p>
                </div>
              </div>

              {/* Role Select */}
              <div className="space-y-2">
                <Label className="text-sm">Role</Label>
                <Select
                  value={editRole}
                  onValueChange={(val) => applyRoleDefaults(val as UserRole, 'edit')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(roleLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Changing the role will reset permissions to that role's defaults. You can then customize individually.
                </p>
              </div>

              {/* Permissions */}
              <div className="space-y-2">
                <Label className="text-sm">Permissions</Label>
                <PermissionToggleList
                  permissions={editPermissions}
                  onToggle={(id) => togglePermission(id, 'edit')}
                  disabled={editRole === 'super_admin'}
                />
                {editRole === 'super_admin' && (
                  <p className="text-xs text-muted-foreground">
                    Super Admins automatically have all permissions.
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSaveEdit} className="flex-1">
                  <FaCheck className="w-3.5 h-3.5 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setShowEditSheet(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Admin Sheet */}
      <Sheet open={showAddSheet} onOpenChange={setShowAddSheet}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add New Admin</SheetTitle>
            <SheetDescription>
              Grant admin access to a new user
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-name" className="text-sm">Full Name</Label>
                <Input
                  id="new-name"
                  placeholder="Enter full name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-email" className="text-sm">Email Address</Label>
                <Input
                  id="new-email"
                  type="email"
                  placeholder="Enter email address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Role Select */}
            <div className="space-y-2">
              <Label className="text-sm">Role</Label>
              <Select
                value={newRole}
                onValueChange={(val) => applyRoleDefaults(val as UserRole, 'add')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Permissions */}
            <div className="space-y-2">
              <Label className="text-sm">Permissions</Label>
              <PermissionToggleList
                permissions={newPermissions}
                onToggle={(id) => togglePermission(id, 'add')}
                disabled={newRole === 'super_admin'}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAddAdmin}
                disabled={!newName || !newEmail}
                className="flex-1"
              >
                <FaPlus className="w-3.5 h-3.5 mr-2" />
                Add Admin
              </Button>
              <Button variant="outline" onClick={() => setShowAddSheet(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation */}
      <ConfirmationModal
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Remove Admin Access"
        description={`Are you sure you want to remove admin access for ${selectedAdmin?.name}? They will no longer be able to access the admin dashboard. This action can be reversed by adding them again.`}
        confirmText="Remove Admin"
        variant="destructive"
        onConfirm={handleDeleteAdmin}
      />

      {/* Suspend Confirmation */}
      <ConfirmationModal
        open={showSuspendConfirm}
        onOpenChange={setShowSuspendConfirm}
        title={selectedAdmin?.status === 'active' ? 'Suspend Admin' : 'Reactivate Admin'}
        description={
          selectedAdmin?.status === 'active'
            ? `Suspending ${selectedAdmin?.name} will immediately revoke their access to the admin dashboard. Their account and permissions will be preserved.`
            : `Reactivating ${selectedAdmin?.name} will restore their access to the admin dashboard with their previous role and permissions.`
        }
        confirmText={selectedAdmin?.status === 'active' ? 'Suspend' : 'Reactivate'}
        variant={selectedAdmin?.status === 'active' ? 'warning' : 'success'}
        onConfirm={handleToggleSuspend}
      />
    </div>
  );
}
