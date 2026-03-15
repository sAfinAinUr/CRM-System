import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { getRefreshTokenFromCookie } from '../api/axios';
import {
  getUserProfileThunk,
  setAuth,
  useAppDispatch,
  useAppSelector,
  userErrorSelect
} from '../store';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isInit, setIsInit] = useState(false);
  const error = useAppSelector(userErrorSelect);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) navigate('/login');
  }, [error, navigate]);

  useEffect(() => {
    if (isInit) return;

    (async () => {
      const refreshToken = await getRefreshTokenFromCookie();
      if (refreshToken) {
        await dispatch(getUserProfileThunk());
        dispatch(setAuth(true));
      }

      setIsInit(true);
    })();
  }, [navigate, dispatch, isInit]);

  if (!isInit) {
    return null;
  }

  return children;
};
