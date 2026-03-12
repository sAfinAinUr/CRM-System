import { Button, Form, Input, message, Typography } from 'antd';
import LayoutAuth from './LayoutAuth';
import { Link, useNavigate } from 'react-router';
import { useEffect } from 'react';

import { useLoginMutation } from '../store';
import { AuthData } from '../types/types';

const { Title, Text } = Typography;

const LoginForm = () => {
  const [loginUser, { isLoading, isSuccess, isError, data, error }] = useLoginMutation();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const purpleColor = '#7F265B';
  const inputStyle = { width: '100%', maxWidth: '420px', height: 45 };
  const buttonStyle = {
    backgroundColor: `${purpleColor}`,
    width: '100%',
    maxWidth: '420px',
    height: 45,
  };

  const onFinish = async (values: AuthData) => {
    await loginUser(values);
  };

  useEffect(() => {
    if (isError) {
      message.error(error as string);
    }
  }, [error, isError]);

  useEffect(() => {
    if (isSuccess && data) {
      navigate('/');
    }
  }, [isSuccess, data, navigate]);

  return (
    <LayoutAuth>
      <div style={{ width: '100%', maxWidth: '420px', margin: '0 auto' }}>
        <Title level={2}>Вход</Title>
        <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            label="Логин"
            name="login"
            rules={[{ required: true, message: 'Пожалуйста, введите логин' }]}>
            <Input placeholder="Введите логин" style={inputStyle} />
          </Form.Item>
          <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: 'Пожалуйста, введите пароль' }]}>
            <Input.Password placeholder="Введите пароль" style={inputStyle} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading} style={buttonStyle} block>
              Войти
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">Нет аккаунта? </Text>
            <Link to="/register" style={{ color: purpleColor }}>
              Зарегистрироваться
            </Link>
          </div>
        </Form>
      </div>
    </LayoutAuth>
  );
};

export default LoginForm;
