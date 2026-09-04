import { useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown } from 'lucide-react';
import { MainLayout } from '@/components/layout/Layouts';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/animation/Transitions';
import { ProductCardSkeleton, ProductCard, EmptySearch } from '@/components/ui';
import { useProducts, useCategories } from '@/lib/queries';

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  
  const { data: catData } = useCategories();
  const { data, isLoading, isError } = useProducts({
    category,
    sort,
  });

  const categories = catData || [];
  const products = data?.data?.products || [];

  const handleCategoryChange = (slug: string) => {
    if (slug === category) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      searchParams.set('sort', e.target.value);
    } else {
      searchParams.delete('sort');
    }
    setSearchParams(searchParams);
  };

  return (
    <MainLayout>
      <PageTransition>
        <div className="container-app py-8 lg:py-12 flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-4 text-white font-semibold">
                <Filter className="w-4 h-4" />
                <h3>Categories</h3>
              </div>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleCategoryChange('')}
                    className={`text-sm w-full text-left px-3 py-2 rounded-lg transition-colors ${!category ? 'bg-brand-500/10 text-brand-400 font-medium' : 'text-surface-400 hover:text-white hover:bg-surface-800'}`}
                  >
                    All Products
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`text-sm w-full text-left px-3 py-2 rounded-lg transition-colors ${category === cat.slug ? 'bg-brand-500/10 text-brand-400 font-medium' : 'text-surface-400 hover:text-white hover:bg-surface-800'}`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {category ? categories.find(c => c.slug === category)?.name || 'Products' : 'All Products'}
                </h1>
                <p className="text-sm text-surface-400 mt-1">
                  Showing {products.length} {products.length === 1 ? 'result' : 'results'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <select 
                    value={sort}
                    onChange={handleSortChange}
                    className="appearance-none bg-surface-900 border border-surface-700 text-white text-sm rounded-xl pl-4 pr-10 py-2.5 focus:outline-none focus:border-brand-500 cursor-pointer"
                  >
                    <option value="">Sort by: Featured</option>
                    <option value="popular">Most Popular</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-surface-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : isError || products.length === 0 ? (
              <div className="py-20">
                <EmptySearch />
              </div>
            ) : (
              <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product) => (
                  <StaggerItem key={product.id}>
                    <ProductCard product={product} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>
          
        </div>
      </PageTransition>
    </MainLayout>
  );
}
