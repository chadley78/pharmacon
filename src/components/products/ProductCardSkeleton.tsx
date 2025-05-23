import React from 'react';

export default function ProductCardSkeleton() {
  return (
    <div className="rounded-card sm:rounded-card-lg border border-gray-200 shadow-md p-3 sm:p-6 bg-white/80 backdrop-blur-sm animate-pulse">
      <div className="relative aspect-w-1 aspect-h-1 w-full min-h-card sm:min-h-card-lg overflow-hidden rounded-t-card sm:rounded-t-card-lg bg-gray-200 mb-4" />
      <div className="space-y-2">
        <div className="h-5 w-3/4 bg-gray-300 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-5 w-1/3 bg-gray-300 rounded mt-3" />
      </div>
    </div>
  );
} 