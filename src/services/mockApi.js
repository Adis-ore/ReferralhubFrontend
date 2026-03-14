// Mock API Service - All 48 Endpoints
import {
  staffUsers,
  adminUsers,
  referrals,
  pointTransactions,
  withdrawals,
  auditLogs,
  notifications,
  conversionRates,
  systemSettings,
  reports,
  faqData,
  dashboardStats,
  chartData,
  recentActivity,
  alerts
} from '../data/mockData';

// Helper to simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to generate JWT token
const generateToken = (user, isAdmin = false) => {
  return btoa(JSON.stringify({
    id: user.id,
    email: user.email,
    role: isAdmin ? user.role : 'staff',
    permissions: isAdmin ? user.permissions : [],
    referralCode: !isAdmin ? user.referralCode : null,
    timestamp: Date.now()
  }));
};

// Helper to verify token
const verifyToken = (token) => {
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
};

// Store for session data
let sessionData = {
  tokens: new Map(),
  refreshTokens: new Map()
};

// ==================== AUTHENTICATION ENDPOINTS (7) ====================

export const adminLogin = async (email, password) => {
  console.log('API: Admin Login', { email });
  await delay();

  const admin = adminUsers.find(a => a.email === email && a.password === password);

  if (!admin) {
    return {
      success: false,
      message: 'Invalid email or password'
    };
  }

  const token = generateToken(admin, true);
  const refreshToken = generateToken({ ...admin, refresh: true }, true);

  sessionData.tokens.set(token, admin);
  sessionData.refreshTokens.set(refreshToken, admin);

  return {
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      },
      token,
      refreshToken
    }
  };
};

export const staffLogin = async (email, password) => {
  console.log('API: Staff Login', { email });
  await delay();

  const staff = staffUsers.find(s => s.email === email && s.password === password);

  if (!staff) {
    return {
      success: false,
      message: 'Invalid email or password'
    };
  }

  if (!staff.isActive) {
    return {
      success: false,
      message: 'Account is inactive. Please contact HR.'
    };
  }

  const token = generateToken(staff, false);
  const refreshToken = generateToken({ ...staff, refresh: true }, false);

  sessionData.tokens.set(token, staff);
  sessionData.refreshTokens.set(refreshToken, staff);

  return {
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: staff.id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        email: staff.email,
        referralCode: staff.referralCode,
        pointsBalance: staff.pointsBalance,
        avatar: staff.avatar
      },
      token,
      refreshToken
    }
  };
};

export const logout = async (token) => {
  console.log('API: Logout');
  await delay(100);

  sessionData.tokens.delete(token);

  return {
    success: true,
    message: 'Logout successful'
  };
};

export const getMe = async (token) => {
  console.log('API: Get Me');
  await delay(100);

  const user = sessionData.tokens.get(token);

  if (!user) {
    return {
      success: false,
      message: 'Invalid or expired token'
    };
  }

  return {
    success: true,
    data: {
      user
    }
  };
};

export const refreshToken = async (oldRefreshToken) => {
  console.log('API: Refresh Token');
  await delay(100);

  const user = sessionData.refreshTokens.get(oldRefreshToken);

  if (!user) {
    return {
      success: false,
      message: 'Invalid refresh token'
    };
  }

  const isAdmin = adminUsers.some(a => a.id === user.id);
  const newToken = generateToken(user, isAdmin);
  const newRefreshToken = generateToken({ ...user, refresh: true }, isAdmin);

  sessionData.tokens.set(newToken, user);
  sessionData.refreshTokens.delete(oldRefreshToken);
  sessionData.refreshTokens.set(newRefreshToken, user);

  return {
    success: true,
    data: {
      token: newToken,
      refreshToken: newRefreshToken
    }
  };
};

export const forgotPassword = async (email) => {
  console.log('API: Forgot Password', { email });
  await delay();

  const user = [...staffUsers, ...adminUsers].find(u => u.email === email);

  if (!user) {
    return {
      success: false,
      message: 'Email not found'
    };
  }

  return {
    success: true,
    message: 'Password reset instructions sent to your email'
  };
};

export const resetPassword = async (token, newPassword) => {
  console.log('API: Reset Password');
  await delay();

  return {
    success: true,
    message: 'Password reset successful'
  };
};

// ==================== ADMIN DASHBOARD ENDPOINTS (4) ====================

export const getAdminDashboardStats = async () => {
  console.log('API: Get Admin Dashboard Stats');
  await delay();

  return {
    success: true,
    data: dashboardStats
  };
};

