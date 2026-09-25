'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Provider } from '@/types/database';
import { toast } from 'sonner';

async function fetchProviders(): Promise<Provider[]> {
  const res = await fetch('/api/providers');
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Gagal mengambil metode bayar');
  }
  return json.data || [];
}

export function useProviders() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['providers'],
    queryFn: fetchProviders,
  });

  const addProvider = useMutation({
    mutationFn: async (payload: { name: string }) => {
      const res = await fetch('/api/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Gagal menambah metode bayar');
      }
      return json.data;
    },
    onSuccess: () => {
      toast.success('Metode bayar baru berhasil ditambahkan');
      queryClient.invalidateQueries({ queryKey: ['providers'] });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Gagal menambah metode bayar');
    },
  });

  return {
    ...query,
    providers: query.data || [],
    addProvider: addProvider.mutateAsync,
    isAdding: addProvider.isPending,
  };
}
