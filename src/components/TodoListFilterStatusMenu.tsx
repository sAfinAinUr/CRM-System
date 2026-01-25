import styles from './TodoListFilterStatusMenu.module.scss';
import { TodoInfo, FilterStatus } from '../types/types.ts';

type TodoListFilterStatusMenuProps = {
  listInfo: TodoInfo;
  handleClick: (selectedButton: FilterStatus) => void;
  filterStatus: FilterStatus;
};

export default function TodoListFilterStatusMenu({
  listInfo,
  handleClick,
  filterStatus,
}: TodoListFilterStatusMenuProps) {
  return (
    <nav className={styles.filterMenu}>
      <button
        className={filterStatus === 'all' ? styles.active : undefined}
        onClick={() => handleClick('all')}>
        Все({listInfo.all})
      </button>
      <button
        className={filterStatus === 'inWork' ? styles.active : undefined}
        onClick={() => handleClick('inWork')}>
        В работе({listInfo.inWork})
      </button>
      <button
        className={filterStatus === 'completed' ? styles.active : undefined}
        onClick={() => handleClick('completed')}>
        Выполнено({listInfo.completed})
      </button>
    </nav>
  );
}
