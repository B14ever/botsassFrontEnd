import axios from 'axios';
import { getSession } from 'next-auth/react';
import { useAuthStore } from '@/store/authStore';
import { useWorkspaceStore } from '@/store/workspaceStore';

type SessionWithAccessToken = {
  accessToken?: string;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
});

api.interceptors.request.use(async (config) => {
  let token = null;

  if (typeof window !== 'undefined') {
    const session = await getSession();
    token = (session as SessionWithAccessToken | null)?.accessToken || useAuthStore.getState().token;
  } else {
    token = useAuthStore.getState().token;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const activeWorkspaceId = useWorkspaceStore.getState().activeWorkspaceId;
  if (activeWorkspaceId) {
    config.headers['X-Workspace-ID'] = activeWorkspaceId;
  }

  return config;
});

export default api;
