// src/services/products.query.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';

export function useProducts(params) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const { data } = await api.get('/products', { params });
      if (Array.isArray(data)) return { items: data, total: data.length, page: 1, limit: data.length };
      // Normalización defensiva
      return {
        items: Array.isArray(data?.items) ? data.items : [],
        total: Number.isFinite(data?.total) ? data.total : (Array.isArray(data?.items) ? data.items.length : 0),
        page: data?.page ?? 1,
        limit: data?.limit ?? 12,
      };
    },
  });
}

export function useProduct(id) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => (await api.get(`/products/${id}`)).data,
    enabled: !!id,
  });
}

export function usePatchSize() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, size, delta }) => {
      const { data } = await api.patch(`/products/${id}/sizes`, { size, delta });
      return data;
    },
    onMutate: async ({ id, size, delta }) => {
      await qc.cancelQueries({ queryKey: ['product', id] });
      const prev = qc.getQueryData(['product', id]);
      if (prev) {
        const copy = { ...prev, sizes: [...(prev.sizes || [])] };
        const idx = copy.sizes.findIndex(s => s.size === size);
        if (idx >= 0) {
          copy.sizes[idx] = { ...copy.sizes[idx], stock: Math.max(0, (copy.sizes[idx].stock || 0) + delta) };
        } else {
          copy.sizes.push({ size, stock: Math.max(0, delta) });
        }
        qc.setQueryData(['product', id], copy);
      }
      return { prev };
    },
    onError: (_e, { id }, ctx) => { if (ctx?.prev) qc.setQueryData(['product', id], ctx.prev); },
    onSettled: (_d, _e, { id }) => {
      qc.invalidateQueries({ queryKey: ['product', id] });
      qc.invalidateQueries({ queryKey: ['products'] });
    }
  });
}
