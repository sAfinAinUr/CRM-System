import { createApi } from '@reduxjs/toolkit/query/react';

import { UserFilters, UsersListResponse } from '../../types/admin';
import { axiosBaseQuery } from './baseQuery';

export const adminService = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl: import.meta.env.VITE_APP_API_BASE_URL,
  }),

  reducerPath: 'adminService',
  tagTypes: ['admin'],
  endpoints: (build) => ({
    getAdminList: build.query<UsersListResponse, Partial<UserFilters>>({
      query: ({ page, limit, search }) => {
        const query = new URLSearchParams();
        if (page) query.append('page', page.toString());
        if (limit) query.append('limit', limit.toString());
        if (search) query.append('search', search);

        return {
          url: `/admin/users?${query.toString()}`,
          method: 'GET',
        };
      },
    }),
  }),
});

export const { useGetAdminListQuery } = adminService;
