// Frontend API service - all data fetched from the backend
// Base URL from environment variable, falls back to localhost:3001 in development

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function getToken(): string | null {
  return localStorage.getItem('admin_token') || localStorage.getItem('staff_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `API error ${res.status}`);
  }
  return res.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  adminLogin: (email: string, password: string) =>
    request<{ token: string; user: any }>('/auth/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  staffLogin: (email: string, password: string) =>
    request<{ token: string; user: any }>('/auth/staff/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
};

// ─── Users ────────────────────────────────────────────────────────────────────
export const usersApi = {
  list: (params: Record<string, any> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request<{ data: any[]; meta: any }>(`/users?${qs}`);
  },
  get: (id: number | string) => request<any>(`/users/${id}`),
  update: (id: number | string, data: Record<string, any>) =>
    request<any>(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  adjustPoints: (id: number | string, type: 'add' | 'deduct', amount: number, reason: string) =>
    request<any>(`/users/${id}/adjust-points`, { method: 'POST', body: JSON.stringify({ type, amount, reason }) }),
};

// ─── Referrals ───────────────────────────────────────────────────────────────
export const referralsApi = {
  list: (params: Record<string, any> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request<{ data: any[]; meta: any }>(`/referrals?${qs}`);
  },
  get: (id: number | string) => request<any>(`/referrals/${id}`),
  update: (id: number | string, data: Record<string, any>) =>
    request<any>(`/referrals/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

// ─── Withdrawals ─────────────────────────────────────────────────────────────
export const withdrawalsApi = {
  list: (params: Record<string, any> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request<{ data: any[]; meta: any }>(`/withdrawals?${qs}`);
  },
  get: (id: number | string) => request<any>(`/withdrawals/${id}`),
  update: (id: number | string, data: Record<string, any>) =>
    request<any>(`/withdrawals/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

// ─── Points / Profession Rates ────────────────────────────────────────────────
export const pointsApi = {
  getProfessionRates: () => request<any[]>('/points/profession-rates'),
  updateProfessionRate: (id: number, data: Record<string, any>) =>
    request<any>(`/points/profession-rates/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getSettings: () => request<any>('/points/settings'),
};

// ─── Settings ────────────────────────────────────────────────────────────────
export const settingsApi = {
  get: () => request<any>('/settings'),
  update: (data: Record<string, any>) =>
    request<any>('/settings', { method: 'PUT', body: JSON.stringify(data) }),
};

// ─── Audit Logs ──────────────────────────────────────────────────────────────
export const auditLogsApi = {
  list: (params: Record<string, any> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request<{ data: any[]; meta: any }>(`/audit-logs?${qs}`);
  },
};

// ─── Connecteam ──────────────────────────────────────────────────────────────
export const connecteamApi = {
  getSettings: () => request<any>('/connecteam/settings'),
  updateSettings: (data: Record<string, any>) =>
    request<any>('/connecteam/settings', { method: 'PUT', body: JSON.stringify(data) }),
  testConnection: (apiKey: string, organizationId: string) =>
    request<{ success: boolean; message: string }>('/connecteam/test-connection', {
      method: 'POST',
      body: JSON.stringify({ apiKey, organizationId }),
    }),
  getHours: (params: Record<string, any> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request<{ data: any[]; meta: any }>(`/connecteam/hours?${qs}`);
  },
  approveHours: (id: string, data: Record<string, any>) =>
    request<any>(`/connecteam/hours/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  bulkApproveHours: (ids: string[], approvedBy?: string) =>
    request<any>('/connecteam/hours/bulk-approve', { method: 'POST', body: JSON.stringify({ ids, approvedBy }) }),
  sync: (adminId?: string) =>
    request<any>('/connecteam/sync', { method: 'POST', body: JSON.stringify({ adminId }) }),
  getLogs: (params: Record<string, any> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request<{ data: any[]; meta: any }>(`/connecteam/logs?${qs}`);
  },
};

// ─── Health ──────────────────────────────────────────────────────────────────
export const healthApi = {
  check: () => request<any>('/health'),
};
