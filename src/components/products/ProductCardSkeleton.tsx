import React from 'react';

export default function ProductCardSkeleton() {
  return (
    <div className="rounded-[16px] sm:rounded-[24px] border border-gray-200 shadow-md p-3 sm:p-6 bg-white/80 backdrop-blur-sm animate-pulse">
      <div className="relative aspect-w-1 aspect-h-1 w-full min-h-[200px] sm:min-h-[300px] overflow-hidden rounded-t-[16px] sm:rounded-t-[24px] bg-gray-200 mb-4" />
      <div className="space-y-2">
        <div className="h-5 w-3/4 bg-gray-300 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-5 w-1/3 bg-gray-300 rounded mt-3" />
      </div>
    </div>
  );
} 