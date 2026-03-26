import { createApi } from '@reduxjs/toolkit/query/react';
import type { UserRegistration } from '../../types/auth';
import { getAxiosBaseQuery, isBaseQueryError } from './baseQuery';

const errorStatus = {
  400: 'Ошибка десериализации запроса или неверный ввод',
  409: 'Пользователь уже существует.',
  500: 'Внутренняя ошибка сервера.',
};

export const registerService = createApi({
  baseQuery: getAxiosBaseQuery({
    baseUrl: import.meta.env.VITE_APP_API_BASE_URL,
  }),

  reducerPath: 'registerService',
  tagTypes: ['register'],
  endpoints: (build) => ({
    signup: build.mutation<void, UserRegistration>({
      query: (signupData) => ({
        url: `/auth/signup`,
        method: 'POST',
        body: signupData,
      }),
      transformErrorResponse(baseQueryReturnValue) {
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

export const { useSignupMutation } = registerService;
