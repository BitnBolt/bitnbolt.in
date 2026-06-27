import { Skeleton } from './Skeleton';
import { PAGE_TOP } from '@/lib/layout';

export default function CartSkeleton() {
  return (
    <section className={`${PAGE_TOP} pb-10`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <Skeleton className="h-8 w-44 mb-6" />
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-0">
                <Skeleton className="h-20 w-20 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-9 w-28" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-4">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      </div>
    </section>
  );
}
