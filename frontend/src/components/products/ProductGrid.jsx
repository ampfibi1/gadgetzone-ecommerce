import React from 'react';
import ProductCard from './ProductCard';
import EmptyState from '../common/EmptyState';

export default function ProductGrid({ products = [], loading = false }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-xl border border-line bg-surface p-4"
          >
            <div className="aspect-square rounded-lg bg-raised" />
            <div className="mt-3 h-3 w-3/4 rounded bg-raised" />
            <div className="mt-2 h-3 w-1/2 rounded bg-raised" />
            <div className="mt-4 h-8 rounded bg-raised" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="No gadgets found"
        description="Try another category or search term."
        actionText="View all products"
        actionLink="/products"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
