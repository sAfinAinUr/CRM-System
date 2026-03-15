import axios from 'axios';

import { Token } from '../types/auth';
import { updateToken } from './auth';
import { tokenService } from './tokenService';

const securedRoutes = [
  '/user/profile',
  '/user/profile/reset-password',
  '/user/logout',
  '/auth/refresh',
  '/admin/users',
];

let isRefreshing = false;
let queueFailedResponses: { resolve: (value: unknown) => void; reject: () => void }[] = [];

export const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (request) => {
  const accessToken = tokenService.getToken();
  accessToken && (request.headers.Authorization = `Bearer ${accessToken}`);

  return request;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const isAxiosError = axios.isAxiosError(error);
    const isUnauthorizedError = error.response?.status === 401;

    const isSecuredRoute =
      isAxiosError &&
      securedRoutes.some((url) => {
        return error.config?.url?.includes(url);
      });

    const errorConfig = error?.config;
    if (!isAxiosError || !errorConfig || !isUnauthorizedError || !isSecuredRoute) {
      return Promise.reject(error);
    }

    if (errorConfig.url.includes('/auth/refresh')) {
      tokenService.clearToken();
      window.location.href = '/login';
    }
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queueFailedResponses.push({ resolve, reject });
      })
        .then(() => {
          return api.request(errorConfig);
        })
        .catch(() => {
          return Promise.reject(error);
        });
    }
    const refreshToken = await getRefreshTokenFromCookie();
    if (!refreshToken) {
      tokenService.clearToken();

      return Promise.reject(error);
    }
    try {
      isRefreshing = true;
      const newToken = await updateToken({ refreshToken });
      await setToken(newToken);
      queueFailedResponses.forEach(({ resolve }) => resolve(null));
      queueFailedResponses = [];
      isRefreshing = false;

      return api.request(errorConfig);
    } catch {
      queueFailedResponses.forEach(({ reject }) => reject());
      queueFailedResponses = [];
      tokenService.clearToken();
      window.location.href = '/login';
    }
  }
);

export async function setToken(token: Token) {
  tokenService.setToken(token.accessToken);

  await cookieStore.set({
    name: 'refreshToken',
    value: token.refreshToken,
  });
}

export async function getRefreshTokenFromCookie(): Promise<string | undefined> {
  const refreshTokenCookie = await cookieStore.get('refreshToken');

  return refreshTokenCookie?.value;
}
