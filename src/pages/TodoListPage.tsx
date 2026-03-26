import { useState, useEffect, useRef, useCallback } from 'react';
import { getTodoList } from '../api/todo';
import TodoList from '../components/TodoList';
import TodoListFilterStatusMenu from '../components/TodoListFilterStatusMenu';
import AddTodo from '../components/AddTodo';
import { MetaResponse, Todo, TodoInfo, FilterStatus } from '../types/todo';

import { Flex, message, Spin } from 'antd';
import { getErrorMessage } from '../helpers/getErrorMessage.ts';

const DEFAULT_LIST_INFO = {
  all: 0,
  completed: 0,
  inWork: 0,
};
const refetchTodoListInterval = 5000;

export default function TodoListPage() {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [filterStatusOfTaskList, setFilterStatusOfTaskList] = useState<FilterStatus>('all');
  const [todoListInfo, setTodoListInfo] = useState<TodoInfo>(DEFAULT_LIST_INFO);
  const [isEditingAnyTask, setIsEditingAnyTask] = useState<boolean>(false);

  const refetchTodoListIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchTodoData = useCallback(async (): Promise<void> => {
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
  }, [filterStatusOfTaskList]);
  const handleStartEdit = () => setIsEditingAnyTask(true);
  const handleStopEdit = () => setIsEditingAnyTask(false);
  useEffect(() => {
    fetchTodoData();
  }, [filterStatusOfTaskList]);
  useEffect(() => {
    if (!isEditingAnyTask) {
      refetchTodoListIntervalRef.current = setInterval(fetchTodoData, refetchTodoListInterval);
    }
    return () => {
      if (refetchTodoListIntervalRef.current) {
        clearInterval(refetchTodoListIntervalRef.current);
        refetchTodoListIntervalRef.current = null;
      }
    };
  }, [filterStatusOfTaskList, isEditingAnyTask]);

  function handleClickSelectTasks(selectedButton: FilterStatus) {
    setFilterStatusOfTaskList(selectedButton);
  }

  return (
    <>
      <AddTodo updateList={fetchTodoData} />
      <TodoListFilterStatusMenu listInfo={todoListInfo} handleClick={handleClickSelectTasks} />
      {isFetching && todoList.length === 0 ? (
        <Flex justify="center" align="center" style={{ minHeight: '400px' }}>
          <Spin size="large" />
        </Flex>
      ) : (
        <TodoList
          list={todoList}
          updateList={fetchTodoData}
          onStartEdit={handleStartEdit}
          onStopEdit={handleStopEdit}
        />
      )}
    </>
  );
}
