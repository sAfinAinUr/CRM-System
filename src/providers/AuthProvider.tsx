import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  getUserProfileThunk,
  setAuth,
  useAppDispatch,
  useAppSelector,
  userErrorSelect
} from '../store';
import { getRefreshTokenFromCookie } from '../api/axios';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isInit, setIsInit] = useState(false);
  const error = useAppSelector(userErrorSelect);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (error) navigate('/login');
  }, [error]);
  useEffect(() => {
    (async () => {
      const refreshToken = await getRefreshTokenFromCookie();
      if (refreshToken) {
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
