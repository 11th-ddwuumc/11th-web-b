import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login } from "../api/auth/login";
import { useAuthStore } from "../stores/auth-store";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setAccessToken = useAuthStore(
    (state) => state.setAccessToken,
  );

  return useMutation({
    mutationFn: login,

    onSuccess: (response) => {
      setAccessToken(response.result.accessToken);

      queryClient.invalidateQueries({
        queryKey: ["members", "me"],
      });

      alert("로그인에 성공했어요.");
      router.push("/");
    },

    onError: (error) => {
      console.error("로그인 실패 원인:", error);

      alert("로그인 실패! F12 콘솔에서 오류를 확인해 주세요.");
    },
  });
}
