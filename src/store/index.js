import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('va_user') || 'null'),
  token: localStorage.getItem('va_token') || null,
  login: (user, token) => {
    localStorage.setItem('va_token', token);
    localStorage.setItem('va_user', JSON.stringify(user));
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('va_token');
    localStorage.removeItem('va_user');
    set({ user: null, token: null });
  },
}));

export const useReportStore = create((set, get) => ({
  reports: [],
  currentReport: null,
  jobStatus: null, // 'pending' | 'processing' | 'completed' | 'failed'
  jobReportId: null,
  setReports: (reports) => set({ reports }),
  setCurrentReport: (report) => set({ currentReport: report }),
  setJob: (reportId, status) => set({ jobReportId: reportId, jobStatus: status }),
  clearJob: () => set({ jobReportId: null, jobStatus: null }),
}));
