import React from 'react';
import ProductCard from './ProductCard';
import EmptyState from '../common/EmptyState';

export default function ProductGrid({ products = [], loading = false }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 animate-pulse">
            <div className="aspect-square bg-slate-200 rounded-xl mb-4" />
            <div className="h-4 bg-slate-200 rounded-md w-3/4 mb-2" />
            <div className="h-3 bg-slate-200 rounded-md w-1/2 mb-4" />
            <div className="h-6 bg-slate-200 rounded-md w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="No gadgets found"
        description="Try clearing filters or searching for something else."
        actionText="View All Products"
        actionLink="/products"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
