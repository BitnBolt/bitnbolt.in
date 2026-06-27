import { Skeleton } from './Skeleton';
import { PAGE_TOP } from '@/lib/layout';

export function OrderSummarySkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-2">
          <Skeleton className="h-12 w-12 rounded shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-4 w-14" />
        </div>
      ))}
      <Skeleton className="h-px w-full" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex justify-between gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  );
}

export default function CheckoutSkeleton() {
  return (
    <section className={`${PAGE_TOP} pb-10`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-8">
          <div>
            <Skeleton className="h-7 w-40 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className={`h-12 w-full ${i === 2 || i === 3 || i === 7 ? 'md:col-span-2' : ''}`}
                />
              ))}
            </div>
          </div>
          <div>
            <Skeleton className="h-7 w-36 mb-4" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-4 h-fit">
          <Skeleton className="h-7 w-32" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex justify-between gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </section>
  );
}
