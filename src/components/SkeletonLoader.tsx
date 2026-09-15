import React from 'react';

interface SkeletonLoaderProps {
  type?: 'card' | 'panel' | 'widget' | 'modal' | 'list';
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  type = 'card', 
  className = '' 
}) => {
  const shimmerClass = "animate-pulse bg-slate-200  rounded-xl";

  if (type === 'modal') {
    return (
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${className}`}>
        <div className="bg-white  border-4 border-vibrant-dark  rounded-[2.5rem] p-6 max-w-lg w-full shadow-[8px_8px_0px_0px_rgba(45,52,54,1)] space-y-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full ${shimmerClass}`} />
            <div className="space-y-2 flex-1">
              <div className={`h-5 w-1/3 ${shimmerClass}`} />
              <div className={`h-3 w-1/2 ${shimmerClass}`} />
            </div>
          </div>
          <div className="space-y-3">
            <div className={`h-4 w-full ${shimmerClass}`} />
            <div className={`h-4 w-5/6 ${shimmerClass}`} />
            <div className={`h-4 w-2/3 ${shimmerClass}`} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <div className={`h-10 w-24 ${shimmerClass}`} />
            <div className={`h-10 w-32 ${shimmerClass}`} />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'panel') {
    return (
      <div className={`bg-white  border-4 border-vibrant-dark  rounded-[2.5rem] p-6 shadow-[8px_8px_0px_0px_rgba(45,52,54,1)] space-y-6 ${className}`}>
        <div className="flex items-center justify-between border-b-2 border-slate-100  pb-4">
          <div className="space-y-2 flex-1">
            <div className={`h-6 w-1/4 ${shimmerClass}`} />
            <div className={`h-4 w-1/3 ${shimmerClass}`} />
          </div>
          <div className={`h-8 w-28 ${shimmerClass}`} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className={`h-48 w-full ${shimmerClass}`} />
            <div className={`h-4 w-3/4 ${shimmerClass}`} />
          </div>
          <div className="space-y-4">
            <div className={`h-6 w-1/2 ${shimmerClass}`} />
            <div className={`h-24 w-full ${shimmerClass}`} />
            <div className={`h-12 w-full ${shimmerClass}`} />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-white  border-2 border-vibrant-dark  rounded-2xl">
            <div className={`w-12 h-12 rounded-xl shrink-0 ${shimmerClass}`} />
            <div className="space-y-2 flex-1">
              <div className={`h-4 w-1/4 ${shimmerClass}`} />
              <div className={`h-3 w-1/2 ${shimmerClass}`} />
            </div>
            <div className={`h-8 w-16 ${shimmerClass}`} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`bg-white  border-4 border-vibrant-dark  rounded-[2rem] p-4 shadow-[6px_6px_0px_0px_rgba(45,52,54,1)] flex flex-col justify-between h-[380px] ${className}`}>
      <div className={`h-[180px] w-full ${shimmerClass}`} />
      <div className="p-2 space-y-4 flex-1 flex flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full ${shimmerClass}`} />
          <div className="space-y-2 flex-1">
            <div className={`h-3 w-1/2 ${shimmerClass}`} />
            <div className={`h-2 w-1/3 ${shimmerClass}`} />
          </div>
        </div>
        <div className="space-y-2">
          <div className={`h-4 w-3/4 ${shimmerClass}`} />
          <div className={`h-3 w-5/6 ${shimmerClass}`} />
        </div>
        <div className="flex gap-2">
          <div className={`h-6 w-16 ${shimmerClass}`} />
          <div className={`h-6 w-16 ${shimmerClass}`} />
        </div>
      </div>
    </div>
  );
};
