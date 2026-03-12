import { createAsyncThunk } from '@reduxjs/toolkit/react';
import { getUserProfile, logout } from '../../api/http';

export const getUserProfileThunk = createAsyncThunk('user/getUserProfile', async () => {
  return getUserProfile();
});
export const logoutUserThunk = createAsyncThunk('user/logout', async () => {
  return logout();
});
