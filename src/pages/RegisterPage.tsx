import { useEffect } from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import { Link } from 'react-router';
import LayoutAuth from './LayoutAuth';
import { UserRegistration } from '../types/types';
import { useSignupMutation } from '../store';

const { Title, Text } = Typography;

const RegisterPage = () => {
  const [signup, { isLoading, isSuccess, isError, error }] = useSignupMutation({});
  const [form] = Form.useForm();

  const onFinish = async ({ confirm, ...rest }: UserRegistration & { confirm: string }) => {
    console.log('Данные формы:', rest);
    signup(rest);
  };

  useEffect(() => {
    if (isError) {
      message.error(error as string);
    }
  }, [error, isError]);

  if (isSuccess) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Title level={3}>Вы успешно зарегистрированы!</Title>
        <Link to="/login">Перейти на страницу авторизации для входа в систему</Link>
      </div>
    );
  }
  const purpleColor = '#7F265B';
  const inputStyle = { width: '100%', maxWidth: '420px', height: 45 };
  const buttonStyle = {
    backgroundColor: `${purpleColor}`,
    width: '100%',
    maxWidth: '420px',
    height: 45,
  };

  return (
    <LayoutAuth>
      <div style={{ width: '100%', maxWidth: '420px', margin: '0 auto' }}>
        <Title level={2}>Регистрация</Title>
        <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            label="Имя пользователя"
            name="username"
            rules={[
              { required: true, message: 'Введите имя пользователя' },
              { pattern: /^[а-яА-Яa-zA-Z\s]+$/, message: 'Только русские или латинские буквы' },
              { min: 1, max: 60, message: 'От 1 до 60 символов' },
            ]}>
            <Input placeholder="Иван" style={inputStyle} />
          </Form.Item>

          <Form.Item
            label="Логин"
            name="login"
            rules={[
              {
                min: 2,
                transform: (value) => value?.trim(),
                message: 'Минимум 2 символа (не считая пробелы)',
              },
              {
                max: 60,
                message: 'Максимум 64 символа',
              },
              { required: true, message: 'Введите логин' },
              { pattern: /^[a-zA-Z]+$/, message: 'Только латинские буквы' },
            ]}>
            <Input placeholder="ivan_cool" style={inputStyle} />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[
              { required: true, message: 'Введите пароль' },
              { min: 6, max: 60, message: 'От 6 до 60 символов' },
            ]}>
            <Input.Password placeholder="******" style={inputStyle} />
          </Form.Item>

          <Form.Item
            label="Повторите пароль"
            name="confirm"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Подтвердите пароль' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Пароли не совпадают'));
                },
              }),
            ]}>
            <Input.Password placeholder="******" style={inputStyle} />
          </Form.Item>

          <Form.Item
            label="Почтовый адрес"
            name="email"
            rules={[
              { required: true, message: 'Введите email' },
              { type: 'email', message: 'Введите валидный email' },
            ]}>
            <Input placeholder="example@mail.com" style={inputStyle} />
          </Form.Item>

          <Form.Item
            label="Телефон"
            name="phoneNumber"
            rules={[{ pattern: /^\+?[1-9]\d{1,14}$/, message: 'Введите валидный номер телефона' }]}>
            <Input placeholder="+79991234567" style={inputStyle} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading} style={buttonStyle}>
              Зарегистрироваться
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">Уже есть аккаунт? </Text>
            <Link to="/login" style={{ color: purpleColor }}>
              Войти
            </Link>
          </div>
        </Form>
      </div>
    </LayoutAuth>
  );
};

export default RegisterPage;
