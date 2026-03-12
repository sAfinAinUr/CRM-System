import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getUserProfileThunk, setAuth, useAppDispatch } from '../store';
import { getTokenFromCookie } from '../api/http';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isInit, setIsInit] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { accessToken, refreshToken } = await getTokenFromCookie();
      if (accessToken && refreshToken) {
        await dispatch(getUserProfileThunk());
        dispatch(setAuth(true));
      } else navigate('/login');

      setIsInit(true);
    })();
  }, [navigate]);
  if (!isInit) {
    return null;
  }
  return children;
};
