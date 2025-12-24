import styles from './TodoListFilterStatusMenu.module.scss';

export default function TodoListFilterStatusMenu({ listInfo, handleClick, filterStatus }) {
  return (
    <nav className={styles.filterMenu}>
      <button
        className={filterStatus === 'all' ? 'active' : undefined}
        onClick={() => handleClick('all')}>
        Все({listInfo.all})
      </button>
      <button
        className={filterStatus === 'inWork' ? 'active' : undefined}
        onClick={() => handleClick('inWork')}>
        В работе({listInfo.inWork})
      </button>
      <button
        className={filterStatus === 'complited' ? 'active' : undefined}
        onClick={() => handleClick('complited')}>
        Выполнено({listInfo.completed})
      </button>
    </nav>
  );
}
