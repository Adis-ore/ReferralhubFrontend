import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const mockUsers: User[] = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah.j@email.com', classification: 'Registered Nurse', location: 'Sydney', referralsMade: 8, referralsReceived: 1, totalPoints: 4000, status: 'active', joinedDate: '2024-01-15' },
  { id: '2', name: 'Michael Chen', email: 'michael.c@email.com', classification: 'Enrolled Nurse', location: 'Melbourne', referralsMade: 5, referralsReceived: 1, totalPoints: 2500, status: 'active', joinedDate: '2024-02-20' },
  { id: '3', name: 'Emma Williams', email: 'emma.w@email.com', classification: 'Support Worker', location: 'Brisbane', referralsMade: 12, referralsReceived: 0, totalPoints: 6000, status: 'active', joinedDate: '2023-11-10' },
  { id: '4', name: 'James Park', email: 'james.p@email.com', classification: 'Assistant in Nursing', location: 'Perth', referralsMade: 3, referralsReceived: 1, totalPoints: 1500, status: 'inactive', joinedDate: '2024-03-05' },
  { id: '5', name: 'Alex Thompson', email: 'alex.t@email.com', classification: 'Registered Nurse', location: 'Sydney', referralsMade: 0, referralsReceived: 1, totalPoints: 500, status: 'pending', joinedDate: '2024-06-01' },
  { id: '6', name: 'Lisa Garcia', email: 'lisa.g@email.com', classification: 'Enrolled Nurse', location: 'Melbourne', referralsMade: 7, referralsReceived: 0, totalPoints: 3500, status: 'active', joinedDate: '2023-12-15' },
  { id: '7', name: 'David Kim', email: 'david.k@email.com', classification: 'Support Worker', location: 'Brisbane', referralsMade: 4, referralsReceived: 1, totalPoints: 2000, status: 'active', joinedDate: '2024-01-28' },
  { id: '8', name: 'Rachel Brown', email: 'rachel.b@email.com', classification: 'Registered Nurse', location: 'Sydney', referralsMade: 15, referralsReceived: 0, totalPoints: 7500, status: 'active', joinedDate: '2023-09-20' },
];

export default function Users() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [classificationFilter, setClassificationFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredUsers = mockUsers.filter(user => {
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
      </div>
    </div>
  );
}
