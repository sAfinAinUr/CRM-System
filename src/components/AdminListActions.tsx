import { useState } from 'react';
import { useNavigate } from 'react-router';

import {
  DeleteOutlined,
  EllipsisOutlined,
  LockOutlined,
  UnlockOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Button, Dropdown, MenuProps, Popconfirm } from 'antd';

import { useBlockUserMutation, useUnblockUserMutation, useUpdateRolesMutation } from '../store';
import { useDeleteUserMutation } from '../store/services/adminService';
import { Roles, User } from '../types/admin';

interface Props {
  user: User;
  refetch: VoidFunction;
}

enum Actions {
  block = 'block',
  unblock = 'unblock',
  makeModerator = 'makeModerator',
  makeAdmin = 'makeAdmin',
  deleteAdmin = 'deleteAdmin',
  deleteModerator = 'deleteModerator',
  delete = 'delete',
  userProfile = 'userProfile'
}

const items = [
  {
    key: Actions.userProfile,
    label: 'Просмотр профиля',
    icon: <UserOutlined />
  },
  { type: 'divider' },
  {
    key: 'roles-group',
    label: 'Управление правами',
    type: 'group',
    children: [
      {
        key: Actions.makeModerator,
        label: 'Назначить модератором',
        icon: <UserAddOutlined />
      },
      {
        key: Actions.makeAdmin,
        label: 'Назначить администратором',
        icon: <UserAddOutlined style={{ color: '#722ed1' }} />
      },
      {
        key: Actions.deleteAdmin,
        label: 'Разжаловать администратора',
        icon: <UserDeleteOutlined />
      },
      {
        key: Actions.deleteModerator,
        label: 'Разжаловать модератора',
        icon: <UserDeleteOutlined />
      }
    ]
  },
  { type: 'divider' },
  {
    key: Actions.block,
    label: 'Заблокировать',
    icon: <LockOutlined />
  },
  {
    key: Actions.unblock,
    label: 'Разблокировать',
    icon: <UnlockOutlined />
  },
  {
    key: Actions.delete,
    label: 'Удалить пользователя',
    danger: true,
    icon: <DeleteOutlined />
  }
] satisfies MenuProps['items'];

function getItems(user: User, isLoadingRoles: boolean) {
  return items
    .map((item) => {
      if ('type' in item && item.type === 'divider') {
        return item;
      }

      if ('type' in item && item.type === 'group' && item.children) {
        const filteredChildren = item.children
          .filter((child: any) => checkVisibility(child.key, user))
          .map((child) => (isLoadingRoles ? { ...child, disabled: true } : child));

        if (filteredChildren.length === 0) return null;

        return { ...item, children: filteredChildren };
      }

      if (!checkVisibility((item as any).key, user)) {
        return null;
      }

      return isLoadingRoles ? { ...item, disabled: true } : item;
    })
    .filter(Boolean);
}

function checkVisibility(key: string, user: User): boolean {
  if (key === Actions.userProfile) return true;
  if (key === Actions.makeAdmin) return !user.roles.includes(Roles.ADMIN) && !user.isBlocked;
  if (key === Actions.makeModerator)
    return !user.roles.includes(Roles.MODERATOR) && !user.isBlocked;
  if (key === Actions.deleteAdmin) return user.roles.includes(Roles.ADMIN);
  if (key === Actions.deleteModerator) return user.roles.includes(Roles.MODERATOR);
  if (key === Actions.block)
    return (
      !user.isBlocked && !user.roles.includes(Roles.ADMIN) && !user.roles.includes(Roles.MODERATOR)
    );
  if (key === Actions.unblock) return user.isBlocked;
  if (key === Actions.delete)
    return !user.roles.includes(Roles.ADMIN) && !user.roles.includes(Roles.MODERATOR);

  return false;
}

export default function AdminListActions({ user, refetch }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [updateRoles, { isLoading: isLoadingRoles }] = useUpdateRolesMutation();
  const [blockUser] = useBlockUserMutation();
  const [unblockUser] = useUnblockUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const navigate = useNavigate();

  const onClick: MenuProps['onClick'] = async ({ key }) => {
    switch (key) {
      case Actions.delete:
        return;
      case Actions.block:
        await blockUser(user.id);
        break;
      case Actions.unblock:
        await unblockUser(user.id);
        break;
      case Actions.makeAdmin:
        await updateRoles({ id: user.id, roles: [...user.roles, Roles.ADMIN] });
        break;
      case Actions.makeModerator:
        await updateRoles({ id: user.id, roles: [...user.roles, Roles.MODERATOR] });
        break;
      case Actions.deleteAdmin:
        await updateRoles({
          id: user.id,
          roles: user.roles.filter((role) => role !== Roles.ADMIN)
        });

        break;
      case Actions.deleteModerator:
        await updateRoles({
          id: user.id,
          roles: user.roles.filter((role) => role !== Roles.MODERATOR)
        });

        break;

      case Actions.userProfile:
        navigate(`/UserProfile/${user.id}`);
        break;
      default:
        break;
    }
    setIsOpen(false);
    refetch();
  };

  const menuItems = getItems(user, isLoadingRoles).map((item) => {
    if (item?.key === Actions.delete) {
      return {
        ...item,
        label: (
          <Popconfirm
            title="Удалить пользователя?"
            description="Это действие нельзя будет отменить."
            onConfirm={async () => {
              await deleteUser(user.id);
              refetch();
              setIsOpen(false);
            }}
            onCancel={(e) => e?.stopPropagation()}
            okText="Да"
            cancelText="Нет">
            <div style={{ width: '100%' }}>Удалить</div>
          </Popconfirm>
        )
      };
    }

    return item;
  });

  return (
    <Dropdown menu={{ items: menuItems, onClick }} open={isOpen}>
      <Button
        onClick={() => setIsOpen((prev) => !prev)}
        shape="circle"
        icon={<EllipsisOutlined />}></Button>
    </Dropdown>
  );
}
