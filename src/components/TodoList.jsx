import Todo from './Todo';
import styles from './TodoList.module.scss';

export default function TodoList({ list, updateList }) {
  return (
    <ul className={styles.todoList}>
      {list.map((todo) => (
        <Todo key={todo.id} todo={todo} updateList={updateList} />
      ))}
    </ul>
  );
}
