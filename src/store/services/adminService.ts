import { createApi } from '@reduxjs/toolkit/query/react';

import {
  User,
  UserFilters,
  UserRequest,
  UserRolesRequest,
  UsersListResponse
} from '../../types/admin';
import { getAxiosBaseQuery } from './baseQuery';

const USER_PROFILE_TAG = { type: 'admin', id: 'PROFILE' } as const;
const ADMIN_LIST_TAG = { type: 'admin', id: 'LIST' } as const;

export const adminService = createApi({
  baseQuery: (args, api, extraOptions) => {
    return getAxiosBaseQuery({
      baseUrl: import.meta.env.VITE_APP_API_BASE_URL
    })(args, api, extraOptions);
  },

  reducerPath: 'adminService',
  tagTypes: ['admin'],
  endpoints: (build) => ({
    getAdminList: build.query<UsersListResponse, Partial<UserFilters>>({
      query: ({ page, limit, search, sortBy, sortOrder, isBlocked }) => {
        const query = new URLSearchParams();
        if (typeof page === 'number' && Number.isFinite(page))
          query.append('page', page.toString());
        if (limit) query.append('limit', limit.toString());
        if (search) query.append('search', search);
        if (sortBy) query.append('sortBy', sortBy);
        if (sortOrder) query.append('sortOrder', sortOrder);
        if (typeof isBlocked === 'boolean') query.append('isBlocked', isBlocked.toString());

        return {
          url: `/admin/users?${query.toString()}`,
          method: 'GET'
        };
      },
      providesTags: () => [ADMIN_LIST_TAG]
    }),
    updateRoles: build.mutation<void, UserRolesRequest>({
      query: ({ id, roles }) => ({
        url: `/admin/users/${id}/rights`,
        method: 'POST',
        body: { roles }
      }),
      invalidatesTags: () => [ADMIN_LIST_TAG]
    }),
    blockUser: build.mutation<void, number>({
      query: (id) => ({
        url: `/admin/users/${id}/block`,
        method: 'POST'
      }),
      invalidatesTags: () => [ADMIN_LIST_TAG]
    }),
    unblockUser: build.mutation<void, number>({
      query: (id) => ({
        url: `/admin/users/${id}/unblock`,
        method: 'POST'
      }),
      invalidatesTags: () => [ADMIN_LIST_TAG]
    }),
    deleteUser: build.mutation<void, number>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: () => [ADMIN_LIST_TAG]
    }),
    updateUser: build.mutation<void, UserRequest>({
      query: ({ id, ...userData }) => ({
        url: `/admin/users/${id}`,
        method: 'PUT',
        body: userData
      }),
      invalidatesTags: () => [USER_PROFILE_TAG]
    }),
    getUserProfile: build.query<User, number>({
      query: (id) => {
        return {
          url: `/admin/users/${id}`,
          method: 'GET'
        };
      },
      providesTags: () => [USER_PROFILE_TAG]
    })
  })
});

export const {
  useGetAdminListQuery,
  useUpdateRolesMutation,
  useBlockUserMutation,
  useUnblockUserMutation,
  useDeleteUserMutation,
  useGetUserProfileQuery,
  useUpdateUserMutation
} = adminService;
