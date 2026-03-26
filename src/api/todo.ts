import { FilterStatus, MetaResponse, Todo, TodoInfo, TodoRequest } from '../types/todo';
import { baseApi } from './axios';

export async function addTodo(title: string): Promise<Todo> {
  const response = await baseApi.post<Todo>('/todos', { title });
  return response.data;
}

export async function getTodoList(filter: FilterStatus): Promise<MetaResponse<Todo, TodoInfo>> {
  const response = await baseApi.get<MetaResponse<Todo, TodoInfo>>('/todos', {
    params: { filter },
  });
  return response.data;
}

export async function editTodo(id: number, todoRequest: TodoRequest): Promise<Todo> {
  const response = await baseApi.put<Todo>(`/todos/${id}`, todoRequest);
  return response.data;
}

export async function deleteTodo(id: number): Promise<void> {
  await baseApi.delete(`/todos/${id}`);
}
