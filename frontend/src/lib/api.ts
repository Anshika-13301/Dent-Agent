const API_BASE = '/api';

export async function request(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('dental_saas_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data;
}

export const api = {
  auth: {
    login: (credentials: { email: string; password: string }) =>
      request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (payload: any) =>
      request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
    me: () => request('/auth/me'),
    demoAccounts: () => request('/auth/demo-accounts'),
  },

  patients: {
    getAll: (params: Record<string, any> = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/patients${q ? `?${q}` : ''}`);
    },
    getById: (id: string) => request(`/patients/${id}`),
    create: (data: any) => request('/patients', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request(`/patients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    scanOverdue: (params: Record<string, any> = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/patients/scan-overdue${q ? `?${q}` : ''}`);
    },
    launchCampaign: (payload: { patientIds?: string[]; campaignType?: string }) =>
      request('/patients/launch-campaign', { method: 'POST', body: JSON.stringify(payload) }),
  },

  appointments: {
    getAll: (params: Record<string, any> = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/appointments${q ? `?${q}` : ''}`);
    },
    getSlots: (daysAhead: number = 7) => request(`/appointments/available-slots?daysAhead=${daysAhead}`),
    book: (data: any) => request('/appointments', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) =>
      request(`/appointments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },

  conversations: {
    getAll: (params: Record<string, any> = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/conversations${q ? `?${q}` : ''}`);
    },
    getById: (id: string) => request(`/conversations/${id}`),
    sendMessage: (id: string, text: string) =>
      request(`/conversations/${id}/messages`, { method: 'POST', body: JSON.stringify({ text }) }),
    toggleAI: (id: string, aiEnabled: boolean) =>
      request(`/conversations/${id}/toggle-ai`, { method: 'PATCH', body: JSON.stringify({ aiEnabled }) }),
    simulate: (payload: { conversationId?: string; patientId?: string; text: string }) =>
      request('/conversations/simulate', { method: 'POST', body: JSON.stringify(payload) }),
  },

  billing: {
    getCurrent: (cycle?: string) => request(`/billing/current${cycle ? `?cycle=${cycle}` : ''}`),
    getHistory: () => request('/billing/history'),
    getROIAnalytics: () => request('/billing/roi-analytics'),
    recalculate: (cycle?: string) =>
      request('/billing/recalculate', { method: 'POST', body: JSON.stringify({ cycle }) }),
  },

  tenants: {
    getAll: () => request('/tenants'),
    getDetails: (id: string) => request(`/tenants/${id}`),
    updateSettings: (id: string, data: any) =>
      request(`/tenants/${id}/settings`, { method: 'PUT', body: JSON.stringify(data) }),
    getSuperAdminMetrics: () => request('/tenants/metrics/superadmin'),
  },
};
