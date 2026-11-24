import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import api from '../api/axios';
import ProductGrid from '../components/products/ProductGrid';
import Pagination from '../components/common/Pagination';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 1 });

  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.data.categories || []);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (currentCategory) params.set('category', currentCategory);
        if (currentSearch) params.set('search', currentSearch);
        if (currentSort) params.set('sort', currentSort);
        params.set('page', currentPage.toString());
        params.set('limit', '12');

        const res = await api.get(`/products?${params.toString()}`);
        setProducts(res.data.data.products || []);
        setPagination(res.data.data.pagination || { page: 1, limit: 12, total: 0, pages: 1 });
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentCategory, currentSearch, currentSort, currentPage]);

  const updateFilter = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {currentCategory
              ? `${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1).replace('-', ' ')}`
              : currentSearch
              ? `Search results for "${currentSearch}"`
              : 'All gadgets'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing {pagination.total} genuine tech products in Bangladesh
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={currentSort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="bg-white border border-slate-200 text-xs rounded-lg px-3 py-2 text-slate-700 font-medium focus:ring-1 focus:ring-sky-500 focus:outline-hidden"
          >
            <option value="">Sort by: Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-xs">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" /> Filter gadgets
              </h3>
              {(currentCategory || currentSearch || currentSort) && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-medium text-sky-600 hover:text-sky-700"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-medium text-[11px] text-slate-400 mb-2">Categories</h4>
              <div className="space-y-1">
                <button
                  onClick={() => updateFilter('category', '')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    !currentCategory
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateFilter('category', cat.slug)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      currentCategory === cat.slug
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {cat._count?.products !== undefined && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded tabular-nums ${
                        currentCategory === cat.slug ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {cat._count.products}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid & Pagination */}
        <main className="lg:col-span-3">
          <ProductGrid products={products} loading={loading} />

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={(p) => updateFilter('page', p.toString())}
          />
        </main>
      </div>
    </div>
  );
}
