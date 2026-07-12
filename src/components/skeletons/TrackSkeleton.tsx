import { Skeleton } from './Skeleton';
import { PAGE_TOP } from '@/lib/layout';

export default function TrackSkeleton() {
  return (
    <div className={`min-h-screen bg-gray-50 ${PAGE_TOP} pb-10`}>
      <div className="max-w-3xl mx-auto px-4 space-y-4">
        <Skeleton className="h-8 w-56 mx-auto" />
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
          <div className="space-y-3 pt-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-3 w-3 rounded-full shrink-0 mt-1.5" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