export const getAdminDashboardCharts = async () => {
  console.log('API: Get Admin Dashboard Charts');
  await delay();

  return {
    success: true,
    data: chartData
  };
};

export const getAdminDashboardRecent = async () => {
  console.log('API: Get Admin Dashboard Recent Activity');
  await delay();

  return {
    success: true,
    data: recentActivity
  };
};

export const getAdminDashboardAlerts = async () => {
  console.log('API: Get Admin Dashboard Alerts');
  await delay();

  return {
    success: true,
    data: alerts
  };
};

// ==================== ADMIN USERS ENDPOINTS (8) ====================

export const getAdminUsers = async (filters = {}, pagination = { page: 1, limit: 10 }) => {
  console.log('API: Get Admin Users', { filters, pagination });
  await delay();

  let filtered = [...staffUsers];

  // Apply filters
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(u =>
      u.firstName.toLowerCase().includes(search) ||
      u.lastName.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search) ||
      u.referralCode.toLowerCase().includes(search)
    );
  }

  if (filters.department) {
    filtered = filtered.filter(u => u.department === filters.department);
  }

  if (filters.location) {
    filtered = filtered.filter(u => u.location === filters.location);
  }

  if (filters.status) {
    const isActive = filters.status === 'active';
    filtered = filtered.filter(u => u.isActive === isActive);
  }

  // Apply sorting
  if (filters.sortBy) {
    filtered.sort((a, b) => {
      const aVal = a[filters.sortBy];
      const bVal = b[filters.sortBy];

      if (filters.sortOrder === 'desc') {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });
  }

  // Apply pagination
  const start = (pagination.page - 1) * pagination.limit;
  const end = start + pagination.limit;
  const paginatedUsers = filtered.slice(start, end);

  return {
    success: true,
    data: {
      users: paginatedUsers,
      meta: {
        total: filtered.length,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(filtered.length / pagination.limit)
      }
    }
  };
};

export const getAdminUserById = async (id) => {
  console.log('API: Get Admin User By ID', { id });
  await delay();

  const user = staffUsers.find(u => u.id === parseInt(id));

  if (!user) {
    return {
      success: false,
      message: 'User not found'
    };
  }

  return {
    success: true,
    data: { user }
  };
};

export const getAdminUserReferrals = async (id) => {
  console.log('API: Get Admin User Referrals', { id });
  await delay();

  const userReferrals = referrals.filter(r => r.userId === parseInt(id));

  return {
    success: true,
    data: {
      referrals: userReferrals,
      total: userReferrals.length
    }
  };
};

export const getAdminUserPoints = async (id) => {
  console.log('API: Get Admin User Points', { id });
  await delay();

  const userTransactions = pointTransactions.filter(t => t.userId === parseInt(id));

  return {
    success: true,
    data: {
      transactions: userTransactions,
      total: userTransactions.length
    }
  };
};

export const updateAdminUser = async (id, data) => {
  console.log('API: Update Admin User', { id, data });
  await delay();

  const userIndex = staffUsers.findIndex(u => u.id === parseInt(id));

  if (userIndex === -1) {
    return {
      success: false,
      message: 'User not found'
    };
  }

  staffUsers[userIndex] = { ...staffUsers[userIndex], ...data };

  return {
    success: true,
    message: 'User updated successfully',
    data: { user: staffUsers[userIndex] }
  };
};

export const deactivateUser = async (id) => {
  console.log('API: Deactivate User', { id });
  await delay();

  const userIndex = staffUsers.findIndex(u => u.id === parseInt(id));

  if (userIndex === -1) {
    return {
      success: false,
      message: 'User not found'
    };
  }

  staffUsers[userIndex].isActive = false;

  return {
    success: true,
    message: 'User deactivated successfully'
  };
};

export const activateUser = async (id) => {
  console.log('API: Activate User', { id });
  await delay();

  const userIndex = staffUsers.findIndex(u => u.id === parseInt(id));

  if (userIndex === -1) {
    return {
      success: false,
      message: 'User not found'
    };
  }

  staffUsers[userIndex].isActive = true;

  return {
    success: true,
    message: 'User activated successfully'
  };
};

export const deleteUser = async (id) => {
  console.log('API: Delete User', { id });
  await delay();

  const userIndex = staffUsers.findIndex(u => u.id === parseInt(id));

  if (userIndex === -1) {
    return {
      success: false,
      message: 'User not found'
    };
  }

  staffUsers.splice(userIndex, 1);

  return {
    success: true,
    message: 'User deleted successfully'
  };
};

// ==================== ADMIN REFERRALS ENDPOINTS (4) ====================

