import { useMutation, useQueryClient } from "@tanstack/react-query";

import { login } from "../lib/api";
import { sessionKey } from "./useAuth";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: async (user) => {
      // prevent older session request from overwiritng this login
      await queryClient.cancelQueries({ queryKey: sessionKey });
      queryClient.setQueryData(sessionKey, user);
    },
  });
};
