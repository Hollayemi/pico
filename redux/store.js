
// "use client";
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { authApi } from './slices/authSlice';
import { userApi } from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(authApi.middleware)
});
