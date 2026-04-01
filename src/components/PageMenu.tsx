import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';

import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import MenuItem from 'antd/es/menu/MenuItem';

import { selectUserRoles, useAppSelector } from '../store';
import { Role } from '../types/auth';

type MenuItem = Required<MenuProps>['items'][number];

enum MenuItemKey {
  profile = '/profile',
  list = '/',
  admin = '/admin'
}

const items = [
  {
    key: 'grp',
    type: 'group',
    children: [
      { key: MenuItemKey.profile, label: 'Профиль' },
      { key: MenuItemKey.list, label: 'Список задач' },
      { key: MenuItemKey.admin, label: 'Пользователи' }
    ]
  }
] satisfies MenuItem[];

const defaultPage = [MenuItemKey.list];

function getItemsByRoles(roles: Role[]) {
  return [...items].map((group) =>
    roles.includes('ADMIN') || roles.includes('MODERATOR')
      ? group
      : { ...group, children: group.children.filter(({ key }) => key !== MenuItemKey.admin) }
  );
}

export default function PageMenu() {
  const roles = useAppSelector(selectUserRoles);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const items = useMemo(() => getItemsByRoles(roles), [roles]);

  const onClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key, { viewTransition: true });
  };

  return (
    <Menu
      selectedKeys={[pathname]}
      defaultSelectedKeys={defaultPage}
      onClick={onClick}
      style={{ width: '100%', height: '100%' }}
      mode="inline"
      items={items}
    />
  );
}
