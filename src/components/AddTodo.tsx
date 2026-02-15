import { memo, useState } from 'react';
import { addNewTodo } from '../api/http';
import { Button, Form, Input, message } from 'antd';

type AddTodoProps = {
  updateList: () => Promise<void>;
};

interface AddTodoFieldType {
  todoName?: string;
}

export default memo(function AddTodo({ updateList }: AddTodoProps) {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [error, setError] = useState<{ message?: string }>();

  async function handleAddTodo(event: AddTodoFieldType): Promise<void> {
    message.success('Submit success!');
    console.log(event.todoName);
    try {
      setIsDisabled(true);
      await addNewTodo(event.todoName!);
      form.resetFields();
      updateList();
    } catch (error: unknown) {
      if (typeof error === 'string') {
        setError({ message: error });
      } else if (error instanceof Error) {
        setError({ message: error.message });
      } else setError({ message: 'error with add new task' });
    } finally {
      setIsDisabled(false);
    }
  }

  const [form] = Form.useForm();

  const onFinishFailed = () => {
    message.error('Submit failed!');
  };

  return (
    <>
      <p>{error && error.message}</p>
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
