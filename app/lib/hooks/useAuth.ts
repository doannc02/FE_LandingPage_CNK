import { useMutation } from '@tanstack/react-query';
import { authApi, LoginRequest, RegisterRequest } from '../../lib/api/auth';
import { useRouter } from 'next/navigation';

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      if (response.isSuccess) {
        router.push('/');
        router.refresh();
      }
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (response) => {
      if (response.isSuccess) {
        router.push('/login');
      }
    },
  });
}

export function useLogout() {
  const router = useRouter();

  return () => {
    authApi.logout();
    router.push('/login');
    router.refresh();
  };
}