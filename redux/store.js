import { configureStore } from '@reduxjs/toolkit';
import authReducer, { authApi }          from './slices/authSlice';
import { admissionApi }                  from './slices/admissionSlice';
import { admissionsApi }                 from './slices/admissionsSlice';
import { studentApi }                    from './slices/studentSlice';
import { staffApi }                      from './slices/staffSlice';
import { academicsApi }                  from './slices/academicsSlice';
import { financeApi }                    from './slices/financeSlice';
import { inventoryApi }                  from './slices/inventorySlice';
import { transportApi }                  from './slices/transportSlice';
import { settingsApi }                   from './slices/settingsSlice';
import { dashboardApi }                  from './slices/dashboardSlice';
import { parentAdmissionsApi }           from './slices/parent/parentAdmissionsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]:             authApi.reducer,
        [admissionApi.reducerPath]:        admissionApi.reducer,
        [admissionsApi.reducerPath]:       admissionsApi.reducer,
        [studentApi.reducerPath]:          studentApi.reducer,
        [staffApi.reducerPath]:            staffApi.reducer,
        [academicsApi.reducerPath]:        academicsApi.reducer,
        [financeApi.reducerPath]:          financeApi.reducer,
        [inventoryApi.reducerPath]:        inventoryApi.reducer,
        [transportApi.reducerPath]:        transportApi.reducer,
        [settingsApi.reducerPath]:         settingsApi.reducer,
        [dashboardApi.reducerPath]:        dashboardApi.reducer,
        [parentAdmissionsApi.reducerPath]: parentAdmissionsApi.reducer, // ← NEW
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['admissionApi/executeMutation/pending'],
                ignoredPaths:   ['admissionApi.mutations'],
            },
        })
            .concat(authApi.middleware)
            .concat(admissionApi.middleware)
            .concat(admissionsApi.middleware)
            .concat(studentApi.middleware)
            .concat(staffApi.middleware)
            .concat(academicsApi.middleware)
            .concat(financeApi.middleware)
            .concat(inventoryApi.middleware)
            .concat(transportApi.middleware)
            .concat(settingsApi.middleware)
            .concat(dashboardApi.middleware)
            .concat(parentAdmissionsApi.middleware), // ← NEW
});
