import { TodoRequest, Todo, TodoInfo, MetaResponse, FilterStatus } from '../types/types.ts';

const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

export async function addNewTodo(title: string): Promise<Todo> {
  const response = await fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    body: JSON.stringify({ title }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to add new task.');
  }

  return await response.json();
}

export async function getTodoList(filter: FilterStatus): Promise<MetaResponse<Todo, TodoInfo>> {
  const response = await fetch(`${BASE_URL}/todos?filter=${filter}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
}

export async function editTodo(id: number, todoRequest: TodoRequest): Promise<Todo> {
  const response = await fetch(`${BASE_URL}/todos/${id}`, {
    body: JSON.stringify(todoRequest),
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
}

export async function deleteTask(id: number) {
  const response = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response;
}
