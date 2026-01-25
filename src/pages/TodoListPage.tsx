import { useState, useEffect } from 'react';
import { getTodoList } from '../api/http';
import TodoList from '../components/TodoList';
import TodoListFilterStatusMenu from '../components/TodoListFilterStatusMenu';
import AddTodo from '../components/AddTodo';
import { MetaResponse, Todo, TodoInfo, FilterStatus } from '../types/types.ts';

import styles from './TodoListPage.module.scss';

const DEFAULT_LIST_INFO = {
  all: 0,
  completed: 0,
  inWork: 0,
};

export default function TodoListPage() {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [filterStatusOfTaskList, setFilterStatusOfTaskList] = useState<FilterStatus>('all');
  const [todoListInfo, setrTodoListInfo] = useState<TodoInfo>(DEFAULT_LIST_INFO);
  const [error, setError] = useState<{ message: string }>();

  async function fetchTodoData(): Promise<void> {
    setIsFetching(true);
    setError(undefined);
    try {
      const response = await getTodoList(filterStatusOfTaskList);
      setTodoList(response.data);
      console.log(response);
      setrTodoListInfo(response.info);
    } catch (error: any) {
      setError({ message: error.message || 'Failed to fetch list' });
    } finally {
      setIsFetching(false);
    }
  }

  useEffect(() => {
    fetchTodoData();
  }, [filterStatusOfTaskList]);

  function handleClickSelectTasks(selectedButton: FilterStatus) {
    setFilterStatusOfTaskList(selectedButton);
  }
  return (
    <>
      <AddTodo updateList={fetchTodoData} />
      <section className={styles.content}>
        <TodoListFilterStatusMenu
          listInfo={todoListInfo}
          handleClick={handleClickSelectTasks}
          filterStatus={filterStatusOfTaskList}
        />
        {error && <p>{error.message}</p>}
        {!error && isFetching ? (
          <p>Loading...</p>
        ) : (
          <TodoList list={todoList} updateList={fetchTodoData} />
        )}
      </section>
    </>
  );
}
