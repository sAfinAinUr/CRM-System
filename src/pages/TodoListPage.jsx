import { useState, useEffect } from 'react';
import { getTodoList } from '../api/http';
import TodoList from '../components/TodoList';
import TodoListFilterStatusMenu from '../components/TodoListFilterStatusMenu';
import AddTodo from '../components/AddTodo';

import styles from './TodoListPage.module.scss';

const DEFAULT_LIST_INFO = {
  all: 0,
  completed: 0,
  inWork: 0,
};

export default function TodoListPage() {
  const [todoList, setTodoList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [filterStatusOfTaskList, setFilterStatusOfTaskList] = useState('all');
  const [todoListInfo, setrTodoListInfo] = useState(DEFAULT_LIST_INFO);
  const [error, setError] = useState();

  async function fetchTodoData() {
    setIsFetching(true);
    setError();
    try {
      const response = await getTodoList(filterStatusOfTaskList);
      setTodoList(response.data);
      setrTodoListInfo(response.info);
    } catch (error) {
      setError({ message: error.message || 'Failed to fetch list' });
    } finally {
      setIsFetching(false);
    }
  }

  useEffect(() => {
    fetchTodoData();
  }, [filterStatusOfTaskList]);

  function handleClickSelectTasks(selectedButton) {
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
