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
    setIsDisabled(true);
    const verify = verifyTodoText(todoText);
    if (verify.isNotValid) {
      setError({ message: verify.message });
      return;
    }
    try {
      await addNewTodo(todoText);
      updateList();
    } catch (error) {
      setError({ message: error.message || 'error with add new task' });
    }
    setTodoText('');
  }

  function handleChange(event) {
    setTodoText(event.target.value);
    setError();
    setIsDisabled(false);
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
