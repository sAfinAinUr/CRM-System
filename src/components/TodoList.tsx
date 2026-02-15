import { Flex } from 'antd';
import TodoItem from './TodoItem.jsx';
import { Todo } from '../types/types.ts';

type TodoListProps = {
  list: Todo[];
  updateList: () => Promise<void>;
};

export default function TodoList({ list, updateList }: TodoListProps) {
  return (
    <Flex vertical align="center" gap="small" style={{ width: '100%' }}>
      {list.map((todo) => (
        <TodoItem key={todo.id} todo={todo} updateList={updateList} />
      ))}
    </Flex>
  );
}
