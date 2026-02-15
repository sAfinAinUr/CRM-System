import { useState, useEffect } from 'react';
import { getErrorMessage, getTodoList } from '../api/http';
import TodoList from '../components/TodoList';
import TodoListFilterStatusMenu from '../components/TodoListFilterStatusMenu';
import AddTodo from '../components/AddTodo';
import { MetaResponse, Todo, TodoInfo, FilterStatus } from '../types/types.ts';

import { Flex, message, Spin } from 'antd';

const DEFAULT_LIST_INFO = {
  all: 0,
  completed: 0,
  inWork: 0,
};

export default function TodoListPage() {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [filterStatusOfTaskList, setFilterStatusOfTaskList] = useState<FilterStatus>('all');
  const [todoListInfo, setTodoListInfo] = useState<TodoInfo>(DEFAULT_LIST_INFO);

  async function fetchTodoData(): Promise<void> {
    setIsFetching(true);
    try {
      const response: MetaResponse<Todo, TodoInfo> = await getTodoList(filterStatusOfTaskList);
      setTodoList(response.data);
      setTodoListInfo(response.info || DEFAULT_LIST_INFO);
    } catch (error: unknown) {
      message.error(getErrorMessage(error));
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
      <TodoListFilterStatusMenu listInfo={todoListInfo} handleClick={handleClickSelectTasks} />
      {isFetching ? (
        <Flex justify="center" align="center" style={{ minHeight: '400px' }}>
          <Spin size="large" tip="Загрузка задач..." />
        </Flex>
      ) : (
        <TodoList list={todoList} updateList={fetchTodoData} />
      )}
    </>
  );
}
