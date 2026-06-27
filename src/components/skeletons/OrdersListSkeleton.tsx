import { Skeleton } from './Skeleton';
import { PAGE_TOP } from '@/lib/layout';

type OrdersListSkeletonProps = {
  contentOnly?: boolean;
};

function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>
      <Skeleton className="h-5 w-28 mb-3" />
      <div className="space-y-2">
        {Array.from({ length: 2 }).map((_, j) => (
          <div key={j} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Skeleton className="h-12 w-12 rounded shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-5 w-16" />
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
        <div className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-6 w-28" />
        </div>
        <Skeleton className="h-10 w-28 rounded-lg" />
      </div>
    </div>
  );
}

export default function OrdersListSkeleton({ contentOnly = false }: OrdersListSkeletonProps) {
  const cards = (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </div>
  );

  if (contentOnly) {
    return cards;
  }

  return (
    <section className={`${PAGE_TOP} pb-10`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8 gap-4">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
        {cards}
      </div>
    </section>
  );
}
