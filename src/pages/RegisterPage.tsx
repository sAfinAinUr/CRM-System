import { useEffect } from 'react';
import { Link } from 'react-router';

import { Button, Form, Input, message, Typography } from 'antd';

import { UI_CONFIG, VALIDATION } from '../helpers/getValidationConfig';
import { useSignupMutation } from '../store';
import { UserRegistration } from '../types/auth';

const { Title, Text } = Typography;

const RegisterPage = () => {
  const [signup, { isLoading, isSuccess, isError, error }] = useSignupMutation({});

  const [form] = Form.useForm();

  const onFinish = async ({ ...rest }: UserRegistration & { confirm: string }) => {
    signup(rest);
  };

  useEffect(() => {
    if (isError) {
      message.error(error as string);
    }
  }, [error, isError]);

  const commonInputStyle = {
    width: '100%',
    maxWidth: UI_CONFIG.MAX_WIDTH,
    height: UI_CONFIG.INPUT_HEIGHT
  };

  const submitButtonStyle = {
    ...commonInputStyle,
    backgroundColor: UI_CONFIG.PURPLE_COLOR
  };

  if (isSuccess) {
    return (
      <div style={{ textAlign: 'center', padding: UI_CONFIG.SUCCESS_PADDING }}>
        <Title level={3}>Вы успешно зарегистрированы!</Title>

        <Link to="/login">Перейти на страницу авторизации для входа в систему</Link>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: UI_CONFIG.MAX_WIDTH, margin: '0 auto' }}>
      <Title level={2}>Регистрация</Title>
      <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item
          label="Имя пользователя"
          name="username"
          rules={[
            {
              min: VALIDATION.USERNAME.MIN,
              transform: (value) => value?.trim(),
              message: `Минимум ${VALIDATION.USERNAME.MIN} символ`
            },
            {
              max: VALIDATION.USERNAME.MAX,
              message: `Максимум ${VALIDATION.USERNAME.MAX} символов`
            },
            { whitespace: true, required: true, message: 'Введите имя пользователя' },
            { pattern: VALIDATION.USERNAME.PATTERN, message: 'Только русские или латинские буквы' }
          ]}>
          <Input style={commonInputStyle} />
        </Form.Item>

        <Form.Item
          label="Логин"
          name="login"
          rules={[
            {
              min: VALIDATION.LOGIN.MIN,
              transform: (value) => value?.trim(),
              message: `Минимум ${VALIDATION.LOGIN.MIN} символа`
            },
            {
              max: VALIDATION.LOGIN.MAX,
              message: `Максимум ${VALIDATION.LOGIN.MAX} символа`
            },
            { required: true, message: 'Введите логин' },
            { pattern: VALIDATION.LOGIN.PATTERN, message: 'Только латинские буквы' }
          ]}>
          <Input style={commonInputStyle} />
        </Form.Item>

        <Form.Item
          label="Пароль"
          name="password"
          rules={[
            { required: true, message: 'Введите пароль' },
            {
              min: VALIDATION.PASSWORD.MIN,
              max: VALIDATION.PASSWORD.MAX,
              message: `От ${VALIDATION.PASSWORD.MIN} до ${VALIDATION.PASSWORD.MAX} символов`
            }
          ]}>
          <Input.Password placeholder="******" style={commonInputStyle} />
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
              }
            })
          ]}>
          <Input.Password placeholder="******" style={commonInputStyle} />
        </Form.Item>

        <Form.Item
          label="Почтовый адрес"
          name="email"
          rules={[
            { required: true, message: 'Введите email' },
            { type: 'email', message: 'Введите валидный email' }
          ]}>
          <Input placeholder="example@mail.com" style={commonInputStyle} />
        </Form.Item>

        <Form.Item
          label="Телефон"
          name="phoneNumber"
          rules={[
            { pattern: VALIDATION.PHONE_PATTERN, message: 'Введите валидный номер телефона' }
          ]}>
          <Input placeholder="+79991234567" style={commonInputStyle} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} style={submitButtonStyle}>
            Зарегистрироваться
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary">Уже есть аккаунт? </Text>
          <Link to="/login" style={{ color: UI_CONFIG.PURPLE_COLOR }}>
            Войти
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default RegisterPage;
