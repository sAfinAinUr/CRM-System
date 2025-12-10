import { useState } from 'react';
import { addNewTask } from '../http';

export function verifyText(text) {
  return text.length < 2 || text.length > 65;
}

export default function AddTask({ handleAddNewTask }) {
  const [taskText, setTaskText] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [error, setError] = useState();

  async function handleAddTask(event) {
    event.preventDefault();
    setIsDisabled(true);
    try {
      const task = await addNewTask(taskText);
      handleAddNewTask(task);
    } catch (error) {
      setError({ message: error.message || 'error with add new task' });
    }
    setTaskText('');
    return false;
  }

  function handleChange(event) {
    setIsDisabled(verifyText(event.target.value));
    setError();
    setTaskText(event.target.value);
  }

  return (
    <form className="AddTaskButton" onSubmit={handleAddTask}>
      {error && <label htmlFor="inputAddText">{error.message}</label>}
      <input
        id="inputAddText"
        type="text"
        value={taskText}
        onChange={handleChange}
        placeholder="task name"
        onPaste={handleChange}
        required></input>
      <button type="submit" disabled={isDisabled}>
        Add
      </button>
    </form>
  );
}
