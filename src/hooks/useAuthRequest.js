import { useAuth } from "@clerk/react";
import { useEffect } from "react";
import axiosService from "../lib/axios";
let isInterceptorRegistered = false;
const useAuthRequest = () => {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  // include token to the request
  useEffect(() => {
    if (isInterceptorRegistered) return;
    isInterceptorRegistered = true;
    if (!isLoaded) return; // don't do anything until clerk is loaded
    const interceptor = axiosService.interceptors.request.use(
      async (config) => {
        if (isSignedIn) {
          const token = await getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
    );
    return () => axiosService.interceptors.request.eject(interceptor);
  }, [isSignedIn, isLoaded, getToken]);
  return { isSignedIn, isClerkLoaded: isLoaded };
};

export default useAuthRequest;
