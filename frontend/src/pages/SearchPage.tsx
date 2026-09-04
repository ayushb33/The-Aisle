import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { MainLayout } from '@/components/layout/Layouts';
import { PageTransition, FadeIn } from '@/components/animation/Transitions';
import { ProductCardSkeleton, ProductCard, EmptySearch } from '@/components/ui';
import { useProducts } from '@/lib/queries';
import { useDebounce } from '@/hooks/useDebounce';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      searchParams.set('q', debouncedQuery);
    } else {
      searchParams.delete('q');
    }
    setSearchParams(searchParams, { replace: true });
  }, [debouncedQuery, searchParams, setSearchParams]);

  const { data, isLoading, isError } = useProducts({
    search: debouncedQuery,
  });

  const products = data?.data?.products || [];

  return (
    <MainLayout>
      <PageTransition>
        <div className="container-app py-8 lg:py-12">
          
          {/* Search Header */}
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">What are you looking for?</h1>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products, categories, or brands..."
                className="w-full bg-surface-900 border-2 border-surface-700 text-white rounded-2xl pl-14 pr-6 py-4 text-lg focus:outline-none focus:border-brand-500 transition-colors"
                autoFocus
              />
              <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-surface-400" />
            </div>
          </div>

          {/* Results */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold text-white">
                {debouncedQuery ? `Search Results for "${debouncedQuery}"` : 'Recommended Products'}
              </h2>
              <span className="text-sm text-surface-400">
                {products.length} {products.length === 1 ? 'result' : 'results'}
              </span>
            </div>

            {isLoading && debouncedQuery ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {Array.from({ length: 10 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : isError || (debouncedQuery && products.length === 0) ? (
              <div className="py-20">
                <EmptySearch />
              </div>
            ) : (
              <FadeIn>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </FadeIn>
            )}
          </div>
          
        </div>
      </PageTransition>
    </MainLayout>
  );
}
