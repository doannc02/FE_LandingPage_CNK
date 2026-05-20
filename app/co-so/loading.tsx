function SkeletonCard() {
  return (
    <div className="bg-zinc-900 border border-zinc-700/60 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-44 bg-zinc-800" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 bg-zinc-800 rounded w-3/4" />
        <div className="h-3 bg-zinc-800 rounded w-full" />
        <div className="h-3 bg-zinc-800 rounded w-2/3" />
        <div className="h-3 bg-zinc-800 rounded w-1/2" />
        <div className="flex gap-2 pt-1 border-t border-zinc-800 mt-1">
          <div className="h-8 bg-zinc-800 rounded-xl flex-1" />
          <div className="h-8 bg-zinc-800 rounded-xl flex-1" />
        </div>
      </div>
    </div>
  );
}

export default function BranchesLoading() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero skeleton */}
      <div className="py-20 sm:py-28 flex flex-col items-center gap-5 animate-pulse">
        <div className="h-3 bg-zinc-800 rounded w-32" />
        <div className="h-10 bg-zinc-800 rounded w-80 sm:w-96" />
        <div className="h-4 bg-zinc-800 rounded w-64" />
        <div className="flex gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-9 w-28 bg-zinc-800 rounded-full" />
          ))}
        </div>
      </div>

      {/* Card grid skeleton */}
      <div className="container mx-auto px-4 sm:px-6 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
            </div>
          </div>
          {/* Map skeleton */}
          <div className="hidden lg:block lg:w-3/5">
            <div className="bg-zinc-900 border border-zinc-700/60 rounded-2xl animate-pulse overflow-hidden">
              <div className="h-12 bg-zinc-800 border-b border-zinc-700/60" />
              <div className="aspect-[16/11] bg-zinc-800" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
