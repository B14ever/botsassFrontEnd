import api from '../api';

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

export type ToolJob = {
  id: string;
  tool_type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  output_file_url?: string;
  error?: string;
  created_at: string;
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

export const executeProjectTool = async (projectId: string, chatId: string, toolType: string, userPrompt: string): Promise<ToolJob> => {
  const response = await api.post<ToolJob>(`/projects/${projectId}/tools/execute`, {
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
