import { useState } from 'react';
import { deleteTodo, editTodo } from '../api/todo';
import { Todo } from '../types/todo';
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
import { getErrorMessage } from '../helpers/getErrorMessage.ts';

interface Props {
  todo: Todo;
  updateList: () => Promise<void>;
  onStartEdit: () => void;
  onStopEdit: () => void;
}

interface EditTodoFieldType {
  todoName?: string;
}

export default function TodoItem({ todo, updateList, onStartEdit, onStopEdit }: Props) {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  function startEdit() {
    setIsEditing((editing) => !editing);
    onStartEdit();
  }

  async function handleEditTodo(event: EditTodoFieldType) {
    if (todo.title === event.todoName) {
      setIsEditing(false);
      return;
    }
    try {
      await editTodo(todo.id, { title: event.todoName });
      await updateList();
      setIsEditing(false);
      onStopEdit();
    } catch (error: unknown) {
      message.error(getErrorMessage(error));
    }
  }

  function handleCloseEditing() {
    setIsEditing(false);
    onStopEdit();
  }

  async function handleDeleteTask() {
    try {
      await deleteTodo(todo.id);
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

  const showErrorMesssage = () => {
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
              onFinish={handleEditTodo}
              onFinishFailed={showErrorMesssage}
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
                  onClick={handleCloseEditing}
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
                onClick={startEdit}
              />
              <Popconfirm
                title="Вы действительно хотите удалить задачу?"
                onConfirm={handleDeleteTask}
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
