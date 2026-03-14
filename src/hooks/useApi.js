// API Hook Wrapper - Easily switch between mock and real API
import * as mockApi from '../services/mockApi';

/**
 * Custom hook that provides access to all API functions
 * This wrapper makes it easy to switch from mock API to real API later
 * Just replace the mockApi imports with real API calls when backend is ready
 */
export const useApi = () => {
  return {
    // Authentication (7 endpoints)
    adminLogin: mockApi.adminLogin,
    staffLogin: mockApi.staffLogin,
    logout: mockApi.logout,
    getMe: mockApi.getMe,
    refreshToken: mockApi.refreshToken,
    forgotPassword: mockApi.forgotPassword,
    resetPassword: mockApi.resetPassword,

    // Admin Dashboard (4 endpoints)
    getAdminDashboardStats: mockApi.getAdminDashboardStats,
    getAdminDashboardCharts: mockApi.getAdminDashboardCharts,
    getAdminDashboardRecent: mockApi.getAdminDashboardRecent,
    getAdminDashboardAlerts: mockApi.getAdminDashboardAlerts,

    // Admin Users (8 endpoints)
    getAdminUsers: mockApi.getAdminUsers,
    getAdminUserById: mockApi.getAdminUserById,
    getAdminUserReferrals: mockApi.getAdminUserReferrals,
    getAdminUserPoints: mockApi.getAdminUserPoints,
    updateAdminUser: mockApi.updateAdminUser,
    deactivateUser: mockApi.deactivateUser,
    activateUser: mockApi.activateUser,
    deleteUser: mockApi.deleteUser,

    // Admin Referrals (4 endpoints)
    getAdminReferrals: mockApi.getAdminReferrals,
    getAdminReferralById: mockApi.getAdminReferralById,
    updateReferralStatus: mockApi.updateReferralStatus,
    getReferralStats: mockApi.getReferralStats,

    // Admin Withdrawals (6 endpoints)
    getAdminWithdrawals: mockApi.getAdminWithdrawals,
    getAdminWithdrawalById: mockApi.getAdminWithdrawalById,
    approveWithdrawal: mockApi.approveWithdrawal,
    rejectWithdrawal: mockApi.rejectWithdrawal,
    processWithdrawal: mockApi.processWithdrawal,
    completeWithdrawal: mockApi.completeWithdrawal,
    getPendingWithdrawalsCount: mockApi.getPendingWithdrawalsCount,

    // Admin Points (7 endpoints)
    getPointsConfig: mockApi.getPointsConfig,
    updateConversionRate: mockApi.updateConversionRate,
    adjustUserPoints: mockApi.adjustUserPoints,
    getPointsHistory: mockApi.getPointsHistory,
    getPointsTransactions: mockApi.getPointsTransactions,
    scheduleRateChange: mockApi.scheduleRateChange,
    deleteScheduledRate: mockApi.deleteScheduledRate,

    // Admin Audit & Reports (8 endpoints)
    getAuditLogs: mockApi.getAuditLogs,
    getAuditLogById: mockApi.getAuditLogById,
    createAuditLog: mockApi.createAuditLog,
    getReports: mockApi.getReports,
    createReport: mockApi.createReport,
    getReportById: mockApi.getReportById,
    scheduleReport: mockApi.scheduleReport,
    deleteReport: mockApi.deleteReport,

    // Admin Settings (6 endpoints)
    getSettings: mockApi.getSettings,
    updateTimezone: mockApi.updateTimezone,
    updateCurrency: mockApi.updateCurrency,
    updateFeatures: mockApi.updateFeatures,
    updateRetention: mockApi.updateRetention,
    performOverrideAction: mockApi.performOverrideAction,

    // Staff Dashboard (3 endpoints)
    getStaffDashboard: mockApi.getStaffDashboard,
    getStaffReferralCode: mockApi.getStaffReferralCode,
    regenerateReferralCode: mockApi.regenerateReferralCode,

    // Staff Referrals (4 endpoints)
    getStaffReferrals: mockApi.getStaffReferrals,
    getStaffReferralById: mockApi.getStaffReferralById,
    sendReferralInvite: mockApi.sendReferralInvite,
    getStaffReferralStats: mockApi.getStaffReferralStats,

    // Staff Points (3 endpoints)
    getStaffPointsBalance: mockApi.getStaffPointsBalance,
    getStaffPointsHistory: mockApi.getStaffPointsHistory,
    getConversionRate: mockApi.getConversionRate,

    // Staff Withdrawals (5 endpoints)
    getStaffWithdrawals: mockApi.getStaffWithdrawals,
    createWithdrawal: mockApi.createWithdrawal,
    getStaffWithdrawalById: mockApi.getStaffWithdrawalById,
    cancelWithdrawal: mockApi.cancelWithdrawal,
    getWithdrawalLimits: mockApi.getWithdrawalLimits,

    // Staff Miscellaneous (12 endpoints)
    getStaffHoursSummary: mockApi.getStaffHoursSummary,
    getStaffHoursSyncStatus: mockApi.getStaffHoursSyncStatus,
    getStaffNotifications: mockApi.getStaffNotifications,
    markNotificationAsRead: mockApi.markNotificationAsRead,
    markAllNotificationsAsRead: mockApi.markAllNotificationsAsRead,
    getStaffProfile: mockApi.getStaffProfile,
    updateStaffProfile: mockApi.updateStaffProfile,
    updateStaffPassword: mockApi.updateStaffPassword,
    uploadStaffAvatar: mockApi.uploadStaffAvatar,
    getFAQ: mockApi.getFAQ,
    submitSupportRequest: mockApi.submitSupportRequest
  };
};

export default useApi;
