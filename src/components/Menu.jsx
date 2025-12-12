function TabButton({ children, isSelected, quantity, ...props }) {
  return (
    <button className={isSelected ? 'active' : undefined} {...props}>
      {children}({quantity})
    </button>
  );
}

export default function Menu({ listInfo, handleClick, isSelected }) {
  return (
    <section className="menu">
      <TabButton
        isSelected={isSelected === 'all'}
        quantity={listInfo.all}
        onClick={() => handleClick('all')}>
        Все
      </TabButton>
      <TabButton
        isSelected={isSelected === 'inWork'}
        quantity={listInfo.inWork}
        onClick={() => handleClick('inWork')}>
        В работе
      </TabButton>
      <TabButton
        isSelected={isSelected === 'completed'}
        quantity={listInfo.completed}
        onClick={() => handleClick('completed')}>
        Выполнено
      </TabButton>
    </section>
  );
}
