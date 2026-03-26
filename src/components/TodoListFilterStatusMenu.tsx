import { TodoInfo, FilterStatus } from '../types/todo';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

type TodoListFilterStatusMenuProps = {
  listInfo: TodoInfo;
  handleClick: (selectedButton: FilterStatus) => void;
};

export default function TodoListFilterStatusMenu({
  listInfo,
  handleClick,
}: TodoListFilterStatusMenuProps) {
  const items: (Omit<NonNullable<TabsProps['items']>[number], 'key'> & { key: FilterStatus })[] = [
    {
      key: 'all',
      label: `Все(${listInfo.all})`,
    },
    {
      key: 'inWork',
      label: `В работе(${listInfo.inWork})`,
    },
    {
      key: 'completed',
      label: `Выполнено(${listInfo.completed})`,
    },
  ];

  const onChange = (key: string) => {
    handleClick(key as FilterStatus);
  };
  return (
    <Tabs style={{ marginTop: 16 }} defaultActiveKey="all" items={items} onChange={onChange} />
  );
}
