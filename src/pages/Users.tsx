import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersApi } from '@/services/api';
import { toast } from 'sonner';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { DataTable } from '@/components/ui/data-table';
import { FilterBar } from '@/components/ui/filter-bar';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FaPlus as Plus, FaDownload as Download, FaEye as Eye, FaGift as Gift, FaCoins as Coins } from 'react-icons/fa';

interface User {
  id: string;
  name: string;
  email: string;
  classification: string;
  location: string;
  referralsMade: number;
  referralsReceived: number;
  totalPoints: number;
  status: 'active' | 'inactive' | 'pending';
  joinedDate: string;
}

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [classificationFilter, setClassificationFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setLoading(true);
    usersApi.list()
      .then((res) => {
        const mapped: User[] = res.data.map((u: any) => ({
          id: String(u.id),
          name: `${u.firstName} ${u.lastName}`,
          email: u.email,
          classification: u.classification,
          location: u.location,
          referralsMade: u.totalReferrals ?? 0,
          referralsReceived: 0,
          totalPoints: u.pointsBalance ?? 0,
          status: u.isActive ? 'active' : 'inactive',
          joinedDate: u.joinDate ? u.joinDate.split('T')[0] : '',
        }));
        setUsers(mapped);
      })
      .catch((err) => {
        toast.error(err.message || 'Failed to load users');
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || user.location.toLowerCase() === locationFilter;
    const matchesClassification = classificationFilter === 'all' || 
      user.classification.toLowerCase().includes(classificationFilter);
    return matchesSearch && matchesStatus && matchesLocation && matchesClassification;
  });

  const columns = [
    {
      key: 'name',
      header: 'User',
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'classification',
      header: 'Classification',
      render: (user: User) => (
        <Badge variant="outline" className="font-normal">
          {user.classification}
        </Badge>
      ),
    },
    {
      key: 'location',
      header: 'Location',
    },
    {
      key: 'referrals',
      header: 'Referrals',
      render: (user: User) => (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm">
            <Gift className="w-4 h-4 text-accent" />
            <span>{user.referralsMade} made</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span>{user.referralsReceived} received</span>
          </div>
        </div>
      ),
    },
    {
      key: 'totalPoints',
      header: 'Points',
      render: (user: User) => (
        <div className="flex items-center gap-1.5">
          <Coins className="w-4 h-4 text-warning" />
          <span className="font-medium">{user.totalPoints.toLocaleString()}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (user: User) => <StatusBadge status={user.status} />,
    },
    {
      key: 'actions',
      header: '',
      render: (user: User) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/users/${user.id}`);
          }}
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Users & Referrals"
        subtitle="Manage users and their referral relationships"
      />

      <div className="p-6 space-y-6">
        {/* Actions */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">All Users</h2>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Filters */}
        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search users..."
          onClearFilters={() => {
            setSearch('');
            setStatusFilter('all');
            setLocationFilter('all');
            setClassificationFilter('all');
          }}
        >
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="sydney">Sydney</SelectItem>
              <SelectItem value="melbourne">Melbourne</SelectItem>
              <SelectItem value="brisbane">Brisbane</SelectItem>
              <SelectItem value="perth">Perth</SelectItem>
            </SelectContent>
          </Select>

          <Select value={classificationFilter} onValueChange={setClassificationFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Classification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classifications</SelectItem>
              <SelectItem value="registered">Registered Nurse</SelectItem>
              <SelectItem value="enrolled">Enrolled Nurse</SelectItem>
              <SelectItem value="assistant">Assistant in Nursing</SelectItem>
              <SelectItem value="support">Support Worker</SelectItem>
            </SelectContent>
          </Select>
        </FilterBar>

        {/* Table */}
        {loading ? (
          <div className="py-12 text-center text-muted-foreground">Loading users...</div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredUsers}
            keyExtractor={(user) => user.id}
            onRowClick={(user) => navigate(`/users/${user.id}`)}
            pagination={{
              page,
              pageSize,
              total: filteredUsers.length,
              onPageChange: setPage,
              onPageSizeChange: setPageSize,
            }}
          />
        )}
      </div>
    </div>
  );
}
