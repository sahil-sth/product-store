import { useAuth } from "@clerk/react";
import { useEffect } from "react";
import axiosService from "../lib/axios";
const useAuthRequest = () => {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  // include token to the request
  useEffect(() => {
    if (!isLoaded) return;

    const interceptor = axiosService.interceptors.request.use(
      async (config) => {
        const token = await getToken();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
    );

    return () => {
      axiosService.interceptors.request.eject(interceptor);
    };
  }, [isLoaded, getToken]);
  return { isSignedIn, isClerkLoaded: isLoaded };
};

export default useAuthRequest;
