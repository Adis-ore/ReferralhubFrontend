import { useState } from 'react';
import { FaUsers, FaGift, FaCreditCard, FaClock, FaCheckCircle, FaCalendar, FaHourglassHalf } from 'react-icons/fa';
import { GiTwoCoins } from 'react-icons/gi';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { KPICard } from '@/components/ui/kpi-card';
import { FilterBar } from '@/components/ui/filter-bar';
import { ReferralChart } from '@/components/dashboard/ReferralChart';
import { PointsChart } from '@/components/dashboard/PointsChart';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const [dateRange, setDateRange] = useState('30d');
  const [location, setLocation] = useState('all');
  const [classification, setClassification] = useState('all');

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Dashboard"
        subtitle="Overview of your referral program performance"
      />

      <div className="p-6 space-y-6">
        {/* Filters */}
        <FilterBar onClearFilters={() => {}}>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <FaCalendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>

          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-40">
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

          <Select value={classification} onValueChange={setClassification}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Classification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classifications</SelectItem>
              <SelectItem value="rn">Registered Nurse (RN)</SelectItem>
              <SelectItem value="en">Enrolled Nurse (EN)</SelectItem>
              <SelectItem value="ain">Assistant in Nursing (AIN)</SelectItem>
              <SelectItem value="sw">Support Worker</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="ml-auto">
            Export Report
          </Button>
        </FilterBar>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
          <KPICard
            title="Total Users"
            value="2,847"
            change={{ value: 12.5, period: 'last month' }}
            icon={<FaUsers className="w-5 h-5" />}
            variant="accent"
          />
          <KPICard
            title="Total Referrals"
            value="1,284"
            change={{ value: 8.2, period: 'last month' }}
            icon={<FaGift className="w-5 h-5" />}
            variant="success"
          />
          <KPICard
            title="Points Issued"
            value="64,200"
            change={{ value: 15.3, period: 'last month' }}
            icon={<GiTwoCoins className="w-5 h-5" />}
            variant="default"
          />
          <KPICard
            title="Pending Withdrawals"
            value="$12,450"
            change={{ value: -5.1, period: 'last month' }}
            icon={<FaClock className="w-5 h-5" />}
            variant="warning"
          />
          <KPICard
            title="Approved Payouts"
            value="$89,320"
            change={{ value: 22.4, period: 'last month' }}
            icon={<FaCheckCircle className="w-5 h-5" />}
            variant="success"
          />
          <KPICard
            title="Active Campaigns"
            value="3"
            icon={<FaCreditCard className="w-5 h-5" />}
            variant="accent"
          />
          <KPICard
            title="Hours Imported Today"
            value="20"
            change={{ value: 4.2, period: 'yesterday' }}
            icon={<FaHourglassHalf className="w-5 h-5" />}
            variant="default"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReferralChart />
          <PointsChart />
        </div>

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </div>
  );
}
