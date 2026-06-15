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