export const getAdminReferrals = async (filters = {}, pagination = { page: 1, limit: 10 }) => {
  console.log('API: Get Admin Referrals', { filters, pagination });
  await delay();

  let filtered = [...referrals];

  // Apply filters
  if (filters.status) {
    filtered = filtered.filter(r => r.status === filters.status);
  }

  if (filters.userId) {
    filtered = filtered.filter(r => r.userId === parseInt(filters.userId));
  }

  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(r =>
      r.referrerName.toLowerCase().includes(search) ||
      r.refereeName.toLowerCase().includes(search) ||
      r.refereeEmail.toLowerCase().includes(search)
    );
  }

  // Apply pagination
  const start = (pagination.page - 1) * pagination.limit;
  const end = start + pagination.limit;
  const paginatedReferrals = filtered.slice(start, end);

  return {
    success: true,
    data: {
      referrals: paginatedReferrals,
      meta: {
        total: filtered.length,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(filtered.length / pagination.limit)
      }
    }
  };
};

export const getAdminReferralById = async (id) => {
  console.log('API: Get Admin Referral By ID', { id });
  await delay();

  const referral = referrals.find(r => r.id === parseInt(id));

  if (!referral) {
    return {
      success: false,
      message: 'Referral not found'
    };
  }

  return {
    success: true,
    data: { referral }
  };
};

export const updateReferralStatus = async (id, status) => {
  console.log('API: Update Referral Status', { id, status });
  await delay();

  const referralIndex = referrals.findIndex(r => r.id === parseInt(id));

  if (referralIndex === -1) {
    return {
      success: false,
      message: 'Referral not found'
    };
  }

  referrals[referralIndex].status = status;
  referrals[referralIndex].updatedAt = new Date().toISOString();

  return {
    success: true,
    message: 'Referral status updated successfully',
    data: { referral: referrals[referralIndex] }
  };
};

export const getReferralStats = async () => {
  console.log('API: Get Referral Stats');
  await delay();

  return {
    success: true,
    data: {
      total: referrals.length,
      pending: referrals.filter(r => r.status === 'pending').length,
      approved: referrals.filter(r => r.status === 'approved').length,
      completed: referrals.filter(r => r.status === 'completed').length,
      rejected: referrals.filter(r => r.status === 'rejected').length
    }
  };
};

// ==================== ADMIN WITHDRAWALS ENDPOINTS (6) ====================

export const getAdminWithdrawals = async (filters = {}, pagination = { page: 1, limit: 10 }) => {
  console.log('API: Get Admin Withdrawals', { filters, pagination });
  await delay();

  let filtered = [...withdrawals];

  // Apply filters
  if (filters.status) {
    filtered = filtered.filter(w => w.status === filters.status);
  }

  if (filters.userId) {
    filtered = filtered.filter(w => w.userId === parseInt(filters.userId));
  }

  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(w =>
      w.userName.toLowerCase().includes(search) ||
      w.accountName.toLowerCase().includes(search)
    );
  }

  // Apply pagination
  const start = (pagination.page - 1) * pagination.limit;
  const end = start + pagination.limit;
  const paginatedWithdrawals = filtered.slice(start, end);

  return {
    success: true,
    data: {
      withdrawals: paginatedWithdrawals,
      meta: {
        total: filtered.length,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(filtered.length / pagination.limit)
      }
    }
  };
};

export const getAdminWithdrawalById = async (id) => {
  console.log('API: Get Admin Withdrawal By ID', { id });
  await delay();

  const withdrawal = withdrawals.find(w => w.id === parseInt(id));

  if (!withdrawal) {
    return {
      success: false,
      message: 'Withdrawal not found'
    };
  }

  return {
    success: true,
    data: { withdrawal }
  };
};

export const approveWithdrawal = async (id) => {
  console.log('API: Approve Withdrawal', { id });
  await delay();

  const withdrawalIndex = withdrawals.findIndex(w => w.id === parseInt(id));

  if (withdrawalIndex === -1) {
    return {
      success: false,
      message: 'Withdrawal not found'
    };
  }

  withdrawals[withdrawalIndex].status = 'approved';
  withdrawals[withdrawalIndex].processedBy = 'Admin Super';

  return {
    success: true,
    message: 'Withdrawal approved successfully'
  };
};

