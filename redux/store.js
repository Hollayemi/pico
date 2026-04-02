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
import { eventsApi }                     from './slices/eventsSlice';          // ← NEW
import { parentAdmissionsApi }           from './slices/parent/parentAdmissionsSlice';
import { reportCardApi }       from './slices/reportCardSlice';
import { parentReportCardApi } from './slices/parent/parentReportCardSlice';
import { parentApi } from './slices/parent/parentSlice';

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
        [eventsApi.reducerPath]:           eventsApi.reducer,
        [parentAdmissionsApi.reducerPath]: parentAdmissionsApi.reducer,
        [reportCardApi.reducerPath]:       reportCardApi.reducer,
        [parentReportCardApi.reducerPath]: parentReportCardApi.reducer,
        [parentApi.reducerPath]: parentApi.reducer,
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
            .concat(eventsApi.middleware)                      
            .concat(reportCardApi.middleware)
            .concat(parentReportCardApi.middleware)         
            .concat(parentAdmissionsApi.middleware)
            .concat(parentApi.middleware),
});
