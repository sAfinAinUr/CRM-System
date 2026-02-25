import axios from 'axios';
import { TodoRequest, Todo, TodoInfo, MetaResponse, FilterStatus } from '../types/types.ts';

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function addTodo(title: string): Promise<Todo> {
  const response = await api.post<Todo>('/todos', { title });
  return response.data;
}

export async function getTodoList(filter: FilterStatus): Promise<MetaResponse<Todo, TodoInfo>> {
  const response = await api.get<MetaResponse<Todo, TodoInfo>>('/todos', {
    params: { filter },
  });
  return response.data;
}

export async function updateTodo(id: number, todoRequest: TodoRequest): Promise<Todo> {
  const response = await api.put<Todo>(`/todos/${id}`, todoRequest);
  return response.data;
}

export async function deleteTodo(id: number): Promise<void> {
  await api.delete(`/todos/${id}`);
}
