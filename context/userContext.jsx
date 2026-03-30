/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { usePathname, useRouter } from "next/navigation";
import { useGetProfileQuery } from "../redux/slices/authSlice";
import { isAuthenticated } from "../redux/api/axiosBaseQuery";
import { protectedRoutes } from "@/utils/protectedRoutes";
const { createContext, useEffect, useState, useContext } = require("react");

const defaultProvider = {
    userInfo: {},
};
const DataContext = createContext(defaultProvider);

const UserDataProvider = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname()
    const [loading, setLoading] = useState(false);
    // http://localhost:3000/portals/auth/admission/login
    useEffect(() => {
        const currentPath = pathname.split("?")[0];
        const isProtected = protectedRoutes.some(route => currentPath.includes(route));
        const isAuthFolder = currentPath.split("/")[2]
        const intended = currentPath.split("/")[2]
        if (isAuthFolder === "auth") {
            return;
        }
        if (isProtected && !isAuthenticated()) {
            router.replace(`/portals/auth/${intended}/login?returnurl=${pathname}`);
        }
    }, [router.pathname]);

    const {
        data: userInfo,
        error: userErr,
        refetch,
        isLoading: userIsLoading,
    } = useGetProfileQuery(undefined, { skip: !isAuthenticated() });
    console.log(userInfo)

    return (
        <DataContext.Provider
            value={{
                userInfo: userInfo?.data?.staff || userInfo?.data?.parent || {},
                refetchUser: refetch,
                selectedAddress: {},
                loading,
                setLoading: setLoading,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};
export { UserDataProvider, DataContext };


export const useUserData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useUser must be used within a UserDataProvider');
    }
    return context;
};