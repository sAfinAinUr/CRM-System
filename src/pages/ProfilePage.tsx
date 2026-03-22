import { useNavigate } from 'react-router';

import { Button, Card } from 'antd';

import { logoutUserThunk, useAppDispatch, useAppSelector, userSelect } from '../store';
import LayoutMainApp from './LayoutMainApp';

export default function ProfilePage() {
  const user = useAppSelector(userSelect);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onLogout = async () => {
    await dispatch(logoutUserThunk()).unwrap();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <LayoutMainApp>
      <Card title={user.username} variant="borderless" style={{ width: 300 }}>
        <p> {user.email}</p>
        {user.phoneNumber && <p>{user.phoneNumber}</p>}
      </Card>
      <Button onClick={onLogout}>ВЫЙТИ</Button>
    </LayoutMainApp>
  );
}
