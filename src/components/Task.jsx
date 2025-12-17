import { useState } from 'react';
import { deleteTask, editTask } from '../api/http';
import { verifyText } from '../helpers/verify';

export default function Task({ title, isDone, id, updateList }) {
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
    const verify = verifyText(taskName);
    if (verify.mean) {
      setError({ message: verify.message });
      return;
    }
    try {
      // const editedTask = await editTask(id, taskName);
      // functions.edit(editedTask);
      await editTask(id, taskName);
      updateList();
      setError();
    } catch (error) {
      setError({ message: error.message || 'error with edit task' });
    }
    setIsEditing(false);
  }

  function handleClickClose() {
    setIsEditing(false);
    setError();
    setTaskName(title);
  }

  async function handleClickDeleteTask() {
    try {
      await deleteTask(id);
      // functions.delete(id, taskIsDone);
      updateList();
      setError();
    } catch (error) {
      setError({ message: error.message || 'error with delete task' });
    }
  }

  async function handleChangeIsDone() {
    setTaskIsDone((taskIsDone) => !taskIsDone);
    try {
      // const editedTask = await editTask(id, taskName, !taskIsDone);
      // functions.edit(editedTask);
      // functions.chahgeIsDone(!taskIsDone, id);
      await editTask(id, taskName, !taskIsDone);
      updateList();
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
          <input type="text" value={taskName} onChange={handleChange} required />
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
