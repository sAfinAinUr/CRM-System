import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit/react';

import type { Profile, Role } from '../../types/auth';
import { RootState } from '../store';
import { getUserProfileThunk, logoutUserThunk } from '../thunks/userAsyncThunks';

interface UserState {
  isAuth: boolean;
  user?: Profile;
  error?: unknown;
}

const userInitialState: UserState = { isAuth: false, user: undefined };

export const userSlice = createSlice({
  name: 'userSlice',
  initialState: userInitialState,
  reducers: {
    setAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
    },
    setError: (state, action: PayloadAction<unknown>) => {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfileThunk.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.isAuth = false;
        state.user = undefined;
      })
      .addCase(getUserProfileThunk.rejected, (state, action) => {
        state.error = action.error;
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.error = action.error;
      });
  }
});

export const selectUser = createSelector(
  [(state: RootState) => state],
  (state: RootState) => state.userSlice.user
);
export const selectUserError = createSelector(
  [(state: RootState) => state],
  (state: RootState) => state.userSlice.error
);

export const selectUserRoles = createSelector(
  [selectUser],
  (user) => user?.roles || ([] as Role[])
);

export const { setAuth, setError } = userSlice.actions;
