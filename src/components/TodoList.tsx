import { Flex } from 'antd';

import { Todo } from '../types/todo';
import TodoItem from './TodoItem.jsx';

type Props = {
  list: Todo[];
  updateList: () => Promise<void>;
  onStartEdit: () => void;
  onStopEdit: () => void;
};

export default function TodoList({ list, updateList, onStartEdit, onStopEdit }: Props) {
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
