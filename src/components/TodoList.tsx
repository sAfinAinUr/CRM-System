import { Flex } from 'antd';
import TodoItem from './TodoItem.jsx';
import { Todo } from '../types/todo';

type TodoListProps = {
  list: Todo[];
  updateList: () => Promise<void>;
  onStartEdit: () => void;
  onStopEdit: () => void;
};

export default function TodoList({ list, updateList, onStartEdit, onStopEdit }: TodoListProps) {
  return (
    <Flex vertical align="center" gap="small" style={{ width: '100%' }}>
      {list.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          updateList={updateList}
          onStartEdit={onStartEdit}
          onStopEdit={onStopEdit}
        />
      ))}
    </Flex>
  );
}
