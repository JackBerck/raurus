'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Transaction } from '@/types/database';
import { toast } from 'sonner';

async function fetchTransactions(): Promise<Transaction[]> {
  const res = await fetch('/api/transactions?limit=100');
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Gagal memuat transaksi');
  }
  return json.data || [];
}

export function useTransactions() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Gagal menghapus transaksi');
      }
      return json;
    },
    onSuccess: () => {
      toast.success('Transaksi berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Gagal menghapus transaksi');
    },
  });

  return {
    ...query,
    transactions: query.data || [],
    deleteTransaction: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
