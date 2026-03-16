import { memo, useState } from 'react';
import { addTodo } from '../api/todo';
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
      await addTodo(values.todoName!);
      await updateList();
      form.resetFields();
      notification.success({
        title: 'Успешно',
        description: 'Задача добавлена в список!',
        style: {
          position: 'static',
        },
      });
    } catch (error: unknown) {
      notification.error({
        title: 'Ошибка добавления',
        description: getErrorMessage(error),
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
              message: 'Поле не должно быть пустым',
            },
            {
              min: 2,
              transform: (value) => value?.trim(),
              message: 'Минимум 2 символа (не считая пробелы)',
            },
            {
              max: 64,
              message: 'Максимум 64 символа',
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
