import { getSession } from 'next-auth/react';
import api from '../api';
import { useAuthStore } from '@/store/authStore';

export type Project = {
  id: string;
  name: string;
  description: string;
  knowledge_base_id: string;
  created_at: string;
  updated_at: string;
};

export type ProjectChat = {
  id: string;
  project_id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

export type ProjectMessage = {
  id: string;
  chat_id: string;
  role: 'user' | 'assistant';
  content: string;
  generation_job_id?: string;
  created_at: string;
};

export type KnowledgeSource = {
  id: string;
  source: string;
  type: 'pdf' | 'website' | 'text';
  chunk_count: number;
  indexed_at: string;
  is_ready: boolean;
};

export type ToolType = 'create_presentation' | 'write_report' | 'analyze_data' | 'generate_image';

export type ToolJob = {
  id: string;
  project_id: string;
  chat_id: string;
  tool_type: ToolType | string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress_stage: string;
  user_prompt?: string;
  content_json?: any;
  output_file_url?: string;
  error?: string;
  created_at: string;
};

export type ToolExecutionResult = {
  job: ToolJob;
  user_message: ProjectMessage;
  assistant_message: ProjectMessage;
};

export const fetchProjects = async (): Promise<Project[]> => {
  const response = await api.get<Project[]>('/projects');
  return response.data;
};

export const createProject = async (name: string, description: string): Promise<Project> => {
  const response = await api.post<Project>('/projects', { name, description });
  return response.data;
};

export const fetchProject = async (id: string): Promise<Project> => {
  const response = await api.get<Project>(`/projects/${id}`);
  return response.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/projects/${id}`);
};

export const fetchProjectChats = async (projectId: string): Promise<ProjectChat[]> => {
  const response = await api.get<ProjectChat[]>(`/projects/${projectId}/chats`);
  return response.data;
};

export const createProjectChat = async (projectId: string, title: string): Promise<ProjectChat> => {
  const response = await api.post<ProjectChat>(`/projects/${projectId}/chats`, { title });
  return response.data;
};

export const fetchProjectChatHistory = async (projectId: string, chatId: string): Promise<ProjectMessage[]> => {
  const response = await api.get<ProjectMessage[]>(`/projects/${projectId}/chats/${chatId}/messages`);
  return response.data;
};

export const deleteProjectChat = async (projectId: string, chatId: string): Promise<void> => {
  await api.delete(`/projects/${projectId}/chats/${chatId}`);
};

export const fetchProjectSources = async (projectId: string): Promise<KnowledgeSource[]> => {
  const response = await api.get<{ sources: KnowledgeSource[] } | KnowledgeSource[]>(`/projects/${projectId}/sources`);
  if (Array.isArray(response.data)) return response.data;
  return (response.data as any)?.sources || [];
};

export const ingestProjectUrl = async (projectId: string, url: string, contentRightsConfirmed = true): Promise<any> => {
  const response = await api.post(`/projects/${projectId}/ingest/url`, {
    source: url,
    content_rights_confirmed: contentRightsConfirmed,
  });
  return response.data;
};

export const ingestProjectPdf = async (projectId: string, file: File, contentRightsConfirmed = true): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('content_rights_confirmed', String(contentRightsConfirmed));
  const response = await api.post(`/projects/${projectId}/ingest/pdf`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const executeProjectTool = async (projectId: string, chatId: string, toolType: string, userPrompt: string): Promise<ToolExecutionResult> => {
  const response = await api.post<ToolExecutionResult>(`/projects/${projectId}/tools/execute`, {
    chat_id: chatId,
    tool_type: toolType,
    user_prompt: userPrompt,
  });
  return response.data;
};

export const getProjectJobStatus = async (projectId: string, jobId: string): Promise<ToolJob> => {
  const response = await api.get<ToolJob>(`/projects/${projectId}/tools/jobs/${jobId}`);
  return response.data;
};

export const fetchChatJobs = async (projectId: string, chatId: string): Promise<ToolJob[]> => {
  const response = await api.get<ToolJob[]>(`/projects/${projectId}/chats/${chatId}/jobs`);
  return response.data || [];
};

/**
 * Re-runs a job as a fresh one and repoints the existing chat message to it
 * server-side — unlike executeProjectTool, this does NOT create a new chat
 * turn, so retrying a failed artifact updates it in place instead of
 * appending a duplicate user/assistant message pair.
 */
export const regenerateJob = async (projectId: string, jobId: string): Promise<ToolJob> => {
  const response = await api.post<ToolJob>(`/projects/${projectId}/tools/jobs/${jobId}/regenerate`);
  return response.data;
};

/**
 * Opens the job-status SSE stream and calls onUpdate for every emitted job
 * snapshot, resolving with the final one once the stream closes. Uses a raw
 * fetch + ReadableStream reader (not EventSource) so the bearer token this
 * app relies on can be sent as a header.
 */
export const streamJobStatus = async (
  projectId: string,
  jobId: string,
  onUpdate: (job: ToolJob) => void
): Promise<ToolJob | null> => {
  const session = await getSession();
  const token = (session as any)?.accessToken || useAuthStore.getState().token;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1';

  const response = await fetch(`${baseUrl}/projects/${projectId}/tools/jobs/${jobId}/stream`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok || !response.body) {
    throw new Error('Failed to open job status stream');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let lastJob: ToolJob | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const frames = buffer.split('\n\n');
    buffer = frames.pop() || '';

    for (const frame of frames) {
      const line = frame.trim();
      if (!line.startsWith('data: ')) continue;
      try {
        const job = JSON.parse(line.slice(6)) as ToolJob;
        lastJob = job;
        onUpdate(job);
      } catch {
        // ignore malformed/partial frames
      }
    }
  }

  return lastJob;
};
