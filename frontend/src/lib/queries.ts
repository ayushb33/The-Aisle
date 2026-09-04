import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  sortOrder: number;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc?: string;
  price: string; // Decimal from Prisma comes as string in JSON
  comparePrice?: string;
  stock: number;
  brand?: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  category?: { name: string; slug: string };
  images: ProductImage[];
}

export interface ProductsResponse {
  products: Product[];
}

export interface PaginatedResponse<T> {
  data: T;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data.data.categories as Category[];
    },
  });
}

export function useProducts(params?: { category?: string; search?: string; sort?: string; page?: number }) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const { data } = await api.get('/products', { params });
      return data as PaginatedResponse<ProductsResponse>;
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data } = await api.get(`/products/${slug}`);
      return data.data.product as Product & {
        variants: any[];
        specifications: any[];
      };
    },
    enabled: !!slug,
  });
}

export interface Review {
  id: string;
  rating: number;
  title?: string;
  body?: string;
  isVerified: boolean;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
}

export function useProductReviews(slug: string, page = 1) {
  return useQuery({
    queryKey: ['reviews', slug, page],
    queryFn: async () => {
      const { data } = await api.get(`/reviews/product/${slug}`, { params: { page, limit: 5 } });
      return data as PaginatedResponse<{ reviews: Review[] }>;
    },
    enabled: !!slug,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: { productId: string; rating: number; title: string; body: string }) => {
      const { data } = await api.post('/reviews', payload);
      return data;
    },
    onSuccess: () => {
      // Invalidate both the product (for avg rating) and its reviews
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
  });
}
