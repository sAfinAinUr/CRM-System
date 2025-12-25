import styles from './TodoListFilterStatusMenu.module.scss';

export default function TodoListFilterStatusMenu({ listInfo, handleClick, filterStatus }) {
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
        className={filterStatus === 'complited' ? styles.active : undefined}
        onClick={() => handleClick('completed')}>
        Выполнено({listInfo.completed})
      </button>
    </nav>
  );
}
