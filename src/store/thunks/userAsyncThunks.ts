import { createAsyncThunk } from '@reduxjs/toolkit/react';
import { getUserProfile, logout } from '../../api/auth';
import { clearToken } from '../../api/axios';

export const getUserProfileThunk = createAsyncThunk('user/getUserProfile', async () => {
  return getUserProfile();
});
export const logoutUserThunk = createAsyncThunk('user/logout', async () => {
  await logout();
  clearToken();
});
