import { Skeleton } from './Skeleton';
import { PAGE_TOP } from '@/lib/layout';

/** Matches /product/[id] layout while data loads. */
export default function ProductDetailSkeleton() {
  return (
    <section className={`py-4 sm:py-8 px-4 sm:px-6 ${PAGE_TOP}`}>
      <div className="max-w-7xl mx-auto bg-white rounded-md border border-gray-100 px-4 sm:px-6 py-5 sm:py-8 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-8">
        {/* Thumbnails */}
        <div className="col-span-12 md:col-span-2 lg:col-span-1 flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg" />
          ))}
        </div>

        {/* Main image */}
        <div className="col-span-12 md:col-span-5 lg:col-span-4">
          <Skeleton className="w-full h-64 sm:h-96 rounded-xl" />
        </div>

        {/* Details */}
        <div className="col-span-12 md:col-span-5 lg:col-span-4 flex flex-col gap-4 sm:gap-6">
          <div className="space-y-3">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full hidden sm:block" />
            </div>
            <Skeleton className="h-8 sm:h-10 w-full max-w-md" />
            <Skeleton className="h-8 sm:h-10 w-3/4 max-w-sm" />
            <Skeleton className="h-4 w-40" />
            <div className="flex items-center gap-3 pt-1">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Skeleton className="h-11 w-full sm:w-40 rounded-lg" />
            <Skeleton className="h-11 w-full sm:w-40 rounded-lg" />
          </div>
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>

        {/* Side benefits */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lower tabs / sections */}
      <div className="max-w-7xl mx-auto mt-4 sm:mt-6 bg-white rounded-md border border-gray-100 px-4 sm:px-6 py-5 sm:py-8 space-y-4">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full shrink-0" />
          ))}
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </section>
  );
}
