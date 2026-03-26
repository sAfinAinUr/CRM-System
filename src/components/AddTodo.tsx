import { memo, useState } from 'react';

import { Button, Form, Input, notification } from 'antd';

import { addTodo } from '../api/todo';
import { getErrorMessage } from '../helpers/getErrorMessage';

interface Props {
  updateList: () => Promise<void>;
}

interface AddTodoField {
  todoName?: string;
}

export default memo(function AddTodo({ updateList }: Props) {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  async function handleAddTodo(values: AddTodoField): Promise<void> {
    try {
      setIsDisabled(true);
      await addTodo(values.todoName!);
      await updateList();
      form.resetFields();

      notification.success({
        title: 'Успешно',
        description: 'Задача добавлена в список!',
        style: {
          position: 'static'
        }
      });
    } catch (error: unknown) {
      notification.error({
        title: 'Ошибка добавления',
        description: getErrorMessage(error)
      });
    } finally {
      setIsDisabled(false);
    }
  }

  const [form] = Form.useForm();

  const showNotificationError = () => {
    notification.error({
      title: 'Ошибка добавления',
      description: 'Не удалось добавить задачу',
      style: {
        position: 'static'
      }
    });
  };

  return (
    <>
      <Form
        form={form}
        size="large"
        layout="inline"
        onFinish={handleAddTodo}
        onFinishFailed={showNotificationError}
        autoComplete="off">
        <Form.Item
          name="todoName"
          rules={[
            {
              required: true,
              whitespace: true,
              message: 'Поле не должно быть пустым'
            },
            {
              min: 2,
              transform: (value) => value?.trim(),
              message: 'Минимум 2 символа (не считая пробелы)'
            },
            {
              max: 64,
              message: 'Максимум 64 символа'
            }
          ]}>
          <Input placeholder="Название задачи" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={isDisabled}>
            Добавить
          </Button>
        </Form.Item>
      </Form>
    </>
  );
});
