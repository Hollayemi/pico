import { configureStore } from '@reduxjs/toolkit';
import authReducer, { authApi } from './slices/authSlice';
import { userApi } from './slices/userSlice';
import { admissionApi } from './slices/admissionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [admissionApi.reducerPath]: admissionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for file uploads
        ignoredActions: ['admissionApi/executeMutation/pending'],
        // Ignore these paths in the state
        ignoredPaths: ['admissionApi.mutations'],
      },
    })
      .concat(authApi.middleware)
      .concat(userApi.middleware)
      .concat(admissionApi.middleware),
});