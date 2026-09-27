import { useMutation, useQueryClient } from "@tanstack/react-query";

import { login, signup } from "../lib/api";
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

export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signup,
    onSuccess: async (user) => {
      // prevent older session request from overwiritng this login
      await queryClient.cancelQueries({ queryKey: sessionKey });
      queryClient.setQueryData(sessionKey, user);
    },
  });
};
