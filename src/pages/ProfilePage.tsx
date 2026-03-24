import { Button, Card, Typography } from 'antd';
import { logoutUserThunk, useAppDispatch, useAppSelector, userSelect } from '../store';

import { useNavigate } from 'react-router';

export default function ProfilePage() {
  const user = useAppSelector(userSelect);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onLogout = async () => {
    await dispatch(logoutUserThunk()).unwrap();
    navigate('/login');
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
