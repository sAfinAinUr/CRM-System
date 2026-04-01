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
  { type: 'divider', key: 'divider' },
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

type AdminMenuItem = NonNullable<MenuProps['items']>[number];

type AdminMenuOption = Extract<AdminMenuItem, { key: string }>;

function isMenuOption(item: AdminMenuItem): item is AdminMenuOption {
  return (
    item !== null &&
    typeof item === 'object' &&
    'key' in item &&
    typeof (item as { key?: unknown }).key !== 'undefined'
  );
}

function getItems(user: User) {
  return items
    .map((item) => {
      if (item?.type === 'divider') {
        return item;
      }

      if (!isMenuOption(item)) {
        return item;
      }

      if (!checkVisibility(item.key, user)) {
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

export default function AdminListActions({ user }: Props) {
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
    <Dropdown menu={{ items: menuItems, onClick }}>
      <Button shape="circle" icon={<EllipsisOutlined />}></Button>
    </Dropdown>
  );
}
