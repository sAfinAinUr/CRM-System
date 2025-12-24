import { useState } from 'react';
import { deleteTask, editTodo } from '../api/http';
import { verifyTodoText } from '../helpers/verify';

import okLogo from '../assets/ok.svg';
import closeLogo from '../assets/close.svg';
import editLogo from '../assets/edit.svg';
import deleteLogo from '../assets/delete.svg';

import IconButton from '../ui/IconButton/IconButton';

import styles from './Todo.module.scss';

export default function Todo({ todo, updateList }) {
  const [todoTitle, setTodoTitle] = useState(todo.title);
  const [todoIsDone, setTodoIsDone] = useState(todo.isDone);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState();

  function handleChange(event) {
    setTodoTitle(event.target.value);
  }

  function handleClickStartEdit() {
    setIsEditing((editing) => !editing);
  }

  async function handleClickEditTodo(event) {
    event.preventDefault();
    if (todo.title === todoTitle) {
      setIsEditing(false);
      return;
    }
    const verify = verifyTodoText(todoTitle);
    if (verify.isNotValid) {
      setError({ message: verify.message });
      return;
    }
    try {
      await editTodo(todo.id, { title: todoTitle });
      updateList();
      setError();
    } catch (error) {
      setError({ message: error.message || 'error with edit task' });
    }
    setIsEditing(false);
  }

  function handleClickCloseEditing() {
    setIsEditing(false);
    setError();
    setTodoTitle(todo.title);
  }

  async function handleClickDeleteTask() {
    try {
      await deleteTask(todo.id);
      updateList();
      setError();
    } catch (error) {
      setError({ message: error.message || 'error with delete task' });
    }
  }

  async function handleChangeIsDone() {
    setTodoIsDone((taskIsDone) => !taskIsDone);
    try {
      await editTodo(todo.id, { isDone: !todoIsDone });
      updateList();
      setError();
    } catch (error) {
      setError({ message: error.message || 'error with edit task' });
    }
  }

  return (
    <li>
      {isEditing ? (
        <form onSubmit={handleClickEditTodo} className={styles.formEdit}>
          <p>{error && error.message}</p>
          <div className={styles.groupCheckBoxAndTodoTitle}>
            <input type="text" value={todoTitle} onChange={handleChange} required />
          </div>
          <div className={styles.groupIconButtons}>
            <IconButton className="ok" type="submit">
              <img src={okLogo} alt="ok" />
            </IconButton>
            <IconButton className="close" onClick={handleClickCloseEditing}>
              <img src={closeLogo} alt="close" />
            </IconButton>
          </div>
        </form>
      ) : (
        <>
          <div className={styles.groupCheckBoxAndTodoTitle}>
            <input type="checkbox" checked={todoIsDone} onChange={handleChangeIsDone}></input>
            <span className={todoIsDone ? 'isDone' : undefined}>{todo.title}</span>
          </div>
          <div className={styles.groupIconButtons}>
            <IconButton onClick={handleClickStartEdit}>
              <img src={editLogo} alt="edit" />
            </IconButton>
            <IconButton className="delete" onClick={handleClickDeleteTask}>
              <img src={deleteLogo} alt="delete" />
            </IconButton>
          </div>
        </>
      )}
    </li>
  );
}
