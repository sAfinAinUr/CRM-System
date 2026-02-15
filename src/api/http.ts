import axios from 'axios';
import { TodoRequest, Todo, TodoInfo, MetaResponse, FilterStatus } from '../types/types.ts';

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function addNewTodo(title: string): Promise<Todo> {
  const response = await api.post<Todo>('/13todos', { title });
  return response.data;
}

export async function getTodoList(filter: FilterStatus): Promise<MetaResponse<Todo, TodoInfo>> {
  const response = await api.get<MetaResponse<Todo, TodoInfo>>('/todos', {
    params: { filter },
  });
  return response.data;
}

export async function editTodo(id: number, todoRequest: TodoRequest): Promise<Todo> {
  const response = await api.put<Todo>(`/todos/${id}`, todoRequest);
  return response.data;
}

export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/todos/${id}`);
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'Ошибка сервера';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Произошла непредвиденная ошибка';
}
