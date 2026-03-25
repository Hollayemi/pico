import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

export const server = process.env.NODE_ENV === "production"
    ? "https://piso-70mk.onrender.com"
    : "http://localhost:5001";



const getAuthHeaders = async (by = "user") => {
    const tokenType = by === "user" ? "user_token" : "store_token"
    const token = localStorage.getItem(tokenType) || "";
    return {
        'Content-Type': 'application/json',
        ...({ Authorization: `Bearer ${token}` }),
    };
};

const showSuccessToast = (data) => {
    const { type, message } = data || {};
    if (type === "success" && message && message !== "success") {
        toast.success(message);
    }
};

// Main query function
export const axiosBaseQuery = (tokenOwner) => async (requestConfig) => {
    const {
        url,
        method = 'GET',
        data,
        actor,
        params,
        headers = {},
        skipSuccessToast = false,

    } = requestConfig;

    try {
        // Build headers
        const authHeaders = await getAuthHeaders(tokenOwner || actor || "user");
        const mergedHeaders = { ...authHeaders, ...headers };

        console.log({ data })
        // Build URL with params
        const fullUrl = new URL(`${server}/api/v1${url}`);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    fullUrl.searchParams.append(key, value);
                }
            });
        }

        const response = await fetch(fullUrl.toString(), {
            method,
            headers: mergedHeaders,
            body: data ? JSON.stringify(data) : undefined,
        });

        // Parse response
        let responseData;
        try {
            responseData = await response.json();
        } catch {
            responseData = null;
        }

        if (!response.ok) {
            const error = new Error(`HTTP ${response.status}`);
            error.response = response;
            error.data = responseData;
            throw error;
        }

        // Handle success message
        if (!skipSuccessToast) {
            showSuccessToast(responseData);
        }

        return { data: responseData };

    } catch (error) {

        toast.error(error.data.message)
        return {
            error: {
                status: status || 0,
                data: error.data || { message: error.message },
                message: error.message,
            }
        };
    }
};

// Token validation
const checkTokenStatus = (account = "user") => {
    const tokenType = account === "user" ? "user_token" : "store_token"
    try {
        const token = localStorage.getItem(tokenType);
        if (!token) return { isValid: false, needsRefresh: false };

        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        const bufferTime = 5 * 60; // 5 minutes

        if (typeof decodedToken.exp === "number") {
            const isValid = decodedToken.exp > currentTime;
            const needsRefresh = decodedToken.exp < currentTime + bufferTime;
            return { isValid, needsRefresh };
        }

        return { isValid: false, needsRefresh: false };
    } catch {
        return { isValid: false, needsRefresh: false };
    }
};

// Export utility functions
export const isAuthenticated = (account) => {
    const { isValid } = checkTokenStatus(account);
    return isValid;
};

export const needsTokenRefresh = () => {
    const { needsRefresh } = checkTokenStatus();
    return needsRefresh;
};

export const clearAuthData = () => {
    localStorage.removeItem("store_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_data");
};

// Default instance
export const api = axiosBaseQuery();