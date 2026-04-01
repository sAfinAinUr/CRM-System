import { useState } from 'react';

import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { Button, message, Select, Space, Tag, Tooltip } from 'antd';

import { getErrorMessage } from '../helpers/getErrorMessage';
import { useUpdateRolesMutation } from '../store';
import { Roles, User } from '../types/admin';

const ROLE_COLORS: Record<Roles, string> = {
  [Roles.ADMIN]: 'purple',
  [Roles.MODERATOR]: 'blue',
  [Roles.USER]: 'default'
};

const ROLE_OPTIONS = [
  { label: 'Администратор', value: Roles.ADMIN },
  { label: 'Модератор', value: Roles.MODERATOR },
  { label: 'Пользователь', value: Roles.USER }
];

export default function RoleSelect({ user }: { user: User }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempRoles, setTempRoles] = useState<Roles[]>(user.roles);
  const [updateRoles, { isLoading }] = useUpdateRolesMutation();

  const handleEdit = () => {
    setTempRoles(user.roles);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempRoles(user.roles);
  };

  const handleSave = async () => {
    const currentStr = [...user.roles].sort().join(',');
    const newStr = [...tempRoles].sort().join(',');

    if (currentStr === newStr) {
      setIsEditing(false);

      return;
    }

    try {
      await updateRoles({ id: user.id, roles: tempRoles }).unwrap();
      message.success('Роли обновлены');
      setIsEditing(false);
    } catch (e) {
      message.error(getErrorMessage(e));
    }
  };

  if (isEditing) {
    const dynamicOptions = ROLE_OPTIONS.map((option) => ({
      ...option,
      disabled: tempRoles.length === 1 && tempRoles.includes(option.value)
    }));

    return (
      <Space>
        <Select
          mode="multiple"
          style={{ minWidth: '200px' }}
          value={tempRoles}
          onChange={setTempRoles}
          options={dynamicOptions}
          maxTagCount="responsive"
          autoFocus
          defaultOpen
        />
        <Button
          type="primary"
          icon={<CheckOutlined />}
          onClick={handleSave}
          loading={isLoading}
          size="small"
        />
        <Button icon={<CloseOutlined />} onClick={handleCancel} size="small" />
      </Space>
    );
  }

  return (
    <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {user.roles.map((role) => (
          <Tag color={ROLE_COLORS[role]} key={role}>
            {ROLE_OPTIONS.find((opt) => opt.value === role)?.label || role}
          </Tag>
        ))}
      </div>
      <Tooltip title="Редактировать роли">
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={handleEdit}
          disabled={user.isBlocked}
          size="small"
        />
      </Tooltip>
    </Space>
  );
}
