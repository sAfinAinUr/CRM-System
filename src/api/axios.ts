import axios from 'axios';

import { setError as setStoreUserError } from '../store';
import { Token } from '../types/auth';
import { updateToken } from './auth';
import { tokenService } from './tokenService';

let isRefreshing = false;
let queueFailedResponses: { resolve: (value: unknown) => void; reject: () => void }[] = [];

export const baseApi = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const api = baseApi.create();

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
    const isLogin = isAxiosError && error.config?.url?.includes('/signin');

    const errorConfig = error?.config;

    // баг системы, error.response пуст, хотя должен быть 429
    if (isAxiosError && !error.response && errorConfig) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(api.request(errorConfig));
        }, 1000);
      });
    }

    if (!isAxiosError || !errorConfig || !isUnauthorizedError || isLogin) {
      return Promise.reject(error);
    }

    if (errorConfig.url.includes('/auth/refresh')) {
      tokenService.clearToken();

      import('../store/store').then(({ store }) => {
        store.dispatch(setStoreUserError(error));
      });

      return Promise.reject(error);
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
      clearToken();

      import('../store/store').then(({ store }) => {
        store.dispatch(setStoreUserError(error));
      });
    }
  }
);

export async function setToken(token: Token) {
  tokenService.setToken(token.accessToken);

  await cookieStore.set({
    name: 'refreshToken',
    value: token.refreshToken
  });
}

export function clearToken() {
  tokenService.clearToken();
  cookieStore.delete('refreshToken');
}

export async function getRefreshTokenFromCookie(): Promise<string | undefined> {
  const refreshTokenCookie = await cookieStore.get('refreshToken');

  return refreshTokenCookie?.value;
}
