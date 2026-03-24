import { useState } from 'react';
import { useNavigate } from 'react-router';

import {
  DeleteOutlined,
  EllipsisOutlined,
  LockOutlined,
  UnlockOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Button, Dropdown, MenuProps, Popconfirm } from 'antd';

import { useBlockUserMutation, useUnblockUserMutation } from '../store';
import { useDeleteUserMutation } from '../store/services/adminService';
import { User } from '../types/admin';

interface Props {
  user: User;
  refetch: VoidFunction;
}

enum Actions {
  block = 'block',
  unblock = 'unblock',
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

function getItems(user: User) {
  return items
    .map((item) => {
      if ('type' in item && item.type === 'divider') {
        return item;
      }

      if (!checkVisibility((item as any).key, user)) {
        return null;
      }

      return item;
    })
    .filter(Boolean);
}

function checkVisibility(key: string, user: User): boolean {
  if (key === Actions.userProfile) return true;
  if (key === Actions.block) return !user.isBlocked;
  if (key === Actions.unblock) return user.isBlocked;
  if (key === Actions.delete) return true;

  return false;
}

export default function AdminListActions({ user, refetch }: Props) {
  const [isOpen, setIsOpen] = useState(false);
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

      case Actions.userProfile:
        navigate(`/UserProfile/${user.id}`);
        break;
      default:
        break;
    }
    setIsOpen(false);
    refetch();
  };

  const menuItems = getItems(user).map((item) => {
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