export const rejectWithdrawal = async (id, reason) => {
  console.log('API: Reject Withdrawal', { id, reason });
  await delay();

  const withdrawalIndex = withdrawals.findIndex(w => w.id === parseInt(id));

  if (withdrawalIndex === -1) {
    return {
      success: false,
      message: 'Withdrawal not found'
    };
  }

  withdrawals[withdrawalIndex].status = 'rejected';
  withdrawals[withdrawalIndex].rejectionReason = reason;
  withdrawals[withdrawalIndex].processedBy = 'Admin Super';
  withdrawals[withdrawalIndex].processedAt = new Date().toISOString();

  return {
    success: true,
    message: 'Withdrawal rejected successfully'
  };
};

export const processWithdrawal = async (id) => {
  console.log('API: Process Withdrawal', { id });
  await delay();

  const withdrawalIndex = withdrawals.findIndex(w => w.id === parseInt(id));

  if (withdrawalIndex === -1) {
    return {
      success: false,
      message: 'Withdrawal not found'
    };
  }

  withdrawals[withdrawalIndex].status = 'processing';

  return {
    success: true,
    message: 'Withdrawal processing started'
  };
};

export const completeWithdrawal = async (id) => {
  console.log('API: Complete Withdrawal', { id });
  await delay();

  const withdrawalIndex = withdrawals.findIndex(w => w.id === parseInt(id));

  if (withdrawalIndex === -1) {
    return {
      success: false,
      message: 'Withdrawal not found'
    };
  }

  withdrawals[withdrawalIndex].status = 'completed';
  withdrawals[withdrawalIndex].processedAt = new Date().toISOString();

  return {
    success: true,
    message: 'Withdrawal completed successfully'
  };
};

export const getPendingWithdrawalsCount = async () => {
  console.log('API: Get Pending Withdrawals Count');
  await delay(100);

  return {
    success: true,
    data: {
      count: withdrawals.filter(w => w.status === 'pending').length
    }
  };
};

// ==================== ADMIN POINTS ENDPOINTS (7) ====================

export const getPointsConfig = async () => {
  console.log('API: Get Points Config');
  await delay();

  return {
    success: true,
    data: {
      currentRate: conversionRates[conversionRates.length - 1].rate,
      minimumWithdrawal: systemSettings.minimumWithdrawal,
      maximumWithdrawal: systemSettings.maximumWithdrawal,
      rateHistory: conversionRates
    }
  };
};

export const updateConversionRate = async (rate) => {
  console.log('API: Update Conversion Rate', { rate });
  await delay();

  const newRate = {
    id: conversionRates.length + 1,
    rate: rate,
    effectiveFrom: new Date().toISOString(),
    effectiveTo: null,
    createdBy: 'admin-1',
    createdAt: new Date().toISOString()
  };

  conversionRates[conversionRates.length - 1].effectiveTo = new Date().toISOString();
  conversionRates.push(newRate);

  return {
    success: true,
    message: 'Conversion rate updated successfully',
    data: { rate: newRate }
  };
};

export const adjustUserPoints = async (userId, points, reason) => {
  console.log('API: Adjust User Points', { userId, points, reason });
  await delay();

  const userIndex = staffUsers.findIndex(u => u.id === parseInt(userId));

  if (userIndex === -1) {
    return {
      success: false,
      message: 'User not found'
    };
  }

  staffUsers[userIndex].pointsBalance += points;

  const transaction = {
    id: pointTransactions.length + 1,
    userId: parseInt(userId),
    userName: `${staffUsers[userIndex].firstName} ${staffUsers[userIndex].lastName}`,
    type: points > 0 ? 'bonus' : 'deduction',
    amount: points,
    balance: staffUsers[userIndex].pointsBalance,
    description: reason,
    createdAt: new Date().toISOString()
  };

  pointTransactions.unshift(transaction);

  return {
    success: true,
    message: 'Points adjusted successfully',
    data: { transaction }
  };
};

export const getPointsHistory = async (filters = {}) => {
  console.log('API: Get Points History', { filters });
  await delay();

  let filtered = [...pointTransactions];

  if (filters.userId) {
    filtered = filtered.filter(t => t.userId === parseInt(filters.userId));
  }

  if (filters.type) {
    filtered = filtered.filter(t => t.type === filters.type);
  }

  return {
    success: true,
    data: {
      transactions: filtered
    }
  };
};

export const getPointsTransactions = async (filters = {}, pagination = { page: 1, limit: 10 }) => {
  console.log('API: Get Points Transactions', { filters, pagination });
  await delay();

  let filtered = [...pointTransactions];

  if (filters.type) {
    filtered = filtered.filter(t => t.type === filters.type);
  }

  if (filters.userId) {
    filtered = filtered.filter(t => t.userId === parseInt(filters.userId));
  }

  // Apply pagination
  const start = (pagination.page - 1) * pagination.limit;
  const end = start + pagination.limit;
  const paginatedTransactions = filtered.slice(start, end);

  return {
    success: true,
    data: {
      transactions: paginatedTransactions,
      meta: {
        total: filtered.length,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(filtered.length / pagination.limit)
      }
    }
  };
};

