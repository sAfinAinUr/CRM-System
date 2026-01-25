import TodoItem from './TodoItem.jsx';
import styles from './TodoList.module.scss';
import { Todo } from '../types/types.ts';

type TodoListProps = {
  list: Todo[];
  updateList: () => Promise<void>;
};

export default function TodoList({ list, updateList }: TodoListProps) {
  return (
    <ul className={styles.todoList}>
      {list.map((todo) => (
        <TodoItem key={todo.id} todo={todo} updateList={updateList} />
      ))}
    </ul>
  );
}
