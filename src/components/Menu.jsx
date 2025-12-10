function TabButton({ children, isSelected, quantity, ...props }) {
  return (
    <button className={isSelected ? 'active' : undefined} {...props}>
      {children}({quantity})
    </button>
  );
}

export default function Menu({ listInfo, handleClick }) {
  return (
    <section>
      <TabButton quantity={listInfo.all} onClick={() => handleClick('all')}>
        Все
      </TabButton>
      <TabButton quantity={listInfo.inWork} onClick={() => handleClick('inWork')}>
        В работе
      </TabButton>
      <TabButton quantity={listInfo.completed} onClick={() => handleClick('completed')}>
        Выполнено
      </TabButton>
    </section>
  );
}
