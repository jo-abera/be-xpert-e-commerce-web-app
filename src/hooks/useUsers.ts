import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/lib/api';

export const userKeys = {
  list: ['users', 'list'] as const,
  detail: (id: number) => ['users', 'detail', id] as const
};

export function useUsers() {
  return useQuery({
    queryKey: userKeys.list,
    queryFn: ({ signal }) => usersApi.list(signal)
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: ({ signal }) => usersApi.get(id, signal),
    enabled: Number.isInteger(id) && id > 0
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => usersApi.delete(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: userKeys.list });
      qc.removeQueries({ queryKey: userKeys.detail(id) });
    },
  });
}