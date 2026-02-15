import { memo, useState } from 'react';
import { addNewTodo, getErrorMessage } from '../api/http';
import { Button, Form, Input, message } from 'antd';

type AddTodoProps = {
  updateList: () => Promise<void>;
};

interface AddTodoFieldType {
  todoName?: string;
}

export default memo(function AddTodo({ updateList }: AddTodoProps) {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  async function handleAddTodo(event: AddTodoFieldType): Promise<void> {
    try {
      setIsDisabled(true);
      await addNewTodo(event.todoName!);
      await updateList();
      form.resetFields();
      message.success('Задача успешно добавлена!');
    } catch (error: unknown) {
      message.error(getErrorMessage(error));
    } finally {
      setIsDisabled(false);
    }
  }

  const [form] = Form.useForm();

  const onFinishFailed = () => {
    message.error('Не удалось добавить задачу');
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
            { required: true, message: 'Поле обязательно для заполнения' },
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
