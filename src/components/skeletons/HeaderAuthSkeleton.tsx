import { Skeleton } from './Skeleton';

export default function HeaderAuthSkeleton() {
  return (
    <div className="hidden sm:flex items-center space-x-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="hidden md:block h-4 w-24" />
    </div>
  );
}
