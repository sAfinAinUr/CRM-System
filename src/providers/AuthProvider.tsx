import { useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import {
  getUserProfileThunk,
  setAuth,
  useAppDispatch,
  useAppSelector,
  userErrorSelect,
} from '../store';
import { getRefreshTokenFromCookie } from '../api/axios';
import { Spin } from 'antd';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isInit, setIsInit] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const error = useAppSelector(userErrorSelect);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      try {
        const refreshToken = await getRefreshTokenFromCookie();
        if (refreshToken) {
          await dispatch(getUserProfileThunk()).unwrap();
          dispatch(setAuth(true));
        } else {
          setShouldRedirect(true);
        }
      } catch (e) {
        setShouldRedirect(true);
      } finally {
        setIsInit(true);
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    if (error) setShouldRedirect(true);
  }, [error]);

  if (!isInit) {
    return <Spin size="large" fullscreen />;
  }

  if (shouldRedirect) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