export const scheduleRateChange = async (rate, effectiveDate) => {
  console.log('API: Schedule Rate Change', { rate, effectiveDate });
  await delay();

  return {
    success: true,
    message: 'Rate change scheduled successfully'
  };
};

export const deleteScheduledRate = async (id) => {
  console.log('API: Delete Scheduled Rate', { id });
  await delay();

  return {
    success: true,
    message: 'Scheduled rate deleted successfully'
  };
};

// ==================== ADMIN AUDIT & REPORTS ENDPOINTS (8) ====================

export const getAuditLogs = async (filters = {}, pagination = { page: 1, limit: 10 }) => {
  console.log('API: Get Audit Logs', { filters, pagination });
  await delay();

  let filtered = [...auditLogs];

  if (filters.action) {
    filtered = filtered.filter(l => l.action.toLowerCase().includes(filters.action.toLowerCase()));
  }

  if (filters.adminId) {
    filtered = filtered.filter(l => l.adminId === filters.adminId);
  }

  // Apply pagination
  const start = (pagination.page - 1) * pagination.limit;
  const end = start + pagination.limit;
  const paginatedLogs = filtered.slice(start, end);

  return {
    success: true,
    data: {
      logs: paginatedLogs,
      meta: {
        total: filtered.length,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(filtered.length / pagination.limit)
      }
    }
  };
};

export const getAuditLogById = async (id) => {
  console.log('API: Get Audit Log By ID', { id });
  await delay();

  const log = auditLogs.find(l => l.id === parseInt(id));

  if (!log) {
    return {
      success: false,
      message: 'Audit log not found'
    };
  }

  return {
    success: true,
    data: { log }
  };
};

export const createAuditLog = async (data) => {
  console.log('API: Create Audit Log', { data });
  await delay();

  const newLog = {
    id: auditLogs.length + 1,
    ...data,
    createdAt: new Date().toISOString()
  };

  auditLogs.unshift(newLog);

  return {
    success: true,
    message: 'Audit log created successfully',
    data: { log: newLog }
  };
};

export const getReports = async (filters = {}) => {
  console.log('API: Get Reports', { filters });
  await delay();

  let filtered = [...reports];

  if (filters.type) {
    filtered = filtered.filter(r => r.type === filters.type);
  }

  return {
    success: true,
    data: {
      reports: filtered
    }
  };
};

export const createReport = async (data) => {
  console.log('API: Create Report', { data });
  await delay();

  const newReport = {
    id: reports.length + 1,
    ...data,
    createdAt: new Date().toISOString()
  };

  reports.push(newReport);

  return {
    success: true,
    message: 'Report created successfully',
    data: { report: newReport }
  };
};

export const getReportById = async (id) => {
  console.log('API: Get Report By ID', { id });
  await delay();

  const report = reports.find(r => r.id === parseInt(id));

  if (!report) {
    return {
      success: false,
      message: 'Report not found'
    };
  }

  return {
    success: true,
    data: { report }
  };
};

export const scheduleReport = async (id, schedule) => {
  console.log('API: Schedule Report', { id, schedule });
  await delay();

  const reportIndex = reports.findIndex(r => r.id === parseInt(id));

  if (reportIndex === -1) {
    return {
      success: false,
      message: 'Report not found'
    };
  }

  reports[reportIndex].schedule = schedule;

  return {
    success: true,
    message: 'Report scheduled successfully'
  };
};

export const deleteReport = async (id) => {
  console.log('API: Delete Report', { id });
  await delay();

  const reportIndex = reports.findIndex(r => r.id === parseInt(id));

  if (reportIndex === -1) {
    return {
      success: false,
      message: 'Report not found'
    };
  }

  reports.splice(reportIndex, 1);

  return {
    success: true,
    message: 'Report deleted successfully'
  };
};

// ==================== ADMIN SETTINGS ENDPOINTS (6) ====================

export const getSettings = async () => {
  console.log('API: Get Settings');
  await delay();

  return {
    success: true,
    data: systemSettings
  };
};

export const updateTimezone = async (timezone) => {
  console.log('API: Update Timezone', { timezone });
  await delay();

  systemSettings.timezone = timezone;

  return {
    success: true,
    message: 'Timezone updated successfully'
  };
};

