import { useState } from 'react';
import { addNewTodo } from '../api/http';
import { verifyTodoText } from '../helpers/verify';

import styles from './AddTodo.module.scss';

export default function AddTodo({ updateList }) {
  const [todoText, setTodoText] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [error, setError] = useState();

  async function handleAddTodo(event) {
    event.preventDefault();
    const verify = verifyTodoText(todoText);
    if (verify.isNotValid) {
      setError({ message: verify.message });
      return;
    }
    try {
      setIsDisabled(true);
      await addNewTodo(todoText);
      updateList();
      setTodoText('');
    } catch (error) {
      setError({ message: error.message || 'error with add new task' });
    } finally {
      setIsDisabled(false);
    }
  }

  function handleChange(event) {
    setTodoText(event.target.value);
    setError();
  }

  return (
    <>
      <p>{error && error.message}</p>
      <form className={styles.addTodoForm} onSubmit={handleAddTodo}>
        <input
          id="inputAddText"
          type="text"
          value={todoText}
          onChange={handleChange}
          placeholder="task name"
          onPaste={handleChange}
          required></input>
        <button type="submit" disabled={isDisabled}>
          Add
        </button>
      </form>
    </>
  );
}
