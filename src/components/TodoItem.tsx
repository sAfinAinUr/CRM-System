import { useState } from 'react';
import { deleteTask, editTodo, getErrorMessage } from '../api/http';
import { Todo } from '../types/types.ts';
import {
  Button,
  Form,
  Input,
  message,
  Checkbox,
  Popconfirm,
  Space,
  Card,
  Flex,
  Typography,
} from 'antd';
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
      setIsEditing(false);
    } catch (error: unknown) {
      message.error(getErrorMessage(error));
    }
  }

  function handleClickCloseEditing() {
    setIsEditing(false);
  }

  async function handleClickDeleteTask() {
    try {
      await deleteTask(todo.id);
      updateList();
    } catch (error: unknown) {
      message.error(getErrorMessage(error));
    }
  }

  async function handleChangeIsDone() {
    try {
      await editTodo(todo.id, { isDone: !todo.isDone });
      updateList();
    } catch (error: unknown) {
      message.error(getErrorMessage(error));
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
            <Checkbox checked={todo.isDone} onChange={handleChangeIsDone}>
              <Typography.Text
                style={{
                  color: todo.isDone ? 'gray' : 'inherit',
                  textDecoration: todo.isDone ? 'line-through' : 'none',
                  maxWidth: 'calc(400px - 168px)',
                }}
                ellipsis={{ tooltip: todo.title }}>
                {todo.title}
              </Typography.Text>
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
