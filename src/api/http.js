export async function addNewTodo(title) {
  const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/todos`, {
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

export async function getTodoList(filter) {
  const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/todos?filter=${filter}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
}

export async function editTodo(id, todoRequest) {
  const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/todos/${id}`, {
    body: JSON.stringify(todoRequest),
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
}

export async function deleteTask(id) {
  const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/todos/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response;
}
