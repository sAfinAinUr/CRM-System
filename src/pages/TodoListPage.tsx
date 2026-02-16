import { useState, useEffect, useRef } from 'react';
import { getErrorMessage, getTodoList } from '../api/http';
import TodoList from '../components/TodoList';
import TodoListFilterStatusMenu from '../components/TodoListFilterStatusMenu';
import AddTodo from '../components/AddTodo';
import { MetaResponse, Todo, TodoInfo, FilterStatus } from '../types/types.ts';

import { Flex, message, Spin } from 'antd';
import LayoutPage from './LayoutPage.tsx';

const DEFAULT_LIST_INFO = {
  all: 0,
  completed: 0,
  inWork: 0,
};
const refetchTodoListInterval = 5 * 1000;

export default function TodoListPage() {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [filterStatusOfTaskList, setFilterStatusOfTaskList] = useState<FilterStatus>('all');
  const [todoListInfo, setTodoListInfo] = useState<TodoInfo>(DEFAULT_LIST_INFO);

  const refetchTodoListIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
    refetchTodoListIntervalRef.current = setInterval(fetchTodoData, refetchTodoListInterval);
    return () => {
      if (refetchTodoListIntervalRef.current) {
        clearInterval(refetchTodoListIntervalRef.current);
      }
    };
  }, [filterStatusOfTaskList]);

  function handleClickSelectTasks(selectedButton: FilterStatus) {
    setFilterStatusOfTaskList(selectedButton);
  }
  return (
    <LayoutPage>
      <AddTodo updateList={fetchTodoData} />
      <TodoListFilterStatusMenu listInfo={todoListInfo} handleClick={handleClickSelectTasks} />
      {isFetching ? (
        <Flex justify="center" align="center" style={{ minHeight: '400px' }}>
          <Spin size="large" />
        </Flex>
      ) : (
        <TodoList list={todoList} updateList={fetchTodoData} />
      )}
    </LayoutPage>
  );
}
