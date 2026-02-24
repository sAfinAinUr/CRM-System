import { memo, useState } from 'react';
import { addNewTodo } from '../api/http';
import { Button, Form, Input, notification } from 'antd';
import { getErrorMessage } from '../helpers/getErrorMessage';
type AddTodoProps = {
  updateList: () => Promise<void>;
};

interface AddTodoFieldType {
  todoName?: string;
}

export default memo(function AddTodo({ updateList }: AddTodoProps) {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  async function handleAddTodo(values: AddTodoFieldType): Promise<void> {
    try {
      setIsDisabled(true);
      await addNewTodo(values.todoName!);
      await updateList();
      form.resetFields();
      notification.success({
        title: 'Успешно',
        description: 'Задача добавлена в список!',
        placement: 'top',
        style: {
          position: 'static',
        },
      });
    } catch (error: unknown) {
      notification.error({
        title: 'Ошибка добавления',
        description: getErrorMessage(error),
        placement: 'top',
      });
    } finally {
      setIsDisabled(false);
    }
  }

  const [form] = Form.useForm();

  const onFinishFailed = () => {
    notification.error({
      title: 'Ошибка добавления',
      description: 'Не удалось добавить задачу',
      placement: 'top',
      style: {
        position: 'static',
      },
    });
  };
  return (
    <>
      <Form
        form={form}
        size="large"
        layout="inline"
        onFinish={handleAddTodo}
        onFinishFailed={onFinishFailed}
        autoComplete="off">
        <Form.Item
          name="todoName"
          rules={[
            {
              required: true,
              whitespace: true,
              message: 'Поле не должно быть пустым или состоять из пробелов',
            },
            {
              validator: (_, value) => {
                const trimmedValue = value?.trim() || '';
                if (trimmedValue.length > 0 && trimmedValue.length < 2) {
                  return Promise.reject(new Error('Минимум 2 символа (не считая пробелы)'));
                }
                if (trimmedValue.length > 64) {
                  return Promise.reject(new Error('Максимум 64 символа'));
                }
                return Promise.resolve();
              },
            },
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
