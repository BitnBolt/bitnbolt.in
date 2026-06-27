import { Skeleton } from './Skeleton';
import { PAGE_TOP } from '@/lib/layout';

export default function OrderDetailSkeleton() {
  return (
    <section className={`${PAGE_TOP} pb-10`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-4 w-36" />
          </div>
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <Skeleton className="h-20 w-20 rounded shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6 space-y-3">
              <Skeleton className="h-6 w-40 mb-2" />
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6 space-y-3">
              <Skeleton className="h-6 w-36 mb-2" />
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6 space-y-3">
              <Skeleton className="h-6 w-36" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
              <Skeleton className="h-px w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}
