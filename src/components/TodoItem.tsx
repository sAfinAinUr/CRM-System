import { ChangeEvent, useState } from 'react';
import { deleteTask, editTodo } from '../api/http';
import { Todo } from '../types/types.ts';
import { Button, Form, Input, message, Checkbox, Popconfirm, Space, Card, Flex } from 'antd';
import { CheckOutlined, CloseOutlined, DeleteOutlined, FormOutlined } from '@ant-design/icons';

type TodoItemProps = {
  todo: Todo;
  updateList: () => Promise<void>;
};

interface EditTodoFieldType {
  todoName?: string;
}

export default function TodoItem({ todo, updateList }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [error, setError] = useState<{ message?: string }>();

  function handleClickStartEdit() {
    setIsEditing((editing) => !editing);
  }

  async function handleClickEditTodo(event: EditTodoFieldType) {
    if (todo.title === event.todoName) {
      setIsEditing(false);
      return;
    }
    try {
      await editTodo(todo.id, { title: event.todoName });
      updateList();
      setError({});
      setIsEditing(false);
    } catch (error: unknown) {
      if (typeof error === 'string') {
        setError({ message: error });
      } else if (error instanceof Error) {
        setError({ message: error.message });
      } else setError({ message: 'error with add new task' });
    }
  }

  function handleClickCloseEditing() {
    setIsEditing(false);
    setError({});
  }

  async function handleClickDeleteTask() {
    try {
      await deleteTask(todo.id);
      updateList();
      setError({});
    } catch (error: unknown) {
      if (typeof error === 'string') {
        setError({ message: error });
      } else if (error instanceof Error) {
        setError({ message: error.message });
      } else setError({ message: 'error with add new task' });
    }
  }

  async function handleChangeIsDone() {
    try {
      await editTodo(todo.id, { isDone: !todo.isDone });
      updateList();
      setError({});
    } catch (error: unknown) {
      if (typeof error === 'string') {
        setError({ message: error });
      } else if (error instanceof Error) {
        setError({ message: error.message });
      } else setError({ message: 'error with add new task' });
    }
  }

  const [form] = Form.useForm();

  const onFinishFailed = () => {
    message.error('Submit failed!');
  };

  return (
    <Card style={{ width: 400 }}>
      <Flex align="center" justify="space-between" style={{ width: '100%' }}>
        {isEditing ? (
          <>
            <p>{error && error.message}</p>
            <Form
              form={form}
              preserve={false}
              size="large"
              layout="inline"
              onFinish={handleClickEditTodo}
              onFinishFailed={onFinishFailed}
              initialValues={{
                todoName: todo.title,
              }}
              autoComplete="off">
              <Form.Item
                name="todoName"
                rules={[{ required: true }, { type: 'string', min: 2, max: 64, whitespace: true }]}>
                <Input placeholder="Название задачи" />
              </Form.Item>
              <Form.Item>
                <Button
                  color="cyan"
                  variant="solid"
                  type="primary"
                  icon={<CheckOutlined />}
                  size="large"
                  htmlType="submit"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="dashed"
                  icon={<CloseOutlined />}
                  size="large"
                  onClick={handleClickCloseEditing}
                />
              </Form.Item>
            </Form>
          </>
        ) : (
          <>
            <Checkbox
              checked={todo.isDone}
              styles={{
                label: {
                  textDecoration: todo.isDone ? 'line-through' : 'none',
                  color: todo.isDone ? 'gray' : 'inherit',
                  transition: 'all 0.3s',
                },
              }}
              onChange={handleChangeIsDone}>
              {todo.title}
            </Checkbox>
            <Space>
              <Button
                color="primary"
                variant="solid"
                icon={<FormOutlined />}
                size="large"
                onClick={handleClickStartEdit}
              />
              <Popconfirm
                title="Вы действительно хотите удалить задачу?"
                onConfirm={handleClickDeleteTask}
                okText="Да"
                cancelText="Нет">
                <Button color="danger" variant="solid" icon={<DeleteOutlined />} size="large" />
              </Popconfirm>
            </Space>
          </>
        )}
      </Flex>
    </Card>
  );
}
