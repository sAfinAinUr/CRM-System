import { configureStore } from '@reduxjs/toolkit';
import { authService } from './services/authService';
import { registerService } from './services/registerService';
import { userSlice } from './slices/userSlice';
import { adminService } from './services/adminService';

export const store = configureStore({
  reducer: {
    [authService.reducerPath]: authService.reducer,
    [registerService.reducerPath]: registerService.reducer,
    [adminService.reducerPath]: adminService.reducer,
    [userSlice.name]: userSlice.reducer,
  },
  middleware: (builder) => {
    return builder().concat([
      authService.middleware,
      registerService.middleware,
      adminService.middleware,
    ]);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
