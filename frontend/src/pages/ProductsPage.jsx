import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, X } from 'lucide-react';
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
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {currentCategory
              ? `${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1).replace('-', ' ')}`
              : currentSearch
              ? `Search results for "${currentSearch}"`
              : 'All Gadgets'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Showing {pagination.total} genuine tech products in Bangladesh
          </p>
        </div>

        {/* Sort & Search Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={currentSort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="bg-white border border-slate-200 text-sm rounded-xl px-3.5 py-2 text-slate-700 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
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
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" /> Filter Gadgets
              </h3>
              {(currentCategory || currentSearch || currentSort) && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h4 className="font-semibold text-xs text-slate-500 uppercase tracking-wider mb-3">Categories</h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => updateFilter('category', '')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    !currentCategory
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateFilter('category', cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                      currentCategory === cat.slug
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {cat._count?.products !== undefined && (
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
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