export const updateCurrency = async (currency) => {
  console.log('API: Update Currency', { currency });
  await delay();

  systemSettings.currency = currency;

  return {
    success: true,
    message: 'Currency updated successfully'
  };
};

export const updateFeatures = async (features) => {
  console.log('API: Update Features', { features });
  await delay();

  systemSettings.features = { ...systemSettings.features, ...features };

  return {
    success: true,
    message: 'Features updated successfully'
  };
};

export const updateRetention = async (days) => {
  console.log('API: Update Retention', { days });
  await delay();

  systemSettings.retentionDays = days;

  return {
    success: true,
    message: 'Retention period updated successfully'
  };
};

export const performOverrideAction = async (action, data) => {
  console.log('API: Perform Override Action', { action, data });
  await delay();

  return {
    success: true,
    message: `Override action '${action}' performed successfully`
  };
};

// ==================== STAFF DASHBOARD ENDPOINTS (3) ====================

export const getStaffDashboard = async (userId) => {
  console.log('API: Get Staff Dashboard', { userId });
  await delay();

  const user = staffUsers.find(u => u.id === parseInt(userId));

  if (!user) {
    return {
      success: false,
      message: 'User not found'
    };
  }

  const userReferrals = referrals.filter(r => r.userId === parseInt(userId));
  const userWithdrawals = withdrawals.filter(w => w.userId === parseInt(userId));

  return {
    success: true,
    data: {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        referralCode: user.referralCode,
        pointsBalance: user.pointsBalance,
        avatar: user.avatar
      },
      stats: {
        totalReferrals: user.totalReferrals,
        successfulReferrals: user.successfulReferrals,
        pendingReferrals: userReferrals.filter(r => r.status === 'pending').length,
        totalPoints: user.pointsBalance,
        totalWithdrawals: userWithdrawals.filter(w => w.status === 'completed').length
      },
      recentReferrals: userReferrals.slice(0, 5),
      recentTransactions: pointTransactions.filter(t => t.userId === parseInt(userId)).slice(0, 5)
    }
  };
};

export const getStaffReferralCode = async (userId) => {
  console.log('API: Get Staff Referral Code', { userId });
  await delay(100);

  const user = staffUsers.find(u => u.id === parseInt(userId));

  if (!user) {
    return {
      success: false,
      message: 'User not found'
    };
  }

  return {
    success: true,
    data: {
      referralCode: user.referralCode
    }
  };
};

