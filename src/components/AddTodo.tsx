import { ChangeEvent, ClipboardEvent, FormEvent, FormEventHandler, useState } from 'react';
import { addNewTodo } from '../api/http';
import { verifyTodoText } from '../helpers/verify';

import styles from './AddTodo.module.scss';

type AddTodoProps = {
  updateList: () => Promise<void>;
};

export default function AddTodo({ updateList }: AddTodoProps) {
  const [todoText, setTodoText] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [error, setError] = useState<{ message?: string }>();

  async function handleAddTodo(event: FormEvent<HTMLFormElement>): Promise<void> {
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
    } catch (error: any) {
      setError({ message: error.message || 'error with add new task' });
    } finally {
      setIsDisabled(false);
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setTodoText(event.target.value);
    setError({});
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    setTodoText(event.currentTarget.value);
    setError({});
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
          onPaste={handlePaste}
          required></input>
        <button type="submit" disabled={isDisabled}>
          Add
        </button>
      </form>
    </>
  );
}
