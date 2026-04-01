import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { Button, Card, Form, Input, message } from 'antd';

import { getErrorMessage } from '../helpers/getErrorMessage';
import { useGetUserProfileQuery, useUpdateUserMutation } from '../store';
import { UserRequest } from '../types/admin';

type UserRequestWithoutId = Omit<UserRequest, 'id'>;

export default function UserProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const [updateUserData, { isLoading }] = useUpdateUserMutation();
  const saveRequestRef = useRef<ReturnType<typeof updateUserData> | null>(null);

  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const isValidID = Number.isFinite(id);
  const { data, isError } = useGetUserProfileQuery(id, { skip: !isValidID });

  const exit = () => {
    saveRequestRef.current?.abort();
    navigate('/admin');
  };

  const onSave = async (values: UserRequestWithoutId) => {
    if (!data) return;

    const changedValues = (Object.keys(values) as Array<keyof UserRequestWithoutId>).reduce(
      (acc: Partial<UserRequest>, key: keyof UserRequestWithoutId) => {
        if (values[key] !== data[key]) {
          acc[key] = values[key];
        }

        return acc;
      },
      {} as Partial<UserRequest>
    );

    if (Object.keys(changedValues).length === 0) {
      setIsEditing(false);

      return;
    }
    try {
      saveRequestRef.current = updateUserData({ id, ...changedValues });
      await saveRequestRef.current.unwrap();
      message.success('Данные успешно обновлены');
      setIsEditing(false);
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    saveRequestRef.current?.abort();
  };

  return (
    <>
      {data &&
        (isEditing ? (
          <Form
            layout="vertical"
            initialValues={{
              username: data.username,
              email: data.email,
              phoneNumber: data.phoneNumber
            }}
            onFinish={onSave}>
            <Form.Item
              label="Имя пользователя"
              name="username"
              rules={[
                { required: true, whitespace: true, message: 'Введите имя' },
                { min: 1, max: 60, message: 'От 1 до 60 символов' }
              ]}>
              <Input style={{ height: 45 }} />
            </Form.Item>

            <Form.Item
              label="Почтовый адрес"
              name="email"
              rules={[
                { required: true, message: 'Введите email' },
                { type: 'email', message: 'Некорректный email' }
              ]}>
              <Input style={{ height: 45 }} />
            </Form.Item>

            <Form.Item
              label="Телефон"
              name="phoneNumber"
              rules={[{ pattern: /^\+?[1-9]\d{1,14}$/, message: 'Некорректный телефон' }]}>
              <Input style={{ height: 45 }} placeholder="+7..." />
            </Form.Item>

            <div style={{ display: 'flex', gap: '10px' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                style={{ height: 45, flex: 1 }}>
                Сохранить
              </Button>
              <Button onClick={handleCancelEditing} style={{ height: 45, flex: 1 }}>
                Отмена
              </Button>
            </div>
          </Form>
        ) : (
          <>
            <Card title={data.username} variant="borderless" style={{ width: 300 }}>
              <p> {data.email}</p>
              {data.phoneNumber && <p>{data.phoneNumber}</p>}
            </Card>
            <Button onClick={() => setIsEditing(true)}>Редактировать</Button>
          </>
        ))}
      {isError && 'Не удалось загрузить пользователя'}
      <Button onClick={exit}>назад</Button>
    </>
  );
}
