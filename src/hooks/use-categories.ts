'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Category } from '@/types/database';
import { toast } from 'sonner';

async function fetchCategories(): Promise<Category[]> {
  const res = await fetch('/api/categories');
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Gagal mengambil kategori');
  }
  return json.data || [];
}

export function useCategories() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const addCategory = useMutation({
    mutationFn: async (payload: { name: string; type?: string }) => {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Gagal menambah kategori');
      }
      return json.data;
    },
    onSuccess: () => {
      toast.success('Kategori baru berhasil ditambahkan');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Gagal menambah kategori');
    },
  });

  return {
    ...query,
    categories: query.data || [],
    addCategory: addCategory.mutateAsync,
    isAdding: addCategory.isPending,
  };
}
