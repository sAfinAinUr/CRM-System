import { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { AxiosError, AxiosRequestConfig } from 'axios';

import { api } from '../../api/axios';

type BaseQueryError = {
  status?: number;
  data: unknown;
};

export const isBaseQueryError = (error: unknown): error is BaseQueryError => {
  return (
    typeof error === 'object' &&
    error != null &&
    'status' in error &&
    'data' in error &&
    (typeof error.status === 'number' || typeof error.status === 'undefined')
  );
};

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' }
  ): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig['method'];
      body?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, body, params }) => {
    try {
      const result = await api({
        url: baseUrl + url,
        method,
        data: body,
        params
      });

      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;

      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message
        }
      } as { error: BaseQueryError };
    }
  };
