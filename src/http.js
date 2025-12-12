export async function addNewTask(title) {
  const response = await fetch('https://easydev.club/api/v1/todos', {
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

export async function getTaskList(param) {
  const response = await fetch(`https://easydev.club/api/v1/todos?filter=${param}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
}

export async function editTask(id, title, isDone) {
  const response = await fetch(`https://easydev.club/api/v1/todos/${id}`, {
    body: JSON.stringify({ title, isDone }),
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
}

export async function deleteTask(id) {
  const response = await fetch(`https://easydev.club/api/v1/todos/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response;
}
