import { useState } from 'react';
import { deleteTask, editTask } from '../http';
import { verifyText } from './addTask';

export default function Task({ title, isDone, id, functions }) {
  const [taskName, setTaskName] = useState(title);
  const [taskIsDone, setTaskIsDone] = useState(isDone);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState();

  function handleChange(event) {
    setTaskName(event.target.value);
  }

  function handleClickStartEdit() {
    setIsEditing((editing) => !editing);
  }

  async function handleClickEditTask() {
    if (verifyText(taskName)) {
      setError({ message: 'invalid format' });
      return;
    }
    try {
      const editedTask = await editTask(id, taskName);
      functions.edit(editedTask);
      setError();
    } catch (error) {
      setError({ message: error.message || 'error with edit task' });
    }
    setIsEditing(false);
  }

  function handleClickClose() {
    setIsEditing(false);
    setError();
  }

  function handleClickDeleteTask() {
    try {
      deleteTask(id);
      functions.delete(id, taskIsDone);
      setError();
    } catch (error) {
      setError({ message: error.message || 'error with delete task' });
    }
  }

  async function handleChangeIsDone() {
    setTaskIsDone((taskIsDone) => !taskIsDone);
    try {
      const editedTask = await editTask(id, taskName, !taskIsDone);
      functions.edit(editedTask);
      functions.chahgeIsDone(!taskIsDone, id);
      setError();
    } catch (error) {
      setError({ message: error.message || 'error with edit task' });
    }
  }

  return (
    <li>
      <div className="checkText">
        {!isEditing && (
          <input type="checkbox" checked={taskIsDone} onChange={handleChangeIsDone}></input>
        )}
        {isEditing ? (
          <input type="text" defaultValue={taskName} onChange={handleChange} required />
        ) : (
          <span className={taskIsDone ? 'isDone' : undefined}>{title}</span>
        )}
      </div>
      <div className="funButtons">
        <button id="edit" onClick={!isEditing ? handleClickStartEdit : handleClickEditTask}>
          {isEditing ? <>✔️</> : <>📝</>}
        </button>
        <button id="closeDelete" onClick={isEditing ? handleClickClose : handleClickDeleteTask}>
          {isEditing ? <>❌</> : <>🗑️</>}
        </button>
      </div>
      {error && <p>{error.message}</p>}
    </li>
  );
}
