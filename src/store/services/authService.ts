import { createApi } from '@reduxjs/toolkit/query/react';
import type { AuthData, Token } from '../../types/auth';
import { setToken } from '../../api/axios';
import { axiosBaseQuery, isBaseQueryError } from './baseQuery';

const errorStatus = {
  400: 'Ошибка десериализации запроса или неверный ввод.',
  401: 'Неверные учетные данные.',
  500: 'Внутренняя ошибка сервера.',
};

export const authService = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl: import.meta.env.VITE_APP_API_BASE_URL,
  }),

  reducerPath: 'authService',
  tagTypes: ['auth'],
  endpoints: (build) => ({
    login: build.mutation<Token, AuthData>({
      query: (authData) => ({
        url: `/auth/signin`,
        method: 'POST',
        body: authData,
      }),
      transformResponse(data: Token) {
        setToken(data);
        return data;
      },
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        console.log({ baseQueryReturnValue, meta, arg });
        if (
          isBaseQueryError(baseQueryReturnValue) &&
          baseQueryReturnValue.status &&
          baseQueryReturnValue.status in errorStatus
        ) {
          return errorStatus[baseQueryReturnValue.status as keyof typeof errorStatus];
        }
      },
    }),
  }),
});

export const { useLoginMutation } = authService;
