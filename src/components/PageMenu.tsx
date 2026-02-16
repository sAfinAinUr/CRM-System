import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import MenuItem from 'antd/es/menu/MenuItem';
import { useNavigate, useLocation } from 'react-router';

type MenuItem = Required<MenuProps>['items'][number];
enum MenuItemKey {
  profile = '1',
  list = '2',
}
const items: MenuItem[] = [
  {
    key: 'grp',
    type: 'group',
    children: [
      { key: MenuItemKey.profile, label: 'Профиль' },
      { key: MenuItemKey.list, label: 'Список задач' },
    ],
  },
];
const defaultPage = [MenuItemKey.list];
export default function PageMenu() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === MenuItemKey.profile) {
      navigate('/profile');
    } else if (key === MenuItemKey.list) {
      navigate('/');
    }
  };

  return (
    <Menu
      selectedKeys={[pathname === '/' ? MenuItemKey.list : MenuItemKey.profile]}
      defaultSelectedKeys={defaultPage}
      onClick={onClick}
      style={{ width: '100%', height: '100%' }}
      mode="inline"
      items={items}
    />
  );
}