export const regenerateReferralCode = async (userId) => {
  console.log('API: Regenerate Referral Code', { userId });
  await delay();

  const userIndex = staffUsers.findIndex(u => u.id === parseInt(userId));

  if (userIndex === -1) {
    return {
      success: false,
      message: 'User not found'
    };
  }

  const newCode = `REF${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  staffUsers[userIndex].referralCode = newCode;

  return {
    success: true,
    message: 'Referral code regenerated successfully',
    data: {
      referralCode: newCode
    }
  };
};

// ==================== STAFF REFERRALS ENDPOINTS (4) ====================

export const getStaffReferrals = async (userId, filters = {}) => {
  console.log('API: Get Staff Referrals', { userId, filters });
  await delay();

  let userReferrals = referrals.filter(r => r.userId === parseInt(userId));

  if (filters.status) {
    userReferrals = userReferrals.filter(r => r.status === filters.status);
  }

  return {
    success: true,
    data: {
      referrals: userReferrals,
      total: userReferrals.length
    }
  };
};

export const getStaffReferralById = async (userId, referralId) => {
  console.log('API: Get Staff Referral By ID', { userId, referralId });
  await delay();

  const referral = referrals.find(r => r.id === parseInt(referralId) && r.userId === parseInt(userId));

  if (!referral) {
    return {
      success: false,
      message: 'Referral not found'
    };
  }

  return {
    success: true,
    data: { referral }
  };
};

export const sendReferralInvite = async (userId, email) => {
  console.log('API: Send Referral Invite', { userId, email });
  await delay();

  const user = staffUsers.find(u => u.id === parseInt(userId));

  if (!user) {
    return {
      success: false,
      message: 'User not found'
    };
  }

  return {
    success: true,
    message: `Referral invitation sent to ${email}`
  };
};

export const getStaffReferralStats = async (userId) => {
  console.log('API: Get Staff Referral Stats', { userId });
  await delay();

  const userReferrals = referrals.filter(r => r.userId === parseInt(userId));

  return {
    success: true,
    data: {
      total: userReferrals.length,
      pending: userReferrals.filter(r => r.status === 'pending').length,
      approved: userReferrals.filter(r => r.status === 'approved').length,
      completed: userReferrals.filter(r => r.status === 'completed').length,
      rejected: userReferrals.filter(r => r.status === 'rejected').length
    }
  };
};

// ==================== STAFF POINTS ENDPOINTS (3) ====================

export const getStaffPointsBalance = async (userId) => {
  console.log('API: Get Staff Points Balance', { userId });
  await delay(100);

  const user = staffUsers.find(u => u.id === parseInt(userId));

  if (!user) {
    return {
      success: false,
      message: 'User not found'
    };
  }

  return {
    success: true,
    data: {
      balance: user.pointsBalance,
      cashValue: user.pointsBalance / 10
    }
  };
};

export const getStaffPointsHistory = async (userId, filters = {}) => {
  console.log('API: Get Staff Points History', { userId, filters });
  await delay();

  let userTransactions = pointTransactions.filter(t => t.userId === parseInt(userId));

  if (filters.type) {
    userTransactions = userTransactions.filter(t => t.type === filters.type);
  }

  return {
    success: true,
    data: {
      transactions: userTransactions,
      total: userTransactions.length
    }
  };
};

export const getConversionRate = async () => {
  console.log('API: Get Conversion Rate');
  await delay(100);

  return {
    success: true,
    data: {
      rate: conversionRates[conversionRates.length - 1].rate,
      description: '10 points = 1 Naira'
    }
  };
};

// ==================== STAFF WITHDRAWALS ENDPOINTS (5) ====================

export const getStaffWithdrawals = async (userId, filters = {}) => {
  console.log('API: Get Staff Withdrawals', { userId, filters });
  await delay();

  let userWithdrawals = withdrawals.filter(w => w.userId === parseInt(userId));

  if (filters.status) {
    userWithdrawals = userWithdrawals.filter(w => w.status === filters.status);
  }

  return {
    success: true,
    data: {
      withdrawals: userWithdrawals,
      total: userWithdrawals.length
    }
  };
};

export const createWithdrawal = async (userId, amount, bankDetails) => {
  console.log('API: Create Withdrawal', { userId, amount, bankDetails });
  await delay();

  const user = staffUsers.find(u => u.id === parseInt(userId));

  if (!user) {
    return {
      success: false,
      message: 'User not found'
    };
  }

  const points = amount * 10;

  if (user.pointsBalance < points) {
    return {
      success: false,
      message: 'Insufficient points balance'
    };
  }

  if (amount < systemSettings.minimumWithdrawal) {
    return {
      success: false,
      message: `Minimum withdrawal amount is NGN ${systemSettings.minimumWithdrawal.toLocaleString()}`
    };
  }

  if (amount > systemSettings.maximumWithdrawal) {
    return {
      success: false,
      message: `Maximum withdrawal amount is NGN ${systemSettings.maximumWithdrawal.toLocaleString()}`
    };
  }

  const newWithdrawal = {
    id: withdrawals.length + 1,
    userId: parseInt(userId),
    userName: `${user.firstName} ${user.lastName}`,
    amount: amount,
    points: points,
    status: 'pending',
    ...bankDetails,
    createdAt: new Date().toISOString(),
    processedAt: null,
    processedBy: null
  };

  withdrawals.unshift(newWithdrawal);

  return {
    success: true,
    message: 'Withdrawal request submitted successfully',
    data: { withdrawal: newWithdrawal }
  };
};

export const getStaffWithdrawalById = async (userId, withdrawalId) => {
  console.log('API: Get Staff Withdrawal By ID', { userId, withdrawalId });
  await delay();

  const withdrawal = withdrawals.find(w => w.id === parseInt(withdrawalId) && w.userId === parseInt(userId));

  if (!withdrawal) {
    return {
      success: false,
      message: 'Withdrawal not found'
    };
  }

  return {
    success: true,
    data: { withdrawal }
  };
};

export const cancelWithdrawal = async (userId, withdrawalId) => {
  console.log('API: Cancel Withdrawal', { userId, withdrawalId });
  await delay();

  const withdrawalIndex = withdrawals.findIndex(w => w.id === parseInt(withdrawalId) && w.userId === parseInt(userId));

  if (withdrawalIndex === -1) {
    return {
      success: false,
      message: 'Withdrawal not found'
    };
  }

  if (withdrawals[withdrawalIndex].status !== 'pending') {
    return {
      success: false,
      message: 'Cannot cancel withdrawal that has been processed'
    };
  }

  withdrawals.splice(withdrawalIndex, 1);

  return {
    success: true,
    message: 'Withdrawal cancelled successfully'
  };
};

export const getWithdrawalLimits = async () => {
  console.log('API: Get Withdrawal Limits');
  await delay(100);

  return {
    success: true,
    data: {
      minimum: systemSettings.minimumWithdrawal,
      maximum: systemSettings.maximumWithdrawal,
      minimumPoints: systemSettings.minimumWithdrawal * 10,
      maximumPoints: systemSettings.maximumWithdrawal * 10
    }
  };
};

// ==================== STAFF MISCELLANEOUS ENDPOINTS (12) ====================

export const getStaffHoursSummary = async (userId) => {
  console.log('API: Get Staff Hours Summary', { userId });
  await delay();

  return {
    success: true,
    data: {
      currentMonth: 160,
      lastMonth: 168,
      yearToDate: 1920
    }
  };
};

export const getStaffHoursSyncStatus = async (userId) => {
  console.log('API: Get Staff Hours Sync Status', { userId });
  await delay();

  return {
    success: true,
    data: {
      lastSynced: new Date().toISOString(),
      status: 'synced'
    }
  };
};

export const getStaffNotifications = async (userId) => {
  console.log('API: Get Staff Notifications', { userId });
  await delay();

  const userNotifications = notifications.filter(n => n.userId === parseInt(userId));

  return {
    success: true,
    data: {
      notifications: userNotifications,
      unreadCount: userNotifications.filter(n => !n.isRead).length
    }
  };
};

export const markNotificationAsRead = async (userId, notificationId) => {
  console.log('API: Mark Notification As Read', { userId, notificationId });
  await delay(100);

  const notificationIndex = notifications.findIndex(n => n.id === parseInt(notificationId) && n.userId === parseInt(userId));

  if (notificationIndex === -1) {
    return {
      success: false,
      message: 'Notification not found'
    };
  }

  notifications[notificationIndex].isRead = true;

  return {
    success: true,
    message: 'Notification marked as read'
  };
};

export const markAllNotificationsAsRead = async (userId) => {
  console.log('API: Mark All Notifications As Read', { userId });
  await delay();

  notifications.forEach(n => {
    if (n.userId === parseInt(userId)) {
      n.isRead = true;
    }
  });

  return {
    success: true,
    message: 'All notifications marked as read'
  };
};

export const getStaffProfile = async (userId) => {
  console.log('API: Get Staff Profile', { userId });
  await delay();

  const user = staffUsers.find(u => u.id === parseInt(userId));

  if (!user) {
    return {
      success: false,
      message: 'User not found'
    };
  }

  return {
    success: true,
    data: { user }
  };
};

export const updateStaffProfile = async (userId, data) => {
  console.log('API: Update Staff Profile', { userId, data });
  await delay();

  const userIndex = staffUsers.findIndex(u => u.id === parseInt(userId));

  if (userIndex === -1) {
    return {
      success: false,
      message: 'User not found'
    };
  }

  staffUsers[userIndex] = { ...staffUsers[userIndex], ...data };

  return {
    success: true,
    message: 'Profile updated successfully',
    data: { user: staffUsers[userIndex] }
  };
};

export const updateStaffPassword = async (userId, oldPassword, newPassword) => {
  console.log('API: Update Staff Password', { userId });
  await delay();

  const user = staffUsers.find(u => u.id === parseInt(userId));

  if (!user) {
    return {
      success: false,
      message: 'User not found'
    };
  }

  if (user.password !== oldPassword) {
    return {
      success: false,
      message: 'Current password is incorrect'
    };
  }

  const userIndex = staffUsers.findIndex(u => u.id === parseInt(userId));
  staffUsers[userIndex].password = newPassword;

  return {
    success: true,
    message: 'Password updated successfully'
  };
};

export const uploadStaffAvatar = async (userId, file) => {
  console.log('API: Upload Staff Avatar', { userId, file });
  await delay();

  const userIndex = staffUsers.findIndex(u => u.id === parseInt(userId));

  if (userIndex === -1) {
    return {
      success: false,
      message: 'User not found'
    };
  }

  const avatarUrl = `https://i.pravatar.cc/150?img=${userId}`;
  staffUsers[userIndex].avatar = avatarUrl;

  return {
    success: true,
    message: 'Avatar uploaded successfully',
    data: { avatarUrl }
  };
};

export const getFAQ = async () => {
  console.log('API: Get FAQ');
  await delay();

  return {
    success: true,
    data: {
      faq: faqData
    }
  };
};

export const submitSupportRequest = async (userId, data) => {
  console.log('API: Submit Support Request', { userId, data });
  await delay();

  return {
    success: true,
    message: 'Support request submitted successfully. We will get back to you soon.'
  };
};
