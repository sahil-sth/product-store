import { useQuery } from "@tanstack/react-query";

import { me } from "../lib/api";

export const sessionKey = ["session"];

const useAuth = () => {
  const session = useQuery({
    queryKey: sessionKey,
    queryFn: me,
    retry: false,
    staleTime: 60_000,
  });

  return {
    user: session.data,
    userId: session.data?.id,
    isSignedIn: Boolean(session.data),
    isLoading: session.isPending,
    error: session.error,
    retry: session.refetch,
  };
};

export default useAuth;
