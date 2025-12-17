import { useState } from 'react';
import { addNewTask } from '../api/http';
import { verifyText } from '../helpers/verify';

export default function AddTask({ updateList }) {
  const [taskText, setTaskText] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [error, setError] = useState();

  async function handleAddTask(event) {
    event.preventDefault();
    setIsDisabled(true);
    try {
      // const task = await addNewTask(taskText);
      // handleAddNewTask(task);
      await addNewTask(taskText);
      updateList();
    } catch (error) {
      setError({ message: error.message || 'error with add new task' });
    }
    setTaskText('');
    return false;
  }

  function handleChange(event) {
    const verify = verifyText(event.target.value);
    setIsDisabled(verify.mean);
    setError({ message: verify.message });
    setTaskText(event.target.value);
    if (event.target.value === '') setTimeout(() => setError(), 9000);
  }

  return (
    <form className="addTask" onSubmit={handleAddTask}>
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
