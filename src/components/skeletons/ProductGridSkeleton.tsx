import { Skeleton } from './Skeleton';

type Props = {
  count?: number;
};

/** Product card grid placeholder for shop / listings. */
export default function ProductGridSkeleton({ count = 9 }: Props) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl sm:rounded-lg border border-gray-100 overflow-hidden flex flex-col shadow-sm"
        >
          <Skeleton className="h-36 sm:h-48 w-full rounded-none" />
          <div className="p-3 sm:p-4 space-y-2.5 flex-1">
            <Skeleton className="h-4 w-16 rounded-full hidden sm:block" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-24 hidden sm:block" />
            <div className="pt-2 flex items-center justify-between gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-16 sm:w-20 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
