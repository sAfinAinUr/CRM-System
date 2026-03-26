import { Button, Card, message, Typography } from 'antd';
import { logoutUserThunk, useAppDispatch, useAppSelector, selectUser } from '../store';

import { useNavigate } from 'react-router';
import { getErrorMessage } from '../helpers/getErrorMessage';

export default function ProfilePage() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      await dispatch(logoutUserThunk()).unwrap();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      navigate('/login');
    }
  };

  const { Text, Paragraph } = Typography;

  if (!user) return null;
  return (
    <>
      <Card title={<Text strong>{user.username}</Text>} variant="borderless">
        <Paragraph>
          <Text type="secondary">Email: </Text>
          <Text>{user.email}</Text>
        </Paragraph>

        {user.phoneNumber && (
          <Paragraph>
            <Text type="secondary">Тел: </Text>
            <Text>{user.phoneNumber}</Text>
          </Paragraph>
        )}
      </Card>
      <Button type="primary" danger onClick={onLogout}>
        ВЫЙТИ
      </Button>
    </>
  );
}
