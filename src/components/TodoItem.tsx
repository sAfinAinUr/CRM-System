import { ChangeEvent, FormEvent, useState } from 'react';
import { deleteTask, editTodo } from '../api/http';
import { verifyTodoText } from '../helpers/verify';
import { Todo } from '../types/types.ts';
import IconButton from '../ui/IconButton/IconButton';

import styles from './Todo.module.scss';

type TodoItemProps = {
  todo: Todo;
  updateList: () => Promise<void>;
};

export default function TodoItem({ todo, updateList }: TodoItemProps) {
  const [todoTitle, setTodoTitle] = useState<string>(todo.title);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [error, setError] = useState<{ message?: string }>();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setTodoTitle(event.target.value);
  }

  function handleClickStartEdit() {
    setIsEditing((editing) => !editing);
  }

  async function handleClickEditTodo(event: FormEvent<HTMLFormElement>) {
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
      setError({});
    } catch (error: unknown) {
      if (typeof error === 'string') {
        setError({ message: error });
      } else if (error instanceof Error) {
        setError({ message: error.message });
      } else setError({ message: 'error with add new task' });
    }
    setIsEditing(false);
  }

  function handleClickCloseEditing() {
    setIsEditing(false);
    setError({});
    setTodoTitle(todo.title);
  }

  async function handleClickDeleteTask() {
    try {
      await deleteTask(todo.id);
      updateList();
      setError({});
    } catch (error: unknown) {
      if (typeof error === 'string') {
        setError({ message: error });
      } else if (error instanceof Error) {
        setError({ message: error.message });
      } else setError({ message: 'error with add new task' });
    }
  }

  async function handleChangeIsDone() {
    try {
      await editTodo(todo.id, { isDone: !todo.isDone });
      updateList();
      setError({});
    } catch (error: unknown) {
      if (typeof error === 'string') {
        setError({ message: error });
      } else if (error instanceof Error) {
        setError({ message: error.message });
      } else setError({ message: 'error with add new task' });
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
            <IconButton variant="primary" icon="ok" type="submit" />
            <IconButton
              variant="secondary"
              icon="close"
              onClick={handleClickCloseEditing}
              type="button"
            />
          </div>
        </form>
      ) : (
        <>
          <div className={styles.groupCheckBoxAndTodoTitle}>
            <input type="checkbox" checked={todo.isDone} onChange={handleChangeIsDone}></input>
            <span className={todo.isDone ? styles.isDone : undefined}>{todo.title}</span>
          </div>
          <div className={styles.groupIconButtons}>
            <IconButton icon="edit" onClick={handleClickStartEdit} />
            <IconButton variant="danger" icon="delete" onClick={handleClickDeleteTask} />
          </div>
        </>
      )}
    </li>
  );
}
